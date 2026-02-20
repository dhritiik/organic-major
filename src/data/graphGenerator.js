
// Helper to generate IDs
const id = (prefix, carbonCount) => `${prefix}-${carbonCount}`;

// IUPAC Prefixes
const prefixes = ['Meth', 'Eth', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct', 'Non', 'Dec'];
const sub = (n) => n.toString().replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);

// -----------------------------------------------------------------------------
// Layout Constants
// -----------------------------------------------------------------------------
const GRID_X = 280;
const GRID_Y = 220;
const START_Y = 0; // Top offset

// Column Assignments
const COLS = {
    AROMATIC: -5,
    NITRILE: -4,
    AMIDE: -3,
    AMINE: -2,
    HALO: -1,
    BACKBONE: 0,
    ALKANE: 1,
    ALKENE: 2,
    ALKYNE: 3,
    ALCOHOL: 4,
    ETHER: 4.8, // Offset
    ALDEHYDE: 6,
    KETONE: 7,
    ACID: 8,
    ESTER: 9
};

// -----------------------------------------------------------------------------
// 1. Element Generator
// -----------------------------------------------------------------------------
const generateElements = () => {
    // Elements float at the top
    const y = -600;
    return [
        { id: 'element-C', type: 'molecule', position: { x: 0, y: y }, data: { isElement: true, label: 'Carbon', formula: 'C', description: 'The backbone of life.', details: { atomicNumber: 6, mass: '12.011' } }, style: { backgroundColor: '#333', color: '#fff', width: 60, height: 60, borderRadius: '50%' } },
        { id: 'element-H', type: 'molecule', position: { x: -200, y: y }, data: { isElement: true, label: 'Hydrogen', formula: 'H', description: 'The fuel of the universe.', details: { atomicNumber: 1, mass: '1.008' } }, style: { backgroundColor: '#fff', color: '#000', width: 50, height: 50, borderRadius: '50%' } },
        { id: 'element-O', type: 'molecule', position: { x: 200, y: y }, data: { isElement: true, label: 'Oxygen', formula: 'O', description: 'The breath of life.', details: { atomicNumber: 8, mass: '15.999' } }, style: { backgroundColor: '#f44336', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-N', type: 'molecule', position: { x: 400, y: y }, data: { isElement: true, label: 'Nitrogen', formula: 'N', description: 'Essential for proteins.', details: { atomicNumber: 7, mass: '14.007' } }, style: { backgroundColor: '#2196f3', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-Cl', type: 'molecule', position: { x: -400, y: -200 }, data: { isElement: true, label: 'Chlorine', formula: 'Cl', description: 'Halogen gas.', details: { atomicNumber: 17, mass: '35.45' } }, style: { backgroundColor: '#4caf50', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
        { id: 'element-Br', type: 'molecule', position: { x: -600, y: -200 }, data: { isElement: true, label: 'Bromine', formula: 'Br', description: 'Liquid halogen.', details: { atomicNumber: 35, mass: '79.90' } }, style: { backgroundColor: '#8d2d2d', color: '#fff', width: 55, height: 55, borderRadius: '50%' } },
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
        position: { x: COLS.BACKBONE * GRID_X, y: c * GRID_Y + START_Y }, // Spaced out vertically
        data: {
            label: `${prefixes[i]}-`,
            formula: `C${sub(c)}`,
            description: `${c} Carbon Atom(s) Backbone.`,
            details: { series: 'Carbon Skeleton', count: c }
        },
        style: {
            backgroundColor: 'transport',
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
    // Alkanes are the primary derivative, placed close to backbone
    return {
        id: id('alkane', c), type: 'molecule', position: { x: COLS.ALKANE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'ane', formula: `C${sub(c)}H${sub(2 * c + 2)}`, description: 'Saturated hydrocarbon.', details: { series: 'Alkane', hybridization: 'sp³' } }
    };
});

const generateAlkenes = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    const isEthene = c === 2;
    return {
        id: id('alkene', c), type: 'molecule', position: { x: COLS.ALKENE * GRID_X, y: c * GRID_Y + START_Y },
        data: {
            label: prefixes[i + 1] + 'ene',
            formula: `C${sub(c)}H${sub(2 * c)}`,
            description: 'Unsaturated with double bond.',
            details: { series: 'Alkene', hybridization: 'sp²' },
            mechanismId: isEthene ? 'hydrohalogenation-ethene-bromoethane' : undefined
        }
    };
});

const generateAlkynes = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('alkyne', c), type: 'molecule', position: { x: COLS.ALKYNE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i + 1] + 'yne', formula: `C${sub(c)}H${sub(2 * c - 2)}`, description: 'Unsaturated with triple bond.', details: { series: 'Alkyne', hybridization: 'sp' } }
    };
});

