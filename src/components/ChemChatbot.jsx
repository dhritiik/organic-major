import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Atom, FlaskConical, Sparkles, ChevronDown,
    RotateCcw, Copy, Check, Beaker, Zap, BookOpen, Flame
} from 'lucide-react';
import { queryChemDatabase } from '../data/chemQueryEngine.js';
// ─── Mode Definitions ───────────────────────────────────────────────────────
const MODES = {
    organic: {
        id: 'organic',
        label: 'Organic Chemistry',
        shortLabel: 'Organic',
        icon: Atom,
        accentColor: '#3b82f6',
        accentGlow: 'rgba(59,130,246,0.25)',
        borderColor: 'rgba(59,130,246,0.35)',
        gradientFrom: '#1e3a5f',
        gradientTo: '#0f172a',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        systemPrompt: `You are OrganicFlow's expert organic chemistry tutor. You specialize in:
- Homologous series (alkanes, alkenes, alkynes, alcohols, aldehydes, ketones, carboxylic acids, esters, amines, amides, aromatics)
- Reaction mechanisms (nucleophilic substitution, electrophilic addition, elimination, radical, condensation, oxidation/reduction)
- Structural isomerism and nomenclature (IUPAC naming)
- Functional group interconversions and synthesis pathways
- Stereochemistry and chirality
- Aromatic chemistry (electrophilic aromatic substitution)

Provide clear, accurate, concise answers. When relevant:
- Use chemical formulas (e.g., CH₃CH₂OH for ethanol)
- Show reaction equations with arrows
- Mention key reagents, conditions, and catalysts
- Explain why reactions happen (mechanism insight)
- Reference homologous series patterns when helpful

Keep answers educational but not overly academic. Use ✦ bullets for key points. For reaction mechanisms use → arrows. Always be precise with chemical names.`,
        placeholder: 'Ask about mechanisms, nomenclature, reactions…',
        suggestions: [
            'What is nucleophilic substitution?',
            'How does ethanol form ethanoic acid?',
            'Explain electrophilic addition to alkenes',
            'What are the products of esterification?',
            'Difference between SN1 and SN2?',
        ],
    },
    physical: {
        id: 'physical',
        label: 'Reagents & Physical',
        shortLabel: 'Reagents',
        icon: FlaskConical,
        accentColor: '#10b981',
        accentGlow: 'rgba(16,185,129,0.25)',
        borderColor: 'rgba(16,185,129,0.35)',
        gradientFrom: '#064e3b',
        gradientTo: '#0f172a',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        systemPrompt: `You are OrganicFlow's expert in reagents, physical chemistry, and laboratory practice. You specialize in:
- Reagent selection and specificity (e.g., LiAlH4 vs NaBH4, PCl5 vs SOCl2, KMnO4 vs CrO3)
- Reaction conditions (temperature, pressure, solvent, pH)
- Catalysts and their roles (acid/base, metal, enzyme, radical initiators)
- Physical properties of organic compounds (boiling points, solubility, polarity, intermolecular forces)
- Test tube reactions and distinguishing tests (Fehling's, Tollens', iodoform, bromine water, sodium metal)
- Thermodynamics and kinetics of organic reactions (activation energy, enthalpy, entropy)
- Laboratory safety and handling of reagents
- Purification techniques (distillation, recrystallisation, chromatography)

When answering:
- Always specify exact reagents with quantities/concentrations where relevant
- Note conditions: temperature (°C), pressure (atm), solvent, time
- Mention safety considerations for hazardous reagents
- Use ✦ for key reagent points, ⚠ for safety notes, ✓ for confirmatory tests
- Give practical lab context wherever possible`,
        placeholder: 'Ask about reagents, conditions, lab tests…',
        suggestions: [
            'What reagent converts alcohol to aldehyde?',
            'Fehling\'s vs Tollens\' test — when to use each?',
            'How do you distinguish alkene from alkane?',
            'LiAlH4 vs NaBH4 — key differences?',
            'What conditions are needed for nitration?',
        ],
    },
};

// ─── Message Bubble ──────────────────────────────────────────────────────────
const MessageBubble = ({ message, mode, onCopy }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';
    const accent = MODES[mode].accentColor;

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
    };

    // Format text: bold **text**, code `text`, bullets ✦
    const formatContent = (text) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            // Code block line
            if (line.startsWith('```') || line.endsWith('```')) {
                return null; // handled separately
            }
            // Apply inline formatting
            const formatted = line
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
                .replace(/`([^`]+)`/g, `<code style="background:rgba(255,255,255,0.08);padding:1px 6px;border-radius:4px;font-family:monospace;font-size:0.85em;color:${accent}">$1</code>`)
                .replace(/✦/g, `<span style="color:${accent}">✦</span>`)
                .replace(/⚠/g, '<span style="color:#f59e0b">⚠</span>')
                .replace(/✓/g, '<span style="color:#10b981">✓</span>');
            return (
                <p
                    key={i}
                    className={`${line.trim() === '' ? 'h-2' : ''} leading-relaxed`}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
        >
            {!isUser && (
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5"
                    style={{ background: `linear-gradient(135deg, ${accent}44, ${accent}22)`, border: `1px solid ${accent}33` }}
                >
                    <Sparkles size={13} style={{ color: accent }} />
                </div>
            )}
            <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative ${
                        isUser
                            ? 'text-white rounded-tr-sm'
                            : 'text-gray-200 rounded-tl-sm'
                    }`}
                    style={
                        isUser
                            ? { background: `linear-gradient(135deg, ${accent}cc, ${accent}88)`, boxShadow: `0 2px 16px ${accent}33` }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
                    }
                >
                    <div className="space-y-0.5">
                        {formatContent(message.content)}
                    </div>

                    {/* Copy button */}
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} className="text-gray-400" />}
                        </button>
                    )}
                </div>

                <span className="text-[10px] text-gray-600 px-1">
                    {message.timestamp}
                </span>
            </div>
        </motion.div>
    );
};

