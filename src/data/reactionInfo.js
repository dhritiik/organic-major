// =============================================================================
// Reaction Knowledge Base — educational info shown when clicking an edge
// =============================================================================

export const reactionInfo = {
    // ──── Hydrogenation ────
    'Hydrogenation': {
        name: 'Hydrogenation',
        type: 'Addition',
        category: 'addition',
        summary: 'Addition of hydrogen (H₂) across a C=C or C≡C bond to reduce unsaturation.',
        reagents: 'H₂ gas',
        catalyst: 'Nickel (Ni), Palladium (Pd), or Platinum (Pt)',
        conditions: '150°C, high pressure',
        mechanism: 'Heterogeneous catalysis — H₂ adsorbs onto the metal surface, weakening the H–H bond. The alkene also adsorbs, and both H atoms add across the double bond simultaneously (syn-addition).',
        keyPoints: [
            'Converts alkenes → alkanes (saturated)',
            'Converts alkynes → alkenes (with Lindlar catalyst) or alkanes (with Ni)',
            'Used industrially to harden vegetable oils into margarine',
            'Syn-addition — both H atoms add to the same face',
        ],
        example: 'CH₂=CH₂ + H₂ → CH₃CH₃',
        energetics: 'Exothermic — releases ~120 kJ/mol',
        relatedMechanisms: ['hydrogenation-ethene', 'hydrogenation-alkyne-alkene'],
    },

    // ──── Hydration ────
    'Hydration': {
        name: 'Hydration',
        type: 'Addition',
        category: 'addition',
        summary: 'Addition of water (H₂O) across a double bond to form an alcohol.',
        reagents: 'Steam (H₂O)',
        catalyst: 'Phosphoric acid (H₃PO₄) on silica, or dilute H₂SO₄',
        conditions: '300°C, 60–70 atm (industrial) or reflux with acid',
        mechanism: 'Electrophilic addition — the π electrons of the C=C attack H⁺ from the acid, forming a carbocation. Water then attacks the carbocation as a nucleophile.',
        keyPoints: [
            'Converts alkenes → alcohols',
            'Follows Markovnikov\'s rule — OH adds to the more substituted carbon',
            'Industrial method for producing ethanol from ethene',
            'Reversible reaction — equilibrium favours products at lower temperature',
        ],
        example: 'CH₂=CH₂ + H₂O → CH₃CH₂OH',
        energetics: 'Slightly exothermic',
        relatedMechanisms: ['hydration-ethene'],
    },

    // ──── Oxidation (various) ────
    'Oxidation': {
        name: 'Oxidation',
        type: 'Oxidation',
        category: 'oxidation',
        summary: 'Removal of hydrogen or addition of oxygen. In organic chemistry, oxidation increases the number of C–O bonds or decreases C–H bonds.',
        reagents: 'Potassium dichromate (K₂Cr₂O₇) or KMnO₄',
        catalyst: 'Acidified with dilute H₂SO₄',
        conditions: 'Distillation (for aldehyde) or Reflux (for acid/ketone)',
        mechanism: 'The oxidising agent [O] removes 2H atoms from the alcohol. For primary alcohols: distillation gives aldehyde, reflux gives carboxylic acid. For secondary alcohols: reflux gives ketone.',
        keyPoints: [
            'Primary alcohol → Aldehyde (distil) → Carboxylic Acid (reflux)',
            'Secondary alcohol → Ketone (reflux)',
            'Tertiary alcohols cannot be oxidised (no H on C–OH carbon)',
            'Colour change: Orange (Cr₂O₇²⁻) → Green (Cr³⁺)',
            'Tollens\' test: Aldehydes give silver mirror, ketones do not',
            'Fehling\'s test: Aldehydes give red precipitate, ketones do not',
        ],
        example: 'CH₃CH₂OH + [O] → CH₃CHO + H₂O',
        energetics: 'Exothermic',
        relatedMechanisms: ['oxidation-alcohol-aldehyde', 'oxidation-aldehyde-acid', 'oxidation-alcohol-ketone', 'oxidation-toluene-benzoic'],
    },

    // ──── Esterification ────
    'Esterification': {
        name: 'Esterification',
        type: 'Condensation',
        category: 'condensation',
        summary: 'A carboxylic acid reacts with an alcohol to form an ester and water.',
        reagents: 'Carboxylic acid + Alcohol',
        catalyst: 'Concentrated H₂SO₄ (acid catalyst)',
        conditions: 'Reflux, heat',
        mechanism: 'Nucleophilic acyl substitution — the alcohol oxygen (nucleophile) attacks the carbonyl carbon of the acid. A tetrahedral intermediate forms, then water is eliminated.',
        keyPoints: [
            'Reversible reaction — use excess of one reactant to push equilibrium',
            'Produces sweet/fruity smelling esters',
            'Esters used in perfumes, flavourings, and solvents',
            'The reverse reaction is hydrolysis of an ester',
            'Fischer esterification when acid catalysed',
        ],
        example: 'CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O',
        energetics: 'Slightly endothermic — needs heat',
        relatedMechanisms: ['esterification'],
    },

    // ──── Dehydration ────
    'Dehydration': {
        name: 'Dehydration',
        type: 'Elimination',
        category: 'elimination',
        summary: 'Removal of water (H₂O) from a molecule. Alcohols can be dehydrated to form alkenes or ethers depending on temperature.',
        reagents: 'Concentrated H₂SO₄ or Al₂O₃',
        catalyst: 'H₂SO₄ acts as both catalyst and dehydrating agent',
        conditions: '170°C → alkene | 140°C → ether',
        mechanism: 'E1 elimination — the acid protonates the –OH to form –OH₂⁺ (good leaving group). Water departs to form a carbocation, then a base removes an adjacent H to form the C=C double bond.',
        keyPoints: [
            'At 170°C: intramolecular dehydration gives an alkene',
            'At 140°C: intermolecular dehydration gives an ether',
            'Follows Zaitsev\'s rule — most substituted alkene is major product',
            'Reverse of hydration',
            'Temperature controls which product forms',
        ],
        example: 'CH₃CH₂OH → CH₂=CH₂ + H₂O (170°C)',
        energetics: 'Endothermic — needs significant heating',
        relatedMechanisms: ['dehydration-alcohol-alkene', 'dehydration-alcohol-ether'],
    },

    // ──── Amidation ────
    'Amidation': {
        name: 'Amidation',
        type: 'Condensation',
        category: 'condensation',
        summary: 'A carboxylic acid reacts with ammonia (or an amine) to form an amide and water.',
        reagents: 'Carboxylic acid + NH₃',
        catalyst: 'Heat (no catalyst needed)',
        conditions: 'Strong heating',
        mechanism: 'The lone pair on nitrogen attacks the carbonyl carbon. An ammonium salt first forms, then heating drives off water to form the amide bond (–CONH₂).',
        keyPoints: [
            'Amide bond is the same bond found in proteins (peptide bond)',
            'Very important in biochemistry',
            'Amides are neutral — neither acidic nor basic',
            'Stronger C–N bond than in amines due to resonance with C=O',
        ],
        example: 'CH₃COOH + NH₃ → CH₃CONH₂ + H₂O',
        energetics: 'Endothermic — needs heat to drive off water',
        relatedMechanisms: ['amidation'],
    },

    // ──── Ammonolysis ────
    'Ammonolysis': {
        name: 'Ammonolysis',
        type: 'Nucleophilic Substitution',
        category: 'substitution',
        summary: 'A haloalkane reacts with excess ammonia to form a primary amine.',
        reagents: 'Excess concentrated NH₃',
        catalyst: 'None — excess NH₃ prevents further substitution',
        conditions: 'Heat in sealed tube, ethanol solvent',
        mechanism: 'SN2 — the lone pair on nitrogen attacks the δ+ carbon bonded to the halogen. The halogen departs as a halide ion. With excess NH₃, further substitution to secondary/tertiary amines is minimised.',
        keyPoints: [
            'Produces primary amine (R–NH₂)',
            'Must use excess NH₃ to avoid polysubstitution',
            'Can also produce secondary & tertiary amines as byproducts',
            'Nucleophile: NH₃ (lone pair on N)',
        ],
        example: 'CH₃CH₂Br + 2NH₃ → CH₃CH₂NH₂ + NH₄Br',
        energetics: 'Exothermic',
        relatedMechanisms: ['ammonolysis'],
    },

    // ──── Substitution (free radical) ────
    'Substitution': {
        name: 'Free Radical Substitution',
        type: 'Free Radical',
        category: 'radical',
        summary: 'An alkane H is replaced by a halogen atom via a free radical chain mechanism.',
        reagents: 'Halogen (Cl₂ or Br₂)',
        catalyst: 'UV light (homolytic fission)',
        conditions: 'UV light, room temperature',
        mechanism: 'Three stages:\n1. Initiation: UV breaks Cl–Cl → 2Cl• (radicals)\n2. Propagation: Cl• + CH₄ → •CH₃ + HCl, then •CH₃ + Cl₂ → CH₃Cl + Cl•\n3. Termination: any two radicals combine (Cl• + Cl•, Cl• + •CH₃, •CH₃ + •CH₃)',
        keyPoints: [
            'Only works with UV light — thermal energy alone is insufficient',
            'Produces a mixture of mono- and poly-substituted products',
            'Not selective — any H can be replaced (major product is most substituted)',
            'Important industrial reaction for making haloalkanes',
            'Chain reaction — one initiation event causes many product molecules',
        ],
        example: 'CH₄ + Cl₂ → CH₃Cl + HCl',
        energetics: 'Exothermic overall',
        relatedMechanisms: ['free-radical-substitution'],
    },

    // ──── Hydrolysis ────
    'Hydrolysis': {
        name: 'Hydrolysis',
        type: 'Nucleophilic Substitution',
        category: 'substitution',
        summary: 'A haloalkane reacts with aqueous NaOH (or water) to replace the halogen with an –OH group, forming an alcohol.',
        reagents: 'NaOH (aqueous) or H₂O',
        catalyst: 'None (NaOH is the nucleophile)',
        conditions: 'Reflux with aqueous NaOH',
        mechanism: 'SN2 — the hydroxide ion (OH⁻) attacks the δ+ carbon. The halogen (good leaving group) departs. For tertiary haloalkanes, SN1 mechanism via carbocation.',
        keyPoints: [
            'Converts haloalkane → alcohol',
            'Rate: C–I > C–Br > C–Cl > C–F (bond strength order)',
            'Primary haloalkanes → SN2 (backside attack, inversion)',
            'Tertiary haloalkanes → SN1 (via carbocation, racemisation)',
            'Silver nitrate test can compare hydrolysis rates of different halides',
        ],
        example: 'CH₃Br + NaOH → CH₃OH + NaBr',
        energetics: 'Exothermic',
        relatedMechanisms: ['nucleophilic-substitution-hydrolysis'],
    },

    // ──── Nitration ────
    'Nitration': {
        name: 'Nitration',
        type: 'Electrophilic Aromatic Substitution',
        category: 'aromatic',
        summary: 'Benzene reacts with nitric acid in the presence of sulfuric acid to form nitrobenzene.',
        reagents: 'Concentrated HNO₃ + concentrated H₂SO₄',
        catalyst: 'H₂SO₄ generates the nitronium ion (NO₂⁺)',
        conditions: '50°C (below 55°C to prevent di-nitration)',
        mechanism: 'Electrophilic aromatic substitution:\n1. HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O\n2. NO₂⁺ attacks the π-electron ring → σ-complex (arenium ion)\n3. H⁺ is lost to restore aromaticity',
        keyPoints: [
            'Temperature must be controlled — above 55°C gives dinitrobenzene',
            'The electrophile is NO₂⁺ (nitronium ion)',
            'N-nitrobenzene is a precursor to aniline (dyes, drugs)',
            'Ring\'s delocalised electrons attack the electrophile',
            'Substitution, NOT addition — aromaticity is preserved',
        ],
        example: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O',
        energetics: 'Exothermic',
        relatedMechanisms: ['nitration-benzene'],
    },

    // ──── Reduction ────
    'Reduction': {
        name: 'Reduction',
        type: 'Reduction',
        category: 'reduction',
        summary: 'Nitrobenzene is reduced to aniline (aminobenzene) using tin and hydrochloric acid.',
        reagents: 'Tin (Sn) + concentrated HCl',
        catalyst: 'Sn acts as reducing agent',
        conditions: 'Reflux, then add NaOH to liberate free amine',
        mechanism: 'The nitro group (–NO₂) is reduced stepwise through nitroso (–NO) and hydroxylamine (–NHOH) intermediates to the amine (–NH₂). Sn provides electrons.',
        keyPoints: [
            'Converts –NO₂ → –NH₂',
            'Aniline is used to make dyes, drugs, and polymers',
            'After reflux, NaOH is added to deprotonate the anilinium salt',
            '6 electrons transferred overall: R–NO₂ + 6[H] → R–NH₂ + 2H₂O',
        ],
        example: 'C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O',
        energetics: 'Exothermic',
        relatedMechanisms: ['reduction-nitrobenzene-aniline'],
    },

    // ──── Friedel-Crafts Alkylation ────
    'Friedel-Crafts': {
        name: 'Friedel-Crafts Alkylation',
        type: 'Electrophilic Aromatic Substitution',
        category: 'aromatic',
        summary: 'An alkyl group is added to benzene using a haloalkane and an aluminium chloride catalyst.',
        reagents: 'Haloalkane (e.g. CH₃Cl) + AlCl₃',
        catalyst: 'Aluminium chloride (AlCl₃) — Lewis acid',
        conditions: 'Anhydrous conditions, reflux',
        mechanism: 'AlCl₃ accepts a lone pair from Cl, generating an electrophilic carbocation (CH₃⁺). This attacks the aromatic ring. H⁺ is lost to restore aromaticity. AlCl₃ is regenerated.',
        keyPoints: [
            'Adds an alkyl group to the ring (methylation, ethylation, etc.)',
            'Increases carbon chain on the ring',
            'AlCl₃ is a Lewis acid catalyst — regenerated at end',
            'Cannot be done on rings with –NO₂ (deactivating group)',
            'Can suffer from polyalkylation (product is more reactive than benzene)',
        ],
        example: 'C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl',
        energetics: 'Exothermic',
        relatedMechanisms: ['friedel-crafts-alkylation'],
    },

    // ──── HBr / electrophilic addition ────
    '+ HBr': {
        name: 'Electrophilic Addition of HBr',
        type: 'Electrophilic Addition',
        category: 'addition',
        summary: 'HBr adds across the C=C double bond of an alkene to form a bromoalkane.',
        reagents: 'HBr (gas or in solution)',
        catalyst: 'None needed',
        conditions: 'Room temperature',
        mechanism: 'The π electrons of C=C attack the δ+ H of H–Br. A carbocation intermediate forms. Br⁻ then attacks the carbocation.',
        keyPoints: [
            'Follows Markovnikov\'s rule — H adds to the C with more H\'s',
            'Forms a carbocation intermediate',
            'More stable (more substituted) carbocation is preferred',
            'Anti-Markovnikov possible with peroxide (radical mechanism)',
        ],
        example: 'CH₂=CH₂ + HBr → CH₃CH₂Br',
        energetics: 'Exothermic',
        relatedMechanisms: ['hydrohalogenation-ethene-bromoethane'],
    },

    // ──── + Br₂ / halogenation ────
    '+ Br₂': {
        name: 'Free Radical Substitution (Bromination)',
        type: 'Free Radical',
        category: 'radical',
        summary: 'An alkane reacts with bromine under UV light, replacing an H atom with Br.',
        reagents: 'Br₂',
        catalyst: 'UV light',
        conditions: 'UV light, room temperature',
        mechanism: 'Free radical mechanism: Initiation → Propagation → Termination. UV light causes homolytic fission of Br₂ → 2Br•',
        keyPoints: [
            'Requires UV light to initiate',
            'Slower than chlorination — Br• is less reactive',
            'More selective than Cl₂ — prefers tertiary H atoms',
            'Produces mixture of products',
        ],
        example: 'CH₄ + Br₂ → CH₃Br + HBr',
        energetics: 'Exothermic overall',
        relatedMechanisms: ['free-radical-substitution'],
    },

    '+ Cl₂': {
        name: 'Free Radical Substitution (Chlorination)',
        type: 'Free Radical',
        category: 'radical',
        summary: 'An alkane reacts with chlorine under UV light, replacing an H atom with Cl.',
        reagents: 'Cl₂',
        catalyst: 'UV light',
        conditions: 'UV light, room temperature',
        mechanism: 'Free radical chain: Cl₂ → 2Cl• (initiation). Cl• + R–H → R• + HCl (propagation). R• + Cl₂ → R–Cl + Cl• (propagation).',
        keyPoints: [
            'Faster and less selective than bromination',
            'Produces mixture of mono- and poly-chlorinated products',
            'Important for making PVC (polyvinyl chloride)',
        ],
        example: 'CH₄ + Cl₂ → CH₃Cl + HCl',
        energetics: 'Exothermic',
        relatedMechanisms: ['free-radical-substitution'],
    },

    // ──── + H₂ (edge label) ────
    '+ H₂': {
        name: 'Hydrogenation',
        type: 'Addition',
        category: 'addition',
        summary: 'Addition of hydrogen gas across a multiple bond.',
        reagents: 'H₂',
        catalyst: 'Ni / Pd / Pt',
        conditions: '150°C, high pressure',
        mechanism: 'Heterogeneous catalysis on metal surface. Both H atoms add simultaneously (syn-addition).',
        keyPoints: [
            'Alkene + H₂ → Alkane',
            'Alkyne + H₂ (Lindlar) → cis-Alkene',
            'Alkyne + 2H₂ → Alkane',
            'Used industrially in margarine production',
        ],
        example: 'CH₂=CH₂ + H₂ → CH₃CH₃',
        energetics: 'Exothermic',
        relatedMechanisms: ['hydrogenation-ethene', 'hydrogenation-alkyne-alkene'],
    },

    // ──── + H₂O (edge label) ────
    '+ H₂O': {
        name: 'Hydration',
        type: 'Electrophilic Addition',
        category: 'addition',
        summary: 'Steam addition across an alkene double bond to produce an alcohol.',
        reagents: 'H₂O (steam)',
        catalyst: 'H₃PO₄',
        conditions: '300°C, 60 atm',
        mechanism: 'Electrophilic addition — H⁺ attacks C=C, then H₂O attacks the carbocation.',
        keyPoints: [
            'Industrial production of ethanol',
            'Follows Markovnikov\'s rule',
            'Reversible — also used for dehydration in reverse',
        ],
        example: 'CH₂=CH₂ + H₂O → CH₃CH₂OH',
        energetics: 'Slightly exothermic',
        relatedMechanisms: ['hydration-ethene'],
    },

    // ──── + KCN ────
    '+ KCN': {
        name: 'Cyanide Substitution (Nitrile Synthesis)',
        type: 'Nucleophilic Substitution',
        category: 'substitution',
        summary: 'A haloalkane reacts with KCN to replace the halogen with a –CN group, extending the carbon chain by one.',
        reagents: 'KCN (potassium cyanide)',
        catalyst: 'None',
        conditions: 'Ethanol/water solvent, reflux',
        mechanism: 'SN2 — the CN⁻ ion attacks the δ+ carbon. The halide departs. The carbon chain increases by one.',
        keyPoints: [
            'Carbon chain increases by 1 (important for synthesis!)',
            'Product: nitrile (R–CN)',
            'Nitrile can be hydrolysed to carboxylic acid or reduced to amine',
            'KCN is highly toxic — handle with extreme care',
        ],
        example: 'CH₃Br + KCN → CH₃CN + KBr',
        energetics: 'Exothermic',
        relatedMechanisms: [],
    },

    // ──── Dow process ────
    'Dow process': {
        name: 'Dow Process',
        type: 'Industrial Substitution',
        category: 'aromatic',
        summary: 'Industrial production of phenol from chlorobenzene using NaOH at high temperature and pressure.',
        reagents: 'NaOH',
        catalyst: 'None — extreme conditions',
        conditions: '300°C, 200 atm',
        mechanism: 'Nucleophilic aromatic substitution — OH⁻ displaces Cl from the ring under forcing conditions.',
        keyPoints: [
            'Historically important industrial process',
            'Now largely replaced by cumene process',
            'Phenol used for plastics (Bakelite), antiseptics',
        ],
        example: 'C₆H₅Cl + NaOH → C₆H₅OH + NaCl',
        energetics: 'Endothermic — needs extreme conditions',
        relatedMechanisms: [],
    },
};

// Lookup by edge label — tries exact match, then fuzzy
export const getReactionInfo = (edgeLabel) => {
    if (!edgeLabel) return null;
    const clean = edgeLabel.trim();
    // Direct match
    if (reactionInfo[clean]) return reactionInfo[clean];
    // Partial match
    const key = Object.keys(reactionInfo).find(k =>
        clean.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(clean.toLowerCase())
    );
    return key ? reactionInfo[key] : null;
};
