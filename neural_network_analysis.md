# Neural Network Architecture for OrganicFlow — Deep Analysis

## 1. Your Current Data Model (Summary)

Your codebase models organic chemistry as a **directed knowledge graph**:

| File | What it Contains |
|------|-----------------|
| [graphGenerator.js](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/graphGenerator.js) | ~150 molecule nodes (15 series × 10 carbons) + 6 element nodes. Each node has: `label`, `formula`, `series`, `functionalGroup`, `hybridization`, `carbonCount` |
| [reactionInfo.js](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/reactionInfo.js) | ~20 reaction types, each with: `type`, `category`, `reagents`, `catalyst`, `conditions`, `mechanism`, `energetics` |
| [mechanisms.js](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/mechanisms.js) | Step-by-step atom positions & bonds for ~15 animated mechanisms |
| [knowledgeGraph.js](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/knowledgeGraph.js) | Glues it together — generates nodes + edges (reactions connecting molecules) |

**Key insight**: Your graph already IS a network. Molecules are nodes, reactions are edges. The neural network maps naturally onto this structure.

---

## 2. What Problem Would the Neural Network Solve?

Before designing layers, we need to define the **task**. Here are the most valuable problems your NN could solve with this data:

### Option A: Reaction Prediction (Recommended)
> **Given**: A starting molecule + reagents/conditions  
> **Predict**: The product molecule (or the reaction type that will occur)

### Option B: Retrosynthesis
> **Given**: A target molecule  
> **Predict**: The best pathway (sequence of reactions) from simple starting materials

### Option C: Reaction Classification
> **Given**: A source molecule, a target molecule  
> **Predict**: What reaction type connects them (Oxidation, Hydration, etc.)

### Option D: Molecular Property Prediction
> **Given**: A molecule's features (carbon count, functional group, series)  
> **Predict**: Properties like reactivity, pH, boiling point trend

---

## 3. Proposed Neural Network Architecture

I'll design for **Option A (Reaction Prediction)** as it maps most directly to your graph. Below is the complete architecture:

### 3.1 Data Encoding (Input Layer)

Each molecule must be converted from your JS object into a **numerical feature vector**:

```
Molecule Feature Vector (input neuron mapping):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Neuron 0:    carbonCount  (1-10)           → normalized to [0, 1]
Neuron 1-15: series (one-hot encoding)     → 15 neurons
             [Alkane, Alkene, Alkyne, Alcohol, Aldehyde, Ketone,
              Carboxylic Acid, Ester, Ether, Amine, Amide, 
              Nitrile, Haloalkane, Aromatic, Carbon Skeleton]
Neuron 16:   has double bond (0 or 1)
Neuron 17:   has triple bond (0 or 1)
Neuron 18:   has -OH group (0 or 1)
Neuron 19:   has -COOH group (0 or 1)
Neuron 20:   has -NH₂ group (0 or 1)
Neuron 21:   has C=O group (0 or 1)
Neuron 22:   has halogen (0 or 1)
Neuron 23:   has -CN group (0 or 1)
Neuron 24:   is aromatic (0 or 1)
Neuron 25-27: hybridization one-hot (sp, sp², sp³)

Total input size per molecule: 28 neurons
```

The **reagent/condition** is also encoded:

```
Reagent Vector:
━━━━━━━━━━━━━━
Neuron 0-19:  reagent one-hot encoding (20 known reagent types)
              [H₂, H₂O, HBr, Br₂, Cl₂, KCN, NaOH, NH₃, 
               H₂SO₄, K₂Cr₂O₇, KMnO₄, HNO₃, AlCl₃, Sn/HCl,
               LiAlH₄, H₃PO₄, CH₃OH, CH₃Cl, UV, Heat]
Neuron 20:    temperature (normalized)
Neuron 21:    pressure (normalized)

Total reagent input: 22 neurons
```

**Combined input vector: 28 (molecule) + 22 (reagent) = 50 neurons**

### 3.2 Network Layers

