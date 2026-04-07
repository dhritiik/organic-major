// =============================================================================
// Physical Chemistry Universe — Entry Point
// Acts as the parallel of knowledgeGraph.js for the organic universe
// =============================================================================

import { generatePhysicalGraph } from './physicalGenerator';

// Physical chemistry universe — all 6 subdomains
const { nodes, edges } = generatePhysicalGraph();

export const physicalNodes = nodes;
export const physicalEdges = edges;

// Concept-only nodes (not equation nodes) used as the initial "focused" view
// when first entering the physical universe
export const physicalConceptNodes = nodes.filter(
    n => n.data?.details?.type === 'concept'
);

// Edges that only connect concept-to-concept (exclude edges to equation nodes)
const equationNodeIds = new Set(
    nodes.filter(n => n.data?.details?.type === 'equation').map(n => n.id)
);
export const physicalConceptEdges = edges.filter(
    e => !equationNodeIds.has(e.target) && !equationNodeIds.has(e.source)
);
