// =============================================================================
// TensorFlow.js Model Definition for Reaction Prediction
// Architecture: Input(50) → Dense(64,ReLU) → Dense(32,ReLU) → Dense(32,ReLU)
//   → Head A: Dense(15, Softmax) [series]
//   → Head B: Dense(10, Softmax) [carbon count]
// =============================================================================

import * as tf from '@tensorflow/tfjs';
import { INPUT_DIM, SERIES_COUNT, CARBON_COUNT } from './encoder';

// ─────────────────────────────────────────────────────────────────────
// Create the dual-output model using TF.js functional API
// ─────────────────────────────────────────────────────────────────────
export function createModel() {
    // Input layer
    const input = tf.input({ shape: [INPUT_DIM], name: 'molecule_reagent_input' });

    // Hidden layers
    const hidden1 = tf.layers.dense({
        units: 64,
        activation: 'relu',
        name: 'reaction_context',
        kernelInitializer: 'heNormal',
    }).apply(input);

    const hidden2 = tf.layers.dense({
        units: 32,
        activation: 'relu',
        name: 'transformation',
        kernelInitializer: 'heNormal',
    }).apply(hidden1);

    const hidden3 = tf.layers.dense({
        units: 32,
        activation: 'relu',
        name: 'product_assembly',
        kernelInitializer: 'heNormal',
    }).apply(hidden2);

    // Output Head A: series classification (15 classes)
    const seriesOutput = tf.layers.dense({
        units: SERIES_COUNT,
        activation: 'softmax',
        name: 'series_output',
    }).apply(hidden3);

    // Output Head B: carbon count classification (10 classes)
    const carbonOutput = tf.layers.dense({
        units: CARBON_COUNT,
        activation: 'softmax',
        name: 'carbon_output',
    }).apply(hidden3);

    const model = tf.model({
        inputs: input,
        outputs: [seriesOutput, carbonOutput],
        name: 'OrganicFlowNN',
    });

    model.compile({
        optimizer: tf.train.adam(0.005),
        loss: ['categoricalCrossentropy', 'categoricalCrossentropy'],
        metrics: ['accuracy'],
    });

    return model;
}

// ─────────────────────────────────────────────────────────────────────
// Load pre-trained weights from public directory
// ─────────────────────────────────────────────────────────────────────
export async function loadPretrainedModel() {
    try {
        const timestamp = new Date().getTime();
        const model = await tf.loadLayersModel(`/nn-weights/model.json?t=${timestamp}`);
        return model;
    } catch (err) {
        console.warn('Pre-trained model not found, creating new model:', err.message);
        return createModel();
    }
}

// ─────────────────────────────────────────────────────────────────────
// Get intermediate layer activations for visualization
// ─────────────────────────────────────────────────────────────────────
export function createActivationModel(model) {
    const layerOutputs = [];
    const layerNames = [];

    for (const layer of model.layers) {
        if (layer.name === 'molecule_reagent_input') continue;
        layerOutputs.push(layer.output);
        layerNames.push(layer.name);
    }

    // Flatten outputs if they are arrays (dual-output model)
    const flatOutputs = layerOutputs.flat();

    const activationModel = tf.model({
        inputs: model.input,
        outputs: flatOutputs,
    });

    return { activationModel, layerNames };
}
