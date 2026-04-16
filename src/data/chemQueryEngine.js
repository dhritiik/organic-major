// =============================================================================
// chemQueryEngine.js — Pure local query engine for OrganicFlow
// No API keys, no network calls. Answers are built entirely from the
// reactionInfo and mechanisms databases already in the project.
// =============================================================================

import { reactionInfo } from './reactionInfo.js';
import { mechanisms } from './mechanisms.js';

// ─── Synonym / keyword map ────────────────────────────────────────────────────
// Maps common terms a user might type to the keys used in reactionInfo / mechanisms.
const REACTION_SYNONYMS = {
    // Hydrogenation
    'hydrogenation': 'Hydrogenation',
    'add hydrogen': 'Hydrogenation',
    'h2 addition': 'Hydrogenation',
    'reduce alkene': 'Hydrogenation',
    'reduce double bond': 'Hydrogenation',
    'margarine': 'Hydrogenation',
    'syn addition': 'Hydrogenation',
    'ni catalyst': 'Hydrogenation',
    'pd catalyst': 'Hydrogenation',
    'pt catalyst': 'Hydrogenation',
    'lindlar': 'Hydrogenation',

    // Hydration
    'hydration': 'Hydration',
    'add water': 'Hydration',
    'steam addition': 'Hydration',
    'h2o addition': 'Hydration',
    'alkene to alcohol': 'Hydration',
    'ethene to ethanol': 'Hydration',
    'markovnikov': 'Hydration',
    'h3po4': 'Hydration',

    // Oxidation
    'oxidation': 'Oxidation',
    'oxidise': 'Oxidation',
    'oxidize': 'Oxidation',
    'k2cr2o7': 'Oxidation',
    'kmno4': 'Oxidation',
    'acidified dichromate': 'Oxidation',
    'alcohol to aldehyde': 'Oxidation',
    'alcohol to ketone': 'Oxidation',
    'aldehyde to acid': 'Oxidation',
    'fehling': 'Oxidation',
    'tollens': 'Oxidation',
    'silver mirror': 'Oxidation',
    'orange to green': 'Oxidation',
    'dichromate': 'Oxidation',

    // Esterification
    'esterification': 'Esterification',
    'ester': 'Esterification',
    'carboxylic acid alcohol': 'Esterification',
    'fruity smell': 'Esterification',
    'fischer': 'Esterification',
    'condensation reaction': 'Esterification',

    // Dehydration
    'dehydration': 'Dehydration',
    'remove water': 'Dehydration',
    'alcohol to alkene': 'Dehydration',
    'alcohol to ether': 'Dehydration',
    '170': 'Dehydration',
    '140': 'Dehydration',
    'zaitsev': 'Dehydration',
    'elimination': 'Dehydration',
    'al2o3': 'Dehydration',
    'conc h2so4': 'Dehydration',

    // Amidation
    'amidation': 'Amidation',
    'amide': 'Amidation',
    'peptide bond': 'Amidation',
    'acid ammonia': 'Amidation',
    'conh2': 'Amidation',

    // Ammonolysis
    'ammonolysis': 'Ammonolysis',
    'haloalkane ammonia': 'Ammonolysis',
    'primary amine': 'Ammonolysis',
    'nh3 substitution': 'Ammonolysis',

    // Free radical substitution
    'free radical': 'Substitution',
    'radical substitution': 'Substitution',
    'uv light': 'Substitution',
    'chlorination': 'Substitution',
    'bromination': 'Substitution',
    'initiation propagation termination': 'Substitution',
    'homolytic': 'Substitution',
    'cl2': 'Substitution',
    'br2 alkane': 'Substitution',

    // Hydrolysis
    'hydrolysis': 'Hydrolysis',
    'naoh': 'Hydrolysis',
    'haloalkane to alcohol': 'Hydrolysis',
    'sn2': 'Hydrolysis',
    'sn1': 'Hydrolysis',
    'nucleophilic substitution': 'Hydrolysis',
    'leaving group': 'Hydrolysis',
    'backside attack': 'Hydrolysis',
    'silver nitrate': 'Hydrolysis',

    // Nitration
    'nitration': 'Nitration',
    'nitrobenzene': 'Nitration',
    'hno3': 'Nitration',
    'nitronium': 'Nitration',
    'electrophilic aromatic': 'Nitration',
    'eas': 'Nitration',
    'no2': 'Nitration',
    'benzene nitric': 'Nitration',

    // Reduction
    'reduction nitrobenzene': 'Reduction',
    'aniline': 'Reduction',
    'tin hcl': 'Reduction',
    'sn hcl': 'Reduction',
    'nitro to amine': 'Reduction',

    // Friedel-Crafts
    'friedel crafts': 'Friedel-Crafts',
    'friedel-crafts': 'Friedel-Crafts',
    'alcl3': 'Friedel-Crafts',
    'lewis acid': 'Friedel-Crafts',
    'alkylation benzene': 'Friedel-Crafts',

    // HBr addition
    'hbr': '+ HBr',
    'add hbr': '+ HBr',
    'hydrohalogenation': '+ HBr',
    'bromoalkane from alkene': '+ HBr',

    // Cyanide substitution
    'kcn': '+ KCN',
    'cyanide': '+ KCN',
    'nitrile synthesis': '+ KCN',
    'extend carbon chain': '+ KCN',
    'chain extension': '+ KCN',

    // Dow process
    'dow process': 'Dow process',
    'phenol from chlorobenzene': 'Dow process',
    'cumene process': 'Dow process',
};

