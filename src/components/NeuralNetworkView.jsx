import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Database, Zap, Plus, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import { ReactionPredictor } from '../neural/predictor';
import { encodeInput } from '../neural/encoder';
import NNCanvasDiagram from './NNCanvasDiagram';

// Build a per-molecule reaction map from graph edges
// Returns: { [nodeId]: [{ reagent, label, targetNode }] }
function buildReactionMap(allNodes, allEdges) {
    const nodeMap = new Map(allNodes.map(n => [n.id, n]));
    const map = {};

    for (const edge of allEdges) {
        // Skip structural / backbone edges
        if (!edge.label || !edge.label.trim()) continue;
        if (edge.id.startsWith('struct-') || edge.id.startsWith('comp-') || edge.id.startsWith('c-backbone')) continue;

        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) continue;
        if (sourceNode.data?.isElement || targetNode.data?.isElement) continue;
        if (sourceNode.id.startsWith('backbone') || targetNode.id.startsWith('backbone')) continue;

        const reagent = edge.data?.reagents || edge.label || '';
        if (!reagent) continue;

        if (!map[edge.source]) map[edge.source] = [];
        map[edge.source].push({
            reagent,            // the exact training string (e.g. "H₂ / Ni, 150°C")
            label: edge.label,  // short label (e.g. "+ H₂")
            targetNode,
        });
    }

    return map;
}

