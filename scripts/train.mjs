// =============================================================================
// Training Script — Run via: node scripts/train.mjs
// Trains the neural network and saves weights to public/nn-weights/
// =============================================================================

import * as tf from '@tensorflow/tfjs-node';

// We need to manually define the graph generator functions here since
// the source files use ES module import/export with React-specific patterns.
// We'll inline the essential logic.

// ── IUPAC Prefixes ──
const prefixes = ['Meth', 'Eth', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct', 'Non', 'Dec'];
const sub = (n) => n.toString().replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const mkId = (prefix, carbonCount) => `${prefix}-${carbonCount}`;

// ── Series Colors (simplified for data only) ──
const SERIES_COLORS = {
    'Alkane': { bg: '#1e3a5f', border: '#3b82f6' },
    'Alkene': { bg: '#1a3d2e', border: '#22c55e' },
    'Alkyne': { bg: '#3b1f4b', border: '#a855f7' },
    'Alcohol': { bg: '#4a1d1d', border: '#ef4444' },
    'Aldehyde': { bg: '#4a3010', border: '#f59e0b' },
    'Ketone': { bg: '#4a3e10', border: '#eab308' },
    'Carboxylic Acid': { bg: '#5c1a1a', border: '#ef4444' },
    'Ester': { bg: '#4a1040', border: '#ec4899' },
    'Ether': { bg: '#2d2040', border: '#8b5cf6' },
    'Amine': { bg: '#102040', border: '#3b82f6' },
    'Amide': { bg: '#1a2840', border: '#6366f1' },
    'Nitrile': { bg: '#102030', border: '#06b6d4' },
    'Haloalkane': { bg: '#103020', border: '#10b981' },
    'Aromatic': { bg: '#302020', border: '#f97316' },
    'Carbon Skeleton': { bg: 'transparent', border: '#555' },
};

// ── Node generators (data-only, no position needed for training) ──
function generateAlkanes(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('alkane', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'ane', formula: `C${sub(c)}H${sub(2*c+2)}`,
                description: `Saturated hydrocarbon with ${c} carbon(s).`,
                details: { series: 'Alkane', hybridization: 'sp³', carbonCount: c },
                seriesColor: SERIES_COLORS['Alkane'],
            }
        };
    });
}

function generateAlkenes(n) {
    return Array.from({ length: n - 1 }, (_, i) => {
        const c = i + 2;
        return {
            id: mkId('alkene', c), type: 'molecule',
            data: {
                label: prefixes[i+1] + 'ene', formula: `C${sub(c)}H${sub(2*c)}`,
                description: `Unsaturated hydrocarbon with C=C.`,
                details: { series: 'Alkene', hybridization: 'sp²', carbonCount: c },
                seriesColor: SERIES_COLORS['Alkene'],
            }
        };
    });
}

function generateAlkynes(n) {
    return Array.from({ length: n - 1 }, (_, i) => {
        const c = i + 2;
        return {
            id: mkId('alkyne', c), type: 'molecule',
            data: {
                label: prefixes[i+1] + 'yne', formula: `C${sub(c)}H${sub(2*c-2)}`,
                description: `Unsaturated with C≡C.`,
                details: { series: 'Alkyne', hybridization: 'sp', carbonCount: c },
                seriesColor: SERIES_COLORS['Alkyne'],
            }
        };
    });
}

function generateAlcohols(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('alcohol', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anol', formula: `C${sub(c)}H${sub(2*c+1)}OH`,
                description: 'Alcohol with -OH group.',
                details: { series: 'Alcohol', functionalGroup: '-OH', carbonCount: c },
                seriesColor: SERIES_COLORS['Alcohol'],
            }
        };
    });
}

function generateAldehydes(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('aldehyde', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anal', formula: `C${sub(c)}H${sub(2*c)}O`,
                description: 'Aldehyde with -CHO group.',
                details: { series: 'Aldehyde', functionalGroup: '-CHO', carbonCount: c },
                seriesColor: SERIES_COLORS['Aldehyde'],
            }
        };
    });
}