// ─── Functional group / compound keyword map ──────────────────────────────────
const COMPOUND_INFO = {
    alkane: {
        name: 'Alkane',
        formula: 'CₙH₂ₙ₊₂',
        description: 'Saturated hydrocarbons — contain only C–C single bonds. Named with -ane suffix.',
        properties: [
            'sp³ hybridised carbon, tetrahedral geometry, 109.5° bond angles',
            'Non-polar — only weak van der Waals (London dispersion) forces',
            'Boiling point rises with chain length (more surface area → stronger LDF)',
            'Branching lowers boiling point (less surface contact)',
            'Virtually insoluble in water (non-polar vs polar)',
            'Good fuels — burn in oxygen to give CO₂ + H₂O',
        ],
        reactions: ['Free Radical Substitution (Cl₂/Br₂, UV light)'],
        series: ['Methane CH₄', 'Ethane C₂H₆', 'Propane C₃H₈', 'Butane C₄H₁₀'],
    },
    alkene: {
        name: 'Alkene',
        formula: 'CₙH₂ₙ',
        description: 'Unsaturated hydrocarbons — contain a C=C double bond. Named with -ene suffix. More reactive than alkanes.',
        properties: [
            'sp² hybridised carbon around C=C, trigonal planar, 120° bond angles',
            'The π bond is above and below the plane — target for electrophiles',
            'Decolourises bromine water — quick test for C=C',
            'cis/trans (E/Z) isomerism possible due to restricted rotation around C=C',
        ],
        reactions: ['Hydrogenation (H₂/Ni)', 'Hydration (H₂O/H₃PO₄)', 'Electrophilic Addition of HBr', 'Addition of Br₂ (bromine water test)'],
        series: ['Ethene C₂H₄', 'Propene C₃H₆', 'But-1-ene C₄H₈'],
    },
    alkyne: {
        name: 'Alkyne',
        formula: 'CₙH₂ₙ₋₂',
        description: 'Unsaturated hydrocarbons with a C≡C triple bond. Named with -yne suffix.',
        properties: [
            'sp hybridised carbon, linear geometry, 180° bond angles',
            'Two π bonds — very electron-rich, reactive toward electrophiles',
            'Terminal alkynes (R–C≡CH) are weakly acidic — proton can be removed',
        ],
        reactions: ['Partial hydrogenation (Lindlar catalyst) → cis-alkene', 'Full hydrogenation (Ni) → alkane', 'Electrophilic addition × 2'],
        series: ['Ethyne C₂H₂ (acetylene)', 'Propyne C₃H₄'],
    },
    alcohol: {
        name: 'Alcohol',
        formula: 'CₙH₂ₙ₊₁OH',
        description: 'Contain the –OH functional group. Named with -ol suffix. Classified as primary, secondary, or tertiary based on C–OH substitution.',
        properties: [
            'Hydrogen bonding — significantly higher boiling points than alkanes of similar MW',
            'Miscible with water in short chain alcohols (H-bond with H₂O)',
            'Primary: –CH₂OH, Secondary: –CHOH–, Tertiary: –COH–',
            'Tertiary alcohols cannot be oxidised (no H on C bearing OH)',
        ],
        reactions: ['Oxidation → aldehyde/ketone/carboxylic acid', 'Dehydration → alkene (170°C) or ether (140°C)', 'Esterification with carboxylic acids', 'Halogenation (PCl₅ or HBr → haloalkane)'],
        series: ['Methanol CH₃OH', 'Ethanol C₂H₅OH', 'Propan-1-ol', 'Propan-2-ol'],
    },
    aldehyde: {
        name: 'Aldehyde',
        formula: 'RCHO',
        description: 'Contain the –CHO group at the end of the carbon chain. Named with -al suffix.',
        properties: [
            'Polar C=O bond — dipole-dipole interactions (higher bp than alkanes)',
            'No O–H — cannot H-bond with themselves (lower bp than alcohols)',
            'Reducing agents — can be oxidised to carboxylic acids',
            'Give positive Fehling\'s test (red ppt) and Tollens\' test (silver mirror)',
        ],
        reactions: ['Oxidation → carboxylic acid', 'Reduction (NaBH₄) → primary alcohol', 'Nucleophilic addition of HCN → hydroxynitrile'],
        series: ['Methanal (formaldehyde) HCHO', 'Ethanal (acetaldehyde) CH₃CHO', 'Propanal C₂H₅CHO'],
    },
    ketone: {
        name: 'Ketone',
        formula: 'RCOR\'',
        description: 'Contain the C=O group flanked by two carbon groups. Named with -one suffix.',
        properties: [
            'Polar C=O bond — dipole-dipole interactions',
            'Cannot be oxidised further under normal conditions (no H on carbonyl C)',
            'Negative Fehling\'s and Tollens\' tests — distinguishes from aldehydes',
            'Iodoform test: methyl ketones (CH₃CO–) give yellow CHI₃ precipitate',
        ],
        reactions: ['Reduction (NaBH₄) → secondary alcohol', 'Nucleophilic addition of HCN → hydroxynitrile', 'Iodoform test (CH₃COR only)'],
        series: ['Propanone (acetone) CH₃COCH₃', 'Butanone CH₃COC₂H₅'],
    },
    carboxylic_acid: {
        name: 'Carboxylic Acid',
        formula: 'RCOOH',
        description: 'Contain the –COOH group. Named with -anoic acid suffix. Weak acids in water.',
        properties: [
            'Strong H-bonding (–COOH donates and accepts) → very high boiling points',
            'Form dimers in non-polar solvents via two H-bonds',
            'Weak acid — partially dissociates: RCOOH ⇌ RCOO⁻ + H⁺',
            'Turns litmus red, reacts with Na₂CO₃ to give CO₂ (fizzing)',
        ],
        reactions: ['Esterification with alcohol (H₂SO₄ cat)', 'Amidation with NH₃ → amide', 'Reduction (LiAlH₄) → primary alcohol', 'Forms acyl chloride with PCl₅ or SOCl₂'],
        series: ['Methanoic acid HCOOH', 'Ethanoic acid CH₃COOH', 'Propanoic acid C₂H₅COOH'],
    },
    ester: {
        name: 'Ester',
        formula: 'RCOOR\'',
        description: 'Contain the –COO– group. Named as alkyl alkanoate. Often fruity smelling.',
        properties: [
            'Polar but no H-bond donor — lower bp than carboxylic acids',
            'Sweet/fruity odours — used in flavourings and perfumes',
            'Can be hydrolysed (acid or base) back to acid + alcohol',
            'Saponification: base hydrolysis gives carboxylate salt + alcohol',
        ],
        reactions: ['Hydrolysis (acid) → carboxylic acid + alcohol', 'Hydrolysis (base, saponification) → carboxylate + alcohol'],
        series: ['Methyl ethanoate CH₃COOCH₃', 'Ethyl ethanoate CH₃COOC₂H₅'],
    },
    amine: {
        name: 'Amine',
        formula: 'RNH₂ / R₂NH / R₃N',
        description: 'Contain the –NH₂ (or substituted N) group. Named with -amine or amino- prefix. Weak bases.',
        properties: [
            'Lone pair on N — acts as nucleophile and weak Brønsted base',
            'Primary amines H-bond via N–H · · · N (weaker than O–H · · · O)',
            'Higher bp than alkanes, lower than alcohols of similar MW',
            'Fishy smell in short chain amines',
        ],
        reactions: ['Salt formation with acids: R–NH₂ + HCl → R–NH₃⁺Cl⁻', 'Ammonolysis of haloalkanes', 'Acylation with acyl chloride → amide'],
        series: ['Methylamine CH₃NH₂', 'Ethylamine C₂H₅NH₂', 'Aniline C₆H₅NH₂'],
    },
    haloalkane: {
        name: 'Haloalkane',
        formula: 'RX (X = F, Cl, Br, I)',
        description: 'Contain a halogen atom bonded to a carbon chain. Named with halo- prefix.',
        properties: [
            'C–X bond is polar (δ+C–Xδ−) — carbon is susceptible to nucleophilic attack',
            'Reactivity order: R–I > R–Br > R–Cl > R–F (bond strength ∝ reactivity⁻¹)',
            'Primary: SN2 favoured; Tertiary: SN1 favoured',
            'Good electrophiles — important intermediates in synthesis',
        ],
        reactions: ['Hydrolysis (NaOH/H₂O) → alcohol (SN2/SN1)', 'Ammonolysis (excess NH₃) → amine', 'KCN substitution → nitrile (chain extension)', 'Elimination (KOH/ethanol) → alkene'],
        series: ['Chloromethane CH₃Cl', 'Bromoethane C₂H₅Br', 'Iodoethane C₂H₅I'],
    },
    amide: {
        name: 'Amide',
        formula: 'RCONH₂',
        description: 'Contain the –CONH₂ group. The carbonyl and amine groups are combined. Found in proteins as the peptide bond.',
        properties: [
            'Resonance between C=O and C–N gives partial double-bond character to C–N',
            'Planar around the amide bond — restricts rotation',
            'Strong H-bonding → very high melting/boiling points',
            'Neutral compounds — neither acidic nor basic like amines/acids',
        ],
        reactions: ['Hydrolysis (acid or base) → carboxylic acid + ammonia/amine', 'Reduction (LiAlH₄) → amine'],
        series: ['Methanamide HCONH₂', 'Ethanamide CH₃CONH₂'],
    },
    nitrile: {
        name: 'Nitrile',
        formula: 'R–CN',
        description: 'Contain the –C≡N group. Named with -nitrile suffix or cyano- prefix. Key intermediates for chain extension.',
        properties: [
            'Linear C≡N group — polar but no H-bond donor',
            'Carbon chain has one more C than the starting haloalkane',
            'Important in synthesis — can be converted to amine or carboxylic acid',
        ],
        reactions: ['Acid hydrolysis → carboxylic acid (+ NH₄⁺)', 'Reduction (LiAlH₄ or H₂/Ni) → primary amine'],
        series: ['Ethanenitrile (acetonitrile) CH₃CN', 'Propanenitrile C₂H₅CN'],
    },
};

