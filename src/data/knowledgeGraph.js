import { generateKnowledgeGraph } from './graphGenerator';

const { nodes, edges } = generateKnowledgeGraph(8); // Generate up to Octane

export const initialNodes = nodes;
export const initialEdges = edges;