function generateKetones(n) {
    return Array.from({ length: n - 2 }, (_, i) => {
        const c = i + 3;
        return {
            id: mkId('ketone', c), type: 'molecule',
            data: {
                label: prefixes[i+2] + 'anone', formula: `C${sub(c)}H${sub(2*c)}O`,
                description: 'Ketone with C=O group.',
                details: { series: 'Ketone', functionalGroup: 'C=O', carbonCount: c },
                seriesColor: SERIES_COLORS['Ketone'],
            }
        };
    });
}

function generateAcids(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('acid', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anoic Acid', formula: `C${sub(c-1)}H${sub(2*c-1)}COOH`,
                description: 'Carboxylic acid with -COOH.',
                details: { series: 'Carboxylic Acid', functionalGroup: '-COOH', carbonCount: c },
                seriesColor: SERIES_COLORS['Carboxylic Acid'],
            }
        };
    });
}

function generateEsters(n) {
    return Array.from({ length: n - 1 }, (_, i) => {
        const c = i + 2;
        return {
            id: mkId('ester', c), type: 'molecule',
            data: {
                label: 'Methyl ' + prefixes[i+1] + 'anoate',
                description: 'Ester.',
                details: { series: 'Ester', functionalGroup: '-COO-', carbonCount: c },
                seriesColor: SERIES_COLORS['Ester'],
            }
        };
    });
}

function generateEthers(n) {
    return Array.from({ length: n - 1 }, (_, i) => {
        const c = i + 2;
        return {
            id: mkId('ether', c), type: 'molecule',
            data: {
                label: c === 4 ? 'Ethoxyethane' : ('Methoxy' + prefixes[i] + 'ane'),
                description: 'Ether.',
                details: { series: 'Ether', functionalGroup: '-O-', carbonCount: c },
                seriesColor: SERIES_COLORS['Ether'],
            }
        };
    });
}

function generateAmines(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('amine', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anamine',
                description: 'Primary amine.',
                details: { series: 'Amine', functionalGroup: '-NH₂', carbonCount: c },
                seriesColor: SERIES_COLORS['Amine'],
            }
        };
    });
}

function generateAmides(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('amide', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anamide',
                description: 'Amide.',
                details: { series: 'Amide', functionalGroup: '-CONH₂', carbonCount: c },
                seriesColor: SERIES_COLORS['Amide'],
            }
        };
    });
}

function generateNitriles(n) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        return {
            id: mkId('nitrile', c), type: 'molecule',
            data: {
                label: prefixes[i] + 'anenitrile',
                description: 'Nitrile with -CN.',
                details: { series: 'Nitrile', functionalGroup: '-CN', hybridization: 'sp', carbonCount: c },
                seriesColor: SERIES_COLORS['Nitrile'],
            }
        };
    });
}

function generateHaloalkanes(n, halogen) {
    return Array.from({ length: n }, (_, i) => {
        const c = i + 1;
        const hName = halogen === 'Br' ? 'Bromo' : 'Chloro';
        return {
            id: mkId(`halo${halogen.toLowerCase()}`, c), type: 'molecule',
            data: {
                label: `${hName}${prefixes[i].toLowerCase()}ane`,
                description: `Haloalkane with -${halogen}.`,
                details: { series: 'Haloalkane', functionalGroup: '-' + halogen, carbonCount: c },
                seriesColor: SERIES_COLORS['Haloalkane'],
            }
        };
    });
}

function generateAromatics() {
    const color = SERIES_COLORS['Aromatic'];
    return [
        { id: 'aromatic-benzene', type: 'molecule', data: { label: 'Benzene', formula: 'C₆H₆', description: 'Aromatic ring.', details: { series: 'Aromatic', hybridization: 'sp²', carbonCount: 6 }, seriesColor: color } },
        { id: 'aromatic-toluene', type: 'molecule', data: { label: 'Toluene', formula: 'C₇H₈', description: 'Methylbenzene.', details: { series: 'Aromatic', carbonCount: 7 }, seriesColor: color } },
        { id: 'aromatic-phenol', type: 'molecule', data: { label: 'Phenol', formula: 'C₆H₅OH', description: 'Hydroxybenzene.', details: { series: 'Aromatic', functionalGroup: '-OH', carbonCount: 6 }, seriesColor: color } },
        { id: 'aromatic-aniline', type: 'molecule', data: { label: 'Aniline', formula: 'C₆H₅NH₂', description: 'Aminobenzene.', details: { series: 'Aromatic', functionalGroup: '-NH₂', carbonCount: 6 }, seriesColor: color } },
        { id: 'aromatic-benzoic', type: 'molecule', data: { label: 'Benzoic Acid', formula: 'C₆H₅COOH', description: 'Carboxybenzene.', details: { series: 'Aromatic', functionalGroup: '-COOH', carbonCount: 7 }, seriesColor: color } },
        { id: 'aromatic-nitro', type: 'molecule', data: { label: 'Nitrobenzene', formula: 'C₆H₅NO₂', description: 'Nitrated benzene.', details: { series: 'Aromatic', functionalGroup: '-NO₂', carbonCount: 6 }, seriesColor: color } },
    ];
}

