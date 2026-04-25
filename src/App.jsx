import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import GraphCanvas from './components/GraphCanvas';
import SearchBar from './components/SearchBar';
import DetailsPanel from './components/DetailsPanel';
import ReactionPanel from './components/ReactionPanel';
import AnimatedBackground from './components/AnimatedBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { initialNodes, initialEdges } from './data/knowledgeGraph';
import { physicalNodes, physicalEdges, physicalConceptNodes, physicalConceptEdges } from './data/physicalKnowledgeGraph';
import { getReactionInfo } from './data/reactionInfo';
import { Globe, Focus, Atom, FlaskConical } from 'lucide-react';

import LandingOverlay from './components/LandingOverlay';
import MechanismPlayer from './components/MechanismPlayer';
import NNSidebar from './components/NNSidebar';
import NeuralNetworkView from './components/NeuralNetworkView';
import ChemChatbot from './components/ChemChatbot';

// ── Organic universe: element-only starting view ──
const minimalNodes = initialNodes.filter(n => n.data.isElement);
const minimalEdges = initialEdges.filter(e =>
  initialNodes.find(n => n.id === e.source)?.data.isElement &&
  initialNodes.find(n => n.id === e.target)?.data.isElement
);

// ─── Chatbot FAB (Floating Action Button cluster) ────────────────────────────
const ChatbotFAB = ({ onOpenOrganic, onOpenPhysical }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sub-buttons */}
      <AnimatePresence>
        {hovered && (
          <>
            {/* Physical/Reagent button */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.85 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-xs px-2.5 py-1 rounded-full text-emerald-300 font-medium whitespace-nowrap"
                style={{
                  background: 'rgba(10,20,30,0.9)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Reagents & Physical
              </span>
              <button
                onClick={onOpenPhysical}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #065f46, #064e3b)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  boxShadow: '0 4px 24px rgba(16,185,129,0.25)',
                }}
              >
                <FlaskConical size={18} className="text-emerald-300" />
              </button>
            </motion.div>

            {/* Organic button */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.85 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-xs px-2.5 py-1 rounded-full text-blue-300 font-medium whitespace-nowrap"
                style={{
                  background: 'rgba(10,20,30,0.9)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Organic Chemistry
              </span>
              <button
                onClick={onOpenOrganic}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f, #1e3058)',
                  border: '1px solid rgba(59,130,246,0.4)',
                  boxShadow: '0 4px 24px rgba(59,130,246,0.25)',
                }}
              >
                <Atom size={18} className="text-blue-300" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative"
        style={{
          background: hovered
            ? 'linear-gradient(135deg, #3b82f6, #10b981)'
            : 'linear-gradient(135deg, #1d4ed8, #059669)',
          boxShadow: hovered
            ? '0 8px 32px rgba(59,130,246,0.4), 0 4px 16px rgba(16,185,129,0.3)'
            : '0 4px 20px rgba(59,130,246,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Dual icon */}
        <div className="relative w-6 h-6">
          <Atom size={16} className="text-white absolute top-0 left-0 opacity-70" />
          <FlaskConical size={14} className="text-white absolute bottom-0 right-0 opacity-90" />
        </div>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ background: 'rgba(59,130,246,0.4)' }}
        />
      </motion.button>

      {/* Label under FAB */}
      {!hovered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-gray-500 text-center"
        >
          ChemAI
        </motion.p>
      )}
    </div>
  );
};

// ─── Main App Content ─────────────────────────────────────────────────────────
function Content() {
  const [nodes, setNodes, onNodesChange] = useNodesState(minimalNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(minimalEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [activeMechanism, setActiveMechanism] = useState(null);
  const [viewMode, setViewMode] = useState('focused');
  const [nnMode, setNnMode] = useState(false);
  const [graphDomain, setGraphDomain] = useState('organic');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState('organic');
  const { fitView } = useReactFlow();

  const allNodes = graphDomain === 'organic' ? initialNodes : physicalNodes;
  const allEdges = graphDomain === 'organic' ? initialEdges : physicalEdges;

  const openChat = (mode) => {
    setChatMode(mode);
    setChatOpen(true);
  };

  const getFocusedGraph = useCallback((targetNode, allNodes, allEdges) => {
    if (!targetNode) return { nodes: minimalNodes, edges: minimalEdges };

    const focusedNodeIds = new Set([targetNode.id]);
    const focusedEdgeIds = new Set();

    const traceUpstream = (nodeId, depth = 0) => {
      if (depth > 4) return;
      allEdges.forEach(edge => {
        if (edge.target === nodeId && !edge.id.startsWith('struct-') && !edge.id.startsWith('comp-')) {
          focusedEdgeIds.add(edge.id);
          if (!focusedNodeIds.has(edge.source)) {
            focusedNodeIds.add(edge.source);
            traceUpstream(edge.source, depth + 1);
          }
        }
      });
    };

    const traceDownstream = (nodeId, depth = 0) => {
      if (depth > 2) return;
      allEdges.forEach(edge => {
        if (edge.source === nodeId && !edge.id.startsWith('struct-') && !edge.id.startsWith('comp-')) {
          focusedEdgeIds.add(edge.id);
          if (!focusedNodeIds.has(edge.target)) {
            focusedNodeIds.add(edge.target);
            traceDownstream(edge.target, depth + 1);
          }
        }
      });
    };

    traceUpstream(targetNode.id);
    traceDownstream(targetNode.id);

    allEdges.forEach(edge => {
      if (edge.target === targetNode.id && edge.source.startsWith('backbone-')) {
        focusedEdgeIds.add(edge.id);
        focusedNodeIds.add(edge.source);
      }
    });

    const filteredNodes = allNodes.filter(n => focusedNodeIds.has(n.id));
    const filteredEdges = allEdges.filter(e => focusedEdgeIds.has(e.id));

    const others = filteredNodes.filter(n => n.id !== targetNode.id && !n.id.startsWith('backbone'));
    const backbones = filteredNodes.filter(n => n.id.startsWith('backbone'));

    const layoutNodes = filteredNodes.map(n => {
      let x = 0, y = 0;

      if (n.id === targetNode.id) {
        x = 0; y = 0;
      } else if (backbones.find(b => b.id === n.id)) {
        y = -350; x = 0;
      } else {
        const idx = others.findIndex(o => o.id === n.id);
        const total = others.length;
        const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
        const radius = total <= 4 ? 380 : 450;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }

      return {
        ...n,
        position: { x, y },
        style: { ...n.style, opacity: 1 }
      };
    });

    const layoutEdges = filteredEdges.map(e => ({
      ...e,
      animated: true,
      style: { ...e.style, opacity: 1, strokeWidth: 2 }
    }));

    return { nodes: layoutNodes, edges: layoutEdges };
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // ── Switch between Organic and Physical universes ───────────────────────────
  const switchDomain = (domain) => {
    if (domain === graphDomain) return;
    setGraphDomain(domain);
    setSelectedNode(null);
    setSelectedEdge(null);
    setNnMode(false);
    if (domain === 'organic') {
      setNodes(minimalNodes);
      setEdges(minimalEdges);
      setViewMode('focused');
    } else {
      // Physical universe: start with concept nodes in universe view
      setNodes(physicalConceptNodes);
      setEdges(physicalConceptEdges);
      setViewMode('universe');
    }
    setTimeout(() => fitView({ duration: 900, padding: 0.25 }), 80);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    const isFoundation = node.data.isElement || node.id.startsWith('backbone');
    if (!isFoundation) {
      applyViewMode(node, viewMode);
    }
  };

  const handleEdgeClick = useCallback((event, edge) => {
    const reactionLabel = edge.label || edge.data?.label;
    if (!reactionLabel) return;

    const reactionData = getReactionInfo(reactionLabel);
    const sourceNode = allNodes.find(n => n.id === edge.source);
    const targetNode = allNodes.find(n => n.id === edge.target);

    setSelectedEdge({
      edge,
      reactionData,
      sourceNode,
      targetNode,
    });
    setSelectedNode(null); // close node panel when selecting an edge
  }, []);

  const applyViewMode = (target, mode) => {
    if (mode === 'focused') {
      const { nodes: fNodes, edges: fEdges } = getFocusedGraph(target, allNodes, allEdges);
      setNodes(fNodes);
      setEdges(fEdges);
      setTimeout(() => fitView({ duration: 1000, padding: 0.5 }), 50);
    } else {
      const connectedNodeIds = allEdges
        .filter(e => e.source === target.id || e.target === target.id)
        .flatMap(e => [e.source, e.target]);

      setNodes(allNodes.map(n => {
        const isTarget = n.id === target.id;
        const isConnected = connectedNodeIds.includes(n.id);
        return {
          ...n,
          style: { ...n.style, opacity: (isTarget || isConnected) ? 1 : 0.1 }
        };
      }));

      setEdges(allEdges.map(e => {
        const isConnected = e.source === target.id || e.target === target.id;
        return {
          ...e,
          style: { ...e.style, opacity: isConnected ? 1 : 0.1 },
          animated: isConnected
        };
      }));
      fitView({ nodes: [target], duration: 1000, padding: 1.5 });
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setSelectedNode(null);
      setSelectedEdge(null);
      if (viewMode === 'universe') {
        setNodes(allNodes);
        setEdges(allEdges);
      } else {
        setNodes(graphDomain === 'organic' ? minimalNodes : physicalConceptNodes);
        setEdges(graphDomain === 'organic' ? minimalEdges : physicalConceptEdges);
      }
      fitView({ duration: 800 });
      return;
    }

    const cleanQuery = query.toLowerCase().trim().replace(/['"!?.,;:]/g, '');

    const targetNode = allNodes.find(n =>
      n.data.label.toLowerCase().trim().replace(/['"!?.,;:]/g, '') === cleanQuery
    ) || allNodes.find(n =>
      n.data.label.toLowerCase().includes(cleanQuery) ||
      (n.data.formula || '').toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQuery)
    );

    if (targetNode) {
      setSelectedNode(targetNode);
      setSelectedEdge(null);
      applyViewMode(targetNode, viewMode);
    }
  };

  const switchToUniverse = () => {
    setViewMode('universe');
    setSelectedNode(null);
    setSelectedEdge(null);
    setNodes(allNodes);
    setEdges(allEdges);
    setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
  };

  const switchToFocused = () => {
    setViewMode('focused');
    setSelectedNode(null);
    setSelectedEdge(null);
    setNodes(graphDomain === 'organic' ? minimalNodes : physicalConceptNodes);
    setEdges(graphDomain === 'organic' ? minimalEdges : physicalConceptEdges);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950 font-sans text-white">
      <AnimatePresence>
        {showLanding && <LandingOverlay onStart={() => setShowLanding(false)} key="landing" />}
        {activeMechanism && (
          <MechanismPlayer
            mechanismId={activeMechanism}
            onClose={() => setActiveMechanism(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Domain Switcher pill tab (top-centre) ──────────────────────────── */}
      {!showLanding && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-xl"
        >
          <button
            onClick={() => switchDomain('organic')}
            title="Organic Chemistry Universe"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              graphDomain === 'organic'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FlaskConical size={14} />
            Organic Chemistry
          </button>
          <button
            onClick={() => switchDomain('physical')}
            title="Physical Chemistry Universe"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              graphDomain === 'physical'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Atom size={14} />
            Physical Chemistry
          </button>
        </motion.div>
      )}

      {/* Header / Search */}
      {!showLanding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-0 left-0 w-full z-40"
        >
          <SearchBar
            onSearch={handleSearch}
            allNodes={initialNodes}
          />
        </motion.div>
      )}

      {/* Side View Toggle + NN */}
      {!showLanding && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
        >
          <button
            onClick={switchToUniverse}
            title="Universe View – See all molecules"
            className={`p-3 rounded-xl border backdrop-blur-lg transition-all hover:scale-110 active:scale-95 group ${
              viewMode === 'universe'
                ? 'bg-blue-600/80 border-blue-400/40 shadow-lg shadow-blue-500/30'
                : 'bg-gray-900/60 border-white/10 hover:bg-gray-800/80 hover:border-white/20'
            }`}
          >
            <Globe size={20} className={viewMode === 'universe' ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
          </button>
          <button
            onClick={switchToFocused}
            title="Focused View – Search & explore"
            className={`p-3 rounded-xl border backdrop-blur-lg transition-all hover:scale-110 active:scale-95 group ${
              viewMode === 'focused'
                ? 'bg-purple-600/80 border-purple-400/40 shadow-lg shadow-purple-500/30'
                : 'bg-gray-900/60 border-white/10 hover:bg-gray-800/80 hover:border-white/20'
            }`}
          >
            <Focus size={20} className={viewMode === 'focused' ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
          </button>
          <div className="w-full h-px bg-white/10 my-1" />
          <NNSidebar nnMode={nnMode} onToggle={() => setNnMode(m => !m)} />
        </motion.div>
      )}

      {/* Main Graph Area */}
      {!nnMode && (
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
          />
        </div>
      )}

      {/* Details Panel (Node) */}
      <AnimatePresence>
        {!nnMode && selectedNode && (
          <DetailsPanel
            selectedNode={selectedNode}
            allEdges={allEdges}
            allNodes={allNodes}
            onClose={() => {
              setSelectedNode(null);
              if (viewMode === 'universe') {
                setNodes(allNodes.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
                setEdges(allEdges.map(e => ({ ...e, style: { ...e.style, opacity: 1 }, animated: !!e.animated })));
              } else {
                setNodes(graphDomain === 'organic' ? minimalNodes : physicalConceptNodes);
                setEdges(graphDomain === 'organic' ? minimalEdges : physicalConceptEdges);
              }
            }}
            onPlayMechanism={graphDomain === 'organic' ? setActiveMechanism : undefined}
            onEdgeSelect={(edge) => {
              const reactionData = getReactionInfo(edge.label);
              const sourceNode = allNodes.find(n => n.id === edge.source);
              const targetNode = allNodes.find(n => n.id === edge.target);
              setSelectedEdge({ edge, reactionData, sourceNode, targetNode });
              setSelectedNode(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Reaction Panel (Edge) */}
      <AnimatePresence>
        {!nnMode && selectedEdge && (
          <ReactionPanel
            reactionData={selectedEdge.reactionData}
            sourceNode={selectedEdge.sourceNode}
            targetNode={selectedEdge.targetNode}
            onClose={() => setSelectedEdge(null)}
            onPlayMechanism={setActiveMechanism}
          />
        )}
      </AnimatePresence>

      {/* Neural Network Full-Screen View — organic universe only */}
      <AnimatePresence>
        {nnMode && graphDomain === 'organic' && (
          <NeuralNetworkView allNodes={initialNodes} allEdges={initialEdges} onClose={() => setNnMode(false)} />
        )}
      </AnimatePresence>

      {/* ── ChemAI Chatbot FAB ── */}
      {!showLanding && !chatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <ChatbotFAB
            onOpenOrganic={() => openChat('organic')}
            onOpenPhysical={() => openChat('physical')}
          />
        </motion.div>
      )}

      {/* ── ChemAI Chatbot Panel ── */}
      <ChemChatbot
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMode={chatMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Content />
    </ReactFlowProvider>
  );
}
