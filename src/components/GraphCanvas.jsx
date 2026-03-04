import React, { useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MoleculeNode from './MoleculeNode';

const defaultEdgeOptions = {
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: '#64748b' },
    labelStyle: { fill: '#cbd5e1', fontWeight: 600, fontSize: 10 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
};

const GraphContent = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, onEdgeClick }) => {
    const nodeTypes = useMemo(() => ({ molecule: MoleculeNode }), []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            minZoom={0.05}
            maxZoom={2}
            attributionPosition="bottom-left"
            className="bg-gray-950"
        >
            <Controls position="bottom-left" />
            <MiniMap
                position="bottom-right"
                nodeStrokeColor={(n) => {
                    const sc = n.data?.seriesColor;
                    if (sc?.border) return sc.border;
                    if (n.style?.stroke) return n.style.stroke;
                    return '#555';
                }}
                nodeColor={(n) => {
                    const sc = n.data?.seriesColor;
                    if (sc?.bg) return sc.bg;
                    if (n.style?.backgroundColor) return n.style.backgroundColor;
                    return '#1e293b';
                }}
                nodeBorderRadius={8}
                maskColor="rgba(0, 0, 0, 0.7)"
                style={{ width: 200, height: 140 }}
            />
            <Background variant="dots" gap={25} size={1} color="#333" />
        </ReactFlow>
    );
};

export default function GraphCanvas(props) {
    return (
        <div className="w-full h-full">
            <GraphContent {...props} />
        </div>
    );
}
