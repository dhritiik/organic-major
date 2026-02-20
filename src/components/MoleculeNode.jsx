import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FlaskConical, Atom } from 'lucide-react';
import { motion } from 'framer-motion';

const MoleculeNode = ({ data, selected }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
      relative min-w-[160px] px-5 py-4 rounded-2xl shadow-xl
      backdrop-blur-xl border transition-colors duration-300
      ${selected
                    ? 'bg-gray-800/80 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                    : 'bg-gray-900/40 border-white/10 hover:border-white/30 hover:bg-gray-800/60'}
    `}>
            <Handle type="target" position={Position.Top} className={`!w-4 !h-4 !-top-2 !rounded-full transition-colors ${selected ? '!bg-blue-400' : '!bg-gray-600'}`} />

            <div className="flex items-center gap-4">
                <div className={`
          p-2.5 rounded-xl shadow-inner
          ${selected ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white' : 'bg-white/5 text-gray-400'}
        `}>
                    <Atom size={24} />
                </div>
                <div>
                    <div className="text-base font-bold text-gray-100 tracking-wide">{data.label}</div>
                    <div className="text-xs font-mono text-gray-400 bg-black/20 px-1.5 py-0.5 rounded inline-block mt-1">{data.formula}</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className={`!w-4 !h-4 !-bottom-2 !rounded-full transition-colors ${selected ? '!bg-emerald-400' : '!bg-gray-600'}`} />
        </motion.div>
    );
};

export default memo(MoleculeNode);
