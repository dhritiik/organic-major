import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

const POPULAR_MOLECULES = [
    { label: 'Ethanol', formula: 'C₂H₅OH', series: 'Alcohol' },
    { label: 'Benzene', formula: 'C₆H₆', series: 'Aromatic' },
    { label: 'Ethene', formula: 'C₂H₄', series: 'Alkene' },
    { label: 'Ethanoic Acid', formula: 'C₂H₄O₂', series: 'Carboxylic Acid' },
    { label: 'Methane', formula: 'CH₄', series: 'Alkane' },
    { label: 'Ethanal', formula: 'C₂H₄O', series: 'Aldehyde' },
];

const SearchBar = ({ onSearch, allNodes = [] }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPopular, setShowPopular] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
                setShowPopular(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Filter suggestions
    const suggestions = useMemo(() => {
        if (!query || query.length < 1) return [];
        const q = query.toLowerCase();
        return allNodes
            .filter(n => !n.data.isElement && !n.id.startsWith('backbone'))
            .filter(n => {
                const label = n.data.label?.toLowerCase() || '';
                const formula = n.data.formula?.toLowerCase() || '';
                const series = n.data.details?.series?.toLowerCase() || '';
                return label.includes(q) || formula.includes(q) || series.includes(q);
            })
            .slice(0, 8);
    }, [query, allNodes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
        setShowSuggestions(false);
        setShowPopular(false);
    };

    const handleSelect = (label) => {
        setQuery(label);
        onSearch(label);
        setShowSuggestions(false);
        setShowPopular(false);
    };

    const clearQuery = () => {
        setQuery('');
        onSearch('');
        setShowSuggestions(false);
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 flex flex-col items-center">
            <div ref={wrapperRef} className="relative w-full">
                <form onSubmit={handleSubmit} className="relative group w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full h-14 pl-14 pr-12 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-2xl hover:bg-gray-800/60 text-lg"
                        placeholder="Search molecules, formulas, or series..."
                        value={query}
                        onFocus={() => {
                            if (query) setShowSuggestions(true);
                            else setShowPopular(true);
                        }}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowPopular(false);
                            setShowSuggestions(!!e.target.value);
                            if (!e.target.value) onSearch('');
                        }}
                    />
                    {query && (
                        <button type="button" onClick={clearQuery} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </form>

                {/* Popular molecules dropdown (when focusing empty input) */}
                {showPopular && !query && (
                    <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="px-4 py-2 flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider border-b border-white/5">
                            <Sparkles size={12} /> Popular Molecules
                        </div>
                        {POPULAR_MOLECULES.map((mol) => (
                            <button
                                key={mol.label}
                                onClick={() => handleSelect(mol.label)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                            >
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-100">{mol.label}</span>
                                    <span className="text-xs text-gray-500 ml-2 font-mono">{mol.formula}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider flex-shrink-0">{mol.series}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                        {suggestions.map((node) => {
                            const sc = node.data.seriesColor;
                            return (
                                <button
                                    key={node.id}
                                    onClick={() => handleSelect(node.data.label)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: sc?.border || '#6b7280' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-gray-100">{node.data.label}</span>
                                        <span className="text-xs text-gray-500 ml-2 font-mono">{node.data.formula}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider flex-shrink-0">
                                        {node.data.details?.series || ''}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
