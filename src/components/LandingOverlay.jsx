import React from 'react';
import { motion } from 'framer-motion';
import { Atom, ArrowRight, FlaskConical } from 'lucide-react';

const LandingOverlay = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md text-white overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        opacity: [0.3, 0.6, 0.3]
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
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 text-emerald-500/20"
                >
                    <FlaskConical size={250} />
                </motion.div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mb-6 tracking-tight">
                        OrganicFlow
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wide"
                >
                    Explore the universe of molecules, reactions, and synthesis pathways in an interactive 3D graph.
                </motion.p>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full text-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-3 mx-auto overflow-hidden"
                >
                    <span className="relative z-10">Start Exploring</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 text-gray-500 text-sm font-mono"
            >
                Interactive Knowledge Graph • React Flow • Vite
            </motion.div>
        </motion.div>
    );
};

export default LandingOverlay;