// ─── Lab tests database ──────────────────────────────────────────────────────
const LAB_TESTS = {
    fehling: {
        name: 'Fehling\'s Test',
        reagent: 'Fehling\'s solution A (CuSO₄) + B (NaOH + sodium potassium tartrate), heated',
        positive: 'Brick-red/orange precipitate of Cu₂O',
        negative: 'Solution stays blue',
        detects: 'Aldehydes (RCHO). Does NOT work for ketones.',
        notes: [
            'Methanol (HCHO) and glucose also give positive result',
            'Formic acid (methanoic acid) gives positive — it is oxidised by Cu²⁺',
            'Must heat — cold Fehling\'s will not react',
        ],
    },
    tollens: {
        name: 'Tollens\' Test (Silver Mirror Test)',
        reagent: 'Tollens\' reagent: AgNO₃ + excess NH₃ (ammoniacal silver nitrate), warm gently',
        positive: 'Silver mirror on glass wall / grey-black precipitate',
        negative: 'No silver deposit',
        detects: 'Aldehydes. Does NOT work for ketones.',
        notes: [
            'Ag⁺ is reduced to Ag⁰ (metallic silver) by the aldehyde',
            'More sensitive than Fehling\'s',
            'Must be freshly prepared — old Tollens\' is explosive',
            'Used to silver mirrors commercially',
        ],
    },
    iodoform: {
        name: 'Iodoform Test',
        reagent: 'I₂ + NaOH (aqueous), warm',
        positive: 'Yellow precipitate of CHI₃ (iodoform, triiodomethane) with antiseptic smell',
        negative: 'No yellow precipitate',
        detects: 'CH₃CO– group: methyl ketones AND ethanal (CH₃CHO) AND ethanol (CH₃CH₂OH)',
        notes: [
            'Only methyl ketones give positive (not other ketones)',
            'Ethanol gives positive — CH₃CH₂OH is oxidised to CH₃CHO by I₂/NaOH',
            'Ethanal (acetaldehyde) gives positive',
            'Propan-2-ol gives positive (oxidised to propanone)',
            'Useful to distinguish ethanal from other aldehydes',
        ],
    },
    bromine_water: {
        name: 'Bromine Water Test',
        reagent: 'Bromine water (Br₂ in water), room temperature',
        positive: 'Decolourisation of orange/brown bromine water',
        negative: 'Orange colour persists',
        detects: 'C=C double bonds (alkenes/alkynes). Also decolourised by aldehydes (different mechanism).',
        notes: [
            'Alkene + Br₂ → dibromoalkane (electrophilic addition)',
            'Phenol also decolourises and gives white ppt (tribromophenol)',
            'Alkanes do NOT decolourise in dark (only under UV → free radical)',
            'Quick field test for unsaturation',
        ],
    },
    sodium_metal: {
        name: 'Sodium Metal Test',
        reagent: 'Small piece of sodium metal',
        positive: 'Effervescence (H₂ gas given off)',
        negative: 'No reaction',
        detects: 'O–H or N–H bonds: alcohols, carboxylic acids, primary/secondary amines',
        notes: [
            'Carboxylic acids react more vigorously than alcohols',
            'Ethers do NOT react (no O–H)',
            'Tertiary amines do NOT react (no N–H)',
            'Reaction: 2R–OH + 2Na → 2R–ONa + H₂',
        ],
    },
    pcl5: {
        name: 'Phosphorus Pentachloride Test (PCl₅)',
        reagent: 'PCl₅ (solid), add to unknown compound',
        positive: 'White fumes of HCl (steamy fumes, turns damp litmus red)',
        negative: 'No fumes',
        detects: 'OH groups: alcohols, carboxylic acids. Also reacts with water — test must be anhydrous.',
        notes: [
            'Confirms presence of –OH group',
            'Also converts COOH → COCl (acyl chloride)',
            'HCl fumes: R–OH + PCl₅ → R–Cl + POCl₃ + HCl',
            'Must use dry, anhydrous conditions',
        ],
    },
};

