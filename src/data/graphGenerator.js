
// Helper to generate IDs
const id = (prefix, carbonCount) => `${prefix}-${carbonCount}`;

// IUPAC Prefixes
const prefixes = ['Meth', 'Eth', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct', 'Non', 'Dec'];
const sub = (n) => n.toString().replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);

// -----------------------------------------------------------------------------
// Layout Constants – wider spacing for readability
// -----------------------------------------------------------------------------
const GRID_X = 360;
const GRID_Y = 300;
const START_Y = 0; // Top offset

// Column Assignments – spread out to avoid overlaps
const COLS = {
    AROMATIC: -6,
    NITRILE: -5,
    AMIDE: -4,
    AMINE: -3,
    HALO: -1.5,
    BACKBONE: 0,
    ALKANE: 1.5,
    ALKENE: 3,
    ALKYNE: 4.5,
    ALCOHOL: 6,
    ETHER: 7.5,
    ALDEHYDE: 9,
    KETONE: 10.5,
    ACID: 12,
    ESTER: 13.5
};

// Series colour map used by MoleculeNode
const SERIES_COLORS = {
    'Alkane':          { bg: '#1e3a5f', border: '#3b82f6' },
    'Alkene':          { bg: '#1a3d2e', border: '#22c55e' },
    'Alkyne':          { bg: '#3b1f4b', border: '#a855f7' },
    'Alcohol':         { bg: '#4a1d1d', border: '#ef4444' },
    'Aldehyde':        { bg: '#4a3010', border: '#f59e0b' },
    'Ketone':          { bg: '#4a3e10', border: '#eab308' },
    'Carboxylic Acid': { bg: '#5c1a1a', border: '#ef4444' },
    'Ester':           { bg: '#4a1040', border: '#ec4899' },
    'Ether':           { bg: '#2d2040', border: '#8b5cf6' },
    'Amine':           { bg: '#102040', border: '#3b82f6' },
    'Amide':           { bg: '#1a2840', border: '#6366f1' },
    'Nitrile':         { bg: '#102030', border: '#06b6d4' },
    'Haloalkane':      { bg: '#103020', border: '#10b981' },
    'Aromatic':        { bg: '#302020', border: '#f97316' },
    'Carbon Skeleton': { bg: 'transparent', border: '#555' },
};

