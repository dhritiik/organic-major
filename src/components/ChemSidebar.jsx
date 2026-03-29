import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, X, Send, Atom, Loader2,
  Sparkles, RotateCcw, ChevronDown,
} from "lucide-react";
import { answerQuery, getSuggestions } from "../data/chemBotEngine.js";

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContextBadge({ context, onClear }) {
  if (!context) return null;
  const icons = { element: "⚛", molecule: "🧪", reaction: "⚡", backbone: "🔗" };
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        background: "rgba(99,220,180,0.12)",
        border: "1px solid rgba(99,220,180,0.3)",
        color: "#63dcb4",
      }}
    >
      <span>{icons[context.type] ?? "🔬"}</span>
      <span className="truncate max-w-[160px]">{context.label}</span>
      <button onClick={onClear} className="ml-1 hover:text-white transition-colors">
        <X size={11} />
      </button>
    </motion.div>
  );
}

/** Renders **bold** markers and line breaks */
function MessageText({ text }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        const rendered = parts.map((p, j) =>
          j % 2 === 1 ? <strong key={j}>{p}</strong> : p
        );
        return (
          <span key={i}>
            {rendered}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
        style={
          isUser
            ? { background: "rgba(255,255,255,0.1)", color: "#ccc" }
            : { background: "linear-gradient(135deg,#63dcb4,#3b9eff)", color: "#0a1628" }
        }
      >
        {isUser ? "U" : <Atom size={13} />}
      </div>

      <div
        className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
        style={
          isUser
            ? {
                background: "rgba(59,158,255,0.18)",
                border: "1px solid rgba(59,158,255,0.25)",
                color: "#e2eeff",
              }
            : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#d4e8d0",
              }
        }
      >
        <MessageText text={msg.content} />
      </div>
    </motion.div>
  );
}

function SuggestedQueries({ context, onSelect }) {
  const suggestions = getSuggestions(context);
  return (
    <div className="px-3 pb-3 flex flex-wrap gap-1.5">
      {suggestions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(99,220,180,0.08)",
            border: "1px solid rgba(99,220,180,0.2)",
            color: "#63dcb4",
          }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ChemSidebar — offline chatbot sidebar for OrganicFlow.
 * All answers come from the local data files — no API needed.
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {function}
 *   context  {object|null}  { type, label, description?, extra? }
 */
export default function ChemSidebar({ isOpen = false, onClose, context = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [localContext, setLocalContext] = useState(context);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalContext(context);
    if (context) { setMessages([]); setShowSuggestions(true); }
  }, [context]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || loading) return;

      setInput("");
      setShowSuggestions(false);
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setLoading(true);

      setTimeout(() => {
        try {
          const answer = answerQuery(trimmed, localContext);
          setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
        } catch {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
          ]);
        } finally {
          setLoading(false);
        }
      }, 120);
    },
    [input, loading, localContext]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]); setLoading(false); setShowSuggestions(true);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
          />

          <motion.aside
            key="sidebar"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full z-40 flex flex-col"
            style={{
              width: "clamp(300px, 28vw, 420px)",
              background: "linear-gradient(160deg, rgba(8,18,40,0.97) 0%, rgba(5,14,30,0.99) 100%)",
              borderLeft: "1px solid rgba(99,220,180,0.15)",
              boxShadow: "-12px 0 60px rgba(0,0,0,0.6)",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#63dcb4,#3b9eff)" }}>
                  <FlaskConical size={15} color="#0a1628" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide" style={{ color: "#e8f4ff" }}>ChemBot</p>
                  <p className="text-xs" style={{ color: "#4a7a6a" }}>Powered by OrganicFlow data</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: "#4a7a6a" }} title="Clear">
                    <RotateCcw size={14} />
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "#4a7a6a" }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Context badge */}
            <AnimatePresence>
              {localContext && (
                <div className="px-3 pt-2.5 pb-1 flex-shrink-0"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-xs mb-1.5" style={{ color: "#3d5a50" }}>Discussing</p>
                  <ContextBadge context={localContext} onClear={() => setLocalContext(null)} />
                </div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-3 pb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(99,220,180,0.08)", border: "1px solid rgba(99,220,180,0.15)" }}>
                    <Sparkles size={22} style={{ color: "#63dcb4" }} />
                  </div>
                  <p className="text-sm" style={{ color: "#4a7a6a" }}>
                    {localContext
                      ? `Ask me anything about ${localContext.label}`
                      : "Select a node or ask about any molecule or reaction"}
                  </p>
                </motion.div>
              )}

              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#63dcb4,#3b9eff)" }}>
                    <Atom size={13} color="#0a1628" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-2"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Loader2 size={13} className="animate-spin" style={{ color: "#63dcb4" }} />
                    <span className="text-xs" style={{ color: "#4a7a6a" }}>Searching knowledge base…</span>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && messages.length === 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <button onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-1 px-3 pt-2 pb-1 text-xs w-full text-left hover:opacity-70 transition-opacity"
                    style={{ color: "#3d5a50" }}>
                    <ChevronDown size={11} /> Suggested questions
                  </button>
                  <SuggestedQueries context={localContext} onSelect={sendMessage} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-end gap-2 rounded-xl px-3 py-2 focus-within:ring-1 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,220,180,0.15)",
                  "--tw-ring-color": "rgba(99,220,180,0.35)",
                }}>
                <textarea
                  ref={inputRef} rows={1} value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={localContext ? `Ask about ${localContext.label}…` : "Ask about any molecule or reaction…"}
                  className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
                  style={{ color: "#d4e8d0", caretColor: "#63dcb4", maxHeight: "120px", fontFamily: "inherit" }}
                  disabled={loading}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95"
                  style={{ background: input.trim() ? "linear-gradient(135deg,#63dcb4,#3b9eff)" : "rgba(255,255,255,0.06)" }}>
                  <Send size={13} color={input.trim() ? "#0a1628" : "#4a7a6a"} />
                </button>
              </div>
              <p className="text-center text-xs mt-2 opacity-40" style={{ color: "#63dcb4" }}>
                ↵ send · shift+↵ newline
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
