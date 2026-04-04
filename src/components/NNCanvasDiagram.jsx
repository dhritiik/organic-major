import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { SERIES_LIST } from '../neural/encoder';

const REAGENT_NAMES = [
    'H₂', 'H₂O', 'HBr', 'Br₂', 'Cl₂', 'KCN', 'NaOH', 'NH₃',
    'H₂SO₄', 'K₂Cr₂O₇', 'KMnO₄', 'HNO₃', 'AlCl₃', 'Sn/HCl',
    'LiAlH₄', 'H₃PO₄', 'CH₃OH', 'CH₃Cl', 'UV', 'Heat', 'Temperature', 'Pressure'
];

function getNeuronLabel(layerKey, realIdx) {
    if (layerKey === 'input') {
        if (realIdx === 0) return 'Carbon Count Form (0-1)';
        if (realIdx >= 1 && realIdx <= 15) return `Molecule Series: ${SERIES_LIST[realIdx - 1]}`;
        if (realIdx === 16) return 'Has Double Bond';
        if (realIdx === 17) return 'Has Triple Bond';
        if (realIdx === 18) return 'Has -OH';
        if (realIdx === 19) return 'Has -COOH';
        if (realIdx === 20) return 'Has -NH₂';
        if (realIdx === 21) return 'Has C=O';
        if (realIdx === 22) return 'Has Halogen';
        if (realIdx === 23) return 'Has -CN';
        if (realIdx === 24) return 'Is Aromatic';
        if (realIdx === 25) return 'sp Hybridized';
        if (realIdx === 26) return 'sp² Hybridized';
        if (realIdx === 27) return 'sp³ Hybridized';
        if (realIdx >= 28 && realIdx <= 49) return `Reagent Feature: ${REAGENT_NAMES[realIdx - 28]}`;
        return `Input Feature ${realIdx}`;
    }
    if (layerKey === 'series_output') {
        return `Predicts: ${SERIES_LIST[realIdx] || 'Unknown'}`;
    }
    if (layerKey === 'carbon_output') {
        return `Predicts Carbon Count: C${realIdx + 1}`;
    }
    return `Hidden Unit #${realIdx}`;
}

function getNeuronExplanation(layerKey, realIdx, activation) {
    const actStr = activation.toFixed(3);
    if (layerKey === 'input') {
        if (activation > 0.1) return `Feature is present in the current Reactant/Reagent pair. Activation: ${actStr}`;
        return `Feature is absent. Activation: ${actStr}`;
    }
    if (layerKey === 'reaction_context') {
        return `Extracts abstract chemical properties and matching conditions. Activation: ${actStr}`;
    }
    if (layerKey === 'transformation') {
        return `Models the electron flow/transformation probability. Activation: ${actStr}`;
    }
    if (layerKey === 'product_assembly') {
        return `Synthesizes final product structural traits. Activation: ${actStr}`;
    }
    if (layerKey === 'series_output') {
        return `Confidence of becoming this series: ${(activation * 100).toFixed(1)}%`;
    }
    if (layerKey === 'carbon_output') {
         return `Confidence of having ${realIdx + 1} carbons: ${(activation * 100).toFixed(1)}%`;
    }
    return `Activation level: ${actStr}`;
}

const LAYER_CONFIG = [
    { key: 'input', name: 'Input', neurons: 50, color: '#94a3b8' },
    { key: 'reaction_context', name: 'Hidden 1', neurons: 64, color: '#a855f7' },
    { key: 'transformation', name: 'Hidden 2', neurons: 32, color: '#3b82f6' },
    { key: 'product_assembly', name: 'Hidden 3', neurons: 32, color: '#22c55e' },
    { key: 'series_output', name: 'Series', neurons: 16, color: '#f59e0b' },
];

