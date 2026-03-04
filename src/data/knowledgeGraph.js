import { generateKnowledgeGraph } from './graphGenerator';

const { nodes, edges } = generateKnowledgeGraph(10); // Generate up to Decane (C10)

export const initialNodes = nodes;
export const initialEdges = edges;
