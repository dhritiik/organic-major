import React from 'react';
import { X, FlaskConical, BookOpen, Beaker, Lightbulb, ArrowRight, Play, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
    addition:     { bg: '#0f2a1a', border: '#22c55e', text: '#4ade80' },
    substitution: { bg: '#1a1a30', border: '#6366f1', text: '#818cf8' },
    elimination:  { bg: '#2a1a0f', border: '#f97316', text: '#fb923c' },
    condensation: { bg: '#2a0f2a', border: '#ec4899', text: '#f472b6' },
    oxidation:    { bg: '#2a0f0f', border: '#ef4444', text: '#f87171' },
    reduction:    { bg: '#0f1a2a', border: '#3b82f6', text: '#60a5fa' },
    radical:      { bg: '#1a2a0f', border: '#84cc16', text: '#a3e635' },
    aromatic:     { bg: '#2a1a0f', border: '#f59e0b', text: '#fbbf24' },
};

const ReactionPanel = ({ reactionData, sourceNode, targetNode, onClose, onPlayMechanism }) => {
    if (!reactionData) return null;

    const cat = categoryColors[reactionData.category] || categoryColors.addition;

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[440px] bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
        >
            <div className="p-6 text-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold"
                            style={{ color: cat.text }}
                        >
                            {reactionData.name}
                        </motion.h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                style={{ borderColor: cat.border, color: cat.text, background: cat.bg }}
                            >
                                {reactionData.type}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group flex-shrink-0">
                        <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Reaction Arrow */}
                    {sourceNode && targetNode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02]"
                        >
                            <div className="text-sm font-medium text-gray-300">{sourceNode.data?.label}</div>
                            <ArrowRight size={16} className="text-gray-500 flex-shrink-0" />
                            <div className="text-sm font-medium text-gray-300">{targetNode.data?.label}</div>
                        </motion.div>
                    )}

                    {/* Summary */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h3 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: cat.text }}>
                            <BookOpen size={16} /> Summary
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{reactionData.summary}</p>
                    </motion.div>

                    {/* Example Equation */}
                    {reactionData.example && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="px-4 py-3 rounded-xl border text-center font-mono text-sm"
                            style={{ borderColor: `${cat.border}33`, background: `${cat.bg}88` }}
                        >
                            <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Example</div>
                            <div className="text-white font-medium">{reactionData.example}</div>
                        </motion.div>
                    )}

                    {/* Conditions Box */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: cat.text }}>
                            <Beaker size={16} /> Reagents & Conditions
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                ['Reagents', reactionData.reagents],
                                ['Catalyst', reactionData.catalyst],
                                ['Conditions', reactionData.conditions],
                                ['Energetics', reactionData.energetics],
                            ].filter(([, v]) => v).map(([label, value], i) => (
                                <div key={label} className="flex justify-between items-center bg-white/[0.03] px-3 py-2.5 rounded-lg border border-white/5">
                                    <span className="text-gray-500 text-xs">{label}</span>
                                    <span className="text-gray-200 text-xs font-medium text-right max-w-[60%]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Mechanism Description */}
                    {reactionData.mechanism && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <h3 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: cat.text }}>
                                <FlaskConical size={16} /> How It Works
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">{reactionData.mechanism}</p>
                        </motion.div>
                    )}

                    {/* Key Points */}
                    {reactionData.keyPoints?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: cat.text }}>
                                <Lightbulb size={16} /> Key Points
                            </h3>
                            <ul className="space-y-1.5">
                                {reactionData.keyPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.border }} />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Play Mechanism Buttons */}
                    {reactionData.relatedMechanisms?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: cat.text }}>
                                <Zap size={16} /> Watch Animation
                            </h3>
                            <div className="space-y-2">
                                {reactionData.relatedMechanisms.map(mechId => (
                                    <button
                                        key={mechId}
                                        onClick={() => onPlayMechanism(mechId)}
                                        className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all border"
                                        style={{
                                            background: `linear-gradient(135deg, ${cat.border}22, ${cat.border}11)`,
                                            borderColor: `${cat.border}44`,
                                            color: cat.text,
                                        }}
                                    >
                                        <Play size={16} fill="currentColor" />
                                        {mechId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ReactionPanel;
