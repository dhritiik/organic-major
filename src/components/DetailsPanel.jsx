import React from 'react';
import { X, FlaskConical, Atom, Info, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailsPanel = ({ selectedNode, onClose, onPlayMechanism }) => {
    if (!selectedNode) return null;

    const { label, formula, description, structure, details } = selectedNode.data;

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-gray-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
        >
            <div className="p-8 text-white">
                <div className="flex justify-between items-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text"
                    >
                        {label}
                    </motion.h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Structure Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-white/10 to-transparent rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                        <div className="relative text-5xl font-mono mb-4 text-white font-bold tracking-wider">{formula}</div>
                        <div className="relative text-base text-gray-300 font-medium bg-black/30 px-3 py-1 rounded-lg">{structure}</div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-blue-300">
                            <Info size={20} /> Description
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-base">
                            {description}
                        </p>
                    </motion.div>

                    {/* Mechanism Button */}
                    {selectedNode.data?.mechanismId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <button
                                onClick={() => onPlayMechanism(selectedNode.data.mechanismId)}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Play size={20} fill="currentColor" /> Watch Reaction Mechanism
                            </button>
                        </motion.div>
                    )}

                    {/* Properties */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-emerald-300">
                            <Atom size={20} /> Properties
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(details).map(([key, value], index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    key={key}
                                    className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors"
                                >
                                    <span className="text-gray-400 capitalize text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-mono text-sm text-white font-semibold">{value}</span>
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
