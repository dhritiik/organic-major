import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import GraphCanvas from './components/GraphCanvas';
import SearchBar from './components/SearchBar';
import DetailsPanel from './components/DetailsPanel';
import ReactionPanel from './components/ReactionPanel';
import AnimatedBackground from './components/AnimatedBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { initialNodes, initialEdges } from './data/knowledgeGraph';
import { getReactionInfo } from './data/reactionInfo';
import { Globe, Focus } from 'lucide-react';

import LandingOverlay from './components/LandingOverlay';
import MechanismPlayer from './components/MechanismPlayer';
import NNSidebar from './components/NNSidebar';
import NeuralNetworkView from './components/NeuralNetworkView';

const minimalNodes = initialNodes.filter(n => n.data.isElement);
const minimalEdges = initialEdges.filter(e =>
  initialNodes.find(n => n.id === e.source)?.data.isElement &&
  initialNodes.find(n => n.id === e.target)?.data.isElement
);

function Content() {
  const [nodes, setNodes, onNodesChange] = useNodesState(minimalNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(minimalEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [activeMechanism, setActiveMechanism] = useState(null);
  const [viewMode, setViewMode] = useState('focused'); // 'universe' or 'focused'
  const [nnMode, setNnMode] = useState(false);
  const { fitView } = useReactFlow();

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

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null); // close edge panel when selecting a node
    const isFoundation = node.data.isElement || node.id.startsWith('backbone');
    if (!isFoundation) {
      applyViewMode(node, viewMode);
    }
  };

  const handleEdgeClick = useCallback((event, edge) => {
    const reactionLabel = edge.label || edge.data?.label;
    if (!reactionLabel) return;

    const reactionData = getReactionInfo(reactionLabel);
    const sourceNode = initialNodes.find(n => n.id === edge.source);
    const targetNode = initialNodes.find(n => n.id === edge.target);

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
      const { nodes: fNodes, edges: fEdges } = getFocusedGraph(target, initialNodes, initialEdges);
      setNodes(fNodes);
      setEdges(fEdges);
      setTimeout(() => fitView({ duration: 1000, padding: 0.5 }), 50);
    } else {
      const connectedNodeIds = initialEdges
        .filter(e => e.source === target.id || e.target === target.id)
        .flatMap(e => [e.source, e.target]);

      setNodes(initialNodes.map(n => {
        const isTarget = n.id === target.id;
        const isConnected = connectedNodeIds.includes(n.id);
        return {
          ...n,
          style: { ...n.style, opacity: (isTarget || isConnected) ? 1 : 0.1 }
        };
      }));

      setEdges(initialEdges.map(e => {
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
        setNodes(initialNodes);
        setEdges(initialEdges);
      } else {
        setNodes(minimalNodes);
        setEdges(minimalEdges);
      }
      fitView({ duration: 800 });
      return;
    }

    const cleanQuery = query.toLowerCase().trim().replace(/['"!?.,;:]/g, '');

    const targetNode = initialNodes.find(n =>
      n.data.label.toLowerCase().trim().replace(/['"!?.,;:]/g, '') === cleanQuery
    ) || initialNodes.find(n =>
      n.data.label.toLowerCase().includes(cleanQuery) ||
      n.data.formula.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQuery)
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
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
  };

  const switchToFocused = () => {
    setViewMode('focused');
    setSelectedNode(null);
    setSelectedEdge(null);
    setNodes(minimalNodes);
    setEdges(minimalEdges);
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

      {/* Side View Toggle Button */}
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

      {/* Details Panel Sidebar (Node) */}
      <AnimatePresence>
        {!nnMode && selectedNode && (
          <DetailsPanel
            selectedNode={selectedNode}
            allEdges={initialEdges}
            allNodes={initialNodes}
            onClose={() => {
              setSelectedNode(null);
              if (viewMode === 'universe') {
                setNodes(initialNodes.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
                setEdges(initialEdges.map(e => ({ ...e, style: { ...e.style, opacity: 1 }, animated: !!e.animated })));
              } else {
                setNodes(minimalNodes);
                setEdges(minimalEdges);
              }
            }}
            onPlayMechanism={setActiveMechanism}
            onEdgeSelect={(edge) => {
              const reactionData = getReactionInfo(edge.label);
              const sourceNode = initialNodes.find(n => n.id === edge.source);
              const targetNode = initialNodes.find(n => n.id === edge.target);
              setSelectedEdge({ edge, reactionData, sourceNode, targetNode });
              setSelectedNode(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Reaction Panel Sidebar (Edge) */}
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

      {/* Neural Network Full-Screen View */}
      <AnimatePresence>
        {nnMode && (
          <NeuralNetworkView allNodes={initialNodes} allEdges={initialEdges} onClose={() => setNnMode(false)} />
        )}
      </AnimatePresence>
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
