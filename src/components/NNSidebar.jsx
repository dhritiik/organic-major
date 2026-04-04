import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const NNSidebar = ({ nnMode, onToggle }) => {
    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            onClick={onToggle}
            title={nnMode ? 'Exit Neural Network Mode' : 'Neural Network Prediction'}
            className={`p-3 rounded-xl border backdrop-blur-lg transition-all hover:scale-110 active:scale-95 group ${
                nnMode
                    ? 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 border-purple-400/40 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-900/60 border-white/10 hover:bg-gray-800/80 hover:border-white/20'
            }`}
        >
            <Brain
                size={20}
                className={nnMode ? 'text-white' : 'text-gray-400 group-hover:text-purple-400'}
            />
        </motion.button>
    );
};

export default NNSidebar;
