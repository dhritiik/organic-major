import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

// ─── Subdomain metadata ───────────────────────────────────────────────────────
const SUBDOMAIN_META = {
    thermodynamics:   { icon: '🔥', short: 'Thermo'  },
    kinetics:         { icon: '⚡', short: 'Kinetics' },
    equilibrium:      { icon: '⚖️', short: 'Equil.'   },
    electrochemistry: { icon: '🔋', short: 'Electro'  },
    solidState:       { icon: '💎', short: 'Solid'    },
    solutions:        { icon: '🌊', short: 'Solutions' },
    atomicStructure:  { icon: '⚛️', short: 'Atomic'   },
};

const ConceptNode = memo(({ data, selected }) => {
    const {
        label,
        symbol,
        equation,
        subdomain,
        seriesColor,
        details,
        units,
    } = data;

    const isEquation = details?.type === 'equation';
    const meta = SUBDOMAIN_META[subdomain] || { icon: '🔬', short: 'Physical' };
    const border = seriesColor?.border || '#6366f1';
    const bg = seriesColor?.bg || '#1a1a2e';

    const cardWidth = isEquation ? 210 : 250;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
                width: cardWidth,
                background: `linear-gradient(145deg, ${bg}ee, #0f0f1aee)`,
                border: `${selected ? 2 : 1.5}px solid ${border}${selected ? 'ff' : '70'}`,
                borderRadius: 14,
                overflow: 'hidden',
                position: 'relative',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                boxShadow: selected
                    ? `0 0 24px ${border}50, 0 0 64px ${border}20, inset 0 0 20px ${border}08`
                    : `0 4px 24px rgba(0,0,0,0.55)`,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Left accent bar */}
            <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: isEquation ? 3 : 4,
                background: `linear-gradient(180deg, ${border}, ${border}60)`,
            }} />

            {/* Top strip: subdomain badge */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px 4px 14px',
                borderBottom: `1px solid ${border}18`,
            }}>
                <span style={{
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 1.8,
                    color: border,
                    opacity: 0.9,
                }}>
                    {meta.short}
                </span>
                <span style={{ fontSize: 13 }}>{meta.icon}</span>
            </div>

            {/* Body */}
            <div style={{ padding: isEquation ? '6px 12px 6px 14px' : '8px 12px 4px 14px' }}>

                {/* Symbol (large, serif) */}
                {symbol && !isEquation && (
                    <div style={{
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        fontSize: 22,
                        lineHeight: 1.1,
                        color: border,
                        marginBottom: 3,
                        filter: `drop-shadow(0 0 8px ${border}60)`,
                    }}>
                        {symbol}
                    </div>
                )}

                {/* Label */}
                <div style={{
                    fontSize: isEquation ? 11 : 13,
                    fontWeight: 700,
                    color: '#e2e8f0',
                    lineHeight: 1.35,
                    marginBottom: isEquation ? 4 : 6,
                }}>
                    {label}
                </div>

                {/* Units badge */}
                {units && !isEquation && (
                    <span style={{
                        display: 'inline-block',
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 10,
                        background: `${border}20`,
                        color: border,
                        border: `1px solid ${border}40`,
                        marginBottom: 6,
                        fontFamily: 'monospace',
                    }}>
                        {units}
                    </span>
                )}
            </div>

            {/* Equation box */}
            {equation && (
                <div style={{
                    margin: '0 10px 10px 10px',
                    padding: isEquation ? '5px 8px' : '7px 10px',
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: 8,
                    border: `1px solid ${border}25`,
                }}>
                    <code style={{
                        fontSize: isEquation ? 10.5 : 11,
                        color: '#94a3b8',
                        fontFamily: "'Fira Mono', 'Cascadia Code', 'Courier New', monospace",
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        lineHeight: 1.5,
                    }}>
                        {equation.length > 55 ? equation.slice(0, 52) + '…' : equation}
                    </code>
                </div>
            )}

            {/* "Has Calculator" indicator */}
            {!isEquation && data.hasCalculator && (
                <div style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 10,
                    fontSize: 10,
                    color: border,
                    opacity: 0.7,
                    fontWeight: 600,
                }}>
                    🧮 calculator
                </div>
            )}

            <Handle type="target" position={Position.Top}
                style={{ opacity: 0.25, background: border, width: 6, height: 6 }} />
            <Handle type="source" position={Position.Bottom}
                style={{ opacity: 0.25, background: border, width: 6, height: 6 }} />
        </motion.div>
    );
});

ConceptNode.displayName = 'ConceptNode';
export default ConceptNode;
