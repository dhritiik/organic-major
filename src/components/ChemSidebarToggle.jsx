import { motion } from "framer-motion";
import { FlaskConical, MessageCircle } from "lucide-react";

/**
 * ChemSidebarToggle — floating button to open the ChemSidebar.
 *
 * Props:
 *   onClick     {function}  – called when button is clicked
 *   isOpen      {boolean}   – current sidebar state (styles button accordingly)
 *   hasContext  {boolean}   – whether a node is currently selected (shows indicator dot)
 */
export default function ChemSidebarToggle({ onClick, isOpen = false, hasContext = false }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Toggle ChemBot sidebar"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl"
      style={{
        background: isOpen
          ? "rgba(8,18,40,0.95)"
          : "linear-gradient(135deg,#63dcb4 0%,#3b9eff 100%)",
        border: isOpen
          ? "1px solid rgba(99,220,180,0.35)"
          : "1px solid transparent",
        color: isOpen ? "#63dcb4" : "#0a1628",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.78rem",
        fontWeight: 600,
        boxShadow: isOpen
          ? "0 0 24px rgba(99,220,180,0.2)"
          : "0 8px 32px rgba(59,158,255,0.35)",
        backdropFilter: "blur(12px)",
        letterSpacing: "0.03em",
      }}
    >
      {/* icon */}
      <FlaskConical size={16} />

      {/* label */}
      <span>{isOpen ? "Close ChemBot" : "Ask ChemBot"}</span>

      {/* pulse dot when context is active and sidebar is closed */}
      {hasContext && !isOpen && (
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "#0a1628" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "#0a1628" }}
          />
        </span>
      )}
    </motion.button>
  );
}
