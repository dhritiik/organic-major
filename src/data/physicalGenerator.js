// =============================================================================
// Physical Chemistry Graph Generator
// Produces ReactFlow nodes + edges for all physical chemistry subdomains
// Layout: far right of the organic graph (x starts at 7000)
//         each subdomain occupies its own horizontal band
// =============================================================================

import {
    thermodynamicsConcepts,
    kineticsConcepts,
    equilibriumConcepts,
    electrochemistryConcepts,
    solidStateConcepts,
    solutionsConcepts,
    atomicStructureConcepts,
    PHYSICAL_COLORS,
} from './physicalInfo';

import { equations } from './equations';

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────────────────────────────

// Physical domain starts well to the right of the organic graph
// (organic rightmost column ESTER ≈ x = 4860, so we start at 7000)
const PHYS_ORIGIN_X = 7200;
const PHYS_ORIGIN_Y = -1200; // Start above the organic y=0 baseline

// Each subdomain is a horizontal "lane"
const LANE_GAP_Y = 700;        // Vertical space between subdomain lanes
const NODE_GAP_X = 420;        // Horizontal space between nodes in a lane
const EQUATION_OFFSET_Y = 260; // Equations rendered below their parent concept node

// Subdomain lane Y offsets
const LANE_Y = {
    thermodynamics:   PHYS_ORIGIN_Y + 0 * LANE_GAP_Y,
    kinetics:         PHYS_ORIGIN_Y + 1 * LANE_GAP_Y,
    equilibrium:      PHYS_ORIGIN_Y + 2 * LANE_GAP_Y,
    electrochemistry: PHYS_ORIGIN_Y + 3 * LANE_GAP_Y,
    solidState:       PHYS_ORIGIN_Y + 4 * LANE_GAP_Y,
    solutions:        PHYS_ORIGIN_Y + 5 * LANE_GAP_Y,
    atomicStructure:  PHYS_ORIGIN_Y + 6 * LANE_GAP_Y,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — build a physical concept node (ReactFlow-compatible)
// ─────────────────────────────────────────────────────────────────────────────
function buildConceptNode(concept, posX, posY) {
    const sc = PHYSICAL_COLORS[concept.subdomain] || PHYSICAL_COLORS.thermodynamics;
    return {
        id: concept.id,
        type: 'molecule',   // reuse existing MoleculeNode — no new component needed
        position: { x: posX, y: posY },
        data: {
            label:        concept.label,
            formula:      concept.symbol || '',   // shown in the monospace badge
            description:  concept.description,
            keyFacts:     concept.keyFacts    || [],
            applications: concept.applications || [],
            domain:       'physical',
            subdomain:    concept.subdomain,
            seriesColor:  sc,
            relatedIds:   concept.relatedIds  || [],
            details: {
                series:  concept.subdomain,   // drives MoleculeNode icon & label
                units:   concept.units   || '',
                type:    'concept',
            },
        },
        style: {
            backgroundColor: sc.bg,
            borderColor:     sc.border,
            width:           220,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — build an equation node
// ─────────────────────────────────────────────────────────────────────────────
function buildEquationNode(eq, posX, posY) {
    const sc = PHYSICAL_COLORS[eq.subdomain] || PHYSICAL_COLORS.thermodynamics;
    // Truncate long equations for the formula badge
    const formulaBadge = eq.equation.length > 28 ? eq.equation.slice(0, 26) + '…' : eq.equation;
    return {
        id: eq.id,
        type: 'molecule',    // reuse MoleculeNode
        position: { x: posX, y: posY },
        data: {
            label:      eq.label,
            formula:    formulaBadge,
            description: eq.equation,   // full equation in description
            domain:     'physical',
            subdomain:  eq.subdomain,
            seriesColor: { bg: `${sc.bg}99`, border: `${sc.border}99` }, // slightly muted
            linksTo:    eq.linksTo    || [],
            derivedFrom: eq.derivedFrom || [],
            details: {
                series: eq.subdomain,
                type:   'equation',
                variables: eq.variables || {},
            },
        },
        style: {
            backgroundColor: `${sc.bg}99`,
            borderColor:     `${sc.border}88`,
            borderStyle:     'dashed',
            width:           200,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — styled edge between two physical nodes
// ─────────────────────────────────────────────────────────────────────────────
function physEdge(eid, src, tgt, label = '', color = '#64748b', type = 'smoothstep') {
    return {
        id: eid,
        source: src,
        target: tgt,
        label,
        type,
        style:      { stroke: color, strokeWidth: 1.5 },
        labelStyle: { fill: '#e2e8f0', fontWeight: 600, fontSize: 10 },
        labelBgStyle:  { fill: '#0f172a', fillOpacity: 0.85 },
        labelBgPadding: [4, 3],
        animated: false,
        data: { domain: 'physical' },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Thermodynamics Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateThermodynamics() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.thermodynamics;
    const laneY = LANE_Y.thermodynamics;

    // Position concept nodes in a row
    const concepts = Object.values(thermodynamicsConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Attach related equations below their concept
    const thermoEqMap = {
        'thermo-gibbs':    ['eq-gibbs', 'eq-gibbs-equilibrium'],
        'thermo-hess':     ['eq-hess'],
        'thermo-enthalpy': ['eq-kirchhoff'],
    };

    let eqCounter = 0;
    Object.entries(thermoEqMap).forEach(([conceptId, eqIds]) => {
        const conceptNode = nodes.find(n => n.id === conceptId);
        if (!conceptNode) return;
        eqIds.forEach((eqId, j) => {
            const eq = equations[eqId];
            if (!eq) return;
            const eqX = conceptNode.position.x + j * 240 - (eqIds.length - 1) * 120;
            const eqY = laneY + EQUATION_OFFSET_Y;
            nodes.push(buildEquationNode(eq, eqX, eqY));
            edges.push(physEdge(
                `thermo-eq-${eqCounter++}`,
                conceptId, eqId,
                'formula',
                sc.border
            ));
        });
    });

    // Intra-domain concept edges
    const conceptEdgeDefs = [
        ['thermo-enthalpy', 'thermo-gibbs',    'contributes to', sc.border],
        ['thermo-entropy',  'thermo-gibbs',    'contributes to', sc.border],
        ['thermo-gibbs',    'thermo-internal', 'relates via ΔU',  '#9333ea'],
        ['thermo-enthalpy', 'thermo-hess',     'used in',         sc.border],
        ['thermo-enthalpy', 'thermo-heatcap',  'measured via',    '#a78bfa'],
    ];
    conceptEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`thermo-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Kinetics Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateKinetics() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.kinetics;
    const laneY = LANE_Y.kinetics;

    const concepts = Object.values(kineticsConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Equation nodes
    const kineticsEqMap = {
        'kinetics-arrhenius': ['eq-arrhenius', 'eq-arrhenius-twopoint'],
        'kinetics-order':     ['eq-firstorder'],
        'kinetics-halftime':  ['eq-halflife'],
    };
    let eqCounter = 0;
    Object.entries(kineticsEqMap).forEach(([conceptId, eqIds]) => {
        const conceptNode = nodes.find(n => n.id === conceptId);
        if (!conceptNode) return;
        eqIds.forEach((eqId, j) => {
            const eq = equations[eqId];
            if (!eq) return;
            const eqX = conceptNode.position.x + j * 240 - (eqIds.length - 1) * 120;
            const eqY = laneY + EQUATION_OFFSET_Y;
            nodes.push(buildEquationNode(eq, eqX, eqY));
            edges.push(physEdge(`kinetics-eq-${eqCounter++}`, conceptId, eqId, 'formula', sc.border));
        });
    });

    // Intra-domain concept edges
    const kinEdgeDefs = [
        ['kinetics-ratelaw',   'kinetics-order',     'determines',     sc.border],
        ['kinetics-order',     'kinetics-halftime',  'governs',         sc.border],
        ['kinetics-ea',        'kinetics-arrhenius', 'quantified by',   sc.border],
        ['kinetics-arrhenius', 'kinetics-ratelaw',   'gives k →',       '#fbbf24'],
        ['kinetics-ea',        'kinetics-catalysis', 'lowered by',      '#f59e0b'],
        ['kinetics-catalysis', 'kinetics-ratelaw',   'increases rate → ', '#fde68a'],
    ];
    kinEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`kinetics-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Equilibrium Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateEquilibrium() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.equilibrium;
    const laneY = LANE_Y.equilibrium;

    const concepts = Object.values(equilibriumConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Equations
    const equilEqMap = {
        'equil-kc': ['eq-kc', 'eq-vanthoff-equilibrium'],
        'equil-kp': ['eq-kp-kc'],
    };
    let eqCounter = 0;
    Object.entries(equilEqMap).forEach(([conceptId, eqIds]) => {
        const conceptNode = nodes.find(n => n.id === conceptId);
        if (!conceptNode) return;
        eqIds.forEach((eqId, j) => {
            const eq = equations[eqId];
            if (!eq) return;
            const eqX = conceptNode.position.x + j * 240 - (eqIds.length - 1) * 120;
            const eqY = laneY + EQUATION_OFFSET_Y;
            nodes.push(buildEquationNode(eq, eqX, eqY));
            edges.push(physEdge(`equil-eq-${eqCounter++}`, conceptId, eqId, 'formula', sc.border));
        });
    });

    // Intra-domain edges
    const equilEdgeDefs = [
        ['equil-kc',         'equil-kp',          'converts to',     sc.border],
        ['equil-qc',         'equil-kc',          'compared against', sc.border],
        ['equil-qc',         'equil-lechatelier', 'drives shift',    '#34d399'],
        ['equil-lechatelier', 'equil-kc',          'governed by',     sc.border],
        ['equil-ice',        'equil-kc',          'solves for',      '#6ee7b7'],
    ];
    equilEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`equil-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Electrochemistry Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateElectrochemistry() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.electrochemistry;
    const laneY = LANE_Y.electrochemistry;

    const concepts = Object.values(electrochemistryConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Equations
    const electroEqMap = {
        'electro-nernst':      ['eq-nernst'],
        'electro-galvanic':    ['eq-gibbs-ecell'],
        'electro-electrolysis': ['eq-faraday'],
    };
    let eqCounter = 0;
    Object.entries(electroEqMap).forEach(([conceptId, eqIds]) => {
        const conceptNode = nodes.find(n => n.id === conceptId);
        if (!conceptNode) return;
        eqIds.forEach((eqId, j) => {
            const eq = equations[eqId];
            if (!eq) return;
            const eqX = conceptNode.position.x + j * 240;
            const eqY = laneY + EQUATION_OFFSET_Y;
            nodes.push(buildEquationNode(eq, eqX, eqY));
            edges.push(physEdge(`electro-eq-${eqCounter++}`, conceptId, eqId, 'formula', sc.border));
        });
    });

    // Intra-domain edges
    const electroEdgeDefs = [
        ['electro-sep',        'electro-galvanic',    'drives',        sc.border],
        ['electro-sep',        'electro-nernst',      'modified by conditions', sc.border],
        ['electro-nernst',     'electro-galvanic',    'non-standard E', '#60a5fa'],
        ['electro-galvanic',   'electro-electrolysis','reversed in',   '#2563eb'],
        ['electro-sep',        'electro-electrolysis','selective discharge', '#93c5fd'],
    ];
    electroEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`electro-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Solid State Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateSolidState() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.solidState;
    const laneY = LANE_Y.solidState;

    const concepts = Object.values(solidStateConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // No dedicated equation nodes for solid state for now
    // Intra-domain edges
    const solidEdgeDefs = [
        ['solid-crystal',  'solid-unitcell',  'defines',     sc.border],
        ['solid-unitcell', 'solid-packing',   'determines',  sc.border],
        ['solid-unitcell', 'solid-defects',   'disturbed by', '#818cf8'],
        ['solid-crystal',  'solid-defects',   'contains',    '#6366f1'],
    ];
    solidEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`solid-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Solutions Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateSolutions() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.solutions;
    const laneY = LANE_Y.solutions;

    const concepts = Object.values(solutionsConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Equations
    const solnEqMap = {
        'soln-raoult':   ['eq-raoult'],
        'soln-ebfp':     ['eq-ebpt', 'eq-fpd'],
        'soln-osmotic':  ['eq-osmotic'],
    };
    let eqCounter = 0;
    Object.entries(solnEqMap).forEach(([conceptId, eqIds]) => {
        const conceptNode = nodes.find(n => n.id === conceptId);
        if (!conceptNode) return;
        eqIds.forEach((eqId, j) => {
            const eq = equations[eqId];
            if (!eq) return;
            const eqX = conceptNode.position.x + j * 240 - (eqIds.length - 1) * 120;
            const eqY = laneY + EQUATION_OFFSET_Y;
            nodes.push(buildEquationNode(eq, eqX, eqY));
            edges.push(physEdge(`soln-eq-${eqCounter++}`, conceptId, eqId, 'formula', sc.border));
        });
    });

    // Intra-domain edges
    const solnEdgeDefs = [
        ['soln-colligative', 'soln-raoult',     'vapour pressure lowering →', sc.border],
        ['soln-colligative', 'soln-ebfp',        'boiling/freezing shift →', sc.border],
        ['soln-colligative', 'soln-osmotic',     'osmosis →',                sc.border],
        ['soln-vanthoff',    'soln-ebfp',         'corrects for i',          sc.border],
        ['soln-vanthoff',    'soln-osmotic',      'corrects for i',          '#f472b6'],
        ['soln-vanthoff',    'soln-colligative',  'scales all properties',   '#f472b6'],
    ];
    solnEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`soln-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-domain edges WITHIN physical chemistry
// (thermodynamics ↔ kinetics ↔ equilibrium ↔ electrochemistry)
// ─────────────────────────────────────────────────────────────────────────────
export function generatePhysicalCrossLinks() {
    const crossEdges = [];
    const col = PHYSICAL_COLORS.crossLink.border;

    const defs = [
        // Thermodynamics ↔ Equilibrium
        ['thermo-gibbs',       'equil-kc',         'ΔG° = −RT ln K',     col],
        ['thermo-enthalpy',    'equil-lechatelier', 'sign of ΔH determines shift dir.', col],

        // Thermodynamics ↔ Electrochemistry
        ['thermo-gibbs',       'electro-galvanic',  'ΔG = −nFE°',         col],
        ['thermo-gibbs',       'electro-nernst',    'ΔG relates to E',    col],

        // Kinetics ↔ Equilibrium
        ['kinetics-catalysis', 'equil-kc',          'no change to K',     col],
        ['kinetics-ea',        'equil-lechatelier', 'temp shifts K',      col],

        // Kinetics ↔ Thermodynamics
        ['kinetics-ea',        'thermo-gibbs',      'ΔG‡ (transition state)', col],
        ['kinetics-arrhenius', 'thermo-enthalpy',   'Ea relates to ΔH',   col],

        // Electrochemistry ↔ Equilibrium
        ['electro-nernst',     'equil-kc',          'E = 0 → K',          col],
        ['electro-sep',        'equil-kc',          'ΔG° drives K',       col],
    ];

    defs.forEach(([src, tgt, lbl, c], i) => {
        crossEdges.push(physEdge(
            `phys-cross-${i}`,
            src, tgt, lbl, c, 'smoothstep'
        ));
    });

    return crossEdges;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Atomic Structure Subgraph
// ─────────────────────────────────────────────────────────────────────────────
function generateAtomicStructure() {
    const nodes = [];
    const edges = [];
    const sc = PHYSICAL_COLORS.atomicStructure;
    const laneY = LANE_Y.atomicStructure;

    const concepts = Object.values(atomicStructureConcepts);
    concepts.forEach((c, i) => {
        const x = PHYS_ORIGIN_X + i * NODE_GAP_X;
        nodes.push(buildConceptNode(c, x, laneY));
    });

    // Intra-domain edges
    const atomEdgeDefs = [
        ['atom-photoelectric', 'atom-bohr',      'quantised energy',    sc.border],
        ['atom-bohr',         'atom-quantum',    'quantum numbers from', sc.border],
        ['atom-quantum',      'atom-config',     'fills orbitals via',  sc.border],
        ['atom-debroglie',    'atom-quantum',    'wave mechanics →',     sc.border],
        ['atom-photoelectric', 'atom-debroglie', 'photon = particle/wave', '#a3e635'],
    ];
    atomEdgeDefs.forEach(([src, tgt, lbl, col], i) => {
        edges.push(physEdge(`atom-concept-${i}`, src, tgt, lbl, col));
    });

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — generate entire physical chemistry graph
// ─────────────────────────────────────────────────────────────────────────────
export function generatePhysicalGraph() {
    const thermo   = generateThermodynamics();
    const kinetics = generateKinetics();
    const equil    = generateEquilibrium();
    const electro  = generateElectrochemistry();
    const solid    = generateSolidState();
    const soln     = generateSolutions();
    const atom     = generateAtomicStructure();

    const nodes = [
        ...thermo.nodes,
        ...kinetics.nodes,
        ...equil.nodes,
        ...electro.nodes,
        ...solid.nodes,
        ...soln.nodes,
        ...atom.nodes,
    ];

    const edges = [
        ...thermo.edges,
        ...kinetics.edges,
        ...equil.edges,
        ...electro.edges,
        ...solid.edges,
        ...soln.edges,
        ...atom.edges,
        ...generatePhysicalCrossLinks(),
    ];

    return { nodes, edges };
}
