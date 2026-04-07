import React, { useMemo, useState } from 'react';
import { X, Atom, Info, Play, Zap, Beaker, ArrowDownToLine, ArrowUpFromLine, ChevronRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { mechanisms } from '../data/mechanisms';
import { equations } from '../data/equations';
import ProblemSolverModal from './ProblemSolverModal';

const DetailsPanel = ({ selectedNode, allEdges = [], allNodes = [], onClose, onPlayMechanism, onEdgeSelect }) => {
    if (!selectedNode) return null;

    const { label, formula, description, details, seriesColor, mechanismIds } = selectedNode.data;
    const borderColor = seriesColor?.border || '#3b82f6';
    const availableMechanisms = (mechanismIds || []).filter(id => mechanisms[id]);
    const isPhysical = selectedNode.data?.domain === 'physical';
    const nodeType = details?.type; // 'concept' | 'equation' (physical) | various (organic)
    const [solverOpen, setSolverOpen] = useState(false);

    // Lightweight, sidebar-only derivation steps (can be expanded over time).
    const derivationSteps = useMemo(() => {
        const id = selectedNode.id;
        if (id === 'thermo-gibbs' || id === 'eq-gibbs') {
            return [
                'Start with definitions of thermodynamic potentials.',
                'Define enthalpy: H = U + PV.',
                'Define Gibbs free energy: G = H − TS.',
                'Take changes at constant T: ΔG = ΔH − TΔS.',
                'Spontaneity criterion at constant T,P: ΔG < 0; equilibrium: ΔG = 0.',
            ];
        }
        return null;
    }, [selectedNode.id]);

    const connectedEdges = useMemo(() => {
        // Keep structural/comparison edges out; focus on “knowledge” links.
        return allEdges.filter(e =>
            (e.source === selectedNode.id || e.target === selectedNode.id) &&
            !e.id?.startsWith('struct-') &&
            !e.id?.startsWith('comp-') &&
            !e.id?.startsWith('c-backbone')
        );
    }, [allEdges, selectedNode.id]);

    const relatedNodes = useMemo(() => {
        const ids = new Set();
        connectedEdges.forEach(e => {
            ids.add(e.source);
            ids.add(e.target);
        });
        ids.delete(selectedNode.id);
        return [...ids]
            .map(id => allNodes.find(n => n.id === id))
            .filter(Boolean);
    }, [connectedEdges, allNodes, selectedNode.id]);

    const relatedFormulas = useMemo(() => {
        // Primary sources: (1) graph-connected equation nodes, (2) equation metadata linked from equation node itself
        const eqNodes = relatedNodes.filter(n => n.data?.details?.type === 'equation');
        const eqIds = new Set(eqNodes.map(n => n.id));

        // If the selected node IS an equation, include itself.
        if (nodeType === 'equation') eqIds.add(selectedNode.id);

        // Pull full equation objects when available.
        return [...eqIds]
            .map(eqId => equations?.[eqId])
            .filter(Boolean);
    }, [relatedNodes, nodeType, selectedNode.id]);

    const solverEquation = useMemo(() => {
        // Prefer: if this node IS an equation node, use it.
        if (nodeType === 'equation') return equations?.[selectedNode.id] || null;
        // Else: pick the first connected equation node if any.
        const eq = relatedFormulas?.[0];
        return eq || null;
    }, [nodeType, selectedNode.id, relatedFormulas]);

    const solverVariables = useMemo(() => {
        // Prefer equation variables when available.
        const vars = solverEquation?.variables;
        if (vars && typeof vars === 'object') {
            return Object.entries(vars).map(([symbol, meta]) => ({
                symbol,
                ...(meta || {}),
            }));
        }
        // Fallback: infer common Ideal Gas variables if the concept is ideal gas.
        if (selectedNode.id === 'thermo-ideal-gas') {
            return [
                { symbol: 'P', name: 'Pressure', units: 'atm or Pa' },
                { symbol: 'V', name: 'Volume', units: 'L or m³' },
                { symbol: 'n', name: 'Amount of substance', units: 'mol' },
                { symbol: 'R', name: 'Gas constant', units: '8.314 J/(mol·K) or 0.08206 L·atm/(mol·K)' },
                { symbol: 'T', name: 'Temperature', units: 'K' },
            ];
        }
        return [];
    }, [solverEquation, selectedNode.id]);

    const termMeanings = useMemo(() => {
        // Equation nodes embed variables inside node.data.details.variables
        const vars = details?.variables;
        if (nodeType !== 'equation' || !vars) return null;
        return Object.entries(vars).map(([symbol, meta]) => ({
            symbol,
            ...meta,
        }));
    }, [details?.variables, nodeType]);

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
            <ProblemSolverModal
                open={solverOpen}
                onClose={() => setSolverOpen(false)}
                title={label}
                equationLabel={solverEquation?.label || (isPhysical ? 'Formula' : 'Formula')}
                equationText={
                    solverEquation?.equation ||
                    (isPhysical && nodeType === 'equation' ? (description || formula) : formula) ||
                    ''
                }
                variables={solverVariables}
            />

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
                    {/* Solve Problem CTA */}
                    {isPhysical && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                            <button
                                onClick={() => setSolverOpen(true)}
                                className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] border border-white/10 bg-white/5 hover:bg-white/10"
                                style={{ boxShadow: `0 6px 22px ${borderColor}15` }}
                                title="Open numerical problem solver input"
                            >
                                <Calculator size={18} />
                                Solve Problem
                            </button>
                            <div className="text-[11px] text-gray-500 mt-2 text-center">
                                Enter known values with units and choose the unknown variable.
                            </div>
                        </motion.div>
                    )}

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
                        <div className="relative text-4xl font-mono mb-2 text-white font-bold tracking-wider">
                            {isPhysical && nodeType === 'equation' ? (description || formula) : formula}
                        </div>
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

                    {/* Physical Chemistry: formula/equation metadata */}
                    {isPhysical && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-2 text-fuchsia-300">
                                <Info size={18} /> Formula / Equation
                            </h3>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="text-sm text-gray-200 font-mono break-words">
                                    {nodeType === 'equation'
                                        ? (equations?.[selectedNode.id]?.equation || description || formula)
                                        : (formula || selectedNode.data?.equation || '')}
                                </div>
                                {equations?.[selectedNode.id]?.shortForm && (
                                    <div className="mt-2 text-xs text-gray-400 font-mono">
                                        {equations[selectedNode.id].shortForm}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Physical Chemistry: derivation steps */}
                    {isPhysical && derivationSteps?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-emerald-300">
                                <ArrowDownToLine size={18} /> Step-by-step derivation
                            </h3>
                            <div className="space-y-2">
                                {derivationSteps.map((step, i) => (
                                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                        <div className="text-xs text-gray-500 mb-1">Step {i + 1}</div>
                                        <div className="text-sm text-gray-200 leading-relaxed">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Physical Chemistry: meaning of each term (for equation nodes) */}
                    {isPhysical && termMeanings?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-cyan-300">
                                <Atom size={18} /> Meaning of each term
                            </h3>
                            <div className="space-y-2">
                                {termMeanings.map((t) => (
                                    <div key={t.symbol} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <div className="font-mono text-sm text-white font-semibold">{t.symbol}</div>
                                            <div className="text-[11px] text-gray-400 font-mono">{t.units || ''}</div>
                                        </div>
                                        {t.name && <div className="text-sm text-gray-200 mt-1">{t.name}</div>}
                                        {(t.note || t.sign) && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {[t.sign, t.note].filter(Boolean).join(' · ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Physical Chemistry: applications/use cases (concept nodes already carry these) */}
                    {isPhysical && Array.isArray(selectedNode.data?.applications) && selectedNode.data.applications.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-orange-300">
                                <Zap size={18} /> Applications & use cases
                            </h3>
                            <div className="space-y-2">
                                {selectedNode.data.applications.map((a, i) => (
                                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
                                        {a}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Physical Chemistry: related formulas & connected concepts */}
                    {isPhysical && (relatedFormulas.length > 0 || relatedNodes.length > 0) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
                            <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-lime-300">
                                <ChevronRight size={18} /> Related (from graph)
                            </h3>

                            {relatedFormulas.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-2">Related formulas</div>
                                    <div className="space-y-2">
                                        {relatedFormulas.map(eq => (
                                            <div key={eq.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                                <div className="text-sm text-white font-semibold">{eq.label}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-1 break-words">{eq.equation}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {relatedNodes.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-2">Connected concepts</div>
                                    <div className="space-y-2">
                                        {relatedNodes
                                            .filter(n => n.data?.details?.type === 'concept')
                                            .slice(0, 12)
                                            .map(n => (
                                                <div key={n.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: n.data?.seriesColor?.border || '#64748b' }}
                                                        />
                                                        <div className="text-sm text-gray-200">{n.data?.label || n.id}</div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Reactions that FORM this molecule (Incoming) */}
                    {!isPhysical && incomingReactions.length > 0 && (
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
                    {!isPhysical && outgoingReactions.length > 0 && (
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
                    {!isPhysical && incomingReactions.length === 0 && outgoingReactions.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                            className="py-3 bg-white/5 border border-white/10 rounded-xl text-center text-gray-500 text-sm">
                            No reaction connections for this node
                        </motion.div>
                    )}

                    {/* Mechanism Animation Buttons */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                        {!isPhysical && availableMechanisms.length > 0 ? (
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
                            !isPhysical ? (
                                <div className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                                    <Zap size={16} /> No mechanism animation available yet
                                </div>
                            ) : null
                        )}
                    </motion.div>

                    {/* Properties */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h3 className="flex items-center gap-2 text-base font-semibold mb-3 text-cyan-300">
                            <Atom size={18} /> Properties
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(details || {})
                                .filter(([key]) => !(isPhysical && key === 'variables')) // avoid duplicating variable meaning section
                                .map(([key, value], index) => (
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
