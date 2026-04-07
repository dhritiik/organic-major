import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator } from 'lucide-react';

const UNIT_OPTIONS = {
    P: ['atm', 'Pa', 'bar', 'torr'],
    V: ['L', 'm³', 'mL'],
    n: ['mol'],
    T: ['K', '°C'],
    R: ['J/(mol·K)', 'L·atm/(mol·K)'],
    E: ['V'],
    'E0': ['V'],
    'E0cell': ['V'],
    k: ['(varies)'],
    A: ['(varies)'],
    Ea: ['J/mol', 'kJ/mol'],
    'ΔG': ['J/mol', 'kJ/mol'],
    'ΔG°': ['J/mol', 'kJ/mol'],
    'ΔH': ['J/mol', 'kJ/mol'],
    'ΔS': ['J/(mol·K)'],
    π: ['Pa', 'atm'],
    M: ['mol/L'],
};

function defaultUnitFor(symbol, metaUnits) {
    const opts = UNIT_OPTIONS[symbol];
    if (opts?.length) return opts[0];
    if (typeof metaUnits === 'string' && metaUnits.trim()) return metaUnits;
    return '';
}

export default function ProblemSolverModal({
    open,
    onClose,
    title,
    equationLabel,
    equationText,
    variables = [],
}) {
    const variableSymbols = useMemo(
        () => variables.map(v => v.symbol).filter(Boolean),
        [variables]
    );

    const [solveFor, setSolveFor] = useState(variableSymbols[0] || '');
    const [inputs, setInputs] = useState(() => ({}));

    // Reset when opening or when equation changes.
    useEffect(() => {
        if (!open) return;
        setSolveFor(variableSymbols[0] || '');
        const next = {};
        variables.forEach(v => {
            next[v.symbol] = {
                value: '',
                unit: defaultUnitFor(v.symbol, v.units),
            };
        });
        setInputs(next);
    }, [open, equationText, equationLabel, variableSymbols, variables]);

    // Convenience: if user types '?' for one variable, auto-set solveFor.
    useEffect(() => {
        if (!open) return;
        const q = Object.entries(inputs).find(([, d]) => String(d?.value || '').trim() === '?');
        if (q?.[0]) setSolveFor(q[0]);
    }, [open, inputs]);

    if (!open) return null;

    const setValue = (sym, value) => {
        setInputs(prev => ({
            ...prev,
            [sym]: { ...(prev[sym] || {}), value },
        }));
    };
    const setUnit = (sym, unit) => {
        setInputs(prev => ({
            ...prev,
            [sym]: { ...(prev[sym] || {}), unit },
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <motion.div
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="w-full max-w-[760px] rounded-2xl border border-white/10 bg-gray-950/90 shadow-2xl overflow-hidden"
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-white font-semibold text-lg">
                            <Calculator size={18} />
                            <span className="truncate">Solve Problem{title ? `: ${title}` : ''}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Input interface only (no calculation yet).
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Close"
                    >
                        <X size={18} className="text-gray-300" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs text-gray-400 mb-2">{equationLabel || 'Formula'}</div>
                        <div className="font-mono text-sm text-white break-words">
                            {equationText || 'No equation found for this node yet.'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="text-sm font-semibold text-white mb-3">Solve for</div>
                            <select
                                value={solveFor}
                                onChange={(e) => setSolveFor(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                            >
                                {variableSymbols.map(sym => (
                                    <option key={sym} value={sym}>
                                        {sym}
                                    </option>
                                ))}
                            </select>
                            <div className="text-xs text-gray-500 mt-2">
                                Tip: type <span className="font-mono text-gray-300">?</span> in a field to auto-select it as the unknown.
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="text-sm font-semibold text-white mb-3">Known values</div>
                            <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                                {variables.map(v => {
                                    const opts = UNIT_OPTIONS[v.symbol] || (v.units ? [v.units] : ['']);
                                    const row = inputs[v.symbol] || { value: '', unit: defaultUnitFor(v.symbol, v.units) };
                                    const disabled = v.symbol === solveFor;
                                    return (
                                        <div key={v.symbol} className={`flex items-center gap-2 ${disabled ? 'opacity-60' : ''}`}>
                                            <div className="w-20 text-xs text-gray-300 font-mono">{v.symbol}</div>
                                            <input
                                                value={row.value}
                                                onChange={(e) => setValue(v.symbol, e.target.value)}
                                                disabled={disabled}
                                                placeholder={disabled ? '?' : 'value'}
                                                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed"
                                            />
                                            <select
                                                value={row.unit}
                                                onChange={(e) => setUnit(v.symbol, e.target.value)}
                                                disabled={disabled}
                                                className="w-40 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed"
                                            >
                                                {opts.map(u => (
                                                    <option key={u} value={u}>
                                                        {u || '—'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold text-white mb-2">Term meanings</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {variables.map(v => (
                                <div key={v.symbol} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <div className="font-mono text-sm text-white">{v.symbol}</div>
                                        <div className="text-[11px] text-gray-500 font-mono">{v.units || ''}</div>
                                    </div>
                                    {v.name && <div className="text-xs text-gray-300 mt-1">{v.name}</div>}
                                    {v.note && <div className="text-[11px] text-gray-500 mt-1">{v.note}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {}}
                        disabled
                        title="Calculation not implemented yet"
                        className="px-4 py-2 rounded-xl bg-blue-600/40 text-sm text-white/70 cursor-not-allowed"
                    >
                        Solve (coming soon)
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