```
┌─────────────────────────────────────────────────────────┐
│                    ARCHITECTURE                         │
│                                                         │
│  INPUT LAYER (50 neurons)                               │
│  ├── 28 neurons: source molecule features               │
│  └── 22 neurons: reagent/conditions                     │
│          │                                              │
│          ▼                                              │
│  HIDDEN LAYER 1 (64 neurons) ── ReLU activation         │
│  "Reaction Context Layer"                               │
│  • Learns which molecule+reagent combos are valid       │
│  • Weights encode reaction compatibility                │
│          │                                              │
│          ▼                                              │
│  HIDDEN LAYER 2 (32 neurons) ── ReLU activation         │
│  "Transformation Layer"                                 │
│  • Learns structural transformations                    │
│  • Captures: "OH + oxidation → C=O"                    │
│          │                                              │
│          ▼                                              │
│  HIDDEN LAYER 3 (32 neurons) ── ReLU activation         │
│  "Product Assembly Layer"                               │
│  • Assembles product molecule features                  │
│  • Captures carbon chain changes, group additions       │
│          │                                              │
│          ▼                                              │
│  OUTPUT LAYER — Two heads:                              │
│  ├── Head A: 15 neurons (softmax) → predicted series    │
│  └── Head B: 10 neurons (softmax) → predicted carbon#   │
│                                                         │
│  Combined output → identifies the product molecule      │
└─────────────────────────────────────────────────────────┘
```

### 3.3 What Each Layer Represents (Chemically)

