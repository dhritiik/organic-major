// =============================================================================
// Unified Graph Generator
// Merges organic chemistry + physical chemistry into a single graph
// Adds cross-domain edges linking organic molecules to physical concepts
// =============================================================================

import { generateKnowledgeGraph } from './graphGenerator';
import { generatePhysicalGraph } from './physicalGenerator';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — cross-domain edge builder
// ─────────────────────────────────────────────────────────────────────────────
function crossEdge(eid, src, tgt, label, context = '') {
    return {
        id: eid,
        source: src,
        target: tgt,
        label,
        type: 'smoothstep',
        style:      { stroke: '#84CC16', strokeWidth: 1.5, strokeDasharray: '6,3' },
        labelStyle: { fill: '#d1fab3', fontWeight: 600, fontSize: 10 },
        labelBgStyle:  { fill: '#0f172a', fillOpacity: 0.85 },
        labelBgPadding: [4, 3],
        animated: false,
        data: {
            type: 'cross-domain',
            context,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — rough combustion enthalpy estimation for CnH(2n+2) alkanes
// Based on: ΔHc ≈ −659n − 43  kJ/mol  (empirical approximation)
// ─────────────────────────────────────────────────────────────────────────────
function estimateCombustionEnthalpy(node) {
    const n = parseInt(node.id?.split('-')[1]) || 1;
    const series = node.data?.details?.series;
    if (series === 'Alkane')  return `ΔHc° ≈ ${(-(659 * n + 43)).toFixed(0)} kJ/mol`;
    if (series === 'Alcohol') return `ΔHc° ≈ ${(-(726 * n - 276)).toFixed(0)} kJ/mol`;
    return `ΔHc° for ${node.data?.label || node.id}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate cross-domain links: organic molecules ↔ physical concepts
// ─────────────────────────────────────────────────────────────────────────────
function generateCrossLinks(organicNodes) {
    const crossEdges = [];
    let counter = 0;

    organicNodes.forEach(node => {
        const series = node.data?.details?.series;

        // ── Combustion Enthalpy: Alkanes and Alcohols → Hess's Law / Enthalpy ──
        if (series === 'Alkane' || series === 'Alcohol') {
            const context = estimateCombustionEnthalpy(node);
            crossEdges.push(crossEdge(
                `cross-hess-${counter++}`,
                node.id,
                'thermo-hess',
                'ΔHc°',
                context
            ));
        }

        // ── Alkanes → Activation Energy (free-radical substitution via UV) ──
        if (series === 'Alkane') {
            crossEdges.push(crossEdge(
                `cross-ea-alkane-${counter++}`,
                node.id,
                'kinetics-ea',
                'UV initiates',
                `Free-radical substitution of ${node.data?.label || node.id} has high Ea, overcome by UV photon energy`
            ));
        }

        // ── Alkenes → Activation Energy (heterogeneous catalysis) ──
        if (series === 'Alkene') {
            crossEdges.push(crossEdge(
                `cross-ea-alkene-${counter++}`,
                node.id,
                'kinetics-catalysis',
                'Ni catalyst',
                `Ni catalyst lowers Ea for hydrogenation of ${node.data?.label || node.id}`
            ));
        }

        // ── Alcohols → Entropy (dehydration increases entropy; gas produced) ──
        if (series === 'Alcohol') {
            crossEdges.push(crossEdge(
                `cross-entropy-${counter++}`,
                node.id,
                'thermo-entropy',
                'ΔS > 0 (dehydration)',
                `Dehydration of ${node.data?.label || node.id} produces a gas → ΔS increases`
            ));
        }

        // ── Carboxylic Acids → Equilibrium (esterification is reversible) ──
        if (series === 'Carboxylic Acid') {
            crossEdges.push(crossEdge(
                `cross-equil-acid-${counter++}`,
                node.id,
                'equil-kc',
                'Kc ≈ 4',
                `Esterification of ${node.data?.label || node.id} is reversible; Kc ≈ 4 at room temperature`
            ));
            // Also to Le Chatelier: remove water to drive equilibrium right
            crossEdges.push(crossEdge(
                `cross-lechat-${counter++}`,
                node.id,
                'equil-lechatelier',
                'Remove H₂O →',
                `Removing water (or using excess alcohol) drives esterification equilibrium toward products`
            ));
        }

        // ── Amine → Entropy & Gibbs (amidation involves both ΔH and ΔS) ──
        if (series === 'Amine') {
            crossEdges.push(crossEdge(
                `cross-gibbs-amine-${counter++}`,
                node.id,
                'thermo-gibbs',
                'ΔG governs amidation',
                `Formation of amide from ${node.data?.label || node.id} + acid: ΔG = ΔH − TΔS`
            ));
        }

        // ── Haloalkane → Rate Law + Kinetics (SN1 vs SN2 rates) ──
        if (series === 'Haloalkane') {
            crossEdges.push(crossEdge(
                `cross-rate-halo-${counter++}`,
                node.id,
                'kinetics-ratelaw',
                'SN1/SN2 rate',
                `Nucleophilic substitution of ${node.data?.label || node.id}: SN2 = rate = k[RX][Nu]`
            ));
        }

        // ── Aromatic compounds → Activation Energy (EAS mechanism) ──
        if (series === 'Aromatic') {
            crossEdges.push(crossEdge(
                `cross-ea-arom-${counter++}`,
                node.id,
                'kinetics-ea',
                'EAS Ea',
                `Electrophilic aromatic substitution on ${node.data?.label || node.id} requires forming high-energy arenium ion intermediate`
            ));
        }
    });

    // ── Specific named organic reaction links ──

    // Esterification ↔ Equilibrium Kc
    crossEdges.push(crossEdge(
        `cross-ester-kc`,
        'acid-2', 'equil-kc',
        'reversible Kc',
        'Ethanoic acid + ethanol ⇌ ethyl ethanoate + water; Kc ≈ 4'
    ));

    // Hydrogenation ↔ Enthalpy of hydrogenation (ΔH < 0)
    crossEdges.push(crossEdge(
        `cross-hyd-enthalpy`,
        'alkene-2', 'thermo-enthalpy',
        'ΔHhyd < 0',
        'Hydrogenation of ethene: ΔH = −137 kJ/mol (exothermic)'
    ));

    // Combustion ↔ Internal Energy
    crossEdges.push(crossEdge(
        `cross-comb-internal`,
        'alkane-1', 'thermo-internal',
        'ΔU (combustion)',
        'CH₄ combustion: ΔU measured by bomb calorimeter (constant volume)'
    ));

    // Electrolysis ↔ Haloalkane formation
    crossEdges.push(crossEdge(
        `cross-electro-halo`,
        'electro-electrolysis', 'halobr-1',
        'produces',
        'Electrolysis of brine produces Cl₂, which reacts with alkanes to form haloalkanes'
    ));

    // Arrhenius ↔ Catalyst in hydrogenation
    crossEdges.push(crossEdge(
        `cross-arrhenius-cat`,
        'kinetics-arrhenius', 'kinetics-catalysis',
        'Ea term → lowered',
        'Catalyst reduces Ea in Arrhenius equation → exponential increase in k'
    ));

    // Gibbs ↔ electrode potential 
    crossEdges.push(crossEdge(
        `cross-gibbs-ecell`,
        'thermo-gibbs', 'electro-galvanic',
        'ΔG = −nFE°',
        'Spontaneous cell reactions have ΔG < 0 and E°cell > 0'
    ));

    return crossEdges;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — unified graph (organic + physical + cross-links)
// ─────────────────────────────────────────────────────────────────────────────
export function generateUnifiedGraph(carbonLimit = 10) {
    // Generate both subgraphs
    const organicGraph  = generateKnowledgeGraph(carbonLimit);
    const physicalGraph = generatePhysicalGraph();

    // Merge nodes (IDs are guaranteed unique: one uses 'alkane-1' style,
    // the other uses 'thermo-gibbs' style)
    const nodes = [
        ...organicGraph.nodes,
        ...physicalGraph.nodes,
    ];

    // Merge edges
    const edges = [
        ...organicGraph.edges,
        ...physicalGraph.edges,
        ...generateCrossLinks(organicGraph.nodes),
    ];

    return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────────────────────
// Named alias so physicalGenerator can import organic under a cleaner name
// ─────────────────────────────────────────────────────────────────────────────
export { generateKnowledgeGraph as generateOrganicGraph };
