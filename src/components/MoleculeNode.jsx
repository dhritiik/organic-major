import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FlaskConical, Atom, Hexagon, Droplets, Flame, TestTube, Beaker, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Map series to icon
const seriesIcon = (series) => {
    switch (series) {
        case 'Aromatic': return <Hexagon size={22} />;
        case 'Alcohol': return <Droplets size={22} />;
        case 'Carboxylic Acid': return <TestTube size={22} />;
        case 'Ester': return <Sparkles size={22} />;
        case 'Aldehyde': case 'Ketone': return <Flame size={22} />;
        case 'Amine': case 'Amide': return <Beaker size={22} />;
        default: return <Atom size={22} />;
    }
};

const MoleculeNode = ({ data, selected }) => {
    const sc = data.seriesColor; // { bg, border } from graphGenerator
    const hasMech = data.mechanismIds && data.mechanismIds.length > 0;
    const series = data.details?.series || '';

    // Determine border/glow colour
    const borderColor = selected
        ? (sc?.border || '#3b82f6')
        : (sc?.border ? `${sc.border}66` : 'rgba(255,255,255,0.1)');
    const bgColor = selected
        ? (sc?.bg || 'rgba(31,41,55,0.8)')
        : (sc?.bg ? `${sc.bg}cc` : 'rgba(17,24,39,0.4)');
    const glowColor = sc?.border || '#3b82f6';

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                boxShadow: selected ? `0 0 28px ${glowColor}55` : 'none',
            }}
            className={`
                relative min-w-[170px] px-5 py-4 rounded-2xl shadow-xl
                backdrop-blur-xl border-2 transition-all duration-300
                hover:shadow-lg
            `}>
            <Handle type="target" position={Position.Top}
                style={{ background: sc?.border || '#6b7280' }}
                className="!w-3.5 !h-3.5 !-top-[7px] !rounded-full !border-2 !border-gray-900" />

            <div className="flex items-center gap-3.5">
                <div
                    style={{
                        background: selected
                            ? `linear-gradient(135deg, ${sc?.border || '#3b82f6'}, ${sc?.border || '#06b6d4'}88)`
                            : `${sc?.border || '#ffffff'}15`,
                    }}
                    className="p-2.5 rounded-xl shadow-inner text-white flex items-center justify-center"
                >
                    {seriesIcon(series)}
                </div>
                <div className="flex flex-col">
                    <div className="text-[15px] font-bold text-gray-100 tracking-wide leading-tight">{data.label}</div>
                    <div className="text-xs font-mono text-gray-400 bg-black/30 px-1.5 py-0.5 rounded inline-block mt-1">{data.formula}</div>
                    {series && <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-widest">{series}</div>}
                </div>
            </div>

            {hasMech && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-900 animate-pulse" title="Has mechanism animation" />
            )}

            <Handle type="source" position={Position.Bottom}
                style={{ background: sc?.border || '#6b7280' }}
                className="!w-3.5 !h-3.5 !-bottom-[7px] !rounded-full !border-2 !border-gray-900" />
        </motion.div>
    );
};

export default memo(MoleculeNode);