// -----------------------------------------------------------------------------
// 1. Element Generator
// -----------------------------------------------------------------------------
const generateElements = () => {
    // Elements float at the very top, spread horizontally
    const y = -800;
    return [
        { id: 'element-C', type: 'molecule', position: { x: 0, y: y }, data: { isElement: true, label: 'Carbon', formula: 'C', description: 'The backbone of organic chemistry – all organic compounds contain carbon.', details: { atomicNumber: 6, mass: '12.011', electronegativity: '2.55', valence: 4 } }, style: { backgroundColor: '#333', color: '#fff', width: 60, height: 60, borderRadius: '50%' } },
        { id: 'element-H', type: 'molecule', position: { x: -300, y: y }, data: { isElement: true, label: 'Hydrogen', formula: 'H', description: 'Most abundant element in the universe. Forms covalent bonds with C.', details: { atomicNumber: 1, mass: '1.008', electronegativity: '2.20', valence: 1 } }, style: { backgroundColor: '#fff', color: '#000', width: 50, height: 50, borderRadius: '50%' } },
        { id: 'element-O', type: 'molecule', position: { x: 300, y: y }, data: { isElement: true, label: 'Oxygen', formula: 'O', description: 'Found in alcohols, aldehydes, ketones, acids, esters, and ethers.', details: { atomicNumber: 8, mass: '15.999', electronegativity: '3.44', valence: 2 } }, style: { backgroundColor: '#f44336', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-N', type: 'molecule', position: { x: 600, y: y }, data: { isElement: true, label: 'Nitrogen', formula: 'N', description: 'Found in amines, amides, nitriles, and amino acids.', details: { atomicNumber: 7, mass: '14.007', electronegativity: '3.04', valence: 3 } }, style: { backgroundColor: '#2196f3', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-Cl', type: 'molecule', position: { x: -600, y: y + 200 }, data: { isElement: true, label: 'Chlorine', formula: 'Cl', description: 'Halogen. Forms haloalkanes via free-radical substitution or nucleophilic substitution.', details: { atomicNumber: 17, mass: '35.45', electronegativity: '3.16', valence: 1 } }, style: { backgroundColor: '#4caf50', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-Br', type: 'molecule', position: { x: -900, y: y + 200 }, data: { isElement: true, label: 'Bromine', formula: 'Br', description: 'Liquid halogen. Used in electrophilic addition to alkenes.', details: { atomicNumber: 35, mass: '79.90', electronegativity: '2.96', valence: 1 } }, style: { backgroundColor: '#8d2d2d', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
    ];
};

// -----------------------------------------------------------------------------
// 2. Backbone Generator (Meth/Eth/Prop Hubs)
// -----------------------------------------------------------------------------
const generateBackbones = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('backbone', c),
        type: 'molecule',
        position: { x: COLS.BACKBONE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: `${prefixes[i]}-`,
            formula: `C${sub(c)}`,
            description: `${c} Carbon backbone – the skeleton for all ${prefixes[i]}– derivatives.`,
            details: { series: 'Carbon Skeleton', carbonCount: c }
        },
        style: {
            backgroundColor: 'transparent',
            borderColor: '#555',
            borderStyle: 'dashed',
            color: '#aaa',
            width: 120,
            height: 120,
            fontSize: '1.2em'
        }
    };
});


// -----------------------------------------------------------------------------
// 3. Homologous Series Generators (Grid Aligned)
// -----------------------------------------------------------------------------

// Hydrocarbons
const generateAlkanes = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('alkane', c), type: 'molecule', position: { x: COLS.ALKANE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'ane', formula: `C${sub(c)}H${sub(2 * c + 2)}`,
            description: `Saturated hydrocarbon with ${c} carbon(s). Only single bonds (σ bonds).`,
            details: { series: 'Alkane', hybridization: 'sp³', bondAngle: '109.5°', general: `CₙH₂ₙ₊₂` },
            mechanismIds: ['free-radical-substitution', 'free-radical-bromination'],
            seriesColor: SERIES_COLORS['Alkane'],
        }
    };
});

const generateAlkenes = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('alkene', c), type: 'molecule', position: { x: COLS.ALKENE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i + 1] + 'ene',
            formula: `C${sub(c)}H${sub(2 * c)}`,
            description: `Unsaturated hydrocarbon with one C=C double bond and ${c} carbons.`,
            details: { series: 'Alkene', hybridization: 'sp²', bondAngle: '120°', general: 'CₙH₂ₙ' },
            mechanismIds: c === 2 ? ['hydrohalogenation-ethene-bromoethane', 'hydrogenation-ethene', 'hydration-ethene'] : ['hydrohalogenation-propene', 'hydrogenation-propene', 'hydration-propene'],
            seriesColor: SERIES_COLORS['Alkene'],
        }
    };
});

const generateAlkynes = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('alkyne', c), type: 'molecule', position: { x: COLS.ALKYNE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i + 1] + 'yne', formula: `C${sub(c)}H${sub(2 * c - 2)}`,
            description: `Unsaturated hydrocarbon with one C≡C triple bond and ${c} carbons.`,
            details: { series: 'Alkyne', hybridization: 'sp', bondAngle: '180°', general: 'CₙH₂ₙ₋₂' },
            mechanismIds: c === 2 ? ['hydrogenation-alkyne-alkene'] : ['hydrogenation-propyne'],
            seriesColor: SERIES_COLORS['Alkyne'],
        }
    };
});

