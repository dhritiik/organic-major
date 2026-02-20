import React, { useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MoleculeNode from './MoleculeNode';

const GraphContent = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick }) => {
    const nodeTypes = useMemo(() => ({ molecule: MoleculeNode }), []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-900"
        >
            <Controls className="bg-white/10 border-white/20 text-white fill-white" />
            <MiniMap
                nodeStrokeColor={(n) => {
                    if (n.style?.stroke) return n.style.stroke;
                    if (n.type === 'input') return '#0041d0';
                    if (n.type === 'output') return '#ff0072';
                    if (n.type === 'default') return '#1a192b';
                    return '#eee';
                }}
                nodeColor={(n) => {
                    if (n.style?.background) return n.style.background;
                    return '#fff';
                }}
                nodeBorderRadius={8}
                maskColor="rgba(0, 0, 0, 0.6)"
                className="bg-gray-800 border-white/10"
            />
            <Background variant="dots" gap={20} size={1} color="#555" />
        </ReactFlow>
    );
};

export default function GraphCanvas(props) {
    return (
        <ReactFlowProvider>
            <div className="w-full h-full">
                <GraphContent {...props} />
            </div>
        </ReactFlowProvider>
    );
}