// ─── Reagent comparison database ─────────────────────────────────────────────
const REAGENT_COMPARISONS = {
    'liaiah4_vs_nabh4': {
        title: 'LiAlH₄ vs NaBH₄',
        reagents: {
            'LiAlH₄ (Lithium aluminium hydride)': [
                'Powerful reducing agent — reduces C=O, COOH, CN, CONH₂',
                'Reduces carboxylic acids → primary alcohols',
                'Reduces esters → two alcohols',
                'Reduces amides → amines',
                'Reduces nitriles → primary amines',
                '⚠ Reacts violently with water/protic solvents — must use dry ether',
                '⚠ Very hazardous — reacts with moisture in air',
                'Anhydrous conditions essential',
            ],
            'NaBH₄ (Sodium borohydride)': [
                'Milder reducing agent — only reduces C=O (aldehydes and ketones)',
                'Does NOT reduce carboxylic acids or esters under normal conditions',
                'Safe to use in water or ethanol solvent',
                'Much safer to handle than LiAlH₄',
                'Selective — useful when you only want to reduce a ketone/aldehyde',
            ],
        },
        summary: 'Use NaBH₄ when you only want to reduce a ketone or aldehyde safely. Use LiAlH₄ when you need to reduce acids, esters, amides or nitriles — but in dry ether only.',
    },
    'pcl5_vs_socl2': {
        title: 'PCl₅ vs SOCl₂ for making acyl chlorides',
        reagents: {
            'PCl₅ (Phosphorus pentachloride)': [
                'Converts –OH → –Cl (alcohols, carboxylic acids)',
                'R–COOH + PCl₅ → R–COCl + POCl₃ + HCl',
                'Byproducts POCl₃ and HCl are difficult to separate',
                'Useful as a test for –OH groups (HCl fumes)',
            ],
            'SOCl₂ (Thionyl chloride)': [
                'Preferred industrially for making acyl chlorides',
                'R–COOH + SOCl₂ → R–COCl + SO₂ + HCl',
                'Byproducts SO₂ and HCl are both gases — easy to remove',
                'Gives purer acyl chloride product',
                '⚠ Volatile, toxic, lachrymatory — handle in fume hood',
            ],
        },
        summary: 'SOCl₂ is preferred for synthesis because gaseous byproducts are easily removed. PCl₅ is used when testing for –OH groups.',
    },
    'kmno4_vs_cr2o7': {
        title: 'KMnO₄ vs K₂Cr₂O₇ as oxidising agents',
        reagents: {
            'KMnO₄ (Potassium permanganate)': [
                'Stronger oxidising agent',
                'Oxidises primary alcohols all the way to carboxylic acid (even under distillation)',
                'Acidified KMnO₄ decolourises with alkenes — also a test for C=C',
                'Colour change: purple → colourless (or brown MnO₂ in neutral)',
                'Can cleave C=C bonds in alkenes (ozonolysis-like)',
            ],
            'K₂Cr₂O₇ (Potassium dichromate)': [
                'Moderate oxidising agent — more controllable',
                'Oxidises primary alcohol → aldehyde (distil) or → acid (reflux)',
                'Oxidises secondary alcohol → ketone (reflux)',
                'Colour change: orange (Cr₂O₇²⁻) → green (Cr³⁺)',
                'Does NOT cleave alkene bonds',
                'Must be acidified with dilute H₂SO₄',
            ],
        },
        summary: 'K₂Cr₂O₇/H₂SO₄ is the standard lab oxidising agent for alcohols. The orange→green colour change is a positive result. KMnO₄ is stronger and used when more forceful oxidation is needed.',
    },
};

