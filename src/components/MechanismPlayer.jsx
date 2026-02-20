import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { mechanisms } from '../data/mechanisms';

const Atom = ({ id, x, y, label, color, scale = 1 }) => (
    <motion.div
        layoutId={id}
        initial={false}
        animate={{ x, y, scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`absolute flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 border-black/20 font-bold z-10 ${color}`}
        style={{ marginLeft: -24, marginTop: -24 }} // Center anchor
    >
        {label}
    </motion.div>
);

const Bond = ({ start, end, type, isForming }) => {
    // Calculate length and angle
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, width: length }}
            transition={{ duration: 0.5 }}
            className={`absolute h-2 origin-left rounded-full ${isForming ? 'bg-emerald-400 border-dashed border-2 bg-transparent' : 'bg-gray-400'}`}
            style={{
                top: start.y,
                left: start.x,
                transform: `rotate(${angle}deg) translate(0, -50%)`, // Center vertically
                height: type === 'double' ? '8px' : '4px',
                borderTop: type === 'double' ? '2px solid transparent' : 'none',
                borderBottom: type === 'double' ? '2px solid transparent' : 'none',
            }}
        >
            {type === 'double' && (
                <div className="absolute top-[-6px] left-0 w-full h-[2px] bg-gray-400 rounded-full" />
            )}
            {type === 'double' && (
                <div className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-gray-400 rounded-full" />
            )}
        </motion.div>
    );
};

const MechanismPlayer = ({ mechanismId, onClose }) => {
    const mechanism = mechanisms[mechanismId];
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!mechanism) return null;

    const currentStep = mechanism.steps[stepIndex];

    // Helper to find atom coords by ID
    const getAtom = (id) => currentStep.atoms.find(a => a.id === id);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setStepIndex(prev => {
                    if (prev < mechanism.steps.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, 3000); // 3 seconds per step
        }
        return () => clearInterval(interval);
    }, [isPlaying, mechanism.steps.length]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <div className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{mechanism.title}</h2>
                        <p className="text-gray-400 text-sm">Step {stepIndex + 1} of {mechanism.steps.length}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative bg-[#1a1c23] overflow-hidden">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-[600px] h-[400px]">
                            {/* Bonds - Render first to be behind atoms */}
                            {currentStep.bonds.map((bond, i) => {
                                const start = getAtom(bond.from);
                                const end = getAtom(bond.to);
                                if (!start || !end) return null;
                                return <Bond key={`${bond.from}-${bond.to}`} start={start} end={end} type={bond.type} isForming={bond.isForming} />;
                            })}

                            {/* Atoms */}
                            {currentStep.atoms.map(atom => (
                                <Atom key={atom.id} {...atom} />
                            ))}
                        </div>
                    </div>

                    {/* Step Description Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/5">
                        <p className="text-lg text-white text-center font-medium animate-pulse-slow">
                            {currentStep.description}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-6 bg-gray-800/50 border-t border-white/10 flex justify-center items-center gap-6">
                    <button
                        onClick={() => setStepIndex(0)}
                        className="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Restart"
                    >
                        <RotateCcw size={20} />
                    </button>

                    <button
                        onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                        className="p-3 rounded-full hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                        disabled={stepIndex === 0}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                        onClick={() => setStepIndex(Math.min(mechanism.steps.length - 1, stepIndex + 1))}
                        className="p-3 rounded-full hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                        disabled={stepIndex === mechanism.steps.length - 1}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MechanismPlayer;