// ── Edge/Reaction generators ──
function generateReactions(nodes) {
    const edges = [];
    const find = (pid) => nodes.find(n => n.id === pid);

    const reactionEdge = (eid, src, tgt, label, reagents, color = '#64748b') => ({
        id: eid, source: src, target: tgt, label,
        style: { stroke: color },
        data: { reagents },
        animated: true,
    });

    nodes.forEach(node => {
        const parts = node.id.split('-');
        if (parts.length < 2) return;
        const type = parts[0];
        const c = parseInt(parts[1]);
        if (isNaN(c)) return;

        if (type === 'alkene') {
            const t = mkId('alkane', c);
            if (find(t)) edges.push(reactionEdge(`hyd-${c}`, node.id, t, '+ H₂', 'H₂ / Ni, 150°C', '#22c55e'));
        }
        if (type === 'alkyne') {
            const t = mkId('alkene', c);
            if (find(t)) edges.push(reactionEdge(`hyd-alkyne-${c}`, node.id, t, '+ H₂', 'H₂ / Lindlar cat.', '#a855f7'));
        }
        if (type === 'alkene') {
            const t = mkId('alcohol', c);
            if (find(t)) edges.push(reactionEdge(`hydration-${c}`, node.id, t, '+ H₂O', 'Steam / H₃PO₄', '#3b82f6'));
        }
        if (type === 'alkene') {
            const tBr = mkId('halobr', c);
            if (find(tBr)) edges.push(reactionEdge(`add-br-${c}`, node.id, tBr, '+ HBr', 'HBr(g)', '#8d2d2d'));
        }
        if (type === 'alcohol') {
            const t = mkId('aldehyde', c);
            if (find(t)) edges.push(reactionEdge(`ox-ald-${c}`, node.id, t, 'Oxidation', 'K₂Cr₂O₇ / H⁺ (distil)', '#f59e0b'));
        }
        if (type === 'alcohol' && c >= 3) {
            const t = mkId('ketone', c);
            if (find(t)) edges.push(reactionEdge(`ox-ket-${c}`, node.id, t, 'Oxidation', 'K₂Cr₂O₇ / H⁺ (reflux)', '#eab308'));
        }
        if (type === 'alcohol' && c >= 2) {
            const t = mkId('alkene', c);
            if (find(t)) edges.push(reactionEdge(`dehy-e-${c}`, node.id, t, 'Dehydration', 'H₂SO₄, 170°C', '#f97316'));
        }
        if (type === 'alcohol' && c >= 1) {
            const t = mkId('ether', c * 2);
            if (find(t)) edges.push(reactionEdge(`ether-${c}`, node.id, t, 'Dehydration', 'H₂SO₄, 140°C', '#8b5cf6'));
        }
        if (type === 'aldehyde') {
            const t = mkId('acid', c);
            if (find(t)) edges.push(reactionEdge(`ox-acid-${c}`, node.id, t, 'Oxidation', 'KMnO₄ / K₂Cr₂O₇', '#ef4444'));
        }
        if (type === 'acid') {
            const t = mkId('ester', c + 1);
            if (find(t)) edges.push(reactionEdge(`ester-${c}`, node.id, t, 'Esterification', '+ CH₃OH / H₂SO₄', '#ec4899'));
        }
        if (type === 'acid') {
            const t = mkId('amide', c);
            if (find(t)) edges.push(reactionEdge(`amide-${c}`, node.id, t, 'Amidation', '+ NH₃, heat', '#6366f1'));
        }
        if (type === 'halobr') {
            const t = mkId('amine', c);
            if (find(t)) edges.push(reactionEdge(`amm-${c}`, node.id, t, 'Ammonolysis', 'excess NH₃', '#3b82f6'));
        }
        if (type === 'halobr') {
            const t = mkId('alcohol', c);
            if (find(t)) edges.push(reactionEdge(`hydrol-${c}`, node.id, t, 'Hydrolysis', 'NaOH(aq), reflux', '#ef4444'));
        }
        if (type === 'halobr') {
            const t = mkId('nitrile', c);
            if (find(t)) edges.push(reactionEdge(`cn-${c}`, node.id, t, '+ KCN', 'KCN, ethanol, reflux', '#06b6d4'));
        }
        if (type === 'alkane') {
            const tBr = mkId('halobr', c);
            const tCl = mkId('halocl', c);
            if (find(tBr)) edges.push(reactionEdge(`sub-br-${c}`, node.id, tBr, '+ Br₂', 'Br₂ / UV light', '#8d2d2d'));
            if (find(tCl)) edges.push(reactionEdge(`sub-cl-${c}`, node.id, tCl, '+ Cl₂', 'Cl₂ / UV light', '#4caf50'));
        }
        if (type === 'nitrile') {
            const t = mkId('acid', c);
            if (find(t)) edges.push(reactionEdge(`nitrile-acid-${c}`, node.id, t, 'Hydrolysis', 'H₂O / H⁺, reflux', '#ef4444'));
        }
        if (type === 'nitrile') {
            const t = mkId('amine', c);
            if (find(t)) edges.push(reactionEdge(`nitrile-amine-${c}`, node.id, t, 'Reduction', 'LiAlH₄ / H₂', '#3b82f6'));
        }
    });

    // Aromatic reactions
    if (find('aromatic-benzene') && find('aromatic-nitro'))
        edges.push(reactionEdge('nitration', 'aromatic-benzene', 'aromatic-nitro', 'Nitration', 'HNO₃ / H₂SO₄, 50°C', '#f97316'));
    if (find('aromatic-nitro') && find('aromatic-aniline'))
        edges.push(reactionEdge('reduction-nitro', 'aromatic-nitro', 'aromatic-aniline', 'Reduction', 'Sn / conc. HCl', '#3b82f6'));
    if (find('aromatic-benzene') && find('aromatic-toluene'))
        edges.push(reactionEdge('alkylation', 'aromatic-benzene', 'aromatic-toluene', 'Friedel-Crafts', 'CH₃Cl / AlCl₃', '#f59e0b'));
    if (find('aromatic-toluene') && find('aromatic-benzoic'))
        edges.push(reactionEdge('ox-sidechain', 'aromatic-toluene', 'aromatic-benzoic', 'Oxidation', 'KMnO₄, reflux', '#ef4444'));
    if (find('aromatic-benzene') && find('aromatic-phenol'))
        edges.push(reactionEdge('phenol-form', 'aromatic-benzene', 'aromatic-phenol', 'Dow process', 'NaOH, high T/P', '#ef4444'));

    return edges;
}