// Aromatics (Benzene System) - Isolate in Far West
const generateAromatics = () => {
    const baseX = COLS.AROMATIC * GRID_X;
    const baseY = 3 * GRID_Y; // Start around C3 level
    const color = SERIES_COLORS['Aromatic'];
    return [
        { id: 'aromatic-benzene', type: 'molecule', position: { x: baseX, y: baseY }, data: { label: 'Benzene', formula: 'C₆H₆', description: 'Parent aromatic ring – delocalised π-electrons above and below the ring. Extremely stable.', details: { series: 'Aromatic', hybridization: 'sp²', bondAngle: '120°' }, mechanismIds: ['nitration-benzene', 'friedel-crafts-alkylation'], seriesColor: color } },
        { id: 'aromatic-toluene', type: 'molecule', position: { x: baseX, y: baseY + GRID_Y }, data: { label: 'Toluene', formula: 'C₇H₈', description: 'Methylbenzene – activating methyl group makes the ring more reactive than benzene.', details: { series: 'Aromatic', altName: 'Methylbenzene' }, mechanismIds: ['oxidation-toluene-benzoic', 'friedel-crafts-alkylation'], seriesColor: color } },
        { id: 'aromatic-phenol', type: 'molecule', position: { x: baseX - 200, y: baseY + GRID_Y }, data: { label: 'Phenol', formula: 'C₆H₅OH', description: 'Hydroxybenzene – weakly acidic. –OH activates ring towards electrophilic substitution.', details: { series: 'Aromatic', functionalGroup: '-OH', pH: 'Weakly acidic' }, mechanismIds: ['dow-process-phenol'], seriesColor: color } },
        { id: 'aromatic-aniline', type: 'molecule', position: { x: baseX + 200, y: baseY + GRID_Y + 100 }, data: { label: 'Aniline', formula: 'C₆H₅NH₂', description: 'Aminobenzene – weak base. Produced by reduction of nitrobenzene (Sn/HCl).', details: { series: 'Aromatic', functionalGroup: '-NH₂' }, mechanismIds: ['reduction-nitrobenzene-aniline'], seriesColor: color } },
        { id: 'aromatic-benzoic', type: 'molecule', position: { x: baseX, y: baseY + 2 * GRID_Y }, data: { label: 'Benzoic Acid', formula: 'C₆H₅COOH', description: 'Carboxybenzene – produced by vigorous oxidation of toluene side chain.', details: { series: 'Aromatic', functionalGroup: '-COOH' }, mechanismIds: ['oxidation-toluene-benzoic'], seriesColor: color } },
        { id: 'aromatic-nitro', type: 'molecule', position: { x: baseX + 200, y: baseY }, data: { label: 'Nitrobenzene', formula: 'C₆H₅NO₂', description: 'Nitrated benzene – pale yellow oily liquid. Reduced to aniline.', details: { series: 'Aromatic', functionalGroup: '-NO₂' }, mechanismIds: ['reduction-nitrobenzene-aniline', 'nitration-benzene'], seriesColor: color } },
    ];
};

// Oxygenated
const generateAlcohols = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('alcohol', c), type: 'molecule', position: { x: COLS.ALCOHOL * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anol',
            formula: `C${sub(c)}H${sub(2 * c + 1)}OH`,
            description: c <= 2 ? 'Primary alcohol with –OH on terminal carbon.' : (c === 3 ? 'Can be primary or secondary alcohol.' : 'Primary alcohol.'),
            details: { series: 'Alcohol', functionalGroup: '-OH', general: 'CₙH₂ₙ₊₁OH' },
            mechanismIds: c <= 2 ? ['oxidation-alcohol-aldehyde', 'dehydration-alcohol-alkene', 'dehydration-alcohol-ether'] : ['oxidation-propanol-propanal', 'oxidation-alcohol-ketone', 'dehydration-propanol-propene', 'dehydration-alcohol-ether'],
            seriesColor: SERIES_COLORS['Alcohol'],
        }
    };
});