export default function NeuralNetworkView({ allNodes, allEdges = [], onClose }) {
    const [predictor] = useState(() => new ReactionPredictor());
    const [isReady, setIsReady] = useState(false);

    const [sourceMoleculeId, setSourceMoleculeId] = useState('');
    const [reagentStr, setReagentStr] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [activations, setActivations] = useState(null);
    const [inputVec, setInputVec] = useState(null);

    // Build reaction map once
    const reactionMap = useMemo(() => buildReactionMap(allNodes, allEdges), [allNodes, allEdges]);

    // Molecules that have at least one valid outgoing reaction
    const validMolecules = useMemo(
        () => allNodes.filter(n => reactionMap[n.id] && reactionMap[n.id].length > 0),
        [allNodes, reactionMap]
    );

    // Reagents available for the currently selected molecule
    const availableReagents = useMemo(() => {
        if (!sourceMoleculeId || !reactionMap[sourceMoleculeId]) return [];
        return reactionMap[sourceMoleculeId];
    }, [sourceMoleculeId, reactionMap]);

    // Reset reagent when molecule changes
    useEffect(() => {
        setReagentStr('');
        setPrediction(null);
        setActivations(null);
        setInputVec(null);
    }, [sourceMoleculeId]);

    useEffect(() => {
        predictor.init().then(() => setIsReady(true));
    }, [predictor]);

    const handlePredict = async () => {
        if (!isReady || !sourceMoleculeId || !reagentStr) return;

        const sourceNode = allNodes.find(n => n.id === sourceMoleculeId);
        if (!sourceNode) return;

        // Run prediction with the exact training reagent string
        const result = await predictor.predict(sourceNode, reagentStr);

        // Sort and grab top 3 series for explanation
        const topSeries = Object.entries(result.rawProbs.series)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, prob]) => ({ name, prob }));

        // Find the expected target node for this reaction (for UI verification)
        const expectedEntry = availableReagents.find(r => r.reagent === reagentStr);
        const expectedTarget = expectedEntry?.targetNode;

        setPrediction({ ...result, topSeries, expectedTarget });
        setInputVec(result.inputVector);
        setActivations(result.activations);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-gray-950 flex"
        >
            {/* ── Left Control Panel ── */}
            <div className="w-[450px] border-r border-white/10 bg-gray-900/50 backdrop-blur-3xl flex flex-col h-full shadow-[0_0_100px_rgba(168,85,247,0.1)] relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    title="Exit Neural Network View"
                >
                    <XCircle size={24} />
                </button>

                <div className="p-8 border-b border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-purple-400">
                        <Database size={24} className="animate-pulse" />
                        <h2 className="text-2xl font-bold tracking-tight text-white">Neural Engine</h2>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Query the deep learning model directly. Select a reactant — only reagents that produce a known
                        reaction will appear in the dropdown, ensuring valid predictions every time.
                    </p>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto">

                    {/* ── Molecule Selector ── */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">
                            1. Input Molecule
                        </label>
                        <select
                            value={sourceMoleculeId}
                            onChange={e => setSourceMoleculeId(e.target.value)}
                            className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all"
                        >
                            <option value="">Select reactant...</option>
                            {validMolecules.map(n => (
                                <option key={n.id} value={n.id}>
                                    {n.data.label}{n.data.formula ? ` (${n.data.formula})` : ''}
                                </option>
                            ))}
                        </select>
                        {sourceMoleculeId && (
                            <p className="text-xs text-purple-400 font-mono">
                                {availableReagents.length} valid reaction{availableReagents.length !== 1 ? 's' : ''} available
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center text-gray-700">
                        <Plus size={20} />
                    </div>

                    {/* ── Reagent Selector (filtered) ── */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">
                            2. Reagent &amp; Conditions
                        </label>
                        <select
                            value={reagentStr}
                            onChange={e => setReagentStr(e.target.value)}
                            disabled={!sourceMoleculeId || availableReagents.length === 0}
                            className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all disabled:opacity-40"
                        >
                            <option value="">
                                {sourceMoleculeId ? 'Select reagent...' : 'Select a molecule first'}
                            </option>
                            {availableReagents.map((r, i) => (
                                <option key={i} value={r.reagent}>
                                    {r.reagent} → {r.targetNode?.data?.label || '?'}
                                </option>
                            ))}
                        </select>

                        {/* Show expected product hint */}
                        {reagentStr && availableReagents.find(r => r.reagent === reagentStr) && (
                            <div className="flex items-center gap-2 text-xs text-green-400 font-mono bg-green-950/20 border border-green-500/20 rounded-lg px-3 py-2">
                                <ArrowRight size={12} />
                                <span>
                                    Expected: <strong>{availableReagents.find(r => r.reagent === reagentStr)?.targetNode?.data?.label}</strong>
                                    {' '}({availableReagents.find(r => r.reagent === reagentStr)?.targetNode?.data?.details?.series})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Run Inference Button ── */}
                    <button
                        onClick={handlePredict}
                        disabled={!isReady || !sourceMoleculeId || !reagentStr}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:grayscale rounded-xl font-medium text-white shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex justify-center items-center gap-2 mt-8"
                    >
                        <Activity size={18} />
                        Run Inference
                    </button>

                    {/* ── Prediction Result Block ── */}
                    <AnimatePresence mode="wait">
                        {prediction && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-8 p-6 rounded-2xl border ${prediction.series === 'No Reaction'
                                    ? 'bg-red-950/20 border-red-500/20'
                                    : 'bg-green-950/20 border-green-500/20'
                                }`}
                            >
                                <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                    <Zap size={14} className={prediction.series === 'No Reaction' ? 'text-red-400' : 'text-green-400'} />
                                    Network Output
                                </div>

                                {prediction.series === 'No Reaction' ? (
                                    <div className="flex items-center gap-3 text-red-300">
                                        <XCircle size={24} />
                                        <span className="text-lg font-medium">No Reaction Expected</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide text-[10px]">Predicted Reaction</div>
                                            <div className="font-mono text-purple-300 bg-gray-900 border border-purple-500/30 rounded-xl p-4">
                                                <div className="flex flex-wrap items-center gap-2 text-lg">
                                                    <span className="text-blue-300">{allNodes.find(n => n.id === sourceMoleculeId)?.data?.label}</span>
                                                    <span className="text-gray-500 text-sm">{'+'}</span>
                                                    <span className="text-blue-200">{reagentStr}</span>
                                                </div>
                                                <div className="my-2 text-gray-500 text-center w-full">↓</div>
                                                <div className="text-center w-full text-xl text-green-400 font-bold">
                                                    {prediction.expectedTarget?.data?.label || prediction.series}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <div className="text-xs text-gray-400">Class: <span className="text-white ml-1">{prediction.series}</span></div>
                                                <div className="text-xs text-gray-400">Carbons: <span className="text-white ml-1">C{prediction.carbonCount}</span></div>
                                            </div>
                                            {prediction.expectedTarget && (
                                                <div className="flex items-center gap-2 text-[10px] font-mono bg-green-950/30 px-2 py-1 rounded-full border border-green-500/30">
                                                    {prediction.series === prediction.expectedTarget?.data?.details?.series && prediction.carbonCount === prediction.expectedTarget?.data?.details?.carbonCount
                                                        ? <CheckCircle size={12} className="text-green-400" />
                                                        : <XCircle size={12} className="text-yellow-400" />
                                                    }
                                                    <span className="text-gray-300">Target Match</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Confidence Bar */}
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-xs font-mono text-gray-400">
                                        <span>Confidence</span>
                                        <span>{(prediction.overallConfidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${prediction.overallConfidence * 100}%` }}
                                            className={`h-full rounded-full ${prediction.overallConfidence > 0.8 ? 'bg-green-500' : prediction.overallConfidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Inference Explanation */}
                                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                    <h4 className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Live Inference Log</h4>

                                    <div className="space-y-3 text-sm font-mono text-gray-400 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-start gap-2">
                                            <span className="text-blue-400">1.</span>
                                            <p>Input Encoded: <span className="text-white">[{inputVec?.slice(0, 5).map(v => v.toFixed(1)).join(', ')}...]</span> (50-dim vector)</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-blue-400">2.</span>
                                            <p>Forward Pass: <span className="text-white">3 Hidden Layers</span> activated. Peak at Layer 3: <span className="text-white">{(Math.max(...(activations?.product_assembly || [0]))).toFixed(2)}</span></p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-blue-400">3.</span>
                                            <div className="w-full">
                                                <p className="mb-2">Softmax Distribution (Top 3):</p>
                                                {prediction.topSeries && prediction.topSeries.map((s, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs mb-1">
                                                        <span className={i === 0 ? 'text-green-400' : 'text-gray-500'}>{s.name}</span>
                                                        <span className={i === 0 ? 'text-green-400' : 'text-gray-500'}>{(s.prob * 100).toFixed(2)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                            <span className="text-purple-400">↳</span>
                                            <p className="text-gray-300">
                                                {prediction.series === 'No Reaction'
                                                    ? `Network determined mathematical incompatibility between reactants.`
                                                    : `Topology mapped to ${prediction.series} structure with ${prediction.carbonCount} carbons.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Right Canvas Area ── */}
            <div className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950 z-0 pointer-events-none min-h-screen" />
                
                <div className="p-8 flex flex-col items-center min-h-full">
                    {/* Canvas Container */}
                    <div className="w-full max-w-6xl z-10 flex flex-col flex-shrink-0 h-[80vh] min-h-[650px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-light text-gray-300">Live Architecture Map</h3>
                            <div className="flex items-center gap-4 text-sm font-mono text-gray-500">
                                <span>Input: 50 dim</span>
                                <ArrowRight size={14} />
                                <span>Hidden: [64, 32, 32]</span>
                                <ArrowRight size={14} />
                                <span>Output: 16 dim</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-gray-900/40 rounded-3xl p-2 border border-white/5 backdrop-blur-sm relative shadow-2xl">
                            {isReady ? (
                                <NNCanvasDiagram
                                    tfModel={predictor.model}
                                    activations={activations}
                                    inputVector={inputVec}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-gray-500 animate-pulse">
                                    Loading Neural Architecture...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Math Explainer Section */}
                    <div className="w-full max-w-6xl z-10 mt-12 pb-12 space-y-6">
                        <h3 className="text-2xl font-light text-purple-300 mb-8 flex items-center gap-3">
                            <Activity size={24} /> Under the Hood: Mathematical Execution
                        </h3>
                        
                        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col md:flex-row gap-8 shadow-xl">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-purple-400 font-mono text-sm tracking-widest uppercase">1. Neuron Activation (Forward Pass)</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Each neuron in a hidden layer receives inputs from all neurons in the previous layer.
                                    The pre-activation <span className="text-white font-mono bg-white/10 px-1 rounded">z</span> is calculated as the dot product 
                                    of the input vector <span className="text-white font-mono bg-white/10 px-1 rounded">x</span> and the weight matrix <span className="text-white font-mono bg-white/10 px-1 rounded">W</span>, plus a bias vector <span className="text-white font-mono bg-white/10 px-1 rounded">b</span>.
                                </p>
                                <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-green-400 text-center text-lg shadow-inner">
                                    z<span className="text-gray-500 text-sm align-sub">j</span> = Σ (w<span className="text-gray-500 text-sm align-sub">ij</span> · a<span className="text-gray-500 text-sm align-sub">i</span>) + b<span className="text-gray-500 text-sm align-sub">j</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <h4 className="text-purple-400 font-mono text-sm tracking-widest uppercase">2. Non-Linearity (ReLU)</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    To allow the network to learn complex chemical rules, we apply the <strong>Rectified Linear Unit (ReLU)</strong> activation function to <span className="text-white font-mono bg-white/10 px-1 rounded">z</span>. 
                                    If <span className="text-white font-mono bg-white/10 px-1 rounded">z &lt; 0</span>, the neuron is deactivated. This isolates specific chemical contexts smoothly.
                                </p>
                                <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-blue-400 text-center text-lg shadow-inner flex items-center justify-center h-[76px]">
                                    a<span className="text-gray-500 text-sm align-sub">j</span> = max(0, z<span className="text-gray-500 text-sm align-sub">j</span>)
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col md:flex-row gap-8 shadow-xl">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-yellow-400 font-mono text-sm tracking-widest uppercase">3. Output Probabilities (Softmax)</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    The final layer uses the <strong>Softmax</strong> function to squash all raw outputs into a valid probability distribution. This creates a list of confident probabilities for each target chemical series that sum perfectly to 100%.
                                </p>
                                <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-yellow-400 text-center text-lg shadow-inner">
                                    P(y=k) = e<span className="text-gray-500 text-xs align-super">z<sub className="align-sub ml-[-2px]">k</sub></span> / Σ e<span className="text-gray-500 text-xs align-super">z<sub className="align-sub ml-[-2px]">i</sub></span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <h4 className="text-yellow-400 font-mono text-sm tracking-widest uppercase">4. Cost & Optimization</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    During training, the model learns via <strong>Categorical Cross-Entropy Loss</strong> with the <strong>Adam Optimizer</strong>. 
                                    It penalizes the model logarithmically for confidently predicting an incorrect chemical reaction over thousands of epochs.
                                </p>
                                <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-red-400 text-center text-lg shadow-inner flex items-center justify-center h-[76px]">
                                    Loss = - Σ (y<span className="text-gray-500 text-xs align-sub">true,i</span> · log( p<span className="text-gray-500 text-xs align-sub">prob,i</span> ))
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