// ─── Physical properties database ────────────────────────────────────────────
const PHYSICAL_PROPERTIES = {
    boiling_point: {
        title: 'Boiling Point Trends in Homologous Series',
        content: [
            '✦ BP increases with chain length — more carbons = more electrons = stronger London dispersion forces (LDF)',
            '✦ Branching decreases BP — branched chains are more spherical, less surface contact, weaker LDF',
            '✦ Alcohols have much higher BP than alkanes of same MW — due to O–H···O hydrogen bonding',
            '✦ Carboxylic acids have the highest BP — form dimers via two H-bonds',
            '✦ Aldehydes/ketones higher than alkanes (dipole-dipole) but lower than alcohols (no O–H)',
            '✦ Order for similar MW: Alkane < Ether < Aldehyde/Ketone < Alcohol < Carboxylic Acid',
        ],
    },
    solubility: {
        title: 'Solubility in Water',
        content: [
            '✦ "Like dissolves like" — polar solvents dissolve polar solutes',
            '✦ Short chain alcohols (C1–C4) are fully miscible with water — O–H···O H-bonds with H₂O',
            '✦ Longer chain alcohols become less soluble — hydrophobic hydrocarbon chain dominates',
            '✦ Alkanes are essentially insoluble in water — non-polar',
            '✦ Carboxylic acids (short chain) dissolve well — both donate and accept H-bonds',
            '✦ Esters have limited water solubility — no O–H donor',
        ],
    },
    intermolecular_forces: {
        title: 'Intermolecular Forces in Organic Compounds',
        content: [
            '✦ London Dispersion Forces (LDF) — present in ALL molecules. Strength ∝ number of electrons (size)',
            '✦ Permanent Dipole-Dipole — in polar molecules with δ+ / δ− ends (e.g., C=O in aldehydes/ketones)',
            '✦ Hydrogen Bonding — requires O–H, N–H, or F–H. Strongest intermolecular force',
            '✦ Alkanes: only LDF',
            '✦ Aldehydes/Ketones: LDF + dipole-dipole (C=O is polar)',
            '✦ Alcohols: LDF + dipole-dipole + H-bonding (O–H)',
            '✦ Carboxylic acids: all three + form dimers (two H-bonds between two molecules)',
            '✦ Amines: LDF + dipole + H-bonding (N–H, but N is less electronegative than O → weaker H-bond)',
        ],
    },
};

