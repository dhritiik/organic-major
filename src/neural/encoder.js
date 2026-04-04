// =============================================================================
// Molecule & Reagent Feature Encoder for Neural Network
// Converts graph node data → numerical feature vectors for TF.js
// =============================================================================

// All known homologous series in the graph
export const SERIES_LIST = [
    'Alkane', 'Alkene', 'Alkyne', 'Alcohol', 'Aldehyde', 'Ketone',
    'Carboxylic Acid', 'Ester', 'Ether', 'Amine', 'Amide',
    'Nitrile', 'Haloalkane', 'Aromatic', 'Carbon Skeleton', 'No Reaction'
];

// All known reagent types (mapped from edge labels & reagent data)
export const REAGENT_LIST = [
    'H₂', 'H₂O', 'HBr', 'Br₂', 'Cl₂', 'KCN', 'NaOH', 'NH₃',
    'H₂SO₄', 'K₂Cr₂O₇', 'KMnO₄', 'HNO₃', 'AlCl₃', 'Sn/HCl',
    'LiAlH₄', 'H₃PO₄', 'CH₃OH', 'CH₃Cl', 'UV', 'Heat'
];

// Human-readable labels for each reagent
export const REAGENT_DISPLAY = [
    'H₂ / Ni (Hydrogenation)',
    'H₂O / H₃PO₄ (Hydration)',
    'HBr (Electrophilic Addition)',
    'Br₂ / UV (Radical Substitution)',
    'Cl₂ / UV (Radical Substitution)',
    'KCN (Cyanide Substitution)',
    'NaOH(aq) (Hydrolysis)',
    'NH₃ excess (Ammonolysis)',
    'H₂SO₄ conc. (Dehydration)',
    'K₂Cr₂O₇ / H⁺ (Oxidation - distil)',
    'KMnO₄ (Oxidation - reflux)',
    'HNO₃ / H₂SO₄ (Nitration)',
    'AlCl₃ / CH₃Cl (Friedel-Crafts)',
    'Sn / conc. HCl (Reduction)',
    'LiAlH₄ (Reduction)',
    'H₃PO₄ (Acid catalyst)',
    'CH₃OH / H₂SO₄ (Esterification)',
    'CH₃Cl / AlCl₃ (Alkylation)',
    'UV light',
    'Heat'
];

// Input dimensions
export const MOLECULE_DIM = 28;
export const REAGENT_DIM = 22;
export const INPUT_DIM = MOLECULE_DIM + REAGENT_DIM; // 50
export const SERIES_COUNT = SERIES_LIST.length; // 15
export const CARBON_COUNT = 10;

// ─────────────────────────────────────────────────────────────────────
// Extract features from a graph node
// ─────────────────────────────────────────────────────────────────────
function extractNodeFeatures(node) {
    const data = node.data || {};
    const details = data.details || {};
    const formula = (data.formula || '').toLowerCase();
    const desc = (data.description || '').toLowerCase();
    const label = (data.label || '').toLowerCase();
    const fg = (details.functionalGroup || '').toLowerCase();

    return {
        carbonCount: details.carbonCount || parseInt(node.id?.split('-')[1]) || 1,
        series: details.series || 'Alkane',
        hasDoubleBond: formula.includes('=') || details.hybridization === 'sp²' || ['Alkene'].includes(details.series) ? 1 : 0,
        hasTripleBond: formula.includes('≡') || details.hybridization === 'sp' || ['Alkyne', 'Nitrile'].includes(details.series) ? 1 : 0,
        hasOH: fg.includes('-oh') || ['Alcohol'].includes(details.series) ? 1 : 0,
        hasCOOH: fg.includes('-cooh') || ['Carboxylic Acid'].includes(details.series) ? 1 : 0,
        hasNH2: fg.includes('-nh') || ['Amine'].includes(details.series) ? 1 : 0,
        hasCarbonyl: fg.includes('c=o') || fg.includes('-cho') || ['Aldehyde', 'Ketone'].includes(details.series) ? 1 : 0,
        hasHalogen: fg.includes('-br') || fg.includes('-cl') || ['Haloalkane'].includes(details.series) ? 1 : 0,
        hasCN: fg.includes('-cn') || ['Nitrile'].includes(details.series) ? 1 : 0,
        isAromatic: ['Aromatic'].includes(details.series) || label.includes('benzene') ? 1 : 0,
        hybridization: details.hybridization || 'sp³',
    };
}

// ─────────────────────────────────────────────────────────────────────
// Encode a molecule node → 28-dim float array
// ─────────────────────────────────────────────────────────────────────
export function encodeMolecule(node) {
    const f = extractNodeFeatures(node);
    const vec = new Float32Array(MOLECULE_DIM);

    // Neuron 0: normalized carbon count (1-10 → 0.1-1.0)
    vec[0] = Math.min(f.carbonCount, 10) / 10;

    // Neurons 1-15: one-hot series
    const seriesIdx = SERIES_LIST.indexOf(f.series);
    if (seriesIdx >= 0) vec[1 + seriesIdx] = 1;

    // Neurons 16-24: functional group flags
    vec[16] = f.hasDoubleBond;
    vec[17] = f.hasTripleBond;
    vec[18] = f.hasOH;
    vec[19] = f.hasCOOH;
    vec[20] = f.hasNH2;
    vec[21] = f.hasCarbonyl;
    vec[22] = f.hasHalogen;
    vec[23] = f.hasCN;
    vec[24] = f.isAromatic;

    // Neurons 25-27: hybridization one-hot (sp, sp², sp³)
    if (f.hybridization === 'sp') vec[25] = 1;
    else if (f.hybridization === 'sp²') vec[26] = 1;
    else vec[27] = 1; // sp³ default

    return vec;
}

