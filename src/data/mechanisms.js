// =============================================================================
// Reaction Mechanisms for OrganicFlow
// Each mechanism has step-by-step atom positions + bonds for animation
// =============================================================================

const makeStep = (id, description, atoms, bonds) => ({ id, description, atoms, bonds });

// Shared atom colors
const C = 'bg-gray-500';
const H = 'bg-white text-gray-900';
const O = 'bg-red-500 text-white';
const N = 'bg-blue-500 text-white';
const Br = 'bg-red-800 text-white';
const Cl = 'bg-green-600 text-white';
const CATION = 'bg-blue-600 text-white';

export const mechanisms = {

    // =========================================================================
    // 1. HYDROHALOGENATION: Ethene + HBr → Bromoethane
    // =========================================================================
    'hydrohalogenation-ethene-bromoethane': {
        title: 'Hydrohalogenation of Ethene',
        reaction: 'C₂H₄ + HBr → C₂H₅Br',
        steps: [
            makeStep('step1', 'Ethene (C₂H₄) has a C=C double bond. HBr approaches as an electrophile.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 350, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 350, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 420, y: 100, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 480, y: 60, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'hbr', to: 'br1' },
                ]
            ),
            makeStep('step2', 'The π electrons of C=C attack Hδ⁺. The H–Br bond breaks heterolytically, Br⁻ leaves.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 300, y: 200, color: CATION, scale: 1.1 },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 370, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 370, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br⁻', x: 460, y: 80, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'hbr', isForming: true },
                ]
            ),
            makeStep('step3', 'Carbocation Intermediate forms. Br⁻ nucleophile is attracted to the C⁺.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 320, y: 200, color: CATION, scale: 1.1 },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 390, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 390, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 200, y: 120, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br⁻', x: 400, y: 300, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'hbr' },
                ]
            ),
            makeStep('step4', 'Br⁻ attacks the C⁺ forming C–Br bond → Bromoethane (CH₃CH₂Br).',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 370, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 370, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 200, y: 120, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 300, y: 300, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'hbr' },
                    { from: 'c2', to: 'br1', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 2. HYDROGENATION: Alkene → Alkane (Ethene → Ethane)
    // =========================================================================
    'hydrogenation-ethene': {
        title: 'Catalytic Hydrogenation of Ethene',
        reaction: 'C₂H₄ + H₂ → C₂H₆ (Ni catalyst)',
        steps: [
            makeStep('step1', 'Ethene and H₂ molecule adsorb onto the Nickel catalyst surface.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 200, y: 80, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'h6', label: 'H', x: 260, y: 80, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'h5', to: 'h6' },
                ]
            ),
            makeStep('step2', 'H₂ bond breaks on catalyst surface. The two H atoms approach the C=C double bond.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 180, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'h6', label: 'H', x: 300, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                ]
            ),
            makeStep('step3', 'Both H atoms add across the double bond simultaneously (syn-addition). C=C becomes C–C.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 180, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'h6', label: 'H', x: 300, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'h5', isForming: true },
                    { from: 'c2', to: 'h6', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 3. HYDRATION: Ethene + H₂O → Ethanol
    // =========================================================================
    'hydration-ethene': {
        title: 'Acid-Catalysed Hydration of Ethene',
        reaction: 'C₂H₄ + H₂O → C₂H₅OH (H₃PO₄ catalyst)',
        steps: [
            makeStep('step1', 'Ethene and water molecule in the presence of an acid catalyst (H⁺).',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 440, y: 120, color: O },
                    { id: 'hw1', label: 'H', x: 490, y: 80, color: H, scale: 0.8 },
                    { id: 'hw2', label: 'H', x: 490, y: 160, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'o1', to: 'hw1' }, { from: 'o1', to: 'hw2' },
                ]
            ),
            makeStep('step2', 'H⁺ from acid attacks the π bond. A carbocation intermediate forms on the more substituted carbon.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 300, y: 200, color: CATION, scale: 1.1 },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 440, y: 200, color: O },
                    { id: 'hw1', label: 'H', x: 490, y: 160, color: H, scale: 0.8 },
                    { id: 'hw2', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'hw2', isForming: true },
                    { from: 'o1', to: 'hw1' },
                ]
            ),
            makeStep('step3', 'Water (nucleophile) attacks the carbocation. Then H⁺ is lost to regenerate catalyst → Ethanol.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 380, y: 280, color: O },
                    { id: 'hw1', label: 'H', x: 430, y: 310, color: H, scale: 0.8 },
                    { id: 'hw2', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'hw2' },
                    { from: 'c2', to: 'o1', isForming: true },
                    { from: 'o1', to: 'hw1' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 4. OXIDATION: Alcohol → Aldehyde (Ethanol → Ethanal)
    // =========================================================================
    'oxidation-alcohol-aldehyde': {
        title: 'Oxidation of Ethanol to Ethanal',
        reaction: 'C₂H₅OH → CH₃CHO (using PCC or K₂Cr₂O₇ distill)',
        steps: [
            makeStep('step1', 'Ethanol (CH₃CH₂OH) – the primary alcohol has an –OH group on the terminal carbon.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 380, y: 280, color: O },
                    { id: 'ho', label: 'H', x: 430, y: 310, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'o1' }, { from: 'o1', to: 'ho' },
                ]
            ),
            makeStep('step2', 'The oxidising agent removes 2H atoms (one from –OH, one from the same C). The C–O becomes C=O.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 460, y: 250, color: H, scale: 0.7 },
                    { id: 'o1', label: 'O', x: 380, y: 280, color: O },
                    { id: 'ho', label: 'H', x: 480, y: 310, color: H, scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' },
                    { from: 'c2', to: 'o1', type: 'double' },
                ]
            ),
            makeStep('step3', 'Product: Ethanal (CH₃CHO). The aldehyde must be distilled off immediately to prevent further oxidation.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 140, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 390, y: 200, color: H, scale: 0.8 },
                    { id: 'h5', label: '', x: 500, y: 300, color: 'bg-transparent', scale: 0 },
                    { id: 'o1', label: 'O', x: 320, y: 300, color: O },
                    { id: 'ho', label: '', x: 500, y: 350, color: 'bg-transparent', scale: 0 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' },
                    { from: 'c2', to: 'o1', type: 'double' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 5. OXIDATION: Aldehyde → Carboxylic Acid (Ethanal → Ethanoic Acid)
    // =========================================================================
    'oxidation-aldehyde-acid': {
        title: 'Oxidation of Ethanal to Ethanoic Acid',
        reaction: 'CH₃CHO → CH₃COOH (KMnO₄ or K₂Cr₂O₇)',
        steps: [
            makeStep('step1', 'Ethanal (CH₃CHO) – an aldehyde with a terminal C=O group.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 140, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 390, y: 200, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 320, y: 300, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' },
                    { from: 'c2', to: 'o1', type: 'double' },
                ]
            ),
            makeStep('step2', 'The oxidising agent [O] inserts an oxygen. The H shifts: C–H becomes C–OH. The C=O remains.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 140, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 460, y: 130, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 320, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 400, y: 150, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o2', isForming: true },
                    { from: 'o2', to: 'h4' },
                ]
            ),
            makeStep('step3', 'Product: Ethanoic Acid (CH₃COOH) – a carboxylic acid.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 140, y: 260, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 460, y: 150, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 320, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 400, y: 140, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o2' },
                    { from: 'o2', to: 'h4' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 6. ESTERIFICATION: Acid + Alcohol → Ester
    // =========================================================================
    'esterification': {
        title: 'Fischer Esterification',
        reaction: 'CH₃COOH + CH₃OH → CH₃COOCH₃ + H₂O',
        steps: [
            makeStep('step1', 'Ethanoic acid (CH₃COOH) and Methanol (CH₃OH) in acidic conditions.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 240, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 320, y: 140, color: O },
                    { id: 'ho', label: 'H', x: 380, y: 110, color: H, scale: 0.8 },
                    { id: 'c3', label: 'C', x: 440, y: 200, color: C },
                    { id: 'o3', label: 'O', x: 380, y: 250, color: O },
                    { id: 'h3', label: 'H', x: 420, y: 290, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o2' }, { from: 'o2', to: 'ho' },
                    { from: 'c3', to: 'o3' }, { from: 'o3', to: 'h3' },
                ]
            ),
            makeStep('step2', 'The –OH of the acid is displaced. Methanol oxygen attacks the carbonyl carbon forming a new C–O bond.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 240, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 340, y: 140, color: O },
                    { id: 'ho', label: 'H', x: 400, y: 110, color: H, scale: 0.8 },
                    { id: 'c3', label: 'C', x: 440, y: 200, color: C },
                    { id: 'o3', label: 'O', x: 350, y: 220, color: O },
                    { id: 'h3', label: 'H', x: 410, y: 330, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o3', isForming: true }, { from: 'o3', to: 'c3' },
                    { from: 'o2', to: 'ho' },
                ]
            ),
            makeStep('step3', 'H₂O leaves. Product: Methyl Ethanoate (CH₃COOCH₃) – an ester with a fruity smell.',
                [
                    { id: 'c1', label: 'C', x: 160, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 260, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 500, y: 100, color: 'bg-red-300 text-gray-900' },
                    { id: 'ho', label: 'H', x: 540, y: 70, color: H, scale: 0.7 },
                    { id: 'c3', label: 'C', x: 440, y: 200, color: C },
                    { id: 'o3', label: 'O', x: 350, y: 200, color: O },
                    { id: 'h3', label: 'H', x: 540, y: 130, color: H, scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o3' }, { from: 'o3', to: 'c3' },
                    { from: 'o2', to: 'ho' }, { from: 'o2', to: 'h3' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 7. FREE RADICAL SUBSTITUTION: Alkane + Halogen → Haloalkane
    // =========================================================================
    'free-radical-substitution': {
        title: 'Free Radical Substitution of Methane',
        reaction: 'CH₄ + Cl₂ → CH₃Cl + HCl (UV light)',
        steps: [
            makeStep('step1', 'INITIATION: UV light causes homolytic fission of the Cl–Cl bond into two Cl• radicals.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 150, y: 270, color: H, scale: 0.8 },
                    { id: 'cl1', label: 'Cl•', x: 380, y: 180, color: Cl, scale: 1.1 },
                    { id: 'cl2', label: 'Cl•', x: 450, y: 230, color: Cl, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'h4' },
                ]
            ),
            makeStep('step2', 'PROPAGATION 1: Cl• radical abstracts an H from CH₄ → CH₃• + HCl.',
                [
                    { id: 'c1', label: 'C•', x: 150, y: 200, color: CATION, scale: 1.05 },
                    { id: 'h1', label: 'H', x: 90, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 400, y: 250, color: H, scale: 0.8 },
                    { id: 'cl1', label: 'Cl', x: 440, y: 210, color: Cl, scale: 1 },
                    { id: 'cl2', label: 'Cl•', x: 460, y: 100, color: Cl, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cl1', to: 'h4' },
                ]
            ),
            makeStep('step3', 'PROPAGATION 2: CH₃• radical reacts with Cl₂ → CH₃Cl + Cl• (chain continues).',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 450, y: 250, color: H, scale: 0.7 },
                    { id: 'cl1', label: 'Cl', x: 300, y: 200, color: Cl, scale: 1 },
                    { id: 'cl2', label: 'Cl•', x: 460, y: 140, color: Cl, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c1', to: 'cl1', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 8. DEHYDRATION: Alcohol → Alkene (Ethanol → Ethene)
    // =========================================================================
    'dehydration-alcohol-alkene': {
        title: 'Dehydration of Ethanol',
        reaction: 'C₂H₅OH → C₂H₄ + H₂O (conc. H₂SO₄, 170°C)',
        steps: [
            makeStep('step1', 'Ethanol (C₂H₅OH) in the presence of concentrated sulfuric acid at 170°C.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 380, y: 280, color: O },
                    { id: 'ho', label: 'H', x: 430, y: 310, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'o1' }, { from: 'o1', to: 'ho' },
                ]
            ),
            makeStep('step2', 'Acid protonates the –OH group. H₂O leaves as a leaving group forming a carbocation.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 300, y: 200, color: CATION, scale: 1.1 },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 360, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 360, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 440, y: 300, color: 'bg-red-300 text-gray-900' },
                    { id: 'ho', label: 'H', x: 480, y: 270, color: H, scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'o1', to: 'ho' },
                ]
            ),
            makeStep('step3', 'A neighbouring H is lost forming a C=C double bond → Ethene + H₂O.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 140, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 470, y: 300, color: H, scale: 0.7 },
                    { id: 'h4', label: 'H', x: 380, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 380, y: 250, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 460, y: 270, color: 'bg-red-300 text-gray-900' },
                    { id: 'ho', label: 'H', x: 500, y: 240, color: H, scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'o1', to: 'ho' }, { from: 'o1', to: 'h3' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 9. AMIDATION: Acid + Amine → Amide
    // =========================================================================
    'amidation': {
        title: 'Amidation – Acid + NH₃',
        reaction: 'CH₃COOH + NH₃ → CH₃CONH₂ + H₂O',
        steps: [
            makeStep('step1', 'Ethanoic acid and ammonia (NH₃) are heated together.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 260, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 340, y: 140, color: O },
                    { id: 'ho', label: 'H', x: 400, y: 110, color: H, scale: 0.8 },
                    { id: 'n1', label: 'N', x: 450, y: 220, color: N },
                    { id: 'hn1', label: 'H', x: 500, y: 180, color: H, scale: 0.8 },
                    { id: 'hn2', label: 'H', x: 500, y: 260, color: H, scale: 0.8 },
                    { id: 'hn3', label: 'H', x: 450, y: 290, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'o2' }, { from: 'o2', to: 'ho' },
                    { from: 'n1', to: 'hn1' }, { from: 'n1', to: 'hn2' }, { from: 'n1', to: 'hn3' },
                ]
            ),
            makeStep('step2', 'NH₃ nitrogen attacks the carbonyl carbon. –OH departs as H₂O.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 260, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 460, y: 80, color: 'bg-red-300 text-gray-900' },
                    { id: 'ho', label: 'H', x: 500, y: 50, color: H, scale: 0.7 },
                    { id: 'n1', label: 'N', x: 360, y: 160, color: N },
                    { id: 'hn1', label: 'H', x: 410, y: 120, color: H, scale: 0.8 },
                    { id: 'hn2', label: 'H', x: 410, y: 200, color: H, scale: 0.8 },
                    { id: 'hn3', label: 'H', x: 500, y: 110, color: H, scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'n1', isForming: true },
                    { from: 'n1', to: 'hn1' }, { from: 'n1', to: 'hn2' },
                    { from: 'o2', to: 'ho' }, { from: 'o2', to: 'hn3' },
                ]
            ),
            makeStep('step3', 'Product: Ethanamide (CH₃CONH₂) – an amide. Water is released.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 290, y: 300, color: O },
                    { id: 'o2', label: 'O', x: 490, y: 80, color: 'bg-red-300 text-gray-900' },
                    { id: 'ho', label: 'H', x: 530, y: 50, color: H, scale: 0.6 },
                    { id: 'n1', label: 'N', x: 380, y: 160, color: N },
                    { id: 'hn1', label: 'H', x: 430, y: 120, color: H, scale: 0.8 },
                    { id: 'hn2', label: 'H', x: 430, y: 200, color: H, scale: 0.8 },
                    { id: 'hn3', label: 'H', x: 530, y: 100, color: H, scale: 0.6 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'n1' },
                    { from: 'n1', to: 'hn1' }, { from: 'n1', to: 'hn2' },
                    { from: 'o2', to: 'ho' }, { from: 'o2', to: 'hn3' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 10. NUCLEOPHILIC SUBSTITUTION: Haloalkane + NaOH → Alcohol
    // =========================================================================
    'nucleophilic-substitution-hydrolysis': {
        title: 'Nucleophilic Substitution (SN2) – Hydrolysis',
        reaction: 'CH₃Br + NaOH → CH₃OH + NaBr',
        steps: [
            makeStep('step1', 'Bromomethane (CH₃Br) and hydroxide ion (OH⁻) approach from opposite sides.',
                [
                    { id: 'c1', label: 'C', x: 250, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 250, y: 130, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 190, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 310, y: 240, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 380, y: 200, color: Br, scale: 1.2 },
                    { id: 'oh', label: 'OH⁻', x: 100, y: 200, color: O, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c1', to: 'br1' },
                ]
            ),
            makeStep('step2', 'OH⁻ attacks the δ⁺ carbon from behind. A pentacoordinate transition state forms. C–Br bond weakens.',
                [
                    { id: 'c1', label: 'C', x: 250, y: 200, color: CATION },
                    { id: 'h1', label: 'H', x: 250, y: 130, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 200, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 300, y: 250, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 380, y: 200, color: Br, scale: 1.2 },
                    { id: 'oh', label: 'OH', x: 150, y: 200, color: O, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c1', to: 'br1', isForming: true },
                    { from: 'oh', to: 'c1', isForming: true },
                ]
            ),
            makeStep('step3', 'Br⁻ leaves. Product: Methanol (CH₃OH). Inversion of configuration occurs.',
                [
                    { id: 'c1', label: 'C', x: 250, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 250, y: 130, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 310, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 190, y: 240, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br⁻', x: 460, y: 200, color: Br, scale: 1.2 },
                    { id: 'oh', label: 'OH', x: 150, y: 200, color: O },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'oh', to: 'c1' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 11. AMMONOLYSIS: Haloalkane + NH₃ → Amine
    // =========================================================================
    'ammonolysis': {
        title: 'Ammonolysis of Bromoethane',
        reaction: 'C₂H₅Br + NH₃ → C₂H₅NH₂ + HBr',
        steps: [
            makeStep('step1', 'Bromoethane and excess ammonia in a sealed tube under heat.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 350, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 350, y: 250, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 380, y: 280, color: Br, scale: 1.1 },
                    { id: 'n1', label: 'NH₃', x: 450, y: 160, color: N, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'br1' },
                ]
            ),
            makeStep('step2', 'NH₃ lone pair attacks the δ⁺ carbon. Br⁻ is displaced.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 350, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 350, y: 250, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br⁻', x: 460, y: 300, color: Br, scale: 1.1 },
                    { id: 'n1', label: 'NH₂', x: 380, y: 180, color: N, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'n1', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Ethylamine (C₂H₅NH₂) – a primary amine.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 350, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 350, y: 250, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br⁻', x: 500, y: 320, color: Br, scale: 1 },
                    { id: 'n1', label: 'NH₂', x: 370, y: 280, color: N },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' }, { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'n1' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 12. NITRATION of Benzene
    // =========================================================================
    'nitration-benzene': {
        title: 'Electrophilic Aromatic Substitution – Nitration',
        reaction: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O (H₂SO₄ catalyst)',
        steps: [
            makeStep('step1', 'Generation of the electrophile: HNO₃ + H₂SO₄ → NO₂⁺ (nitronium ion) + HSO₄⁻ + H₂O',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NO₂⁺', x: 270, y: 50, color: 'bg-orange-500 text-white', scale: 1.2 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                ]
            ),
            makeStep('step2', 'NO₂⁺ attacks the π electrons of benzene ring. Arenium ion intermediate forms.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C⁺', x: 270, y: 130, color: CATION },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NO₂', x: 270, y: 70, color: 'bg-orange-500 text-white', scale: 1.1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'no2', isForming: true },
                ]
            ),
            makeStep('step3', 'H⁺ is lost from the ring restoring aromaticity → Nitrobenzene (C₆H₅NO₂).',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NO₂', x: 270, y: 60, color: 'bg-orange-500 text-white', scale: 1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'no2' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 13. REDUCTION: Alkyne → Alkene (Lindlar's catalyst)
    // =========================================================================
    'hydrogenation-alkyne-alkene': {
        title: 'Partial Hydrogenation of Ethyne (Lindlar)',
        reaction: 'C₂H₂ + H₂ → C₂H₄ (Lindlar catalyst, cis-product)',
        steps: [
            makeStep('step1', 'Ethyne (C₂H₂) with a C≡C triple bond and H₂ on Lindlar catalyst surface.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 200, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 380, y: 200, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 230, y: 100, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 290, y: 100, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c2', to: 'h2' },
                    { from: 'h3', to: 'h4' },
                ]
            ),
            makeStep('step2', 'One equivalent of H₂ adds across the triple bond (syn-addition). C≡C becomes C=C.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 250, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 380, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 320, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c2', to: 'h2' },
                    { from: 'c1', to: 'h3', isForming: true },
                    { from: 'c2', to: 'h4', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: cis-Ethene (C₂H₄). Lindlar catalyst poisons further reduction, stopping at the alkene.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 320, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 140, y: 250, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 380, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 320, y: 130, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c2', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c2', to: 'h4' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 14. OXIDATION: Alcohol → Ketone (Propan-2-ol → Propanone)
    // =========================================================================
    'oxidation-alcohol-ketone': {
        title: 'Oxidation of Propan-2-ol to Propanone',
        reaction: 'CH₃CH(OH)CH₃ → CH₃COCH₃ (K₂Cr₂O₇/H⁺)',
        steps: [
            makeStep('step1', 'Propan-2-ol – a secondary alcohol with –OH on the middle carbon.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 380, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 260, y: 300, color: O },
                    { id: 'ho', label: 'H', x: 310, y: 340, color: H, scale: 0.8 },
                    { id: 'hc', label: 'H', x: 260, y: 130, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c2', to: 'o1' }, { from: 'o1', to: 'ho' },
                    { from: 'c2', to: 'hc' },
                ]
            ),
            makeStep('step2', 'Oxidising agent removes 2H. The C–O single bond becomes C=O double bond.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 380, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 260, y: 300, color: O },
                    { id: 'ho', label: '', x: 500, y: 340, color: 'bg-transparent', scale: 0 },
                    { id: 'hc', label: '', x: 500, y: 130, color: 'bg-transparent', scale: 0 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c2', to: 'o1', type: 'double' },
                ]
            ),
            makeStep('step3', 'Product: Propanone (CH₃COCH₃) – Acetone, the simplest ketone.',
                [
                    { id: 'c1', label: 'CH₃', x: 160, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 280, y: 200, color: C },
                    { id: 'c3', label: 'CH₃', x: 400, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 280, y: 300, color: O },
                    { id: 'ho', label: '', x: 500, y: 340, color: 'bg-transparent', scale: 0 },
                    { id: 'hc', label: '', x: 500, y: 130, color: 'bg-transparent', scale: 0 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c2', to: 'o1', type: 'double' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 15. DEHYDRATION: Alcohol → Ether (Ethanol → Diethyl ether)
    // =========================================================================
    'dehydration-alcohol-ether': {
        title: 'Intermolecular Dehydration – Ether Formation',
        reaction: '2 C₂H₅OH → C₂H₅OC₂H₅ + H₂O (H₂SO₄, 140°C)',
        steps: [
            makeStep('step1', 'Two molecules of ethanol in the presence of conc. H₂SO₄ at 140°C.',
                [
                    { id: 'c1', label: 'C', x: 120, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 210, y: 200, color: C },
                    { id: 'o1', label: 'OH', x: 280, y: 200, color: O },
                    { id: 'c3', label: 'C', x: 400, y: 200, color: C },
                    { id: 'c4', label: 'C', x: 490, y: 200, color: C },
                    { id: 'o2', label: 'OH', x: 340, y: 200, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1' },
                    { from: 'c3', to: 'c4' }, { from: 'c3', to: 'o2' },
                ]
            ),
            makeStep('step2', 'Condensation: one –OH loses H, the other loses –OH altogether. A C–O–C linkage forms.',
                [
                    { id: 'c1', label: 'C', x: 120, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 210, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 300, y: 200, color: O },
                    { id: 'c3', label: 'C', x: 390, y: 200, color: C },
                    { id: 'c4', label: 'C', x: 480, y: 200, color: C },
                    { id: 'o2', label: 'H₂O', x: 300, y: 310, color: 'bg-red-300 text-gray-900', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1', isForming: true },
                    { from: 'o1', to: 'c3', isForming: true }, { from: 'c3', to: 'c4' },
                ]
            ),
            makeStep('step3', 'Product: Ethoxyethane (Diethyl Ether, C₂H₅OC₂H₅). Water is eliminated.',
                [
                    { id: 'c1', label: 'CH₃', x: 100, y: 200, color: C },
                    { id: 'c2', label: 'CH₂', x: 200, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 300, y: 200, color: O },
                    { id: 'c3', label: 'CH₂', x: 400, y: 200, color: C },
                    { id: 'c4', label: 'CH₃', x: 500, y: 200, color: C },
                    { id: 'o2', label: 'H₂O', x: 300, y: 340, color: 'bg-red-300 text-gray-900', scale: 0.7 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1' },
                    { from: 'o1', to: 'c3' }, { from: 'c3', to: 'c4' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 16. Friedel-Crafts Alkylation: Benzene → Toluene
    // =========================================================================
    'friedel-crafts-alkylation': {
        title: 'Friedel-Crafts Alkylation',
        reaction: 'C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl (AlCl₃)',
        steps: [
            makeStep('step1', 'Benzene ring and CH₃Cl with AlCl₃ catalyst. AlCl₃ polarises the C–Cl bond.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'me', label: 'CH₃⁺', x: 270, y: 50, color: CATION, scale: 1.1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                ]
            ),
            makeStep('step2', 'CH₃⁺ electrophile attacks the benzene π system. H⁺ is lost restoring aromaticity.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'me', label: 'CH₃', x: 270, y: 70, color: C },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'me', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Toluene (Methylbenzene, C₆H₅CH₃).',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'me', label: 'CH₃', x: 270, y: 65, color: C },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'me' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 17. REDUCTION: Nitrobenzene → Aniline
    // =========================================================================
    'reduction-nitrobenzene-aniline': {
        title: 'Reduction of Nitrobenzene to Aniline',
        reaction: 'C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O (Sn/HCl)',
        steps: [
            makeStep('step1', 'Nitrobenzene (C₆H₅NO₂) with an –NO₂ group on the benzene ring.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NO₂', x: 270, y: 60, color: 'bg-orange-500 text-white', scale: 1.1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'no2' },
                ]
            ),
            makeStep('step2', 'Sn/HCl provides [H]. –NO₂ is reduced through intermediate stages: –NO₂ → –NO → –NHOH → –NH₂.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NH₂', x: 270, y: 60, color: N, scale: 1.1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'no2', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Aniline (C₆H₅NH₂) – an aromatic amine. NaOH is added to liberate the free amine.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 220, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 250, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 220, color: C },
                    { id: 'no2', label: 'NH₂', x: 270, y: 60, color: N },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'no2' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 18. OXIDATION: Toluene → Benzoic Acid
    // =========================================================================
    'oxidation-toluene-benzoic': {
        title: 'Side-Chain Oxidation of Toluene',
        reaction: 'C₆H₅CH₃ → C₆H₅COOH (KMnO₄, reflux)',
        steps: [
            makeStep('step1', 'Toluene (C₆H₅CH₃) – benzene ring with a methyl substituent.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 170, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 140, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 170, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'me', label: 'CH₃', x: 270, y: 70, color: C },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'me' },
                ]
            ),
            makeStep('step2', 'KMnO₄ oxidises the –CH₃ side chain to –COOH. The ring is unaffected.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 170, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 140, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 170, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'me', label: 'COOH', x: 270, y: 60, color: O },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'me', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Benzoic Acid (C₆H₅COOH). KMnO₄ turns from purple to colourless (MnO₄⁻ → Mn²⁺).',
                [
                    { id: 'b1', label: 'C', x: 200, y: 170, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 140, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 170, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'me', label: 'COOH', x: 270, y: 58, color: O },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'me' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 19. CYANIDE SUBSTITUTION: CH₃Br + KCN → CH₃CN + KBr
    // =========================================================================
    'cyanide-substitution': {
        title: 'Nucleophilic Substitution with Cyanide',
        reaction: 'CH₃Br + KCN → CH₃CN + KBr',
        steps: [
            makeStep('step1', 'Bromomethane (CH₃Br) – the C–Br bond is polar. CN⁻ is a strong nucleophile.',
                [
                    { id: 'c1', label: 'C', x: 220, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 160, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 160, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 220, y: 130, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br', x: 340, y: 200, color: Br, scale: 1.2 },
                    { id: 'cn', label: 'CN⁻', x: 80, y: 200, color: N, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'br' },
                ]
            ),
            makeStep('step2', 'SN2: CN⁻ attacks the δ⁺ carbon from behind. C–Br bond breaks heterolytically.',
                [
                    { id: 'c1', label: 'C', x: 250, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 250, y: 140, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 210, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 290, y: 240, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br⁻', x: 410, y: 200, color: Br, scale: 1.2 },
                    { id: 'cn', label: 'CN', x: 130, y: 200, color: N, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cn', to: 'c1', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: CH₃CN (ethanenitrile) formed. Br⁻ leaves. Carbon chain extended by 1!',
                [
                    { id: 'c1', label: 'C', x: 250, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 250, y: 130, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 200, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 300, y: 250, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br⁻', x: 460, y: 200, color: Br, scale: 1 },
                    { id: 'cn', label: 'C≡N', x: 140, y: 200, color: N, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cn', to: 'c1' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 20. NITRILE HYDROLYSIS: CH₃CN + H₂O → CH₃COOH + NH₃
    // =========================================================================
    'nitrile-hydrolysis': {
        title: 'Acid Hydrolysis of a Nitrile',
        reaction: 'CH₃CN + 2H₂O + H⁺ → CH₃COOH + NH₄⁺',
        steps: [
            makeStep('step1', 'Ethanenitrile (CH₃CN) refluxed with dilute acid (H₂O/H⁺).',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'N', x: 380, y: 200, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'w1', label: 'H₂O', x: 300, y: 80, color: 'bg-blue-400 text-white', scale: 0.9 },
                    { id: 'w2', label: 'H₂O', x: 340, y: 310, color: 'bg-blue-400 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'n1', type: 'triple' },
                ]
            ),
            makeStep('step2', 'Water attacks the C≡N bond. The triple bond breaks down step by step.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'NH', x: 380, y: 200, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'w1', label: 'OH', x: 300, y: 110, color: O, scale: 0.9 },
                    { id: 'w2', label: 'H₂O', x: 340, y: 310, color: 'bg-blue-400 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'n1', type: 'double' },
                    { from: 'c2', to: 'w1', isForming: true },
                ]
            ),
            makeStep('step3', 'Further hydrolysis: amide intermediate forms, then breaks to acid + NH₃.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'NH₂', x: 380, y: 260, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'w1', label: 'O', x: 300, y: 120, color: O },
                    { id: 'w2', label: 'H₂O', x: 340, y: 330, color: 'bg-blue-400 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'w1', type: 'double' },
                    { from: 'c2', to: 'n1' },
                ]
            ),
            makeStep('step4', 'Product: CH₃COOH (ethanoic acid) + NH₃. The C≡N is fully hydrolysed to –COOH.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'NH₃', x: 440, y: 280, color: N, scale: 1.1 },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'w1', label: 'O', x: 300, y: 120, color: O },
                    { id: 'w2', label: 'OH', x: 380, y: 200, color: O },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'w1', type: 'double' },
                    { from: 'c2', to: 'w2' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 21. NITRILE REDUCTION: CH₃CN + 4[H] → CH₃CH₂NH₂
    // =========================================================================
    'nitrile-reduction': {
        title: 'Reduction of a Nitrile to an Amine',
        reaction: 'CH₃CN + 4[H] → CH₃CH₂NH₂ (LiAlH₄ in dry ether)',
        steps: [
            makeStep('step1', 'Ethanenitrile (CH₃C≡N). LiAlH₄ provides hydride ions [H⁻] as the reducing agent.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'N', x: 380, y: 200, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'ha', label: '[H]', x: 300, y: 80, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: '[H]', x: 360, y: 80, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hc', label: '[H]', x: 360, y: 300, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hd', label: '[H]', x: 420, y: 300, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'n1', type: 'triple' },
                ]
            ),
            makeStep('step2', '[H] atoms add across the C≡N triple bond, reducing it step by step.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'N', x: 380, y: 200, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 300, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: 'H', x: 300, y: 270, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hc', label: 'H', x: 380, y: 140, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hd', label: 'H', x: 430, y: 250, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'n1', type: 'single' },
                    { from: 'c2', to: 'ha', isForming: true },
                    { from: 'c2', to: 'hb', isForming: true },
                    { from: 'n1', to: 'hc', isForming: true },
                    { from: 'n1', to: 'hd', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: CH₃CH₂NH₂ (ethylamine). C≡N fully reduced to C–NH₂. Chain length preserved.',
                [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: C },
                    { id: 'n1', label: 'N', x: 390, y: 200, color: N },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 200, y: 130, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 300, y: 130, color: H, scale: 0.8 },
                    { id: 'hb', label: 'H', x: 300, y: 270, color: H, scale: 0.8 },
                    { id: 'hc', label: 'H', x: 430, y: 150, color: H, scale: 0.8 },
                    { id: 'hd', label: 'H', x: 430, y: 250, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'c2' },
                    { from: 'c2', to: 'n1' },
                    { from: 'c2', to: 'ha' }, { from: 'c2', to: 'hb' },
                    { from: 'n1', to: 'hc' }, { from: 'n1', to: 'hd' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 22. DOW PROCESS: Benzene → Phenol
    // =========================================================================
    'dow-process-phenol': {
        title: 'Dow Process: Phenol Synthesis',
        reaction: 'C₆H₅Cl + NaOH → C₆H₅OH + NaCl (300°C, 200 atm)',
        steps: [
            makeStep('step1', 'Chlorobenzene is produced first (Benzene + Cl₂/AlCl₃). Then treated with NaOH.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'cl', label: 'Cl', x: 270, y: 55, color: Cl, scale: 1.1 },
                    { id: 'na', label: 'NaOH', x: 450, y: 180, color: 'bg-amber-500 text-white', scale: 1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'cl' },
                ]
            ),
            makeStep('step2', 'At 300°C and 200 atm, OH⁻ displaces Cl⁻ via nucleophilic aromatic substitution.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'cl', label: 'Cl⁻', x: 180, y: 60, color: Cl, scale: 1 },
                    { id: 'na', label: 'OH', x: 270, y: 55, color: O, scale: 1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'na', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Phenol (C₆H₅OH) + NaCl. Acidify sodium phenoxide to get phenol.',
                [
                    { id: 'b1', label: 'C', x: 200, y: 160, color: C },
                    { id: 'b2', label: 'C', x: 270, y: 130, color: C },
                    { id: 'b3', label: 'C', x: 340, y: 160, color: C },
                    { id: 'b4', label: 'C', x: 340, y: 230, color: C },
                    { id: 'b5', label: 'C', x: 270, y: 260, color: C },
                    { id: 'b6', label: 'C', x: 200, y: 230, color: C },
                    { id: 'cl', label: 'NaCl', x: 140, y: 50, color: Cl, scale: 0.9 },
                    { id: 'na', label: 'OH', x: 270, y: 55, color: O, scale: 1 },
                ],
                [
                    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
                    { from: 'b3', to: 'b4' }, { from: 'b4', to: 'b5' },
                    { from: 'b5', to: 'b6' }, { from: 'b6', to: 'b1' },
                    { from: 'b2', to: 'na' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 23. FREE RADICAL BROMINATION: CH₄ + Br₂ → CH₃Br + HBr
    // =========================================================================
    'free-radical-bromination': {
        title: 'Free Radical Bromination of Methane',
        reaction: 'CH₄ + Br₂ → CH₃Br + HBr (UV light)',
        steps: [
            makeStep('step1', 'INITIATION: UV light causes homolytic fission of Br–Br → two Br• radicals.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 150, y: 270, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br•', x: 380, y: 180, color: Br, scale: 1.1 },
                    { id: 'br2', label: 'Br•', x: 450, y: 230, color: Br, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'h4' },
                ]
            ),
            makeStep('step2', 'PROPAGATION 1: Br• abstracts H from CH₄ → CH₃• + HBr. Slower than Cl• (less reactive).',
                [
                    { id: 'c1', label: 'C•', x: 150, y: 200, color: CATION, scale: 1.05 },
                    { id: 'h1', label: 'H', x: 90, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 400, y: 250, color: H, scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 440, y: 210, color: Br, scale: 1 },
                    { id: 'br2', label: 'Br•', x: 460, y: 100, color: Br, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'br1', to: 'h4' },
                ]
            ),
            makeStep('step3', 'PROPAGATION 2: CH₃• + Br₂ → CH₃Br + Br• (chain continues). More selective than Cl₂.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 120, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 120, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 450, y: 250, color: H, scale: 0.7 },
                    { id: 'br1', label: 'Br', x: 300, y: 200, color: Br, scale: 1 },
                    { id: 'br2', label: 'Br•', x: 460, y: 140, color: Br, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c1', to: 'br1', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 24. HYDROGENATION OF PROPENE: CH₃CH=CH₂ + H₂ → CH₃CH₂CH₃
    // =========================================================================
    'hydrogenation-propene': {
        title: 'Catalytic Hydrogenation of Propene',
        reaction: 'CH₃CH=CH₂ + H₂ → CH₃CH₂CH₃ (Ni, 150°C)',
        steps: [
            makeStep('step1', 'Propene (3-carbon alkene) and H₂ adsorb onto the Ni catalyst surface.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 220, y: 90, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: 'H', x: 290, y: 90, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'ha', to: 'hb' },
                ]
            ),
            makeStep('step2', 'H–H bond breaks on catalyst. Both H atoms add across C=C (syn-addition).',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 260, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: 'H', x: 370, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c2', to: 'ha', isForming: true },
                    { from: 'c3', to: 'hb', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Propane (CH₃CH₂CH₃). Fully saturated – no more double bonds.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 260, y: 130, color: H, scale: 0.8 },
                    { id: 'hb', label: 'H', x: 370, y: 130, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c2', to: 'ha' }, { from: 'c3', to: 'hb' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 25. HYDRATION OF PROPENE: CH₃CH=CH₂ + H₂O → CH₃CH(OH)CH₃
    // =========================================================================
    'hydration-propene': {
        title: 'Hydration of Propene (Markovnikov)',
        reaction: 'CH₃CH=CH₂ + H₂O → CH₃CH(OH)CH₃ (H₃PO₄ cat.)',
        steps: [
            makeStep('step1', 'Propene has a C=C double bond. H⁺ from H₃PO₄ approaches as electrophile.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hp', label: 'H⁺', x: 370, y: 100, color: 'bg-yellow-400 text-gray-900', scale: 0.9 },
                    { id: 'oh', label: 'OH⁻', x: 200, y: 310, color: O, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                ]
            ),
            makeStep('step2', 'Markovnikov\'s Rule: H⁺ adds to the terminal C (fewer substituents). Carbocation on C2.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 260, y: 200, color: CATION, scale: 1.1 },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hp', label: 'H', x: 370, y: 130, color: H, scale: 0.8 },
                    { id: 'oh', label: 'OH⁻', x: 260, y: 310, color: O, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c3', to: 'hp', isForming: true },
                ]
            ),
            makeStep('step3', 'OH⁻ attacks C⁺ → Propan-2-ol. The –OH is on the middle carbon (secondary alcohol).',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hp', label: 'H', x: 370, y: 130, color: H, scale: 0.8 },
                    { id: 'oh', label: 'OH', x: 260, y: 290, color: O, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c3', to: 'hp' },
                    { from: 'c2', to: 'oh', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 26. HYDROHALOGENATION OF PROPENE: CH₃CH=CH₂ + HBr → CH₃CHBrCH₃
    // =========================================================================
    'hydrohalogenation-propene': {
        title: 'Hydrohalogenation of Propene (Markovnikov)',
        reaction: 'CH₃CH=CH₂ + HBr → CH₃CHBrCH₃',
        steps: [
            makeStep('step1', 'Propene (CH₃CH=CH₂) with HBr approaching. π electrons attack H(δ⁺).',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 300, y: 90, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br', x: 360, y: 60, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'hbr', to: 'br' },
                ]
            ),
            makeStep('step2', 'Markovnikov: H adds to terminal C₃ (more H\'s). 2° carbocation on C₂ is more stable.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C⁺', x: 260, y: 200, color: CATION, scale: 1.1 },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 370, y: 130, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br⁻', x: 260, y: 310, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c3', to: 'hbr', isForming: true },
                ]
            ),
            makeStep('step3', 'Br⁻ attacks C⁺ → 2-Bromopropane. Major product follows Markovnikov\'s rule.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                    { id: 'hbr', label: 'H', x: 370, y: 130, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br', x: 260, y: 300, color: Br, scale: 1.2 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                    { from: 'c3', to: 'hbr' },
                    { from: 'c2', to: 'br', isForming: true },
                ]
            ),
        ]
    },

    // =========================================================================
    // 27. OXIDATION: Propanol → Propanal
    // =========================================================================
    'oxidation-propanol-propanal': {
        title: 'Oxidation of Propan-1-ol to Propanal',
        reaction: 'CH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O',
        steps: [
            makeStep('step1', 'Propan-1-ol: primary alcohol. Acidified K₂Cr₂O₇ is the oxidising agent. Distil immediately!',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 155, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 340, y: 130, color: H, scale: 0.8 },
                    { id: 'oh', label: 'OH', x: 420, y: 200, color: O },
                    { id: 'ox', label: '[O]', x: 340, y: 310, color: 'bg-orange-500 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c3', to: 'h6' },
                    { from: 'c3', to: 'oh' },
                ]
            ),
            makeStep('step2', 'Two H atoms removed (one from –OH, one from C). C–O becomes C=O.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 155, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H₂O', x: 430, y: 310, color: 'bg-blue-400 text-white', scale: 0.8 },
                    { id: 'oh', label: 'O', x: 420, y: 200, color: O },
                    { id: 'ox', label: 'Cr³⁺', x: 340, y: 310, color: 'bg-green-600 text-white', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c3', to: 'oh', type: 'double', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Propanal (CH₃CH₂CHO). Distil immediately to prevent further oxidation to acid.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 155, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 340, y: 125, color: H, scale: 0.8 },
                    { id: 'oh', label: 'O', x: 420, y: 200, color: O },
                    { id: 'ox', label: 'H₂O', x: 430, y: 310, color: 'bg-blue-400 text-white', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c3', to: 'h6' },
                    { from: 'c3', to: 'oh', type: 'double' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 28. DEHYDRATION: Propanol → Propene
    // =========================================================================
    'dehydration-propanol-propene': {
        title: 'Dehydration of Propan-1-ol',
        reaction: 'CH₃CH₂CH₂OH → CH₃CH=CH₂ + H₂O (H₂SO₄, 170°C)',
        steps: [
            makeStep('step1', 'Propan-1-ol heated with conc. H₂SO₄ at 170°C. Acid protonates the –OH group.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 340, y: 130, color: H, scale: 0.8 },
                    { id: 'oh', label: 'OH', x: 420, y: 200, color: O },
                    { id: 'hp', label: 'H⁺', x: 440, y: 260, color: 'bg-yellow-400 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c3', to: 'h6' }, { from: 'c3', to: 'oh' },
                ]
            ),
            makeStep('step2', 'H₂O leaves (good leaving group). Neighbouring C–H breaks → C=C double bond forms.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 340, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 340, y: 270, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H₂O', x: 430, y: 290, color: 'bg-blue-400 text-white', scale: 0.9 },
                    { id: 'oh', label: 'H₂O', x: 430, y: 200, color: 'bg-blue-400 text-white', scale: 0.9 },
                    { id: 'hp', label: 'H⁺', x: 460, y: 150, color: 'bg-yellow-400 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double', isForming: true },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                ]
            ),
            makeStep('step3', 'Product: Propene (CH₃CH=CH₂) + H₂O. H₂SO₄ regenerated (catalyst).',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 250, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 360, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 90, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 410, y: 160, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 410, y: 240, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H₂O', x: 460, y: 300, color: 'bg-blue-400 text-white', scale: 0.9 },
                    { id: 'oh', label: '', x: 460, y: 200, color: 'bg-transparent', scale: 0.1 },
                    { id: 'hp', label: '', x: 460, y: 150, color: 'bg-transparent', scale: 0.1 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' }, { from: 'c3', to: 'h5' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 29. OXIDATION: Propanal → Propanoic Acid
    // =========================================================================
    'oxidation-propanal-propanoic': {
        title: 'Oxidation of Propanal to Propanoic Acid',
        reaction: 'CH₃CH₂CHO + [O] → CH₃CH₂COOH',
        steps: [
            makeStep('step1', 'Propanal (CH₃CH₂CHO) treated with KMnO₄ or K₂Cr₂O₇ (reflux).',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h7', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h8', label: 'H', x: 340, y: 130, color: H, scale: 0.8 },
                    { id: 'o1', label: 'O', x: 420, y: 200, color: O },
                    { id: 'ox', label: '[O]', x: 380, y: 310, color: 'bg-orange-500 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'h4' }, { from: 'c1', to: 'h5' },
                    { from: 'c2', to: 'h6' }, { from: 'c2', to: 'h7' },
                    { from: 'c3', to: 'h8' },
                    { from: 'c3', to: 'o1', type: 'double' },
                ]
            ),
            makeStep('step2', 'Oxygen inserts: the aldehyde H is replaced by –OH. C=O remains.',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h7', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h8', label: 'OH', x: 340, y: 290, color: O },
                    { id: 'o1', label: 'O', x: 420, y: 200, color: O },
                    { id: 'ox', label: 'Cr³⁺', x: 430, y: 310, color: 'bg-green-600 text-white', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'h4' }, { from: 'c1', to: 'h5' },
                    { from: 'c2', to: 'h6' }, { from: 'c2', to: 'h7' },
                    { from: 'c3', to: 'o1', type: 'double' },
                    { from: 'c3', to: 'h8', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Propanoic acid (CH₃CH₂COOH). Orange Cr₂O₇²⁻ turns green (Cr³⁺).',
                [
                    { id: 'c1', label: 'C', x: 140, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 240, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 340, y: 200, color: C },
                    { id: 'h3', label: 'H', x: 140, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 90, y: 160, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 90, y: 245, color: H, scale: 0.8 },
                    { id: 'h6', label: 'H', x: 240, y: 130, color: H, scale: 0.8 },
                    { id: 'h7', label: 'H', x: 240, y: 270, color: H, scale: 0.8 },
                    { id: 'h8', label: 'OH', x: 340, y: 290, color: O },
                    { id: 'o1', label: 'O', x: 420, y: 200, color: O },
                    { id: 'ox', label: '', x: 430, y: 310, color: 'bg-transparent', scale: 0.1 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3' },
                    { from: 'c1', to: 'h3' }, { from: 'c1', to: 'h4' }, { from: 'c1', to: 'h5' },
                    { from: 'c2', to: 'h6' }, { from: 'c2', to: 'h7' },
                    { from: 'c3', to: 'o1', type: 'double' },
                    { from: 'c3', to: 'h8' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 30. HYDROLYSIS: Bromoethane + NaOH → Ethanol
    // =========================================================================
    'hydrolysis-bromoethane': {
        title: 'Nucleophilic Substitution: Bromoethane Hydrolysis',
        reaction: 'CH₃CH₂Br + NaOH → CH₃CH₂OH + NaBr',
        steps: [
            makeStep('step1', 'Bromoethane: C–Br bond is polar (Cδ⁺–Brδ⁻). OH⁻ is the nucleophile.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 290, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 290, y: 270, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br', x: 400, y: 200, color: Br, scale: 1.2 },
                    { id: 'oh', label: 'OH⁻', x: 60, y: 200, color: O, scale: 1.1 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'br' },
                ]
            ),
            makeStep('step2', 'SN2: OH⁻ attacks C₂ from behind. Br⁻ leaves simultaneously (back-side attack).',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 290, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 290, y: 270, color: H, scale: 0.8 },
                    { id: 'br', label: 'Br⁻', x: 440, y: 200, color: Br, scale: 1.1 },
                    { id: 'oh', label: 'OH', x: 400, y: 200, color: O, scale: 1 },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'oh', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Ethanol (CH₃CH₂OH) + Br⁻. Inversion of configuration at C₂.',
                [
                    { id: 'c1', label: 'C', x: 180, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 290, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 180, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 290, y: 130, color: H, scale: 0.8 },
                    { id: 'h5', label: 'H', x: 290, y: 270, color: H, scale: 0.8 },
                    { id: 'br', label: 'NaBr', x: 460, y: 280, color: Br, scale: 0.9 },
                    { id: 'oh', label: 'OH', x: 380, y: 200, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c2', to: 'h4' }, { from: 'c2', to: 'h5' },
                    { from: 'c2', to: 'oh' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 31. HYDROGENATION: Propyne → Propene (Lindlar catalyst)
    // =========================================================================
    'hydrogenation-propyne': {
        title: 'Partial Hydrogenation of Propyne',
        reaction: 'CH₃C≡CH + H₂ → CH₃CH=CH₂ (Lindlar catalyst)',
        steps: [
            makeStep('step1', 'Propyne (CH₃C≡CH) with C≡C triple bond. Lindlar catalyst gives partial reduction.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 200, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 260, y: 90, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: 'H', x: 330, y: 90, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'triple' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' }, { from: 'c3', to: 'h4' },
                    { from: 'ha', to: 'hb' },
                ]
            ),
            makeStep('step2', 'H₂ adds across the triple bond. Only one equivalent of H₂ adds (Lindlar stops it).',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 260, y: 130, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                    { id: 'hb', label: 'H', x: 420, y: 250, color: 'bg-yellow-300 text-gray-900', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' },
                    { from: 'c2', to: 'ha', isForming: true },
                    { from: 'c3', to: 'hb', isForming: true },
                ]
            ),
            makeStep('step3', 'Product: Propene (CH₃CH=CH₂). cis-alkene from syn-addition. Triple → Double bond.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'c3', label: 'C', x: 370, y: 200, color: C },
                    { id: 'h1', label: 'H', x: 100, y: 150, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 250, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'h4', label: 'H', x: 420, y: 150, color: H, scale: 0.8 },
                    { id: 'ha', label: 'H', x: 260, y: 130, color: H, scale: 0.8 },
                    { id: 'hb', label: 'H', x: 420, y: 250, color: H, scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'c3', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'c3', to: 'h4' },
                    { from: 'c2', to: 'ha' }, { from: 'c3', to: 'hb' },
                ]
            ),
        ]
    },

    // =========================================================================
    // 32. ESTERIFICATION: Ethanoic Acid + Methanol → Methyl Ethanoate
    // =========================================================================
    'esterification-ethanoic': {
        title: 'Esterification of Ethanoic Acid',
        reaction: 'CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O',
        steps: [
            makeStep('step1', 'Ethanoic acid + Methanol heated under reflux with conc. H₂SO₄ catalyst.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 250, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 320, y: 140, color: O },
                    { id: 'oh1', label: 'OH', x: 320, y: 260, color: O },
                    { id: 'h1', label: 'H', x: 100, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'cm', label: 'C', x: 440, y: 200, color: C },
                    { id: 'hm1', label: 'H', x: 490, y: 150, color: H, scale: 0.8 },
                    { id: 'hm2', label: 'H', x: 490, y: 250, color: H, scale: 0.8 },
                    { id: 'hm3', label: 'H', x: 440, y: 130, color: H, scale: 0.8 },
                    { id: 'ohm', label: 'OH', x: 380, y: 200, color: O },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'oh1' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cm', to: 'hm1' }, { from: 'cm', to: 'hm2' },
                    { from: 'cm', to: 'hm3' }, { from: 'cm', to: 'ohm' },
                ]
            ),
            makeStep('step2', 'The –OH of the acid and the H of the alcohol leave as water. New C–O–C ester bond forms.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 330, y: 140, color: O },
                    { id: 'oh1', label: 'O', x: 340, y: 200, color: O },
                    { id: 'h1', label: 'H', x: 100, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'cm', label: 'C', x: 420, y: 200, color: C },
                    { id: 'hm1', label: 'H', x: 470, y: 150, color: H, scale: 0.8 },
                    { id: 'hm2', label: 'H', x: 470, y: 250, color: H, scale: 0.8 },
                    { id: 'hm3', label: 'H', x: 420, y: 130, color: H, scale: 0.8 },
                    { id: 'ohm', label: 'H₂O', x: 300, y: 310, color: 'bg-blue-400 text-white', scale: 0.9 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'oh1' }, { from: 'oh1', to: 'cm', isForming: true },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cm', to: 'hm1' }, { from: 'cm', to: 'hm2' },
                    { from: 'cm', to: 'hm3' },
                ]
            ),
            makeStep('step3', 'Product: Methyl ethanoate (CH₃COOCH₃) – fruity smell! Reaction is reversible.',
                [
                    { id: 'c1', label: 'C', x: 150, y: 200, color: C },
                    { id: 'c2', label: 'C', x: 260, y: 200, color: C },
                    { id: 'o1', label: 'O', x: 330, y: 135, color: O },
                    { id: 'oh1', label: 'O', x: 340, y: 200, color: O },
                    { id: 'h1', label: 'H', x: 100, y: 160, color: H, scale: 0.8 },
                    { id: 'h2', label: 'H', x: 100, y: 240, color: H, scale: 0.8 },
                    { id: 'h3', label: 'H', x: 150, y: 130, color: H, scale: 0.8 },
                    { id: 'cm', label: 'C', x: 420, y: 200, color: C },
                    { id: 'hm1', label: 'H', x: 470, y: 150, color: H, scale: 0.8 },
                    { id: 'hm2', label: 'H', x: 470, y: 250, color: H, scale: 0.8 },
                    { id: 'hm3', label: 'H', x: 420, y: 130, color: H, scale: 0.8 },
                    { id: 'ohm', label: 'H₂O', x: 300, y: 310, color: 'bg-blue-400 text-white', scale: 0.8 },
                ],
                [
                    { from: 'c1', to: 'c2' }, { from: 'c2', to: 'o1', type: 'double' },
                    { from: 'c2', to: 'oh1' }, { from: 'oh1', to: 'cm' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c1', to: 'h3' },
                    { from: 'cm', to: 'hm1' }, { from: 'cm', to: 'hm2' },
                    { from: 'cm', to: 'hm3' },
                ]
            ),
        ]
    },
};