// ── Main training function ──
async function main() {
    const N = 10;
    console.log('🧪 OrganicFlow Neural Network Trainer');
    console.log('═'.repeat(50));
    console.log(`Generating knowledge graph with ${N} carbon limit...`);

    const nodes = [
        ...generateAlkanes(N),
        ...generateAlkenes(N),
        ...generateAlkynes(N),
        ...generateAromatics(),
        ...generateAlcohols(N),
        ...generateEthers(N),
        ...generateAldehydes(N),
        ...generateKetones(N),
        ...generateAcids(N),
        ...generateEsters(N),
        ...generateAmines(N),
        ...generateAmides(N),
        ...generateNitriles(N),
        ...generateHaloalkanes(N, 'Br'),
        ...generateHaloalkanes(N, 'Cl'),
    ];

    const edges = generateReactions(nodes);

    console.log(`  Nodes: ${nodes.length}`);
    console.log(`  Edges: ${edges.length}`);

    // ── Encoder ──
    const SERIES_LIST = [
        'Alkane', 'Alkene', 'Alkyne', 'Alcohol', 'Aldehyde', 'Ketone',
        'Carboxylic Acid', 'Ester', 'Ether', 'Amine', 'Amide',
        'Nitrile', 'Haloalkane', 'Aromatic', 'Carbon Skeleton', 'No Reaction'
    ];
    const MOLECULE_DIM = 28;
    const REAGENT_DIM = 22;
    const INPUT_DIM = 50;
    const SERIES_COUNT = 16;
    const CARBON_COUNT = 10;

    function extractNodeFeatures(node) {
        const data = node.data || {};
        const details = data.details || {};
        const fg = (details.functionalGroup || '').toLowerCase();
        const label = (data.label || '').toLowerCase();
        return {
            carbonCount: details.carbonCount || parseInt(node.id?.split('-')[1]) || 1,
            series: details.series || 'Alkane',
            hasDoubleBond: details.hybridization === 'sp²' || details.series === 'Alkene' ? 1 : 0,
            hasTripleBond: details.hybridization === 'sp' || ['Alkyne', 'Nitrile'].includes(details.series) ? 1 : 0,
            hasOH: fg.includes('-oh') || details.series === 'Alcohol' ? 1 : 0,
            hasCOOH: fg.includes('-cooh') || details.series === 'Carboxylic Acid' ? 1 : 0,
            hasNH2: fg.includes('-nh') || details.series === 'Amine' ? 1 : 0,
            hasCarbonyl: fg.includes('c=o') || fg.includes('-cho') || ['Aldehyde', 'Ketone'].includes(details.series) ? 1 : 0,
            hasHalogen: fg.includes('-br') || fg.includes('-cl') || details.series === 'Haloalkane' ? 1 : 0,
            hasCN: fg.includes('-cn') || details.series === 'Nitrile' ? 1 : 0,
            isAromatic: details.series === 'Aromatic' || label.includes('benzene') ? 1 : 0,
            hybridization: details.hybridization || 'sp³',
        };
    }

    function encodeMolecule(node) {
        const f = extractNodeFeatures(node);
        const vec = new Float32Array(MOLECULE_DIM);
        vec[0] = Math.min(f.carbonCount, 10) / 10;
        const sIdx = SERIES_LIST.indexOf(f.series);
        if (sIdx >= 0) vec[1 + sIdx] = 1;
        vec[16] = f.hasDoubleBond; vec[17] = f.hasTripleBond;
        vec[18] = f.hasOH; vec[19] = f.hasCOOH; vec[20] = f.hasNH2;
        vec[21] = f.hasCarbonyl; vec[22] = f.hasHalogen; vec[23] = f.hasCN;
        vec[24] = f.isAromatic;
        if (f.hybridization === 'sp') vec[25] = 1;
        else if (f.hybridization === 'sp²') vec[26] = 1;
        else vec[27] = 1;
        return vec;
    }

    function encodeReagent(reagentStr) {
        const vec = new Float32Array(REAGENT_DIM);
        if (!reagentStr) return vec;
        const clean = reagentStr.toLowerCase();
        const patterns = [
            ['h₂', 'h2', 'hydrogen'], ['h₂o', 'h2o', 'steam', 'water'],
            ['hbr'], ['br₂', 'br2'], ['cl₂', 'cl2'], ['kcn', 'cyanide'],
            ['naoh', 'hydroxide'], ['nh₃', 'nh3', 'ammonia'],
            ['h₂so₄', 'h2so4', 'sulfuric'], ['k₂cr₂o₇', 'k2cr2o7', 'dichromate'],
            ['kmno₄', 'kmno4', 'permanganate'], ['hno₃', 'hno3', 'nitric'],
            ['alcl₃', 'alcl3'], ['sn', 'tin'], ['lialh₄', 'lialh4'],
            ['h₃po₄', 'h3po4', 'phosphoric'], ['ch₃oh', 'ch3oh', 'methanol'],
            ['ch₃cl', 'ch3cl'], ['uv', 'light'], ['heat', '°c', 'reflux'],
        ];
        patterns.forEach((p, i) => { if (p.some(x => clean.includes(x))) vec[i] = 1; });
        const tempMatch = clean.match(/(\d+)\s*°?\s*c/i);
        if (tempMatch) vec[20] = Math.min(parseInt(tempMatch[1]), 500) / 500;
        else if (clean.includes('reflux')) vec[20] = 0.16;
        const pressMatch = clean.match(/(\d+)\s*atm/i);
        if (pressMatch) vec[21] = Math.min(parseInt(pressMatch[1]), 300) / 300;
        return vec;
    }

    function encodeInput(node, reagentStr) {
        const molVec = encodeMolecule(node);
        const reagVec = encodeReagent(reagentStr);
        const combined = new Float32Array(INPUT_DIM);
        combined.set(molVec, 0);
        combined.set(reagVec, MOLECULE_DIM);
        return combined;
    }

    function encodeLabel(targetNode) {
        const f = extractNodeFeatures(targetNode);
        const seriesLabel = new Float32Array(SERIES_COUNT);
        const sIdx = SERIES_LIST.indexOf(f.series);
        if (sIdx >= 0) seriesLabel[sIdx] = 1;
        const carbonLabel = new Float32Array(CARBON_COUNT);
        const cIdx = Math.min(f.carbonCount, CARBON_COUNT) - 1;
        if (cIdx >= 0) carbonLabel[cIdx] = 1;
        return { seriesLabel, carbonLabel };
    }

    // ── Extract training data ──
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const samples = [];
    const validPairs = new Set();

    for (const edge of edges) {
        if (!edge.label || !edge.label.trim()) continue;
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) continue;

        const reagentStr = edge.data?.reagents || edge.label || '';
        validPairs.add(`${sourceNode.id}|${reagentStr}`);
        
        const input = encodeInput(sourceNode, reagentStr);
        const { seriesLabel, carbonLabel } = encodeLabel(targetNode);
        samples.push({ input, seriesLabel, carbonLabel, isPositive: true });
    }

    console.log(`\n📊 Valid reaction samples: ${samples.length}`);

    // ── Generate Negative Samples ("No Reaction") ──
    const REAGENT_STRINGS = [
        'H₂ / Ni, 150°C', 'Steam / H₃PO₄', 'HBr(g)', 'Br₂ / UV light', 'Cl₂ / UV light',
        'KCN, ethanol, reflux', 'NaOH(aq), reflux', 'excess NH₃', 'H₂SO₄, 170°C',
        'H₂SO₄, 140°C', 'K₂Cr₂O₇ / H⁺ (distil)', 'K₂Cr₂O₇ / H⁺ (reflux)', 'KMnO₄ / K₂Cr₂O₇',
        'HNO₃ / H₂SO₄, 50°C', 'Sn / conc. HCl', 'LiAlH₄ / H₂', '+ CH₃OH / H₂SO₄', 
        'CH₃Cl / AlCl₃', '+ NH₃, heat', 'H₂ / Lindlar cat.', 'Dow process', 'H₂O / H⁺, reflux'
    ];

    const noReactionNode = { data: { details: { series: 'No Reaction', carbonCount: 0 } } };
    let negativeCount = 0;

    for (const node of nodes) {
        for (const reagent of REAGENT_STRINGS) {
            if (!validPairs.has(`${node.id}|${reagent}`)) {
                const input = encodeInput(node, reagent);
                const { seriesLabel, carbonLabel } = encodeLabel(noReactionNode);
                samples.push({ input, seriesLabel, carbonLabel, isPositive: false });
                negativeCount++;
            }
        }
    }
    console.log(`❌ Invalid (No Reaction) samples generated: ${negativeCount}`);
    console.log(`📊 Total raw samples: ${samples.length}`);

    // ── Augment & Balance Data ──
    const augmented = [];
    for (const sample of samples) {
        // Balance classes: Add 15 copies of positive samples, 1 copy of negative
        const copies = sample.isPositive ? 18 : 1;
        for (let f = 0; f < copies; f++) {
            const noisyInput = new Float32Array(sample.input.length);
            for (let i = 0; i < sample.input.length; i++) {
                if (i === 0 || i === 48 || i === 49) { // Add tiny noise to continuous variables
                    noisyInput[i] = Math.max(0, Math.min(1, sample.input[i] + (Math.random() - 0.5) * 0.1));
                } else {
                    noisyInput[i] = sample.input[i];
                }
            }
            augmented.push({ input: noisyInput, seriesLabel: sample.seriesLabel, carbonLabel: sample.carbonLabel });
        }
    }

    // Shuffle
    for (let i = augmented.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [augmented[i], augmented[j]] = [augmented[j], augmented[i]];
    }

    console.log(`📊 Augmented samples: ${augmented.length}`);

    // ── Build model ──
    const input = tf.input({ shape: [INPUT_DIM], name: 'molecule_reagent_input' });
    const h1 = tf.layers.dense({ units: 64, activation: 'relu', name: 'reaction_context', kernelInitializer: 'heNormal' }).apply(input);
    const h2 = tf.layers.dense({ units: 32, activation: 'relu', name: 'transformation', kernelInitializer: 'heNormal' }).apply(h1);
    const h3 = tf.layers.dense({ units: 32, activation: 'relu', name: 'product_assembly', kernelInitializer: 'heNormal' }).apply(h2);
    const seriesOutput = tf.layers.dense({ units: SERIES_COUNT, activation: 'softmax', name: 'series_output' }).apply(h3);
    const carbonOutput = tf.layers.dense({ units: CARBON_COUNT, activation: 'softmax', name: 'carbon_output' }).apply(h3);

    const model = tf.model({ inputs: input, outputs: [seriesOutput, carbonOutput], name: 'OrganicFlowNN' });
    model.compile({ optimizer: tf.train.adam(0.005), loss: ['categoricalCrossentropy', 'categoricalCrossentropy'], metrics: ['accuracy'] });

    model.summary();

    // ── Train ──
    const xs = tf.tensor2d(augmented.map(s => Array.from(s.input)));
    const ySeries = tf.tensor2d(augmented.map(s => Array.from(s.seriesLabel)));
    const yCarbon = tf.tensor2d(augmented.map(s => Array.from(s.carbonLabel)));

    console.log('\n🚀 Training...\n');

    await model.fit(xs, [ySeries, yCarbon], {
        epochs: 40,
        batchSize: 16,
        validationSplit: 0.15,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 10 === 0 || epoch === 39) {
                    console.log(`  Epoch ${epoch + 1}/40 — loss: ${logs.loss.toFixed(4)} | series_acc: ${(logs.series_output_acc * 100).toFixed(1)}% | carbon_acc: ${(logs.carbon_output_acc * 100).toFixed(1)}%`);
                }
            }
        }
    });

    // ── Save ──
    const fs = await import('fs');
    const path = await import('path');
    const savePath = path.resolve('public', 'nn-weights');
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });

    await model.save(`file://${savePath}`);
    console.log(`\n✅ Model saved to ${savePath}/`);

    // ── Quick test ──
    console.log('\n🧪 Quick test predictions:');
    const testCases = [
        { src: 'alkene-2', reagent: 'H₂ / Ni, 150°C', expected: 'Alkane C2' },
        { src: 'alkene-2', reagent: 'Steam / H₃PO₄', expected: 'Alcohol C2' },
        { src: 'alcohol-2', reagent: 'K₂Cr₂O₇ / H⁺ (distil)', expected: 'Aldehyde C2' },
        { src: 'alkane-1', reagent: 'Br₂ / UV light', expected: 'Haloalkane C1' },
        { src: 'halobr-2', reagent: 'excess NH₃', expected: 'Amine C2' },
    ];

    for (const tc of testCases) {
        const srcNode = nodeMap.get(tc.src);
        if (!srcNode) continue;
        const inp = encodeInput(srcNode, tc.reagent);
        const [sp, cp] = model.predict(tf.tensor2d([Array.from(inp)]));
        const sData = sp.dataSync();
        const cData = cp.dataSync();

        let maxS = 0, maxSi = 0;
        for (let i = 0; i < sData.length; i++) { if (sData[i] > maxS) { maxS = sData[i]; maxSi = i; } }
        let maxC = 0, maxCi = 0;
        for (let i = 0; i < cData.length; i++) { if (cData[i] > maxC) { maxC = cData[i]; maxCi = i; } }

        const predicted = `${SERIES_LIST[maxSi]} C${maxCi + 1}`;
        const icon = predicted === tc.expected ? '✅' : '❌';
        console.log(`  ${icon} ${srcNode.data.label} + "${tc.reagent}" → ${predicted} (expected: ${tc.expected}) [${(maxS * 100).toFixed(0)}%]`);

        sp.dispose(); cp.dispose();
    }

    // Cleanup
    xs.dispose(); ySeries.dispose(); yCarbon.dispose();
    console.log('\n🎉 Done!');
}

main().catch(console.error);