// ─── Typing Indicator ────────────────────────────────────────────────────────
const TypingIndicator = ({ mode }) => {
    const accent = MODES[mode].accentColor;
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5"
        >
            <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${accent}44, ${accent}22)`, border: `1px solid ${accent}33` }}
            >
                <Sparkles size={13} style={{ color: accent }} />
            </div>
            <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: accent }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// ─── Suggestion Chip ─────────────────────────────────────────────────────────
const SuggestionChip = ({ text, onClick, accent }) => (
    <button
        onClick={() => onClick(text)}
        className="px-3 py-1.5 text-xs rounded-full border transition-all hover:scale-[1.03] active:scale-[0.97] text-left whitespace-nowrap"
        style={{
            borderColor: `${accent}33`,
            color: `${accent}cc`,
            background: `${accent}0d`,
        }}
    >
        {text}
    </button>
);

// ─── Main Chatbot Component ───────────────────────────────────────────────────
const ChemChatbot = ({ isOpen, onClose, initialMode = 'organic' }) => {
    const [mode, setMode] = useState(initialMode);
    const [messages, setMessages] = useState({ organic: [], physical: [] });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModeMenu, setShowModeMenu] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const currentMode = MODES[mode];
    const currentMessages = messages[mode];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen, mode]);

    const addMessage = useCallback((role, content) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => ({
            ...prev,
            [mode]: [...prev[mode], { id: Date.now(), role, content, timestamp }],
        }));
    }, [mode]);

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || isLoading) return;

        setInput('');
        addMessage('user', trimmed);
        setIsLoading(true);

        // Small artificial delay so the typing indicator shows (feels responsive)
        await new Promise(resolve => setTimeout(resolve, 320));

        try {
            const reply = queryChemDatabase(trimmed);
            addMessage('assistant', reply);
        } catch (err) {
            addMessage('assistant', 'Something went wrong searching the database. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, mode, messages, addMessage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages(prev => ({ ...prev, [mode]: [] }));
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setShowModeMenu(false);
    };

    const Icon = currentMode.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="fixed right-0 top-0 h-full z-[60] flex flex-col"
                        style={{ width: 460 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Glassmorphic container */}
                        <div
                            className="flex flex-col h-full relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(180deg, #0d1421 0%, #0a0f1a 100%)',
                                borderLeft: `1px solid ${currentMode.borderColor}`,
                                boxShadow: `-20px 0 80px ${currentMode.accentGlow}`,
                            }}
                        >
                            {/* Ambient glow top */}
                            <div
                                className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
                                style={{
                                    background: `radial-gradient(ellipse at 50% -20%, ${currentMode.accentColor}18 0%, transparent 70%)`,
                                }}
                            />

                            {/* ── Header ── */}
                            <div
                                className="relative flex-shrink-0 px-5 py-4 flex items-center justify-between"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                {/* Mode selector */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${currentMode.accentColor}33, ${currentMode.accentColor}11)`,
                                            border: `1px solid ${currentMode.accentColor}44`,
                                        }}
                                    >
                                        <Icon size={18} style={{ color: currentMode.accentColor }} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white font-semibold text-sm">ChemAI</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-mono" 
                                                  style={{ 
                                                      color: currentMode.accentColor, 
                                                      borderColor: `${currentMode.accentColor}44`,
                                                      background: `${currentMode.accentColor}11`
                                                  }}>
                                                {currentMode.shortLabel}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-0.5">AI Chemistry Assistant</p>
                                    </div>
                                </div>

                                {/* Right controls */}
                                <div className="flex items-center gap-1.5">
                                    {/* Mode toggle */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowModeMenu(m => !m)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
                                            style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                                        >
                                            Switch mode
                                            <ChevronDown size={12} className={`transition-transform ${showModeMenu ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showModeMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-1 w-52 rounded-xl overflow-hidden z-10"
                                                    style={{
                                                        background: '#111827',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                                                    }}
                                                >
                                                    {Object.values(MODES).map(m => {
                                                        const MIcon = m.icon;
                                                        const isActive = m.id === mode;
                                                        return (
                                                            <button
                                                                key={m.id}
                                                                onClick={() => switchMode(m.id)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                                                                style={{
                                                                    background: isActive ? `${m.accentColor}11` : 'transparent',
                                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                                }}
                                                            >
                                                                <div
                                                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                                    style={{
                                                                        background: `${m.accentColor}22`,
                                                                        border: `1px solid ${m.accentColor}44`,
                                                                    }}
                                                                >
                                                                    <MIcon size={14} style={{ color: m.accentColor }} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-medium text-gray-200">{m.label}</div>
                                                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                                                        {m.id === 'organic' ? 'Mechanisms & synthesis' : 'Reagents & lab tests'}
                                                                    </div>
                                                                </div>
                                                                {isActive && (
                                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: m.accentColor }} />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        onClick={clearChat}
                                        title="Clear chat"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                                    >
                                        <RotateCcw size={15} />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* ── Mode Tab Bar ── */}
                            <div
                                className="flex-shrink-0 flex px-4 py-2 gap-2"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            >
                                {Object.values(MODES).map(m => {
                                    const MIcon = m.icon;
                                    const isActive = m.id === mode;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => switchMode(m.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center"
                                            style={
                                                isActive
                                                    ? {
                                                          background: `${m.accentColor}22`,
                                                          color: m.accentColor,
                                                          border: `1px solid ${m.accentColor}44`,
                                                      }
                                                    : {
                                                          color: '#6b7280',
                                                          border: '1px solid transparent',
                                                      }
                                            }
                                        >
                                            <MIcon size={13} />
                                            {m.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Messages ── */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative">
                                {/* Empty state */}
                                {currentMessages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center h-full pb-8 gap-5"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${currentMode.accentColor}33, ${currentMode.accentColor}11)`,
                                                border: `1px solid ${currentMode.accentColor}44`,
                                                boxShadow: `0 0 40px ${currentMode.accentColor}22`,
                                            }}
                                        >
                                            <Icon size={28} style={{ color: currentMode.accentColor }} />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-white font-semibold text-base mb-1">
                                                {currentMode.label} Assistant
                                            </h3>
                                            <p className="text-gray-500 text-xs leading-relaxed max-w-[260px]">
                                                {mode === 'organic'
                                                    ? 'Ask about reaction mechanisms, functional groups, synthesis pathways, IUPAC naming, and more.'
                                                    : 'Ask about reagent selection, lab tests, reaction conditions, physical properties, and practical chemistry.'}
                                            </p>
                                        </div>

                                        {/* Suggestion chips */}
                                        <div className="flex flex-wrap gap-2 justify-center px-4">
                                            {currentMode.suggestions.map((s, i) => (
                                                <motion.div
                                                    key={s}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.1 + i * 0.05 }}
                                                >
                                                    <SuggestionChip
                                                        text={s}
                                                        onClick={sendMessage}
                                                        accent={currentMode.accentColor}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Messages */}
                                {currentMessages.map((msg) => (
                                    <MessageBubble key={msg.id} message={msg} mode={mode} />
                                ))}

                                {/* Typing */}
                                <AnimatePresence>
                                    {isLoading && <TypingIndicator mode={mode} />}
                                </AnimatePresence>

                                <div ref={messagesEndRef} />
                            </div>

                            {/* ── Suggestion chips (when messages exist) ── */}
                            {currentMessages.length > 0 && currentMessages.length < 3 && (
                                <div
                                    className="flex-shrink-0 px-4 pb-2 flex gap-1.5 overflow-x-auto"
                                    style={{ scrollbarWidth: 'none' }}
                                >
                                    {currentMode.suggestions.slice(0, 3).map((s) => (
                                        <SuggestionChip
                                            key={s}
                                            text={s}
                                            onClick={sendMessage}
                                            accent={currentMode.accentColor}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* ── Input Area ── */}
                            <div
                                className="flex-shrink-0 p-4"
                                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <div
                                    className="flex items-end gap-2 rounded-2xl px-4 py-3 transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${input ? currentMode.accentColor + '55' : 'rgba(255,255,255,0.08)'}`,
                                        boxShadow: input ? `0 0 20px ${currentMode.accentGlow}` : 'none',
                                    }}
                                >
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={currentMode.placeholder}
                                        rows={1}
                                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none resize-none leading-relaxed max-h-28"
                                        style={{ scrollbarWidth: 'none' }}
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!input.trim() || isLoading}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                                        style={{
                                            background: input.trim()
                                                ? `linear-gradient(135deg, ${currentMode.accentColor}, ${currentMode.accentColor}bb)`
                                                : 'rgba(255,255,255,0.06)',
                                            boxShadow: input.trim() ? `0 4px 14px ${currentMode.accentGlow}` : 'none',
                                        }}
                                    >
                                        <Send size={14} className="text-white" />
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-gray-700 mt-2">
                                    Press Enter to send · Shift+Enter for new line
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChemChatbot;