const generateAldehydes = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('aldehyde', c), type: 'molecule', position: { x: COLS.ALDEHYDE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anal', formula: `C${sub(c)}H${sub(2 * c)}O`,
            description: 'Terminal carbonyl (C=O) group at the end of the carbon chain.',
            details: { series: 'Aldehyde', functionalGroup: '-CHO', test: 'Tollens / Fehlings' },
            mechanismIds: c <= 2 ? ['oxidation-aldehyde-acid'] : ['oxidation-propanal-propanoic'],
            seriesColor: SERIES_COLORS['Aldehyde'],
        }
    };
});

const generateKetones = (n) => Array.from({ length: n - 2 }, (_, i) => {
    const c = i + 3; // Starts at Propanone (C3)
    return {
        id: id('ketone', c), type: 'molecule', position: { x: COLS.KETONE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i + 2] + 'anone', formula: `C${sub(c)}H${sub(2 * c)}O`,
            description: 'Internal carbonyl (C=O) group within the carbon chain. Cannot be further oxidised easily.',
            details: { series: 'Ketone', functionalGroup: 'C=O', test: 'Does NOT reduce Tollens' },
            mechanismIds: ['oxidation-alcohol-ketone'],
            seriesColor: SERIES_COLORS['Ketone'],
        }
    };
});

const generateAcids = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('acid', c), type: 'molecule', position: { x: COLS.ACID * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anoic Acid', formula: `C${sub(c - 1)}H${sub(2 * c - 1)}COOH`,
            description: 'Carboxylic acid – contains –COOH. Weak acid. Reacts with bases, alcohols, amines.',
            details: { series: 'Carboxylic Acid', functionalGroup: '-COOH', pH: 'Acidic (weak)' },
            mechanismIds: ['esterification', 'esterification-ethanoic', 'amidation'],
            seriesColor: SERIES_COLORS['Carboxylic Acid'],
        },
    };
});

const generateEsters = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('ester', c), type: 'molecule', position: { x: COLS.ESTER * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: 'Methyl ' + prefixes[i + 1] + 'anoate', formula: `C${sub(c)}H${sub(2 * c)}O₂`,
            description: 'Ester – fruity-smelling compound formed from acid + alcohol. Used in perfumes & flavourings.',
            details: { series: 'Ester', functionalGroup: '-COO-', formation: 'Esterification' },
            mechanismIds: ['esterification', 'esterification-ethanoic'],
            seriesColor: SERIES_COLORS['Ester'],
        },
    };
});

const generateEthers = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('ether', c), type: 'molecule', position: { x: COLS.ETHER * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: c === 4 ? 'Ethoxyethane' : ('Methoxy' + prefixes[i] + 'ane'),
            formula: `C${sub(c)}H${sub(2 * c + 2)}O`,
            description: 'Ethers – relatively unreactive. Formed by intermolecular dehydration of alcohols.',
            details: { series: 'Ether', functionalGroup: '-O-', formation: 'Dehydration (140°C)' },
            mechanismIds: ['dehydration-alcohol-ether'],
            seriesColor: SERIES_COLORS['Ether'],
        }
    };
});

// Nitrogenous
const generateAmines = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('amine', c), type: 'molecule', position: { x: COLS.AMINE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anamine', formula: `C${sub(c)}H${sub(2 * c + 1)}NH₂`,
            description: 'Primary amine – acts as a base (lone pair on N). Formed from haloalkanes via ammonolysis.',
            details: { series: 'Amine', functionalGroup: '-NH₂', pH: 'Basic (weak)' },
            mechanismIds: ['ammonolysis', 'nitrile-reduction'],
            seriesColor: SERIES_COLORS['Amine'],
        },
    };
});