// Aromatics (Benzene System) - Isolate in Far West
const generateAromatics = () => {
    const baseX = COLS.AROMATIC * GRID_X;
    const baseY = 3 * GRID_Y; // Start around C3 level
    return [
        { id: 'aromatic-benzene', type: 'molecule', position: { x: baseX, y: baseY }, data: { label: 'Benzene', formula: 'C₆H₆', description: 'Aromatic ring system.', details: { series: 'Aromatic' } } },
        { id: 'aromatic-toluene', type: 'molecule', position: { x: baseX, y: baseY + GRID_Y }, data: { label: 'Toluene', formula: 'C₇H₈', description: 'Methylbenzene.', details: { series: 'Aromatic' } } },
        { id: 'aromatic-phenol', type: 'molecule', position: { x: baseX - 150, y: baseY + GRID_Y }, data: { label: 'Phenol', formula: 'C₆H₅OH', description: 'Hydroxybenzene.', details: { series: 'Aromatic', functionalGroup: '-OH' } } },
        { id: 'aromatic-aniline', type: 'molecule', position: { x: baseX + 150, y: baseY + GRID_Y }, data: { label: 'Aniline', formula: 'C₆H₅NH₂', description: 'Aminobenzene.', details: { series: 'Aromatic', functionalGroup: '-NH₂' } } },
        { id: 'aromatic-benzoic', type: 'molecule', position: { x: baseX, y: baseY + 2 * GRID_Y }, data: { label: 'Benzoic Acid', formula: 'C₆H₅COOH', description: 'Carboxybenzene.', details: { series: 'Aromatic', functionalGroup: '-COOH' } } },
        { id: 'aromatic-nitro', type: 'molecule', position: { x: baseX + 150, y: baseY }, data: { label: 'Nitrobenzene', formula: 'C₆H₅NO₂', description: 'Precursor to aniline.', details: { series: 'Aromatic', functionalGroup: '-NO₂' } } },
    ];
};

// Oxygenated
const generateAlcohols = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('alcohol', c), type: 'molecule', position: { x: COLS.ALCOHOL * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anol', formula: `C${sub(c)}H${sub(2 * c + 1)}OH`, description: 'Primary alcohol.', details: { series: 'Alcohol', functionalGroup: '-OH' } }
    };
});

const generateAldehydes = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('aldehyde', c), type: 'molecule', position: { x: COLS.ALDEHYDE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anal', formula: `C${sub(c)}H${sub(2 * c)}O`, description: 'Terminal carbonyl.', details: { series: 'Aldehyde', functionalGroup: '-CHO' } }
    };
});

const generateKetones = (n) => Array.from({ length: n - 2 }, (_, i) => {
    const c = i + 3; // Starts at Propanone (C3)
    return {
        id: id('ketone', c), type: 'molecule', position: { x: COLS.KETONE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i + 2] + 'anone', formula: `C${sub(c)}H${sub(2 * c)}O`, description: 'Internal carbonyl.', details: { series: 'Ketone', functionalGroup: 'C=O' } }
    };
});

const generateAcids = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('acid', c), type: 'molecule', position: { x: COLS.ACID * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anoic Acid', formula: `C${sub(c - 1)}H${sub(2 * c - 1)}COOH`, description: 'Carboxylic acid.', details: { series: 'Carboxylic Acid', functionalGroup: '-COOH' } },
        style: { borderColor: '#ef4444' } // Red border for acids
    };
});

const generateEsters = (n) => Array.from({ length: n - 1 }, (_, i) => {
    // Starts at C2 (Methyl Methanoate)
    const c = i + 2;
    return {
        id: id('ester', c), type: 'molecule', position: { x: COLS.ESTER * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: 'Methyl ' + prefixes[i + 1] + 'anoate', formula: `C${sub(c)}H${sub(2 * c)}O₂`, description: 'Sweet smelling ester.', details: { series: 'Ester', functionalGroup: '-COO-' } },
        style: { borderColor: '#ec4899' } // Pink for esters
    };
});

