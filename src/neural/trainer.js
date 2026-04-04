// =============================================================================
// Training Data Extraction & Model Trainer
// Extracts training samples from the existing knowledge graph edges
// =============================================================================

import * as tf from '@tensorflow/tfjs';
import { encodeInput, encodeLabel } from './encoder';

// ─────────────────────────────────────────────────────────────────────
// Extract training data from graph nodes & edges
// Each reaction edge becomes one training sample:
//   input  = encode(sourceNode) + encode(reagent)
//   output = encode(targetNode) labels
// ─────────────────────────────────────────────────────────────────────
export function extractTrainingData(nodes, edges) {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const samples = [];

    for (const edge of edges) {
        // Skip structural/backbone edges (not real reactions)
        if (edge.id.startsWith('struct-') ||
            edge.id.startsWith('comp-') ||
            edge.id.startsWith('c-backbone')) continue;
        if (!edge.label || !edge.label.trim()) continue;

        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) continue;

        // Skip element nodes and backbone nodes
        if (sourceNode.data?.isElement || targetNode.data?.isElement) continue;
        if (sourceNode.id.startsWith('backbone') || targetNode.id.startsWith('backbone')) continue;

        // Build reagent string from edge data + label
        const reagentStr = edge.data?.reagents || edge.label || '';

        const input = encodeInput(sourceNode, reagentStr);
        const { seriesLabel, carbonLabel } = encodeLabel(targetNode);

        samples.push({ input, seriesLabel, carbonLabel });
    }

    return samples;
}

// ─────────────────────────────────────────────────────────────────────
// Augment data by adding slight noise to continuous features
// ─────────────────────────────────────────────────────────────────────
export function augmentData(samples, factor = 3) {
    const augmented = [...samples];

    for (let f = 0; f < factor; f++) {
        for (const sample of samples) {
            const noisyInput = new Float32Array(sample.input.length);
            for (let i = 0; i < sample.input.length; i++) {
                // Add small noise to continuous features (neuron 0 = carbonCount, 20 = temp, 21 = pressure)
                if (i === 0 || i === 48 || i === 49) {
                    noisyInput[i] = Math.max(0, Math.min(1, sample.input[i] + (Math.random() - 0.5) * 0.1));
                } else {
                    noisyInput[i] = sample.input[i];
                }
            }
            augmented.push({
                input: noisyInput,
                seriesLabel: sample.seriesLabel,
                carbonLabel: sample.carbonLabel,
            });
        }
    }

    return augmented;
}

// ─────────────────────────────────────────────────────────────────────
// Train the model
// ─────────────────────────────────────────────────────────────────────
export async function trainModel(model, samples, options = {}) {
    const {
        epochs = 500,
        batchSize = 16,
        validationSplit = 0.15,
        onEpochEnd = null,
    } = options;

    // Augment data
    const augmented = augmentData(samples, 3);

    // Shuffle
    for (let i = augmented.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [augmented[i], augmented[j]] = [augmented[j], augmented[i]];
    }

    // Convert to tensors
    const xs = tf.tensor2d(augmented.map(s => Array.from(s.input)));
    const ySeries = tf.tensor2d(augmented.map(s => Array.from(s.seriesLabel)));
    const yCarbon = tf.tensor2d(augmented.map(s => Array.from(s.carbonLabel)));

    const history = await model.fit(xs, [ySeries, yCarbon], {
        epochs,
        batchSize,
        validationSplit,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (onEpochEnd) onEpochEnd(epoch, logs);
            },
        },
    });

    // Cleanup
    xs.dispose();
    ySeries.dispose();
    yCarbon.dispose();

    return history;
}