// ─── Query intent detection ──────────────────────────────────────────────────

function detectIntent(q) {
    try {
        if (!q || typeof q !== 'string') {
            return { type: 'unknown' };
        }

        const lower = q.toLowerCase()
            .replace(/['']/g, "'")
            .replace(/[–—]/g, '-');

        const escapeRegex = (str) =>
            str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const wordMatch = (word) => {
            try {
                const safeWord = escapeRegex(word);
                return new RegExp(`\\b${safeWord}\\b`, 'i').test(lower);
            } catch {
                return lower.includes(word);
            }
        };

        // ============================================================
        // 🔥 0. DIRECT CONCEPT DETECTION (NEW FIX)
        // ============================================================
        if (/sn1|sn2|nucleophilic substitution/i.test(lower)) {
            return { type: 'mechanism', key: 'sn1_sn2' };
        }

        // ============================================================
        // 🔥 1. LAB TESTS
        // ============================================================
        if (/fehling/i.test(lower)) return { type: 'lab_test', key: 'fehling' };
        if (/tollens|silver mirror/i.test(lower)) return { type: 'lab_test', key: 'tollens' };
        if (/iodoform/i.test(lower)) return { type: 'lab_test', key: 'iodoform' };
        if (/bromine water|br2 water|decolouri/i.test(lower)) return { type: 'lab_test', key: 'bromine_water' };
        if (/sodium metal|na metal/i.test(lower)) return { type: 'lab_test', key: 'sodium_metal' };
        if (/pcl5/i.test(lower)) return { type: 'lab_test', key: 'pcl5' };

        // ============================================================
        // 🔥 2. COMPARISONS
        // ============================================================
        if (/lialh4.*nabh4|nabh4.*lialh4/i.test(lower)) return { type: 'comparison', key: 'liaiah4_vs_nabh4' };
        if (/pcl5.*socl2|socl2.*pcl5/i.test(lower)) return { type: 'comparison', key: 'pcl5_vs_socl2' };
        if (/kmno4.*cr2o7|cr2o7.*kmno4/i.test(lower)) return { type: 'comparison', key: 'kmno4_vs_cr2o7' };

        // ============================================================
        // 🔥 3. PHYSICAL
        // ============================================================
        if (/boiling point|bp/i.test(lower)) return { type: 'physical', key: 'boiling_point' };
        if (/solubil|miscible/i.test(lower)) return { type: 'physical', key: 'solubility' };
        if (/intermolecular|hydrogen bond|dipole/i.test(lower)) return { type: 'physical', key: 'intermolecular_forces' };

        // ============================================================
        // 🔥 4. REACTIONS (SAFE SCORING)
        // ============================================================
        let bestMatch = null;
        let maxScore = 0;

        for (const [kw, reactionKey] of Object.entries(REACTION_SYNONYMS || {})) {
            if (wordMatch(kw)) {
                const score = kw.length;
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = reactionKey;
                }
            }
        }

        if (bestMatch) {
            return { type: 'reaction', key: bestMatch };
        }

        // ============================================================
        // 🔥 5. COMPOUNDS
        // ============================================================
        for (const [keyword, data] of Object.entries(COMPOUND_INFO || {})) {
            if (wordMatch(keyword) || wordMatch(data.name.toLowerCase())) {
                return { type: 'compound', key: keyword };
            }
        }

        // ============================================================
        // 🔥 6. MECHANISMS (SAFE)
        // ============================================================
        for (const [mechId, mech] of Object.entries(mechanisms || {})) {
            if (!mech?.title) continue;

            const words = mech.title.toLowerCase().split(/\s+/);
            const matches = words.filter(w => w.length > 4 && lower.includes(w));

            if (matches.length >= 2) {
                return { type: 'mechanism', key: mechId };
            }
        }

        return { type: 'unknown' };

    } catch (err) {
        console.error("detectIntent error:", err);
        return { type: 'unknown' };
    }
}

