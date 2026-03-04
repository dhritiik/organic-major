import React from 'react';
import { motion } from 'framer-motion';
import { Atom, ArrowRight, FlaskConical, Beaker, Zap, BookOpen, MousePointerClick } from 'lucide-react';

const FEATURES = [
    { icon: MousePointerClick, label: 'Click molecules', desc: 'to see properties & reactions' },
    { icon: Zap, label: 'Click reaction edges', desc: 'to learn reagents & mechanisms' },
    { icon: Beaker, label: 'Watch animations', desc: 'step-by-step reaction mechanisms' },
    { icon: BookOpen, label: '150+ molecules', desc: 'across 15 homologous series' },
];

const LandingOverlay = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/95 backdrop-blur-xl text-white overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        opacity: [0.15, 0.35, 0.15]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 text-blue-500/20"
                >
                    <Atom size={300} />
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -10, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 text-emerald-500/20"
                >
                    <FlaskConical size={250} />
                </motion.div>
                {/* Gradient orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-600/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[200px] bg-gradient-to-t from-purple-600/10 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mb-4 tracking-tight">
                        OrganicFlow
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-8">Interactive Organic Chemistry Knowledge Graph</p>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto"
                >
                    Explore molecules, reactions, and synthesis pathways. Click on any molecule to see its chemistry, or click a reaction arrow to learn how one compound transforms into another.
                </motion.p>

                {/* Feature cards */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto"
                >
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.label}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/8 transition-colors"
                        >
                            <f.icon size={24} className="mx-auto mb-2 text-blue-400" />
                            <div className="text-sm font-semibold text-white">{f.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    onClick={onStart}
                    className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full text-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-3 mx-auto overflow-hidden"
                >
                    <span className="relative z-10">Start Exploring</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-8 text-gray-600 text-xs font-mono tracking-wider"
            >
                Built with React Flow • Framer Motion • Tailwind CSS
            </motion.div>
        </motion.div>
    );
};

export default LandingOverlay;