// ─────────────────────────────────────────────────────────────────────
// Parse reagent string from edge data and encode → 22-dim float array
// ─────────────────────────────────────────────────────────────────────
export function encodeReagent(reagentStr) {
    const vec = new Float32Array(REAGENT_DIM);
    if (!reagentStr) return vec;

    const clean = reagentStr.toLowerCase();

    // One-hot encode which reagent(s) are present (multiple can fire)
    const reagentPatterns = [
        ['h₂', 'h2', 'hydrogen'],
        ['h₂o', 'h2o', 'steam', 'water'],
        ['hbr'],
        ['br₂', 'br2'],
        ['cl₂', 'cl2'],
        ['kcn', 'cyanide'],
        ['naoh', 'hydroxide'],
        ['nh₃', 'nh3', 'ammonia'],
        ['h₂so₄', 'h2so4', 'sulfuric'],
        ['k₂cr₂o₇', 'k2cr2o7', 'dichromate'],
        ['kmno₄', 'kmno4', 'permanganate'],
        ['hno₃', 'hno3', 'nitric'],
        ['alcl₃', 'alcl3'],
        ['sn', 'tin'],
        ['lialh₄', 'lialh4'],
        ['h₃po₄', 'h3po4', 'phosphoric'],
        ['ch₃oh', 'ch3oh', 'methanol'],
        ['ch₃cl', 'ch3cl'],
        ['uv', 'light'],
        ['heat', '°c', 'reflux'],
    ];

    reagentPatterns.forEach((patterns, i) => {
        if (patterns.some(p => clean.includes(p))) {
            vec[i] = 1;
        }
    });

    // Neuron 20: temperature (try to extract a number, normalize 0-500 → 0-1)
    const tempMatch = clean.match(/(\d+)\s*°?\s*c/i);
    if (tempMatch) {
        vec[20] = Math.min(parseInt(tempMatch[1]), 500) / 500;
    } else if (clean.includes('reflux')) {
        vec[20] = 0.16; // ~78°C for ethanol reflux
    }

    // Neuron 21: pressure (normalize 0-300 → 0-1)
    const pressMatch = clean.match(/(\d+)\s*atm/i);
    if (pressMatch) {
        vec[21] = Math.min(parseInt(pressMatch[1]), 300) / 300;
    }

    return vec;
}

// ─────────────────────────────────────────────────────────────────────
// Encode complete input: molecule + reagent → 50-dim float array
// ─────────────────────────────────────────────────────────────────────
export function encodeInput(node, reagentStr) {
    const molVec = encodeMolecule(node);
    const reagVec = encodeReagent(reagentStr);

    const combined = new Float32Array(INPUT_DIM);
    combined.set(molVec, 0);
    combined.set(reagVec, MOLECULE_DIM);
    return combined;
}

// ─────────────────────────────────────────────────────────────────────
// Decode output probabilities → human-readable prediction
// ─────────────────────────────────────────────────────────────────────
export function decodeOutput(seriesProbs, carbonProbs) {
    // Find top-1 series
    let maxSeriesIdx = 0;
    let maxSeriesProb = seriesProbs[0];
    for (let i = 1; i < seriesProbs.length; i++) {
        if (seriesProbs[i] > maxSeriesProb) {
            maxSeriesIdx = i;
            maxSeriesProb = seriesProbs[i];
        }
    }

    // Find top-1 carbon count
    let maxCarbonIdx = 0;
    let maxCarbonProb = carbonProbs[0];
    for (let i = 1; i < carbonProbs.length; i++) {
        if (carbonProbs[i] > maxCarbonProb) {
            maxCarbonIdx = i;
            maxCarbonProb = carbonProbs[i];
        }
    }

    return {
        series: SERIES_LIST[maxSeriesIdx],
        seriesConfidence: maxSeriesProb,
        carbonCount: maxCarbonIdx + 1,
        carbonConfidence: maxCarbonProb,
        overallConfidence: (maxSeriesProb + maxCarbonProb) / 2,
        seriesProbs: Array.from(seriesProbs),
        carbonProbs: Array.from(carbonProbs),
    };
}

// ─────────────────────────────────────────────────────────────────────
// Create one-hot label arrays from a target node
// ─────────────────────────────────────────────────────────────────────
export function encodeLabel(targetNode) {
    const f = extractNodeFeatures(targetNode);

    // Series one-hot
    const seriesLabel = new Float32Array(SERIES_COUNT);
    const sIdx = SERIES_LIST.indexOf(f.series);
    if (sIdx >= 0) seriesLabel[sIdx] = 1;

    // Carbon count one-hot (1-indexed → 0-indexed)
    const carbonLabel = new Float32Array(CARBON_COUNT);
    const cIdx = Math.min(f.carbonCount, CARBON_COUNT) - 1;
    if (cIdx >= 0) carbonLabel[cIdx] = 1;

    return { seriesLabel, carbonLabel };
}