const generateAmides = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('amide', c), type: 'molecule', position: { x: COLS.AMIDE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anamide', formula: `C${sub(c)}H${sub(2 * c + 1)}NO`,
            description: 'Amide – formed from acid + ammonia/amine. Contains the –CONH₂ group.',
            details: { series: 'Amide', functionalGroup: '-CONH₂', formation: 'Amidation' },
            mechanismIds: ['amidation'],
            seriesColor: SERIES_COLORS['Amide'],
        }
    };
});

const generateNitriles = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('nitrile', c), type: 'molecule', position: { x: COLS.NITRILE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i] + 'anenitrile', formula: `C${sub(c)}H${sub(2 * c - 1)}N`,
            description: 'Nitrile – contains C≡N triple bond. Can be hydrolysed to carboxylic acid or reduced to amine.',
            details: { series: 'Nitrile', functionalGroup: '-CN', hybridization: 'sp' },
            mechanismIds: ['cyanide-substitution', 'nitrile-hydrolysis', 'nitrile-reduction'],
            seriesColor: SERIES_COLORS['Nitrile'],
        }
    };
});

// Halogens
const generateHaloalkanes = (n, halogen) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    const hName = halogen === 'Br' ? 'Bromo' : 'Chloro';
    // Offset Halogens slightly within their column
    const xOffset = halogen === 'Br' ? 0 : -50;
    const yOffset = halogen === 'Br' ? 0 : 50;
    return {
        id: id(`halo${halogen.toLowerCase()}`, c), type: 'molecule', position: { x: COLS.HALO * GRID_X + xOffset, y: c * GRID_Y + START_Y + yOffset },
        data: {
            label: `${hName}${prefixes[i].toLowerCase()}ane`,
            formula: `C${sub(c)}H${sub(2 * c + 1)}${halogen}`,
            description: `Haloalkane with –${halogen}. Good leaving group. Undergoes nucleophilic substitution & elimination.`,
            details: { series: 'Haloalkane', functionalGroup: '-' + halogen, bondPolarity: `C-${halogen} is polar` },
            mechanismIds: halogen === 'Br'
                        ? ['nucleophilic-substitution-hydrolysis', 'hydrolysis-bromoethane', 'ammonolysis', 'cyanide-substitution', 'free-radical-bromination']
                        : ['free-radical-substitution', 'nucleophilic-substitution-hydrolysis'],
            seriesColor: SERIES_COLORS['Haloalkane'],
        }
    };
});

// -----------------------------------------------------------------------------
// 4. Edges & Connections
// -----------------------------------------------------------------------------

// Helper for edge colors
const getElementColor = (el) => {
    switch (el) {
        case 'H': return '#fff';
        case 'O': return '#f44336';
        case 'N': return '#2196f3';
        case 'Cl': return '#4caf50';
        case 'Br': return '#8d2d2d';
        default: return '#777';
    }
};