| Layer | Chemistry Analog | What the Weights Learn |
|-------|-----------------|----------------------|
| **Input** | Molecule identity card | Raw structural data |
| **Hidden 1** | "Can this reaction happen?" | Reaction feasibility rules (e.g., tertiary alcohols can't oxidize) |
| **Hidden 2** | "What changes structurally?" | Bond-breaking/forming patterns (e.g., double bond → single bond in hydrogenation) |
| **Hidden 3** | "What's the product?" | Product assembly (new functional group, same/different carbon count) |
| **Output** | "Here's your answer" | Product molecule classification |

### 3.4 Activation Functions

| Layer | Activation | Why |
|-------|-----------|-----|
| Hidden 1, 2, 3 | **ReLU** [f(x) = max(0, x)](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/graphGenerator.js#331-332) | Fast, avoids vanishing gradients, reactions are either "on" or "off" |
| Output Head A | **Softmax** | Mutually exclusive series classification (a product is ONE series) |
| Output Head B | **Softmax** | Mutually exclusive carbon count (product has ONE carbon count) |

### 3.5 Weights & Biases — What They Mean

```
Hidden Layer 1 (50 → 64):
  Weights:  50 × 64 = 3,200 parameters
  Biases:   64 parameters
  
  Example weight meaning:
  w[carbonCount → neuron_5] = 0.8
  → "Higher carbon count makes this neuron activate more"
  → This neuron might represent "long-chain reactivity"

Hidden Layer 2 (64 → 32):
  Weights:  64 × 32 = 2,048 parameters
  Biases:   32 parameters

Hidden Layer 3 (32 → 32):
  Weights:  32 × 32 = 1,024 parameters
  Biases:   32 parameters

Output Head A (32 → 15):
  Weights:  32 × 15 = 480 parameters
  Biases:   15 parameters

Output Head B (32 → 10):
  Weights:  32 × 10 = 320 parameters
  Biases:   10 parameters

TOTAL TRAINABLE PARAMETERS: ~7,179
```

---

## 4. Training Data — From Your Graph

Your existing edges ARE training examples:

```javascript
// Each edge becomes a training sample:
// Edge: alkene-2 --[+ H₂]--> alkane-2

trainingExample = {
  input: {
    molecule: encode("Ethene", carbonCount=2, series="Alkene", ...),
    reagent:  encode("H₂", catalyst="Ni", temp=150)
  },
  expectedOutput: {
    series: "Alkane",     // Head A target
    carbonCount: 2        // Head B target
  }
}
```

From [generateReactions()](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/data/graphGenerator.js#329-504), you have **~17 reaction types × up to 10 carbon variants** = **~120-170 training samples**. That's small, so you'd use:

- **Data augmentation**: Add reverse reactions, vary conditions
- **Small network**: The architecture above is intentionally compact
- **High epoch count**: Train for 500-1000 epochs with low learning rate

---

## 5. Backpropagation — Training Flow

```
Forward Pass:
━━━━━━━━━━━━
1. Encode Ethene + H₂ → input vector [0.2, 0, 1, 0, ..., 1, 0, ...]
2. Layer 1: z₁ = W₁·x + b₁, a₁ = ReLU(z₁)
3. Layer 2: z₂ = W₂·a₁ + b₂, a₂ = ReLU(z₂)
4. Layer 3: z₃ = W₃·a₂ + b₃, a₃ = ReLU(z₃)
5. Output:  ŷ_series = softmax(W_A·a₃ + b_A)
            ŷ_carbon = softmax(W_B·a₃ + b_B)

Loss Calculation:
━━━━━━━━━━━━━━━━
L = CrossEntropy(ŷ_series, y_series) + CrossEntropy(ŷ_carbon, y_carbon)

Example: If model predicted "Alkane" with 90% confidence and truth IS Alkane:
L_series = -log(0.9) = 0.105  (small loss ✓)

Backward Pass (Backpropagation):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
∂L/∂W_A → update output weights
∂L/∂W₃ → update layer 3 weights (chain rule through ReLU)
∂L/∂W₂ → update layer 2 weights
∂L/∂W₁ → update layer 1 weights

Weight Update (SGD):
W_new = W_old - learningRate × ∂L/∂W
```

---

## 6. How to Implement This in Your Project

### Option 1: Pure JavaScript (No Dependencies)
Build the neural network from scratch in JS. Best for learning, integrates directly with your React app.

```
New files to create:
├── src/
│   └── neural/
│       ├── encoder.js        # Converts molecules → vectors
│       ├── NeuralNetwork.js  # Core NN with forward/backward pass
│       ├── trainer.js        # Training loop using your graph data
│       └── predictor.js      # User-facing: "what happens if I add H₂ to ethene?"
```

### Option 2: Use TensorFlow.js
More robust, GPU-accelerated, but adds dependency.

```bash
npm install @tensorflow/tfjs
```

### Option 3: Train in Python, Export to JS
Train with PyTorch/TensorFlow, export weights as JSON, load in your React app.

---

## 7. Integration With Your Existing App

The neural network would plug into your app as a **new interactive feature**:

```
User Flow:
1. User selects a molecule node (e.g., clicks "Ethanol")
2. User picks a reagent from a dropdown (e.g., "K₂Cr₂O₇ / H₂SO₄")
3. Neural network predicts → "Ethanal (Aldehyde, C2)"
4. The graph animates to show the predicted pathway
5. Confidence score shown (e.g., "94% confident")
```

This would add a "Predict Reaction" button to your existing [DetailsPanel.jsx](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/components/DetailsPanel.jsx).

---

## 8. Visual Summary — The Full Picture

```
YOUR EXISTING DATA                    NEURAL NETWORK
━━━━━━━━━━━━━━━━                    ━━━━━━━━━━━━━━
                                    
graphGenerator.js ──→ Molecule       ┌─────────────┐
  (nodes: series,     Encoder  ──→  │ Input (50)  │
   carbon count,                    │      ↓       │
   functional group)                │ Hidden₁ (64) │ ← ReLU
                                    │      ↓       │
reactionInfo.js ──→ Reagent          │ Hidden₂ (32) │ ← ReLU
  (reagents,         Encoder  ──→   │      ↓       │
   conditions,                      │ Hidden₃ (32) │ ← ReLU
   temperature)                     │      ↓       │
                                    │ Output (25)  │ ← Softmax
                                    └──────┬──────┘
                                           │
                                    Product Prediction
                                    (Series + Carbon#)
                                           │
                                           ▼
                                    Graph Visualization
                                    (highlight predicted
                                     node + path)
```

---

## 9. Recommended Implementation Order

| Step | What | Estimated Effort |
|------|------|-----------------|
| 1 | Build `encoder.js` — convert your molecules & reagents to vectors | 2-3 hours |
| 2 | Build `NeuralNetwork.js` — matrix math, forward pass, ReLU, softmax | 4-5 hours |
| 3 | Build `trainer.js` — extract training data from your edges, implement backprop | 3-4 hours |
| 4 | Train the network and tune hyperparameters | 2-3 hours |
| 5 | Build `predictor.js` — user-facing inference | 1-2 hours |
| 6 | Integrate into [DetailsPanel.jsx](file:///Users/dhritikothari/Desktop/organic-flow-sem8/organic-flow/src/components/DetailsPanel.jsx) with UI | 2-3 hours |
| 7 | Add visualization of NN internals (optional, very cool) | 3-4 hours |

**Total: ~17-24 hours of focused work**

---

## 10. Key Decisions for You

> [!IMPORTANT]
> Before implementing, decide on these:

1. **Which task?** — Reaction prediction (recommended), retrosynthesis, or classification?
2. **Pure JS or TensorFlow.js?** — From scratch teaches more; TF.js is more robust
3. **Train live or pre-trained?** — Train once, save weights as JSON, or re-train on every page load?
4. **Visualize the NN?** — Do you want to show the neuron activations in the UI (like a "brain" view)?

Let me know your choices and I'll build the implementation!
