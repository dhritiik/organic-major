import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import GraphCanvas from './components/GraphCanvas';
import SearchBar from './components/SearchBar';
import DetailsPanel from './components/DetailsPanel';
import AnimatedBackground from './components/AnimatedBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { initialNodes, initialEdges } from './data/knowledgeGraph';

import LandingOverlay from './components/LandingOverlay';
import MechanismPlayer from './components/MechanismPlayer';

function Content() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [activeMechanism, setActiveMechanism] = useState(null);
  const { fitView, setCenter, getNodes } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);

    // Highlight selected node and dim others
    setNodes((nds) => nds.map((n) => {
      const isSelected = n.id === node.id;
      return {
        ...n,
        style: {
          ...n.style,
          opacity: isSelected ? 1 : 0.5,
        }
      };
    }));
  };

  const handleSearch = (query) => {
    if (!query) {
      // Reset
      setNodes(initialNodes);
      setEdges(initialEdges);
      fitView({ duration: 800 });
      return;
    }

    const targetNode = nodes.find(n =>
      n.data.label.toLowerCase().includes(query.toLowerCase()) ||
      n.data.formula.toLowerCase().includes(query.toLowerCase())
    );

    if (targetNode) {
      setSelectedNode(targetNode);

      // Find connected nodes
      const connectedEdgeIds = edges
        .filter(e => e.source === targetNode.id || e.target === targetNode.id)
        .map(e => e.id);

      const connectedNodeIds = edges
        .filter(e => e.source === targetNode.id || e.target === targetNode.id)
        .flatMap(e => [e.source, e.target]);

      // Update styles
      setNodes(nds => nds.map(n => {
        const isTarget = n.id === targetNode.id;
        const isConnected = connectedNodeIds.includes(n.id);
        const shouldHighlight = isTarget || isConnected;

        return {
          ...n,
          style: {
            ...n.style,
            opacity: shouldHighlight ? 1 : 0.1,
            // You can add more styling here like border color
            strokeWidth: isTarget ? 3 : 1,
            fill: isTarget ? '#1e293b' : n.style?.fill
          },
          data: {
            ...n.data,
            // Force update label or other props if needed
          }
        };
      }));

      setEdges(eds => eds.map(e => {
        const isConnected = connectedEdgeIds.includes(e.id);
        return {
          ...e,
          animated: isConnected,
          style: {
            ...e.style,
            strokeWidth: isConnected ? 3 : 1,
            stroke: isConnected ? '#60a5fa' : '#334155',
            opacity: isConnected ? 1 : 0.2, // Lower opacity for non-connected
          },
          labelStyle: {
            fill: isConnected ? '#fff' : '#555',
            fontWeight: isConnected ? 700 : 400,
          }
        };
      }));

      // Zoom to node
      fitView({ nodes: [targetNode], duration: 1000, padding: 2 });
    }
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
          <SearchBar onSearch={handleSearch} />
        </motion.div>
      )}

      {/* Main Graph Area */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* Details Panel Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <DetailsPanel
            selectedNode={selectedNode}
            onClose={() => {
              setSelectedNode(null);
              setNodes(initialNodes); // Reset styles on close
              setEdges(initialEdges);
            }}
            onPlayMechanism={setActiveMechanism}
          />
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
