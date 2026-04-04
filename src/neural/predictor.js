// =============================================================================
// Reaction Predictor — User-facing inference wrapper
// Loads model, runs prediction, extracts activations for visualization
// =============================================================================

import * as tf from '@tensorflow/tfjs';
import { encodeInput, decodeOutput, SERIES_LIST } from './encoder';
import { loadPretrainedModel, createActivationModel, createModel } from './model';
import { extractTrainingData, trainModel } from './trainer';

export class ReactionPredictor {
    constructor() {
        this.model = null;
        this.activationModel = null;
        this.layerNames = [];
        this.isReady = false;
        this.isTraining = false;
    }

    // ─────────────────────────────────────────────────────────────────
    // Initialize: try to load pre-trained, else train from scratch
    // ─────────────────────────────────────────────────────────────────
    async init() {
        if (this.isReady) return;

        try {
            this.model = await loadPretrainedModel();
            this.isReady = true;
            this._buildActivationModel();
        } catch (err) {
            console.warn('Could not load pre-trained model:', err);
            this.model = createModel();
            this.isReady = true;
            this._buildActivationModel();
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Train from graph data (used when no pre-trained weights exist)
    // ─────────────────────────────────────────────────────────────────
    async trainFromGraph(nodes, edges, onProgress = null) {
        this.isTraining = true;
        if (!this.model) {
            this.model = createModel();
        }

        const samples = extractTrainingData(nodes, edges);
        console.log(`Training on ${samples.length} samples...`);

        await trainModel(this.model, samples, {
            epochs: 300,
            batchSize: 16,
            onEpochEnd: (epoch, logs) => {
                if (onProgress) {
                    onProgress({
                        epoch,
                        loss: logs.loss,
                        seriesAcc: logs.series_output_acc,
                        carbonAcc: logs.carbon_output_acc,
                    });
                }
            },
        });

        this.isTraining = false;
        this.isReady = true;
        this._buildActivationModel();
    }

    // ─────────────────────────────────────────────────────────────────
    // Run prediction
    // ─────────────────────────────────────────────────────────────────
    predict(moleculeNode, reagentStr) {
        if (!this.isReady || !this.model) {
            throw new Error('Model not loaded. Call init() first.');
        }

        const inputVec = encodeInput(moleculeNode, reagentStr);
        const inputTensor = tf.tensor2d([Array.from(inputVec)]);

        // Forward pass
        const [seriesTensor, carbonTensor] = this.model.predict(inputTensor);
        const seriesProbs = seriesTensor.dataSync();
        const carbonProbs = carbonTensor.dataSync();

        // Get activations for visualization
        const activations = this._getActivations(inputTensor);

        // Cleanup
        inputTensor.dispose();
        seriesTensor.dispose();
        carbonTensor.dispose();

        const decoded = decodeOutput(seriesProbs, carbonProbs);

        // Map raw probabilities to series labels for UI explanation
        const rawSeriesMap = {};
        for (let i = 0; i < SERIES_LIST.length; i++) {
            rawSeriesMap[SERIES_LIST[i]] = seriesProbs[i];
        }

        return {
            ...decoded,
            rawProbs: { series: rawSeriesMap },
            activations,
            inputVector: Array.from(inputVec),
        };
    }

    // ─────────────────────────────────────────────────────────────────
    // Find the matching node in the graph for a prediction
    // ─────────────────────────────────────────────────────────────────
    findPredictedNode(prediction, allNodes) {
        const { series, carbonCount } = prediction;

        // Try exact match first
        const match = allNodes.find(n => {
            const d = n.data?.details || {};
            const nSeries = d.series;
            const nCarbon = d.carbonCount || parseInt(n.id?.split('-')[1]) || 0;
            return nSeries === series && nCarbon === carbonCount;
        });

        if (match) return match;

        // Fuzzy: match series only
        return allNodes.find(n => n.data?.details?.series === series) || null;
    }

    // ─────────────────────────────────────────────────────────────────
    // Internal: build activation model for visualization
    // ─────────────────────────────────────────────────────────────────
    _buildActivationModel() {
        if (!this.model) return;
        try {
            const { activationModel, layerNames } = createActivationModel(this.model);
            this.activationModel = activationModel;
            this.layerNames = layerNames;
        } catch (err) {
            console.warn('Could not build activation model:', err);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Internal: extract activations from all layers
    // ─────────────────────────────────────────────────────────────────
    _getActivations(inputTensor) {
        if (!this.activationModel) return {};

        try {
            const outputs = this.activationModel.predict(inputTensor);
            const outputList = Array.isArray(outputs) ? outputs : [outputs];

            const activations = {};
            const layerNames = [
                'reaction_context',   // hidden1 (64)
                'transformation',     // hidden2 (32)
                'product_assembly',   // hidden3 (32)
                'series_output',      // output head A (15)
                'carbon_output',      // output head B (10)
            ];

            outputList.forEach((tensor, i) => {
                const name = layerNames[i] || `layer_${i}`;
                const data = tensor.dataSync();
                activations[name] = Array.from(data);
                tensor.dispose();
            });

            return activations;
        } catch (err) {
            console.warn('Activation extraction failed:', err);
            return {};
        }
    }
}

// Singleton instance
export const predictor = new ReactionPredictor();
export default predictor;