// ─── Response builders ────────────────────────────────────────────────────────

function buildReactionResponse(key) {
    const r = reactionInfo[key];
    if (!r) return null;

    const lines = [];
    lines.push(`**${r.name}** — ${r.type}`);
    lines.push('');
    lines.push(r.summary);
    lines.push('');

    if (r.reagents)   lines.push(`✦ **Reagents:** ${r.reagents}`);
    if (r.catalyst)   lines.push(`✦ **Catalyst:** ${r.catalyst}`);
    if (r.conditions) lines.push(`✦ **Conditions:** ${r.conditions}`);
    if (r.example)    lines.push(`✦ **Example:** ${r.example}`);
    if (r.energetics) lines.push(`✦ **Energetics:** ${r.energetics}`);

    if (r.mechanism) {
        lines.push('');
        lines.push('**Mechanism:**');
        lines.push(r.mechanism);
    }

    if (r.keyPoints && r.keyPoints.length) {
        lines.push('');
        lines.push('**Key Points:**');
        r.keyPoints.forEach(p => lines.push(`✦ ${p}`));
    }

    // Link to step-by-step mechanisms if available
    if (r.relatedMechanisms && r.relatedMechanisms.length) {
        const available = r.relatedMechanisms.filter(id => mechanisms[id]);
        if (available.length) {
            lines.push('');
            lines.push(`**Step-by-step mechanisms available:** ${available.map(id => mechanisms[id].title).join(', ')}`);
            lines.push('→ Click on the reaction arrows in the graph to view these animations.');
        }
    }

    return lines.join('\n');
}

function buildCompoundResponse(key) {
    const c = COMPOUND_INFO[key];
    if (!c) return null;

    const lines = [];
    lines.push(`**${c.name}** (${c.formula})`);
    lines.push('');
    lines.push(c.description);
    lines.push('');
    lines.push('**Properties:**');
    c.properties.forEach(p => lines.push(`✦ ${p}`));
    lines.push('');
    lines.push('**Key Reactions:**');
    c.reactions.forEach(r => lines.push(`✦ ${r}`));
    if (c.series && c.series.length) {
        lines.push('');
        lines.push('**Examples:** ' + c.series.join(' · '));
    }
    return lines.join('\n');
}

