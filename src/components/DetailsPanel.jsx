import React, { useMemo } from 'react';
import { X, Atom, Info, Play, Zap, Beaker, ArrowDownToLine, ArrowUpFromLine, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { mechanisms } from '../data/mechanisms';

const DetailsPanel = ({ selectedNode, allEdges = [], allNodes = [], onClose, onPlayMechanism, onEdgeSelect }) => {
    if (!selectedNode) return null;

    const { label, formula, description, details, seriesColor, mechanismIds } = selectedNode.data;
    const borderColor = seriesColor?.border || '#3b82f6';
    const availableMechanisms = (mechanismIds || []).filter(id => mechanisms[id]);

    // Compute incoming edges (reactions that FORM this molecule)
    const incomingReactions = useMemo(() => {
        return allEdges
            .filter(e => e.target === selectedNode.id && e.label && !e.id.startsWith('struct-') && !e.id.startsWith('comp-') && !e.id.startsWith('c-backbone'))
            .map(e => {
                const sourceNode = allNodes.find(n => n.id === e.source);
                return { edge: e, sourceNode, targetNode: selectedNode };
            });
    }, [selectedNode.id, allEdges, allNodes]);

    // Compute outgoing edges (reactions FROM this molecule)
    const outgoingReactions = useMemo(() => {
        return allEdges
            .filter(e => e.source === selectedNode.id && e.label && !e.id.startsWith('struct-') && !e.id.startsWith('comp-') && !e.id.startsWith('c-backbone'))
            .map(e => {
                const targetNode = allNodes.find(n => n.id === e.target);
                return { edge: e, sourceNode: selectedNode, targetNode };
            });
    }, [selectedNode.id, allEdges, allNodes]);

    const ReactionItem = ({ reaction, direction }) => {
        const { edge, sourceNode, targetNode } = reaction;
        const otherNode = direction === 'incoming' ? sourceNode : targetNode;
        const otherColor = otherNode?.data?.seriesColor?.border || '#6b7280';
        const reagents = edge.data?.reagents || '';

        return (
            <button
                onClick={() => onEdgeSelect && onEdgeSelect(edge)}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/8 transition-all group flex items-center gap-3"
            >
                <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: otherColor }}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                        {direction === 'incoming' ? (
                            <>
                                <span className="text-gray-400 truncate">{sourceNode?.data?.label || '?'}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 font-semibold" style={{ color: edge.style?.stroke || '#94a3b8' }}>
                                    {edge.label}
                                </span>
                                <ChevronRight size={12} className="text-gray-600" />
                                <span className="text-white font-semibold truncate">{label}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-white font-semibold truncate">{label}</span>
                                <ChevronRight size={12} className="text-gray-600" />
                                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 font-semibold" style={{ color: edge.style?.stroke || '#94a3b8' }}>
                                    {edge.label}
                                </span>
                                <ChevronRight size={12} className="text-gray-600" />
                                <span className="text-gray-400 truncate">{targetNode?.data?.label || '?'}</span>
                            </>
                        )}
                    </div>
                    {reagents && (
                        <div className="text-[11px] text-gray-500 mt-1 font-mono">{reagents}</div>
                    )}
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
            </button>
        );
    };

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[440px] bg-gray-900/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
        >
            <div className="p-7 text-white">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold"
                            style={{ color: borderColor }}
                        >
                            {label}
                        </motion.h2>
                        {details?.series && (
                            <span className="text-xs uppercase tracking-widest text-gray-500 mt-1 block">{details.series}</span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Formula Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group"
                        style={{ background: `linear-gradient(135deg, ${borderColor}15, transparent)` }}
                    >
                        <div className="absolute inset-0 blur-[50px] group-hover:opacity-40 opacity-20 transition-opacity"
                             style={{ background: borderColor }} />
                        <div className="relative text-4xl font-mono mb-2 text-white font-bold tracking-wider">{formula}</div>
                        {details?.general && (
                            <div className="relative text-sm text-gray-400 font-mono bg-black/30 px-3 py-1 rounded-lg">General: {details.general}</div>
                        )}
                    </motion.div>

                    {/* Description */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <h3 className="flex items-center gap-2 text-base font-semibold mb-2 text-blue-300">
                            <Info size={18} /> About
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
                    </motion.div>

                    {/* Reactions that FORM this molecule (Incoming) */}
                    {incomingReactions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-emerald-400">
                                <ArrowDownToLine size={18} /> Formed By ({incomingReactions.length})
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Reactions that produce {label}. Click to learn more.</p>
                            <div className="space-y-2">
                                {incomingReactions.map((r, i) => (
                                    <motion.div
                                        key={r.edge.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.04 }}
                                    >
                                        <ReactionItem reaction={r} direction="incoming" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Reactions FROM this molecule (Outgoing) */}
                    {outgoingReactions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-orange-400">
                                <ArrowUpFromLine size={18} /> Reacts To ({outgoingReactions.length})
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Reactions that {label} can undergo. Click to learn more.</p>
                            <div className="space-y-2">
                                {outgoingReactions.map((r, i) => (
                                    <motion.div
                                        key={r.edge.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.04 }}
                                    >
                                        <ReactionItem reaction={r} direction="outgoing" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* No reactions message */}
                    {incomingReactions.length === 0 && outgoingReactions.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                            className="py-3 bg-white/5 border border-white/10 rounded-xl text-center text-gray-500 text-sm">
                            No reaction connections for this node
                        </motion.div>
                    )}

                    {/* Mechanism Animation Buttons */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                        {availableMechanisms.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-purple-300">
                                    <Beaker size={18} /> Animated Mechanisms ({availableMechanisms.length})
                                </h3>
                                {availableMechanisms.map((mechId, idx) => {
                                    const mech = mechanisms[mechId];
                                    return (
                                        <button
                                            key={mechId}
                                            onClick={() => onPlayMechanism(mechId)}
                                            className="w-full py-3 px-4 rounded-xl font-semibold flex items-center gap-3 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
                                            style={{
                                                background: `linear-gradient(135deg, ${borderColor}${idx === 0 ? '' : '88'}, ${borderColor}44)`,
                                                boxShadow: `0 4px 20px ${borderColor}22`,
                                            }}
                                        >
                                            <Play size={18} fill="currentColor" className="flex-shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold truncate">{mech?.title || mechId}</div>
                                                {mech?.steps && (
                                                    <div className="text-xs text-white/60">{mech.steps.length} steps</div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                                <Zap size={16} /> No mechanism animation available yet
                            </div>
                        )}
                    </motion.div>

                    {/* Properties */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-cyan-300">
                            <Atom size={18} /> Properties
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(details || {}).map(([key, value], index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (index * 0.04) }}
                                    key={key}
                                    className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5 hover:border-white/15 transition-colors"
                                >
                                    <span className="text-gray-400 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-mono text-sm text-white font-medium">{String(value)}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DetailsPanel;