const generateEthers = (n) => Array.from({ length: n - 1 }, (_, i) => {
    const c = i + 2;
    return {
        id: id('ether', c), type: 'molecule', position: { x: COLS.ETHER * GRID_X, y: c * GRID_Y + START_Y + (GRID_Y / 2) }, // Offset between rows
        data: { label: 'Methoxy' + prefixes[i] + 'ane', formula: `C${sub(c)}H${sub(2 * c + 2)}O`, description: 'Ethers are inert.', details: { series: 'Ether', functionalGroup: '-O-' } }
    };
});

// Nitrogenous
const generateAmines = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('amine', c), type: 'molecule', position: { x: COLS.AMINE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anamine', formula: `C${sub(c)}H${sub(2 * c + 1)}NH₂`, description: 'Primary amine.', details: { series: 'Amine', functionalGroup: '-NH₂' } },
        style: { borderColor: '#3b82f6' } // Blue for bases
    };
});

const generateAmides = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    return {
        id: id('amide', c), type: 'molecule', position: { x: COLS.AMIDE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anamide', formula: `C${sub(c)}H${sub(2 * c + 1)}NO`, description: 'Acid derivative.', details: { series: 'Amide', functionalGroup: '-CONH₂' } }
    };
});

const generateNitriles = (n) => Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    // Actually Methanenitrile is HCN. Let's start C2 (Ethanenitrile/Acetonitrile)
    return {
        id: id('nitrile', c), type: 'molecule', position: { x: COLS.NITRILE * GRID_X, y: c * GRID_Y + START_Y },
        data: { label: prefixes[i] + 'anenitrile', formula: `C${sub(c)}H${sub(2 * c - 1)}N`, description: 'Triple bond N.', details: { series: 'Nitrile', functionalGroup: '-CN' } }
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
        data: { label: `${hName}${prefixes[i].toLowerCase()}ane`, formula: `C${sub(c)}H${sub(2 * c + 1)}${halogen}`, description: 'Halogenated.', details: { series: 'Haloalkane', functionalGroup: '-' + halogen } }
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

    // --- Backbone Connections (Carbon Skeleton) ---
    nodes.forEach(node => {
        if (node.id.startsWith('backbone')) {
            const cStr = node.id.split('-')[1];
            const c = parseInt(cStr);
            edges.push({
                id: `c-backbone-${c}`,
                source: 'element-C',
                target: node.id,
                label: `${c}x`,
                style: { stroke: '#555', strokeWidth: 1, strokeDasharray: '5,5' },
                animated: false
            });

            // Connect Backbone to Alkane
            const alkane = id('alkane', c);
            if (find(alkane)) {
                edges.push({
                    id: `backbone-alkane-${c}`,
                    source: node.id,
                    target: alkane,
                    type: 'straight',
                    style: { stroke: '#fff', strokeWidth: 2, opacity: 0.3 }
                });
            }
        }
    });

    // --- Elemental Composition Edges ---
    const parseFormula = (formula) => {
        if (!formula) return {};
        const normal = formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)]);
        const counts = {};
        let match;
        const regex = /([A-Z][a-z]?)([\d]*)/g;
        while ((match = regex.exec(normal)) !== null) {
            const element = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            counts[element] = (counts[element] || 0) + count;
        }
        return counts;
    };

    nodes.forEach(node => {
        if (node.data.isElement || node.id.startsWith('backbone')) return;
        const counts = parseFormula(node.data.formula);
        Object.entries(counts).forEach(([element, count]) => {
            if (element === 'C') return; // Handled by backbone
            const sourceId = `element-${element}`;
            if (find(sourceId)) {
                edges.push({
                    id: `comp-${element}-${node.id}`,
                    source: sourceId,
                    target: node.id,
                    label: `${count}x`,
                    style: { stroke: getElementColor(element), strokeWidth: 1, strokeDasharray: '2,4', opacity: 0.15 },
                    animated: false
                });
            }
        });
    });

    // --- Reactions ---
    nodes.forEach(node => {
        const parts = node.id.split('-');
        if (parts.length < 2) return;
        const type = parts[0];
        const c = parseInt(parts[1]);
        if (isNaN(c)) return;

        // 1. Alkene -> Alkane (Hydrogenation)
        if (type === 'alkene') {
            const target = id('alkane', c);
            if (find(target)) edges.push({ id: `hyd-${c}`, source: node.id, target, label: 'Hydrogenation', data: { reagents: 'H₂/Ni' } });
        }

        // 2. Alkyne -> Alkene
        if (type === 'alkyne') {
            const target = id('alkene', c);
            if (find(target)) edges.push({ id: `hyd-alkyne-${c}`, source: node.id, target, label: 'Hydrogenation', data: { reagents: 'H₂/Lindlar' } });
        }

        // 3. Alkene -> Alcohol
        if (type === 'alkene') {
            const target = id('alcohol', c);
            if (find(target)) edges.push({ id: `hydration-${c}`, source: node.id, target, label: 'Hydration', data: { reagents: 'H₂O/H⁺' } });
        }

        // 4. Alcohol -> Aldehyde
        if (type === 'alcohol') {
            const target = id('aldehyde', c);
            if (find(target)) edges.push({ id: `ox-ald-${c}`, source: node.id, target, label: 'Oxidation', data: { reagents: 'PCC' } });
        }

        // 5. Alcohol -> Ketone
        if (type === 'alcohol' && c >= 3) {
            const target = id('ketone', c);
            if (find(target)) edges.push({ id: `ox-ket-${c}`, source: node.id, target, label: 'Oxidation', data: { reagents: 'K₂Cr₂O₇' } });
        }

        // 6. Aldehyde -> Acid
        if (type === 'aldehyde') {
            const target = id('acid', c);
            if (find(target)) edges.push({ id: `ox-acid-${c}`, source: node.id, target, label: 'Oxidation', data: { reagents: 'KMnO₄' } });
        }

        // 7. Acid -> Ester
        if (type === 'acid') {
            const target = id('ester', c + 1);
            if (find(target)) edges.push({ id: `ester-${c}`, source: node.id, target, label: 'Esterification', data: { reagents: 'CH₃OH/H⁺' } });
        }

        // 8. Acid -> Amide
        if (type === 'acid') {
            const target = id('amide', c);
            if (find(target)) edges.push({ id: `amide-${c}`, source: node.id, target, label: 'Amidation', data: { reagents: 'NH₃, Heat' } });
        }

        // 9. Haloalkane -> Amine
        if (type === 'halobr') {
            const target = id('amine', c);
            if (find(target)) edges.push({ id: `amm-${c}`, source: node.id, target, label: 'Ammonolysis', data: { reagents: 'NH₃ (exc)' } });
        }

        // 10. Alkane -> Haloalkane
        if (type === 'alkane') {
            const tBr = id('halobr', c);
            const tCl = id('halocl', c);
            if (find(tBr)) edges.push({ id: `sub-br-${c}`, source: node.id, target: tBr, label: 'Substitution', style: { strokeDasharray: '5,5' }, data: { reagents: 'Br₂/UV' } });
            if (find(tCl)) edges.push({ id: `sub-cl-${c}`, source: node.id, target: tCl, label: 'Substitution', style: { strokeDasharray: '5,5' }, data: { reagents: 'Cl₂/UV' } });
        }

        // 11. Alcohol -> Ether
        if (type === 'alcohol' && c >= 1) {
            const target = id('ether', c * 2);
            if (find(target)) edges.push({ id: `ether-${c}`, source: node.id, target, label: 'Dehydration', data: { reagents: 'H₂SO₄, 140°C' } });
        }
    });

    // --- Aromatic Connections ---
    if (find('aromatic-benzene') && find('aromatic-nitro'))
        edges.push({ id: 'nitration', source: 'aromatic-benzene', target: 'aromatic-nitro', label: 'Nitration', data: { reagents: 'HNO₃/H₂SO₄' } });
    if (find('aromatic-nitro') && find('aromatic-aniline'))
        edges.push({ id: 'reduction-nitro', source: 'aromatic-nitro', target: 'aromatic-aniline', label: 'Reduction', data: { reagents: 'Sn/HCl' } });
    if (find('aromatic-benzene') && find('aromatic-toluene'))
        edges.push({ id: 'alkylation', source: 'aromatic-benzene', target: 'aromatic-toluene', label: 'Alkylation', data: { reagents: 'CH₃Cl/AlCl₃' } });
    if (find('aromatic-toluene') && find('aromatic-benzoic'))
        edges.push({ id: 'ox-sidechain', source: 'aromatic-toluene', target: 'aromatic-benzoic', label: 'Oxidation', data: { reagents: 'KMnO₄' } });


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
