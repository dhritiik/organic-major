// =============================================================================
// Physical Chemistry — Equation Node Definitions
// Pure knowledge atoms: each equation is a first-class entity in the graph
// =============================================================================

import { PHYSICAL_COLORS } from './physicalInfo';

// ─────────────────────────────────────────────────────────────────────────────
// THERMODYNAMICS EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const thermoEquations = {
    'eq-gibbs': {
        id: 'eq-gibbs',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'Gibbs–Helmholtz Equation',
        equation: 'ΔG = ΔH − TΔS',
        latex: '\\Delta G = \\Delta H - T\\Delta S',
        variables: {
            ΔG: { name: 'Gibbs free energy change', units: 'kJ/mol', sign: '< 0 = spontaneous' },
            ΔH: { name: 'Enthalpy change',          units: 'kJ/mol', sign: '< 0 = exothermic'  },
            T:  { name: 'Temperature',               units: 'K',      note: 'Must be in Kelvin'  },
            ΔS: { name: 'Entropy change',            units: 'J/(mol·K)', sign: '> 0 = more disorder' },
        },
        derivedFrom: ['thermo-enthalpy', 'thermo-entropy'],
        linksTo: ['equil-kc', 'electro-galvanic'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
    'eq-hess': {
        id: 'eq-hess',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'Hess\'s Law (formation)',
        equation: 'ΔH°rxn = Σ ΔH°f(products) − Σ ΔH°f(reactants)',
        variables: {
            'ΔH°rxn': { name: 'Standard enthalpy of reaction', units: 'kJ/mol' },
            'ΔH°f':   { name: 'Standard enthalpy of formation', units: 'kJ/mol', note: 'ΔH°f of elements = 0' },
        },
        linksTo: ['thermo-hess', 'thermo-enthalpy'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
    'eq-gibbs-equilibrium': {
        id: 'eq-gibbs-equilibrium',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'ΔG° and Equilibrium',
        equation: 'ΔG° = −RT ln K',
        variables: {
            'ΔG°': { name: 'Standard Gibbs free energy change', units: 'J/mol'          },
            R:     { name: 'Universal gas constant',           units: '8.314 J/(mol·K)' },
            T:     { name: 'Temperature',                      units: 'K'               },
            K:     { name: 'Equilibrium constant',             units: 'dimensionless'   },
        },
        derivedFrom: ['thermo-gibbs', 'equil-kc'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
    'eq-kirchhoff': {
        id: 'eq-kirchhoff',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'Kirchhoff\'s Law',
        equation: 'ΔH(T₂) = ΔH(T₁) + ΔCp(T₂ − T₁)',
        variables: {
            'ΔH':  { name: 'Enthalpy change at temperature T', units: 'kJ/mol'       },
            'ΔCp': { name: 'Difference in heat capacities',    units: 'J/(mol·K)'    },
            T:     { name: 'Temperature',                       units: 'K'            },
        },
        linksTo: ['thermo-heatcap', 'thermo-enthalpy'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
    'eq-ideal-gas': {
        id: 'eq-ideal-gas',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'Ideal Gas Law',
        equation: 'PV = nRT',
        variables: {
            P: { name: 'Pressure', units: 'Pa or atm' },
            V: { name: 'Volume', units: 'm³ or L' },
            n: { name: 'Amount of substance', units: 'mol' },
            R: { name: 'Gas constant', units: '8.314 J/(mol·K) or 0.08206 L·atm/(mol·K)' },
            T: { name: 'Temperature', units: 'K' },
        },
        derivedFrom: ['thermo-ideal-gas'],
        linksTo: ['thermo-vdw'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
    'eq-van-der-waals': {
        id: 'eq-van-der-waals',
        type: 'equation',
        domain: 'physical',
        subdomain: 'thermodynamics',
        label: 'van der Waals Equation',
        equation: '(P + a(n/V)²)(V − nb) = nRT',
        variables: {
            P: { name: 'Pressure', units: 'Pa or atm' },
            V: { name: 'Volume', units: 'm³ or L' },
            n: { name: 'Amount of substance', units: 'mol' },
            R: { name: 'Gas constant', units: 'varies' },
            T: { name: 'Temperature', units: 'K' },
            a: { name: 'Attraction parameter', units: 'varies' },
            b: { name: 'Excluded volume parameter', units: 'varies' },
        },
        derivedFrom: ['thermo-ideal-gas', 'thermo-vdw'],
        linksTo: ['thermo-ideal-gas'],
        color: PHYSICAL_COLORS.thermodynamics.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// KINETICS EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const kineticsEquations = {
    'eq-arrhenius': {
        id: 'eq-arrhenius',
        type: 'equation',
        domain: 'physical',
        subdomain: 'kinetics',
        label: 'Arrhenius Equation',
        equation: 'k = A · e^(−Ea/RT)',
        variables: {
            k:  { name: 'Rate constant',              units: 'varies (depends on order)' },
            A:  { name: 'Pre-exponential factor',     units: 'same as k'                 },
            Ea: { name: 'Activation energy',          units: 'J/mol'                     },
            R:  { name: 'Gas constant',               units: '8.314 J/(mol·K)'           },
            T:  { name: 'Temperature',                units: 'K'                         },
        },
        linearForm: 'ln k = ln A − Ea/RT',
        derivedFrom: ['kinetics-ea', 'kinetics-catalysis'],
        linksTo: ['kinetics-ratelaw'],
        color: PHYSICAL_COLORS.kinetics.border,
    },
    'eq-arrhenius-twopoint': {
        id: 'eq-arrhenius-twopoint',
        type: 'equation',
        domain: 'physical',
        subdomain: 'kinetics',
        label: 'Arrhenius (Two-Temperature Form)',
        equation: 'ln(k2/k1) = -Ea/R * (1/T2 - 1/T1)',
        variables: {
            'k1': { name: 'Rate constant at T1', units: 'varies' },
            'k2': { name: 'Rate constant at T2', units: 'varies' },
            Ea: { name: 'Activation energy',   units: 'J/mol'  },
            R:  { name: 'Gas constant',         units: '8.314 J/(mol·K)' },
        },
        derivedFrom: ['eq-arrhenius'],
        linksTo: ['kinetics-ea'],
        color: PHYSICAL_COLORS.kinetics.border,
    },
    'eq-firstorder': {
        id: 'eq-firstorder',
        type: 'equation',
        domain: 'physical',
        subdomain: 'kinetics',
        label: 'First-Order Integrated Rate Law',
        equation: 'ln[A]t = ln[A]0 - kt  =>  [A]t = [A]0 * e^(-kt)',
        variables: {
            '[A]t':  { name: 'Concentration at time t',   units: 'mol/L' },
            '[A]0':  { name: 'Initial concentration',      units: 'mol/L' },
            k:       { name: 'First-order rate constant', units: 's^-1'   },
            t:       { name: 'Time',                       units: 's'     },
        },
        linksTo: ['kinetics-halftime', 'kinetics-order'],
        color: PHYSICAL_COLORS.kinetics.border,
    },
    'eq-halflife': {
        id: 'eq-halflife',
        type: 'equation',
        domain: 'physical',
        subdomain: 'kinetics',
        label: 'First-Order Half-life',
        equation: 't½ = ln 2 / k = 0.693 / k',
        variables: {
            't½': { name: 'Half-life',            units: 's'   },
            k:    { name: 'Rate constant (1st)',  units: 's⁻¹' },
        },
        derivedFrom: ['eq-firstorder'],
        linksTo: ['kinetics-halftime'],
        color: PHYSICAL_COLORS.kinetics.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// EQUILIBRIUM EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const equilibriumEquations = {
    'eq-kc': {
        id: 'eq-kc',
        type: 'equation',
        domain: 'physical',
        subdomain: 'equilibrium',
        label: 'Equilibrium Constant Expression (Kc)',
        equation: 'Kc = [C]^c[D]^d / [A]^a[B]^b',
        variables: {
            'reactants': { name: 'Reactant equilibrium concentrations [A],[B]', units: 'mol/L'         },
            'products':  { name: 'Product equilibrium concentrations [C],[D]',  units: 'mol/L'         },
            'abcd':      { name: 'Stoichiometric coefficients a,b,c,d',        units: 'dimensionless' },
            Kc:          { name: 'Equilibrium constant',                        units: 'dimensionless' },
        },
        linksTo: ['equil-kc', 'equil-qc', 'equil-kp'],
        color: PHYSICAL_COLORS.equilibrium.border,
    },
    'eq-kp-kc': {
        id: 'eq-kp-kc',
        type: 'equation',
        domain: 'physical',
        subdomain: 'equilibrium',
        label: 'Kp–Kc Relationship',
        equation: 'Kp = Kc · (RT)^Δn',
        variables: {
            Kp:    { name: 'Equilibrium constant (pressure)', units: 'atm^(dn) or Pa^(dn)' },
            Kc:    { name: 'Equilibrium constant (conc.)',    units: 'mol^(dn)/L^(dn)'     },
            R:     { name: 'Gas constant',                    units: '0.0821 L·atm/(mol·K)' },
            T:     { name: 'Temperature',                     units: 'K'                    },
            'dn':  { name: 'Change in moles of gas (delta n)', units: 'dimensionless'       },
        },
        linksTo: ['equil-kp', 'equil-kc'],
        color: PHYSICAL_COLORS.equilibrium.border,
    },
    'eq-vanthoff-equilibrium': {
        id: 'eq-vanthoff-equilibrium',
        type: 'equation',
        domain: 'physical',
        subdomain: 'equilibrium',
        label: 'Van\'t Hoff Equation (K vs T)',
        equation: 'ln(K₂/K₁) = −ΔH°/R · (1/T₂ − 1/T₁)',
        variables: {
            'K1':  { name: 'Equilibrium constant at T1', units: 'dimensionless'    },
            'K2':  { name: 'Equilibrium constant at T2', units: 'dimensionless'    },
            'dH0': { name: 'Standard enthalpy change',  units: 'J/mol'            },
            R:     { name: 'Gas constant',               units: '8.314 J/(mol·K)' },
        },
        linksTo: ['equil-kc', 'thermo-enthalpy'],
        color: PHYSICAL_COLORS.equilibrium.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// ELECTROCHEMISTRY EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const electroEquations = {
    'eq-nernst': {
        id: 'eq-nernst',
        type: 'equation',
        domain: 'physical',
        subdomain: 'electrochemistry',
        label: 'Nernst Equation',
        equation: 'E = E° − (RT/nF) · ln Q',
        shortForm: 'E = E° − (0.0592/n) · log Q  (at 298 K)',
        variables: {
            E:    { name: 'Cell potential under non-standard conditions', units: 'V'               },
            'E0': { name: 'Standard cell potential',                     units: 'V'               },
            R:    { name: 'Gas constant',                   units: '8.314 J/(mol·K)'              },
            T:    { name: 'Temperature',                    units: 'K'                            },
            n:    { name: 'Moles of electrons transferred', units: 'mol'                          },
            F:    { name: 'Faraday constant',               units: '96485 C/mol'                 },
            Q:    { name: 'Reaction quotient',              units: 'dimensionless'                },
        },
        linksTo: ['electro-nernst', 'equil-qc', 'electro-sep'],
        color: PHYSICAL_COLORS.electrochemistry.border,
    },
    'eq-gibbs-ecell': {
        id: 'eq-gibbs-ecell',
        type: 'equation',
        domain: 'physical',
        subdomain: 'electrochemistry',
        label: 'Gibbs Energy and Cell EMF',
        equation: 'ΔG = −nFE°cell',
        variables: {
            'dG':    { name: 'Gibbs free energy change', units: 'J/mol'       },
            n:       { name: 'Moles of electrons',        units: 'mol'         },
            F:       { name: 'Faraday constant',          units: '96485 C/mol' },
            'E0cell': { name: 'Standard cell potential',  units: 'V'           },
        },
        derivedFrom: ['thermo-gibbs', 'electro-galvanic'],
        color: PHYSICAL_COLORS.electrochemistry.border,
    },
    'eq-faraday': {
        id: 'eq-faraday',
        type: 'equation',
        domain: 'physical',
        subdomain: 'electrochemistry',
        label: 'Faraday\'s Laws of Electrolysis',
        equation: 'm = (M · I · t) / (n · F)',
        variables: {
            m: { name: 'Mass deposited/liberated', units: 'g'              },
            M: { name: 'Molar mass of substance',  units: 'g/mol'          },
            I: { name: 'Current',                  units: 'A (Amperes)'    },
            t: { name: 'Time',                     units: 's (seconds)'    },
            n: { name: 'Electrons transferred',    units: 'mol'            },
            F: { name: 'Faraday constant',         units: '96485 C/mol'    },
        },
        linksTo: ['electro-electrolysis'],
        color: PHYSICAL_COLORS.electrochemistry.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTIONS EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const solutionsEquations = {
    'eq-raoult': {
        id: 'eq-raoult',
        type: 'equation',
        domain: 'physical',
        subdomain: 'solutions',
        label: 'Raoult\'s Law',
        equation: 'P_A = χ_A · P°_A',
        variables: {
            'P_A':  { name: 'Partial vapour pressure of A', units: 'Pa or atm'     },
            'χ_A':  { name: 'Mole fraction of A',           units: 'dimensionless' },
            'P°_A': { name: 'Vapour pressure of pure A',    units: 'Pa or atm'     },
        },
        corollary: 'ΔP = χ_B · P°_A  (relative vapour pressure lowering)',
        linksTo: ['soln-raoult', 'soln-colligative'],
        color: PHYSICAL_COLORS.solutions.border,
    },
    'eq-ebpt': {
        id: 'eq-ebpt',
        type: 'equation',
        domain: 'physical',
        subdomain: 'solutions',
        label: 'Boiling Point Elevation',
        equation: 'ΔTb = i · Kb · m',
        variables: {
            'ΔTb': { name: 'Boiling point elevation',         units: 'K or °C'      },
            i:     { name: 'van\'t Hoff factor',              units: 'dimensionless' },
            Kb:    { name: 'Ebullioscopic constant (water: 0.512)', units: 'K·kg/mol' },
            m:     { name: 'Molality of solution',            units: 'mol/kg'        },
        },
        linksTo: ['soln-ebfp', 'soln-vanthoff'],
        color: PHYSICAL_COLORS.solutions.border,
    },
    'eq-fpd': {
        id: 'eq-fpd',
        type: 'equation',
        domain: 'physical',
        subdomain: 'solutions',
        label: 'Freezing Point Depression',
        equation: 'ΔTf = i · Kf · m',
        variables: {
            'ΔTf': { name: 'Freezing point depression',       units: 'K or °C'      },
            i:     { name: 'van\'t Hoff factor',              units: 'dimensionless' },
            Kf:    { name: 'Cryoscopic constant (water: 1.86)', units: 'K·kg/mol'   },
            m:     { name: 'Molality of solution',            units: 'mol/kg'        },
        },
        linksTo: ['soln-ebfp', 'soln-vanthoff'],
        color: PHYSICAL_COLORS.solutions.border,
    },
    'eq-osmotic': {
        id: 'eq-osmotic',
        type: 'equation',
        domain: 'physical',
        subdomain: 'solutions',
        label: 'Osmotic Pressure (van\'t Hoff)',
        equation: 'π = iMRT',
        variables: {
            π: { name: 'Osmotic pressure',      units: 'Pa or atm'     },
            i: { name: 'van\'t Hoff factor',   units: 'dimensionless' },
            M: { name: 'Molarity',              units: 'mol/L'         },
            R: { name: 'Gas constant',          units: '0.0821 L·atm/(mol·K)' },
            T: { name: 'Temperature',           units: 'K'             },
        },
        linksTo: ['soln-osmotic', 'soln-vanthoff'],
        color: PHYSICAL_COLORS.solutions.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATISTICAL MECHANICS EQUATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const statisticalMechEquations = {
    'eq-boltzmann': {
        id: 'eq-boltzmann',
        type: 'equation',
        domain: 'physical',
        subdomain: 'statisticalMech',
        label: 'Boltzmann Distribution',
        equation: 'p_i = (1/Z) · e^(−E_i/kT)',
        variables: {
            'p_i': { name: 'Probability of state i', units: 'dimensionless' },
            'E_i': { name: 'Energy of state i', units: 'J' },
            k: { name: 'Boltzmann constant', units: '1.381×10^-23 J/K' },
            T: { name: 'Temperature', units: 'K' },
            Z: { name: 'Partition function', units: 'dimensionless' },
        },
        derivedFrom: ['stat-boltzmann', 'stat-partition'],
        linksTo: ['stat-partition'],
        color: PHYSICAL_COLORS.statisticalMech.border,
    },
    'eq-partition': {
        id: 'eq-partition',
        type: 'equation',
        domain: 'physical',
        subdomain: 'statisticalMech',
        label: 'Partition Function',
        equation: 'Z = Σ e^(−E_i/kT)',
        variables: {
            Z: { name: 'Partition function', units: 'dimensionless' },
            'E_i': { name: 'Energy of state i', units: 'J' },
            k: { name: 'Boltzmann constant', units: '1.381×10^-23 J/K' },
            T: { name: 'Temperature', units: 'K' },
        },
        derivedFrom: ['stat-partition'],
        linksTo: ['stat-boltzmann', 'thermo-entropy', 'thermo-internal'],
        color: PHYSICAL_COLORS.statisticalMech.border,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Master flat export — all equations in one map
// ─────────────────────────────────────────────────────────────────────────────
export const equations = {
    ...thermoEquations,
    ...kineticsEquations,
    ...equilibriumEquations,
    ...electroEquations,
    ...solutionsEquations,
    ...statisticalMechEquations,
};

export default equations;