function buildLabTestResponse(key) {
    const t = LAB_TESTS[key];
    if (!t) return null;

    const lines = [];
    lines.push(`**${t.name}**`);
    lines.push('');
    lines.push(`✦ **Reagent:** ${t.reagent}`);
    lines.push(`✦ **Positive result:** ${t.positive}`);
    lines.push(`✦ **Negative result:** ${t.negative}`);
    lines.push(`✦ **Detects:** ${t.detects}`);
    lines.push('');
    lines.push('**Notes:**');
    t.notes.forEach(n => lines.push(`✦ ${n}`));
    return lines.join('\n');
}

function buildComparisonResponse(key) {
    const c = REAGENT_COMPARISONS[key];
    if (!c) return null;

    const lines = [];
    lines.push(`**${c.title}**`);
    lines.push('');

    for (const [name, points] of Object.entries(c.reagents)) {
        lines.push(`**${name}:**`);
        points.forEach(p => lines.push(`✦ ${p}`));
        lines.push('');
    }

    lines.push(`**Summary:** ${c.summary}`);
    return lines.join('\n');
}

function buildPhysicalResponse(key) {
    const p = PHYSICAL_PROPERTIES[key];
    if (!p) return null;

    const lines = [];
    lines.push(`**${p.title}**`);
    lines.push('');
    p.content.forEach(line => lines.push(line));
    return lines.join('\n');
}

function buildMechanismResponse(key) {
    const m = mechanisms[key];
    if (!m) return null;

    const lines = [];
    lines.push(`**${m.title}**`);
    lines.push(`Reaction: ${m.reaction}`);
    lines.push('');
    lines.push(`This mechanism has **${m.steps.length} steps:**`);
    m.steps.forEach((step, i) => {
        lines.push(`${i + 1}. ${step.description}`);
    });
    lines.push('');
    lines.push('→ Click the reaction arrow in the graph to view the full step-by-step animation.');
    return lines.join('\n');
}

function buildUnknownResponse(query) {
    // Try to find partial matches across all databases for a helpful fallback
    const q = query.toLowerCase();
    const suggestions = [];

    // Scan reaction names
    for (const key of Object.keys(reactionInfo)) {
        if (key.toLowerCase().split(' ').some(w => w.length > 3 && q.includes(w))) {
            suggestions.push(reactionInfo[key].name);
        }
    }

    // Scan compound names
    for (const [key, c] of Object.entries(COMPOUND_INFO)) {
        if (q.includes(key) || q.includes(c.name.toLowerCase())) {
            suggestions.push(c.name);
        }
    }

    if (suggestions.length > 0) {
        return `I found some related topics in the database: **${[...new Set(suggestions)].slice(0, 4).join(', ')}**.\n\nTry asking about one of these specifically, e.g. "What is ${suggestions[0]}?" or "How does ${suggestions[0]} work?"`;
    }

    return `I couldn't find a match in the OrganicFlow database for that query.\n\n**Try asking about:**\n✦ A reaction: Hydrogenation, Esterification, Hydrolysis, Nitration, Free Radical Substitution…\n✦ A compound class: Alkane, Alkene, Alcohol, Aldehyde, Ketone, Carboxylic Acid, Ester, Amine…\n✦ A lab test: Fehling's, Tollens', Iodoform, Bromine water…\n✦ A reagent comparison: LiAlH₄ vs NaBH₄, KMnO₄ vs K₂Cr₂O₇…\n✦ Physical properties: Boiling points, Solubility, Intermolecular forces…`;
}

// ─── Main exported function ───────────────────────────────────────────────────

export function queryChemDatabase(userQuery) {
    try {
        if (!userQuery || !userQuery.trim()) {
            return 'Please type a chemistry question to get started.';
        }

        const intent = detectIntent(userQuery);

        console.log("Query:", userQuery);
        console.log("Detected intent:", intent);

        switch (intent.type) {
            case 'reaction':
                return buildReactionResponse(intent.key) || buildUnknownResponse(userQuery);

            case 'compound':
                return buildCompoundResponse(intent.key) || buildUnknownResponse(userQuery);

            case 'lab_test':
                return buildLabTestResponse(intent.key) || buildUnknownResponse(userQuery);

            case 'comparison':
                return buildComparisonResponse(intent.key) || buildUnknownResponse(userQuery);

            case 'physical':
                return buildPhysicalResponse(intent.key) || buildUnknownResponse(userQuery);

            case 'mechanism':
                return buildMechanismResponse(intent.key) || buildUnknownResponse(userQuery);

            default:
                return buildUnknownResponse(userQuery);
        }

    } catch (err) {
        console.error("Query engine crash:", err);
        return "⚠️ Something broke internally. Check console logs.";
    }
}