export default function NNCanvasDiagram({ tfModel, activations, inputVector }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const layersPosRef = useRef([]);
    const [weights, setWeights] = useState([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);
    const [pinnedNode, setPinnedNode] = useState(null);

    // ── Extract Weights Once ──
    useEffect(() => {
        if (!tfModel) return;
        const extracted = [];
        for (const layer of tfModel.layers) {
            if (layer.name === 'molecule_reagent_input' || layer.name === 'carbon_output') continue;
            const wTensors = layer.getWeights();
            if (wTensors.length > 0) {
                const wData = wTensors[0].dataSync(); // kernel
                const bData = wTensors.length > 1 ? wTensors[1].dataSync() : null; // biases
                const shape = wTensors[0].shape; // [inputNodes, outputNodes]
                extracted.push({ data: wData, bias: bData, shape });
            }
        }
        setWeights(extracted);
    }, [tfModel]);

    // ── Resize Observer ──
    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    // ── Mouse Hover Handling ──
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const findNodeAtMouse = (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let found = null;
            for (const layer of layersPosRef.current) {
                for (const node of layer.nodes) {
                    const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
                    if (dist < 15) { // Hover radius
                        found = { layer: layer.conf, node, x: node.x, y: node.y };
                        break;
                    }
                }
                if (found) break;
            }
            return found;
        };

        const handleMouseMove = (e) => {
            setHoveredNode(findNodeAtMouse(e));
        };

        const handleMouseLeave = () => setHoveredNode(null);

        const handleClick = (e) => {
            const found = findNodeAtMouse(e);
            if (found) {
                setPinnedNode(found);
            } else {
                setPinnedNode(null);
            }
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('click', handleClick);
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('click', handleClick);
        };
    }, []);

    const activeNode = pinnedNode || hoveredNode;

    // ── Draw Network ──
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        ctx.scale(dpr, dpr);

        // Background
        ctx.fillStyle = '#111827'; // gray-900
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Config
        const cols = LAYER_CONFIG.length;
        const colSpacing = dimensions.width / cols;
        const maxNeuronsToDraw = 40; // cap visually to avoid lag/clutter
        const paddingY = 60;
        const maxDrawHeight = dimensions.height - paddingY * 2;

        // Calculate node positions
        const layersPos = LAYER_CONFIG.map((conf, colIdx) => {
            const x = colSpacing * colIdx + colSpacing / 2;
            const drawCount = Math.min(conf.neurons, maxNeuronsToDraw);
            const rowSpacing = Math.min(22, maxDrawHeight / drawCount);
            const totalHeight = drawCount * rowSpacing;
            const startY = (dimensions.height - totalHeight) / 2;
            
            // Get activations for this layer
            let acts = [];
            if (activations) {
                if (conf.key === 'input') acts = inputVector || [];
                else acts = activations[conf.key] || [];
            }

            const nodes = [];
            for (let i = 0; i < drawCount; i++) {
                // simple sub-sampling if actual > drawCount
                const realIdx = drawCount < conf.neurons ? Math.floor((i / drawCount) * conf.neurons) : i;
                const act = acts[realIdx] || 0;
                nodes.push({ x, y: startY + i * rowSpacing, act, realIdx });
            }
            return { conf, nodes, x };
        });

        // Store positions for hover detection
        layersPosRef.current = layersPos;

        // ── Draw Weights (Lines) ──
        if (weights.length > 0) {
            ctx.lineWidth = 0.5;
            for (let layerIdx = 0; layerIdx < layersPos.length - 1; layerIdx++) {
                const srcLayer = layersPos[layerIdx];
                const dstLayer = layersPos[layerIdx + 1];
                const wMatrix = weights[layerIdx];
                if (!wMatrix) continue;
                
                // For performance, only draw a subset of lines or lines with significant weight
                const [srcSize, dstSize] = wMatrix.shape;
                
                for (let i = 0; i < srcLayer.nodes.length; i++) {
                    const srcNode = srcLayer.nodes[i];
                    for (let j = 0; j < dstLayer.nodes.length; j++) {
                        const dstNode = dstLayer.nodes[j];
                        
                        // kernel is stored flattened: index = srcRealIdx * dstSize + dstRealIdx
                        const wIndex = srcNode.realIdx * dstSize + dstNode.realIdx;
                        const wValue = wMatrix.data[wIndex];

                        if (Math.abs(wValue) < 0.2) continue; // skip weak connections to clean UI

                        // Color based on weight sign
                        const r = wValue > 0 ? 59 : 239;
                        const g = wValue > 0 ? 130 : 68;
                        const b = wValue > 0 ? 246 : 68;
                        const alpha = Math.min(0.8, Math.abs(wValue) * 0.3);

                        // If both source and destination are activated in a prediction, brighten the line!
                        // ReLU activations can be > 1, so we cap the intensity to avoid giant blobs
                        const fireIntensity = Math.min(1.5, Math.max(0, srcNode.act * 0.5) * Math.max(0, dstNode.act * 0.5));
                        const finalAlpha = Math.max(alpha, Math.min(0.9, fireIntensity));
                        const finalLineW = Math.min(4, 0.5 + fireIntensity * 2);

                        ctx.beginPath();
                        ctx.moveTo(srcNode.x, srcNode.y);
                        // curved lines
                        ctx.bezierCurveTo(srcNode.x + colSpacing/3, srcNode.y, dstNode.x - colSpacing/3, dstNode.y, dstNode.x, dstNode.y);
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
                        ctx.lineWidth = finalLineW;
                        ctx.stroke();
                    }
                }
            }
        }

        // ── Draw Neurons ──
        for (const layer of layersPos) {
            for (const node of layer.nodes) {
                const intensity = Math.min(1, Math.max(0.1, Math.abs(node.act)));
                const size = 3 + intensity * 6; // glow gets bigger

                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                
                // Base color parsing
                ctx.fillStyle = layer.conf.color;
                
                if (intensity > 0.5) {
                    ctx.shadowBlur = 15 * intensity;
                    ctx.shadowColor = layer.conf.color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
                
                // Add white core to highly active neurons
                if (intensity > 0.8) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.fill();
                }
            }
            
            // Draw Layer Label
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#9ca3af';
            ctx.font = '12px ui-sans-serif, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(layer.conf.name, layer.x, paddingY - 20);
            
            ctx.fillStyle = '#4b5563';
            ctx.font = '10px ui-monospace, monospace';
            ctx.fillText(`${layer.conf.neurons} params`, layer.x, dimensions.height - paddingY + 30);
        }

    }, [dimensions, weights, activations, inputVector]);

    return (
        <div ref={containerRef} className="w-full h-full relative z-20">
            <div className="absolute inset-0 bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <canvas 
                    ref={canvasRef} 
                    style={{ width: '100%', height: '100%' }}
                    className="block"
                />
                {/* Overlay Gradient / UI hints */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-gray-900/40 via-transparent to-gray-900/40" />
                
                <div className="absolute top-6 left-6 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md text-xs text-green-400 font-mono flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Live Weights & Activations
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-3 text-[10px] text-gray-400 font-mono bg-gray-950/80 p-4 rounded-xl border border-white/10 backdrop-blur-md z-10 w-[200px]">
                    <div className="flex justify-between items-center w-full">
                        <span>Excitatory (+)</span>
                        <div className="h-0.5 w-10 bg-blue-500/80" />
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <span>Inhibitory (-)</span>
                        <div className="h-0.5 w-10 bg-red-500/80" />
                    </div>
                    <div className="pt-2 mt-1 border-t border-white/10 text-gray-500 text-center leading-relaxed">
                        Hover over neurons directly to trace properties.
                    </div>
                </div>
            </div>

            {/* Neuron Hover Tooltip */}
            <AnimatePresence>
                {activeNode && (
                    <motion.div 
                        key={pinnedNode ? 'pinned' : 'hover'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            left: Math.max(20, activeNode.x + 300 > dimensions.width ? activeNode.x - 300 : activeNode.x + 20),
                            top: Math.max(20, Math.min(activeNode.y - 50, dimensions.height - 380)),
                            pointerEvents: pinnedNode ? 'auto' : 'none'
                        }}
                        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30 w-[280px]"
                    >
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 w-full">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
                                    style={{ backgroundColor: activeNode.layer.color, color: activeNode.layer.color }}
                                />
                                <h4 className="text-white text-sm font-semibold tracking-wide">
                                    {activeNode.layer.name} Neuron
                                </h4>
                            </div>
                            {pinnedNode && (
                                <button onClick={() => setPinnedNode(null)} className="text-gray-500 hover:text-white pointer-events-auto">
                                    <XCircle size={14} />
                                </button>
                            )}
                        </div>
                        <div className="space-y-2 mb-3">
                            <p className="text-purple-300 text-[11px] font-mono font-bold leading-relaxed">
                                {getNeuronLabel(activeNode.layer.key, activeNode.node.realIdx)}
                            </p>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                {getNeuronExplanation(activeNode.layer.key, activeNode.node.realIdx, activeNode.node.act)}
                            </p>
                        </div>
                        
                        {/* ── Mathematical Calculation Section ── */}
                        {(() => {
                            const lIdx = LAYER_CONFIG.findIndex(c => c.key === activeNode.layer.key);
                            if (lIdx > 0 && weights[lIdx - 1]) {
                                const wMatrix = weights[lIdx - 1];
                                const prevLayer = layersPosRef.current[lIdx - 1];
                                const dstIdx = activeNode.node.realIdx;
                                const dstSize = wMatrix.shape[1];
                                
                                let wxSum = 0;
                                const contributions = [];
                                for (let i = 0; i < prevLayer.nodes.length; i++) {
                                    const srcNode = prevLayer.nodes[i];
                                    const wValue = wMatrix.data[srcNode.realIdx * dstSize + dstIdx];
                                    const contribution = wValue * srcNode.act;
                                    wxSum += contribution;
                                    
                                    if (Math.abs(contribution) > 0.001) {
                                        contributions.push({
                                            value: contribution,
                                            weight: wValue,
                                            act: srcNode.act,
                                            label: getNeuronLabel(prevLayer.conf.key, srcNode.realIdx)
                                        });
                                    }
                                }
                                
                                contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
                                
                                const bias = wMatrix.bias ? wMatrix.bias[dstIdx] : 0;
                                const z = wxSum + bias;
                                const isOutput = activeNode.layer.key === 'series_output';
                                
                                return (
                                    <div className="mt-2 pt-2 border-t border-white/10 font-mono text-[10px] space-y-1">
                                        <div className="text-gray-500 uppercase tracking-widest text-[8px] mb-1">Neuron Mathematics</div>
                                        
                                        {contributions.length > 0 && (
                                            <div className="mb-2 space-y-1 bg-white/5 p-1.5 rounded-lg border border-white/5">
                                                <div className="text-[8px] text-gray-500 mb-1">Incoming Signals (w × a):</div>
                                                <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full pointer-events-auto">
                                                    {contributions.map((c, i) => (
                                                        <div key={i} className="flex justify-between items-center text-[9px]">
                                                            <span className="text-gray-400 truncate max-w-[130px]" title={c.label}>
                                                                {c.label}
                                                            </span>
                                                            <span className="text-gray-400 shrink-0">
                                                                <span className={c.weight > 0 ? "text-blue-300" : "text-red-300"}>{c.weight.toFixed(2)}</span>
                                                                <span className="text-gray-600 px-0.5">×</span>
                                                                <span className="text-green-300">{c.act.toFixed(2)}</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Σ (w · a_prev)</span>
                                            <span className="text-blue-300">{wxSum.toFixed(3)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Bias (b)</span>
                                            <span className="text-red-300">{bias >= 0 ? '+' : ''}{bias.toFixed(3)}</span>
                                        </div>
                                        <div className="h-px w-full bg-white/10 my-1"/>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">z = Σwx + b</span>
                                            <span className="text-white">{z.toFixed(3)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-green-400 mt-1">
                                            <span>{isOutput ? 'Softmax(z)' : 'ReLU(z)'}</span>
                                            <span className="font-bold text-xs">{activeNode.node.act.toFixed(3)}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                        
                        {activeNode.node.act > 0 && (
                            <div className="mt-3 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, activeNode.node.act * 100)}%` }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
