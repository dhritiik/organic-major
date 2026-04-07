import { generateKnowledgeGraph } from './graphGenerator';

// Organic chemistry universe — C1 to C10
const { nodes, edges } = generateKnowledgeGraph(10);

export const initialNodes = nodes;
export const initialEdges = edges;