const generateReactions = (nodes) => {
    const edges = [];
    const find = (pid) => nodes.find(n => n.id === pid);

    // Edge style helpers
    const reactionEdge = (eid, src, tgt, label, reagents, color = '#64748b') => ({
        id: eid, source: src, target: tgt, label,
        style: { stroke: color, strokeWidth: 2 },
        labelStyle: { fill: '#e2e8f0', fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.85 },
        labelBgPadding: [6, 4],
        data: { reagents },
        animated: true,
    });

    // --- Backbone Connections (Carbon Skeleton) ---
    nodes.forEach(node => {
        const parts = node.id.split('-');
        if (parts.length >= 2) {
            const c = parseInt(parts[1]);
            if (!isNaN(c) && !node.data.isElement && !node.id.startsWith('backbone') && !node.id.startsWith('aromatic')) {
                const backboneId = id('backbone', c);
                if (find(backboneId)) {
                    edges.push({
                        id: `struct-${node.id}`,
                        source: backboneId,
                        target: node.id,
                        label: '',
                        style: { stroke: '#334155', strokeWidth: 1, strokeDasharray: '4,4', opacity: 0.15 },
                        animated: false
                    });
                }
            }
        }

        if (node.id.startsWith('backbone')) {
            const c = parseInt(node.id.split('-')[1]);
            edges.push({
                id: `c-backbone-${c}`,
                source: 'element-C',
                target: node.id,
                label: `${c}×C`,
                style: { stroke: '#555', strokeWidth: 1.5, strokeDasharray: '5,5' },
                animated: false
            });
        }
    });

    // --- Reactions ---
    nodes.forEach(node => {
        const parts = node.id.split('-');
        if (parts.length < 2) return;
        const type = parts[0];
        const c = parseInt(parts[1]);
        if (isNaN(c)) return;

        // 1. Alkene → Alkane (Hydrogenation: H₂/Ni)
        if (type === 'alkene') {
            const target = id('alkane', c);
            if (find(target)) edges.push(reactionEdge(`hyd-${c}`, node.id, target, '+ H₂', 'H₂ / Ni, 150°C', '#22c55e'));
        }

        // 2. Alkyne → Alkene (Partial Hydrogenation)
        if (type === 'alkyne') {
            const target = id('alkene', c);
            if (find(target)) edges.push(reactionEdge(`hyd-alkyne-${c}`, node.id, target, '+ H₂', 'H₂ / Lindlar cat.', '#a855f7'));
        }

        // 3. Alkene → Alcohol (Hydration: H₂O/H⁺)
        if (type === 'alkene') {
            const target = id('alcohol', c);
            if (find(target)) edges.push(reactionEdge(`hydration-${c}`, node.id, target, '+ H₂O', 'Steam / H₃PO₄', '#3b82f6'));
        }

        // 4. Alkene → Haloalkane (Electrophilic Addition)
        if (type === 'alkene') {
            const tBr = id('halobr', c);
            if (find(tBr)) edges.push(reactionEdge(`add-br-${c}`, node.id, tBr, '+ HBr', 'HBr(g)', '#8d2d2d'));
        }

        // 5. Alcohol → Aldehyde (Mild Oxidation)
        if (type === 'alcohol') {
            const target = id('aldehyde', c);
            if (find(target)) edges.push(reactionEdge(`ox-ald-${c}`, node.id, target, 'Oxidation', 'K₂Cr₂O₇ / H⁺ (distil)', '#f59e0b'));
        }

        // 6. Alcohol → Ketone  (for c>=3)
        if (type === 'alcohol' && c >= 3) {
            const target = id('ketone', c);
            if (find(target)) edges.push(reactionEdge(`ox-ket-${c}`, node.id, target, 'Oxidation', 'K₂Cr₂O₇ / H⁺ (reflux)', '#eab308'));
        }

        // 7. Alcohol → Alkene (Dehydration at 170°C)
        if (type === 'alcohol' && c >= 2) {
            const target = id('alkene', c);
            if (find(target)) edges.push(reactionEdge(`dehy-e-${c}`, node.id, target, 'Dehydration', 'H₂SO₄, 170°C', '#f97316'));
        }

        // 8. Alcohol → Ether (Dehydration at 140°C)
        if (type === 'alcohol' && c >= 1) {
            const target = id('ether', c * 2);
            if (find(target)) edges.push(reactionEdge(`ether-${c}`, node.id, target, 'Dehydration', 'H₂SO₄, 140°C', '#8b5cf6'));
        }

        // 9. Aldehyde → Acid (Full Oxidation)
        if (type === 'aldehyde') {
            const target = id('acid', c);
            if (find(target)) edges.push(reactionEdge(`ox-acid-${c}`, node.id, target, 'Oxidation', 'KMnO₄ / K₂Cr₂O₇', '#ef4444'));
        }

        // 10. Acid → Ester (Esterification)
        if (type === 'acid') {
            const target = id('ester', c + 1);
            if (find(target)) edges.push(reactionEdge(`ester-${c}`, node.id, target, 'Esterification', '+ CH₃OH / H₂SO₄', '#ec4899'));
        }

        // 11. Acid → Amide (Amidation)
        if (type === 'acid') {
            const target = id('amide', c);
            if (find(target)) edges.push(reactionEdge(`amide-${c}`, node.id, target, 'Amidation', '+ NH₃, heat', '#6366f1'));
        }

        // 12. Haloalkane (Br) → Amine (Ammonolysis)
        if (type === 'halobr') {
            const target = id('amine', c);
            if (find(target)) edges.push(reactionEdge(`amm-${c}`, node.id, target, 'Ammonolysis', 'excess NH₃', '#3b82f6'));
        }

        // 13. Haloalkane (Br) → Alcohol (Nucleophilic substitution / Hydrolysis)
        if (type === 'halobr') {
            const target = id('alcohol', c);
            if (find(target)) edges.push(reactionEdge(`hydrol-${c}`, node.id, target, 'Hydrolysis', 'NaOH(aq), reflux', '#ef4444'));
        }

        // 14. Haloalkane (Br) → Nitrile (Cyanide substitution)
        if (type === 'halobr') {
            const target = id('nitrile', c);
            if (find(target)) edges.push(reactionEdge(`cn-${c}`, node.id, target, '+ KCN', 'KCN, ethanol, reflux', '#06b6d4'));
        }

        // 15. Alkane → Haloalkane (Free-radical Substitution)
        if (type === 'alkane') {
            const tBr = id('halobr', c);
            const tCl = id('halocl', c);
            if (find(tBr)) edges.push(reactionEdge(`sub-br-${c}`, node.id, tBr, '+ Br₂', 'Br₂ / UV light', '#8d2d2d'));
            if (find(tCl)) edges.push(reactionEdge(`sub-cl-${c}`, node.id, tCl, '+ Cl₂', 'Cl₂ / UV light', '#4caf50'));
        }

        // 16. Nitrile → Acid (Hydrolysis)
        if (type === 'nitrile') {
            const target = id('acid', c);
            if (find(target)) edges.push(reactionEdge(`nitrile-acid-${c}`, node.id, target, 'Hydrolysis', 'H₂O / H⁺, reflux', '#ef4444'));
        }

        // 17. Nitrile → Amine (Reduction)
        if (type === 'nitrile') {
            const target = id('amine', c);
            if (find(target)) edges.push(reactionEdge(`nitrile-amine-${c}`, node.id, target, 'Reduction', 'LiAlH₄ / H₂', '#3b82f6'));
        }
    });

    // --- Aromatic Connections ---
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
};

// -----------------------------------------------------------------------------
// 5. Main Export
// -----------------------------------------------------------------------------
export const generateKnowledgeGraph = (carbonLimit = 6) => {
    // Generate all series
    const elements = generateElements();
    const backbones = generateBackbones(carbonLimit);

    const alkanes = generateAlkanes(carbonLimit);
    const alkenes = generateAlkenes(carbonLimit);
    const alkynes = generateAlkynes(carbonLimit);
    const aromatics = generateAromatics();

    const alcohols = generateAlcohols(carbonLimit);
    const ethers = generateEthers(carbonLimit);
    const aldehydes = generateAldehydes(carbonLimit);
    const ketones = generateKetones(carbonLimit);
    const acids = generateAcids(carbonLimit);
    const esters = generateEsters(carbonLimit);

    const amines = generateAmines(carbonLimit);
    const amides = generateAmides(carbonLimit);
    const nitriles = generateNitriles(carbonLimit);

    const bromo = generateHaloalkanes(carbonLimit, 'Br');
    const chloro = generateHaloalkanes(carbonLimit, 'Cl');

    const nodes = [
        ...elements, ...backbones,
        ...alkanes, ...alkenes, ...alkynes, ...aromatics,
        ...alcohols, ...ethers, ...aldehydes, ...ketones, ...acids, ...esters,
        ...amines, ...amides, ...nitriles,
        ...bromo, ...chloro
    ];

    const edges = generateReactions(nodes);

    return { nodes, edges };
};
