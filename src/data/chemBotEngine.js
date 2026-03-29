// =============================================================================
// ChemBot Knowledge Engine
// Answers questions purely from OrganicFlow's local data files
// =============================================================================

import { initialNodes, initialEdges } from '../data/knowledgeGraph';
import { mechanisms } from '../data/mechanisms';
import { reactionInfo, getReactionInfo } from '../data/reactionInfo';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalize = (s) => s?.toLowerCase().trim().replace(/['"!?.,;:]/g, '') ?? '';

/** Find a node by fuzzy label/formula match */
const findNode = (query) => {
  const q = normalize(query);
  return (
    initialNodes.find((n) => normalize(n.data.label) === q) ||
    initialNodes.find(
      (n) =>
        normalize(n.data.label).includes(q) ||
        q.includes(normalize(n.data.label)) ||
        normalize(n.data.formula ?? '').replace(/[₀-₉]/g, (c) =>
          String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))
        ) === q
    )
  );
};

/** Get all edges connected to a node */
const getEdgesFor = (nodeId) =>
  initialEdges.filter((e) => e.source === nodeId || e.target === nodeId);

/** Get neighbouring nodes */
const getNeighbours = (nodeId) => {
  const edges = getEdgesFor(nodeId);
  const ids = new Set(edges.flatMap((e) => [e.source, e.target]).filter((id) => id !== nodeId));
  return initialNodes.filter((n) => ids.has(n.id));
};

/** Get reactions (edges with labels) for a node */
const getReactionsFor = (nodeId) =>
  getEdgesFor(nodeId).filter((e) => e.label && e.label.trim());

/** Get mechanism by id */
const getMechanism = (id) => mechanisms[id];

/** Summarise a node for display */
const summariseNode = (node) => {
  const d = node.data;
  return {
    label: d.label,
    formula: d.formula,
    series: d.details?.series ?? (d.isElement ? 'Element' : 'Compound'),
    description: d.description,
    details: d.details,
    mechanismIds: d.mechanismIds ?? [],
  };
};

// ─── Intent Patterns ─────────────────────────────────────────────────────────

const INTENTS = [
  { pattern: /what is (.+)/i,                           handler: 'define' },
  { pattern: /tell me about (.+)/i,                     handler: 'define' },
  { pattern: /describe (.+)/i,                          handler: 'define' },
  { pattern: /explain (.+)/i,                           handler: 'define' },
  { pattern: /formula (?:of|for) (.+)/i,                handler: 'formula' },
  { pattern: /structure (?:of|for) (.+)/i,              handler: 'formula' },
  { pattern: /what(?:'s| is) the formula (?:of|for) (.+)/i, handler: 'formula' },
  { pattern: /reactions? (?:of|for|involving) (.+)/i,   handler: 'reactions' },
  { pattern: /how (?:is|does) (.+) react/i,             handler: 'reactions' },
  { pattern: /what reactions? (?:does|can) (.+)/i,      handler: 'reactions' },
  { pattern: /mechanism (?:of|for) (.+)/i,              handler: 'mechanism' },
  { pattern: /how does (.+) work/i,                     handler: 'mechanism' },
  { pattern: /steps? (?:of|for|in) (.+)/i,              handler: 'mechanism' },
  { pattern: /reagents? (?:for|of) (.+)/i,              handler: 'reagents' },
  { pattern: /conditions? (?:for|of) (.+)/i,            handler: 'conditions' },
  { pattern: /compare (.+) (?:and|with|to) (.+)/i,      handler: 'compare' },
  { pattern: /difference between (.+) and (.+)/i,       handler: 'compare' },
  { pattern: /related to (.+)/i,                        handler: 'related' },
  { pattern: /connected to (.+)/i,                      handler: 'related' },
  { pattern: /neighbours? of (.+)/i,                    handler: 'related' },
  { pattern: /what (?:series|group|family) is (.+)/i,   handler: 'series' },
  { pattern: /which series (?:does|is) (.+)/i,          handler: 'series' },
  { pattern: /(?:test|identify|detect) (.+)/i,          handler: 'test' },
  { pattern: /how (?:to )?make (.+)/i,                  handler: 'synthesis' },
  { pattern: /(?:synthesise|synthesis|prepare|make) (.+)/i, handler: 'synthesis' },
  { pattern: /from (.+) (?:to|make|get|produce) (.+)/i, handler: 'pathway' },
  { pattern: /convert (.+) to (.+)/i,                   handler: 'pathway' },
  { pattern: /list (?:all )?(.+)/i,                     handler: 'list' },
  { pattern: /show (?:me )?(.+)/i,                      handler: 'define' },
];

// ─── Response Builders ───────────────────────────────────────────────────────

const handlers = {

  define(match, context) {
    const query = match[1];
    // Try reaction info first
    const ri = getReactionInfo(query);
    if (ri) return formatReactionInfo(ri);

    // Try node
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) return notFound(query);
    return formatNodeInfo(node);
  },

  formula(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) return notFound(query);
    const d = node.data;
    const lines = [
      `**${d.label}**`,
      `Molecular formula: **${d.formula}**`,
    ];
    if (d.details?.series) lines.push(`Series: ${d.details.series}`);
    if (d.details?.general) lines.push(`General formula: ${d.details.general}`);
    if (d.details?.functionalGroup) lines.push(`Functional group: ${d.details.functionalGroup}`);
    if (d.details?.hybridization) lines.push(`Hybridisation: ${d.details.hybridization}`);
    if (d.details?.bondAngle) lines.push(`Bond angle: ${d.details.bondAngle}`);
    return lines.join('\n');
  },

  reactions(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) return notFound(query);

    const edges = getReactionsFor(node.id);
    if (edges.length === 0)
      return `No reactions found for **${node.data.label}** in the knowledge graph.`;

    const lines = [`**Reactions involving ${node.data.label}:**\n`];
    edges.forEach((e) => {
      const other = initialNodes.find((n) =>
        n.id === (e.source === node.id ? e.target : e.source)
      );
      const direction = e.source === node.id ? '→' : '←';
      lines.push(
        `• ${node.data.label} ${direction} **${other?.data.label ?? '?'}** via **${e.label}**` +
          (e.data?.reagents ? `\n  Reagents: ${e.data.reagents}` : '')
      );
    });
    return lines.join('\n');
  },

  mechanism(match, context) {
    const query = match[1];
    // Try reaction info
    const ri = getReactionInfo(query);
    if (ri?.relatedMechanisms?.length) {
      const mech = getMechanism(ri.relatedMechanisms[0]);
      if (mech) return formatMechanism(mech);
    }

    // Try direct mechanism lookup
    const mechKey = Object.keys(mechanisms).find((k) =>
      normalize(k).includes(normalize(query)) ||
      normalize(mechanisms[k].title ?? '').includes(normalize(query))
    );
    if (mechKey) return formatMechanism(mechanisms[mechKey]);

    // Try node's mechanism IDs
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (node?.data.mechanismIds?.length) {
      const mech = getMechanism(node.data.mechanismIds[0]);
      if (mech) return formatMechanism(mech);
    }

    return `No step-by-step mechanism found for "${query}". Try clicking the ▶ Play Mechanism button in the graph panel!`;
  },

  reagents(match, context) {
    const query = match[1];
    const ri = getReactionInfo(query);
    if (ri) {
      const lines = [`**Reagents for ${ri.name}:**\n`];
      lines.push(`Reagents: **${ri.reagents}**`);
      if (ri.catalyst) lines.push(`Catalyst: **${ri.catalyst}**`);
      if (ri.conditions) lines.push(`Conditions: ${ri.conditions}`);
      return lines.join('\n');
    }

    // Try edges
    const edges = initialEdges.filter((e) =>
      normalize(e.label ?? '').includes(normalize(query))
    );
    if (edges.length) {
      const e = edges[0];
      return `**${e.label}** reaction uses: **${e.data?.reagents ?? 'See reaction panel for details'}**`;
    }

    return notFound(query);
  },

  conditions(match, context) {
    const query = match[1];
    const ri = getReactionInfo(query);
    if (ri) {
      return `**Conditions for ${ri.name}:**\n\n${ri.conditions}\n\nCatalyst: ${ri.catalyst ?? 'none'}`;
    }
    return notFound(query);
  },

  compare(match, context) {
    const [, a, b] = match;
    const nodeA = findNode(a);
    const nodeB = findNode(b);
    const riA = getReactionInfo(a);
    const riB = getReactionInfo(b);

    if (nodeA && nodeB) return compareNodes(nodeA, nodeB);
    if (riA && riB) return compareReactions(riA, riB);
    if (nodeA) return formatNodeInfo(nodeA);
    if (riA) return formatReactionInfo(riA);
    return notFound(`${a} or ${b}`);
  },

  related(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) return notFound(query);

    const neighbours = getNeighbours(node.id);
    if (!neighbours.length)
      return `**${node.data.label}** has no connected molecules in the current graph.`;

    const lines = [`**Molecules connected to ${node.data.label}:**\n`];
    neighbours.forEach((n) => {
      const edge = initialEdges.find(
        (e) =>
          (e.source === node.id && e.target === n.id) ||
          (e.target === node.id && e.source === n.id)
      );
      lines.push(`• **${n.data.label}** (${n.data.formula ?? ''}) via ${edge?.label ?? 'structural link'}`);
    });
    return lines.join('\n');
  },

  series(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) return notFound(query);

    const series = node.data.details?.series;
    if (!series) return `**${node.data.label}** doesn't have a series classification in the data.`;

    const members = initialNodes
      .filter((n) => n.data.details?.series === series)
      .sort((a, b) => (a.data.details?.carbonCount ?? 0) - (b.data.details?.carbonCount ?? 0));

    const lines = [
      `**${node.data.label}** belongs to the **${series}** series.\n`,
      `Members in the knowledge graph:`,
      ...members.map((n) => `• ${n.data.label} (${n.data.formula})`),
    ];
    return lines.join('\n');
  },

  test(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);

    const tests = {
      aldehyde: "• **Tollens' test** (silver mirror reagent) → silver mirror ✓\n• **Fehling's solution** → brick-red precipitate ✓\n• Aldehydes are reducing agents; ketones are NOT.",
      ketone: "• **Tollens' test** → no reaction ✗\n• **Fehling's solution** → no reaction ✗\n• Use **2,4-DNPH** (Brady's reagent) → orange precipitate (confirms C=O group present).",
      alkene: "• **Bromine water** → decolourises (orange → colourless) ✓\n• **Acidified KMnO₄** → decolourises (purple → colourless) ✓",
      alkane: "• **Bromine water** → no decolourisation ✗\n• Alkanes are unreactive to most reagents at room temperature.",
      alcohol: "• **Na metal** → fizzing (H₂ gas) ✓\n• **PCl₅** → white fumes of HCl ✓\n• **Acidified K₂Cr₂O₇** → colour change indicates primary/secondary.",
      carboxylic: "• **Litmus paper** → turns red (acidic) ✓\n• **Na₂CO₃** solution → fizzing (CO₂) ✓\n• pH < 7 in aqueous solution.",
      haloalkane: "• **Silver nitrate in ethanol** → white/cream/yellow precipitate (AgCl/AgBr/AgI)\n• Warm with NaOH(aq) first to hydrolyse.",
      amine: "• **Litmus paper** → turns blue (basic) ✓\n• Reacts with acids to form salts.",
    };

    if (node) {
      const s = normalize(node.data.details?.series ?? node.data.label);
      const entry = Object.entries(tests).find(([k]) => s.includes(k));
      if (entry) {
        return `**Identification test for ${node.data.label} (${entry[0]}):**\n\n${entry[1]}`;
      }
      if (node.data.details?.test) {
        return `**Test for ${node.data.label}:** ${node.data.details.test}`;
      }
    }

    const q = normalize(query);
    const entry = Object.entries(tests).find(([k]) => q.includes(k));
    if (entry) return `**Identification test for ${entry[0]}:**\n\n${entry[1]}`;

    return "Try specifying the compound type, e.g. 'test for aldehyde', 'identify alkene', 'how to test for alcohol'.";
  },

  synthesis(match, context) {
    const query = match[1];
    const node = findNode(query) ?? (context ? findNode(context.label) : null);
    if (!node) {
      const ri = getReactionInfo(query);
      if (ri) return formatReactionInfo(ri);
      return notFound(query);
    }

    const incomingEdges = initialEdges.filter((e) => e.target === node.id && e.label);
    if (!incomingEdges.length)
      return `No synthesis routes found leading to **${node.data.label}** in the graph.`;

    const lines = [`**How to synthesise ${node.data.label}:**\n`];
    incomingEdges.forEach((e) => {
      const src = initialNodes.find((n) => n.id === e.source);
      lines.push(
        `• From **${src?.data.label ?? e.source}** via **${e.label}**` +
          (e.data?.reagents ? `\n  Using: ${e.data.reagents}` : '')
      );
    });
    return lines.join('\n');
  },

  pathway(match, context) {
    const [, from, to] = match;
    const nodeFrom = findNode(from);
    const nodeTo = findNode(to);

    if (!nodeFrom) return notFound(from);
    if (!nodeTo) return notFound(to);

    // Direct edge
    const direct = initialEdges.find(
      (e) => e.source === nodeFrom.id && e.target === nodeTo.id && e.label
    );
    if (direct) {
      return (
        `**${nodeFrom.data.label} → ${nodeTo.data.label}**\n\n` +
        `Reaction: **${direct.label}**\n` +
        (direct.data?.reagents ? `Reagents: ${direct.data.reagents}` : '')
      );
    }

    // 2-step path
    const via = initialEdges
      .filter((e1) => e1.source === nodeFrom.id)
      .flatMap((e1) =>
        initialEdges
          .filter((e2) => e2.source === e1.target && e2.target === nodeTo.id)
          .map((e2) => ({ e1, e2, mid: initialNodes.find((n) => n.id === e1.target) }))
      );

    if (via.length) {
      const { e1, e2, mid } = via[0];
      return (
        `**${nodeFrom.data.label} → ${nodeTo.data.label}** (2 steps)\n\n` +
        `Step 1: **${e1.label}** → ${mid?.data.label}\n` +
        (e1.data?.reagents ? `  Reagents: ${e1.data.reagents}\n` : '') +
        `Step 2: **${e2.label}** → ${nodeTo.data.label}\n` +
        (e2.data?.reagents ? `  Reagents: ${e2.data.reagents}` : '')
      );
    }

    return `No direct pathway found from **${nodeFrom.data.label}** to **${nodeTo.data.label}** in the graph. Try searching both nodes individually.`;
  },

  list(match, context) {
    const query = normalize(match[1]);
    const series = ['Alkane', 'Alkene', 'Alkyne', 'Alcohol', 'Aldehyde', 'Ketone',
      'Carboxylic Acid', 'Ester', 'Ether', 'Amine', 'Amide', 'Nitrile', 'Haloalkane', 'Aromatic'];
    const matched = series.find((s) => query.includes(s.toLowerCase()));

    if (matched) {
      const members = initialNodes
        .filter((n) => n.data.details?.series === matched)
        .sort((a, b) => (a.data.details?.carbonCount ?? 0) - (b.data.details?.carbonCount ?? 0));
      if (members.length) {
        return (
          `**${matched} series (${members.length} members):**\n\n` +
          members.map((n) => `• ${n.data.label} — ${n.data.formula}`).join('\n')
        );
      }
    }

    if (query.includes('reaction') || query.includes('mechanism')) {
      const keys = Object.keys(mechanisms);
      return `**Available mechanisms (${keys.length}):**\n\n` +
        keys.map((k) => `• ${mechanisms[k].title ?? k}`).join('\n');
    }

    return `Try: "list all alkanes", "list alkenes", "list reactions", "list mechanisms".`;
  },
};

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatNodeInfo(node) {
  const d = node.data;
  const s = summariseNode(node);
  const lines = [
    `**${s.label}** (${s.formula})`,
    '',
    s.description,
  ];

  if (s.series && s.series !== 'Compound') lines.push(`\nSeries: **${s.series}**`);
  if (d.details?.hybridization) lines.push(`Hybridisation: ${d.details.hybridization}`);
  if (d.details?.bondAngle) lines.push(`Bond angle: ${d.details.bondAngle}`);
  if (d.details?.functionalGroup) lines.push(`Functional group: ${d.details.functionalGroup}`);
  if (d.details?.general) lines.push(`General formula: ${d.details.general}`);
  if (d.details?.pH) lines.push(`pH character: ${d.details.pH}`);
  if (d.details?.test) lines.push(`Identification test: ${d.details.test}`);
  if (d.details?.atomicNumber) {
    lines.push(`\nAtomic number: ${d.details.atomicNumber}`);
    lines.push(`Atomic mass: ${d.details.mass}`);
    lines.push(`Electronegativity: ${d.details.electronegativity}`);
    lines.push(`Valence: ${d.details.valence}`);
  }

  const reactions = getReactionsFor(node.id);
  if (reactions.length) {
    lines.push(`\nConnected via ${reactions.length} reaction(s) — ask "reactions of ${s.label}" for details.`);
  }

  if (s.mechanismIds.length) {
    lines.push(`\nMechanisms available: ${s.mechanismIds.length}. Click ▶ in the panel or ask "mechanism of ${s.label}".`);
  }

  return lines.join('\n');
}

function formatReactionInfo(ri) {
  const lines = [
    `**${ri.name}** — ${ri.type}`,
    '',
    ri.summary,
    '',
    `Reagents: **${ri.reagents}**`,
    ri.catalyst ? `Catalyst: **${ri.catalyst}**` : null,
    `Conditions: ${ri.conditions}`,
    '',
    `**Mechanism overview:**\n${ri.mechanism}`,
    '',
    ri.example ? `Example: \`${ri.example}\`` : null,
    ri.energetics ? `Energetics: ${ri.energetics}` : null,
  ].filter(Boolean);

  if (ri.keyPoints?.length) {
    lines.push('\n**Key points:**');
    ri.keyPoints.forEach((p) => lines.push(`• ${p}`));
  }

  return lines.join('\n');
}

function formatMechanism(mech) {
  const lines = [
    `**${mech.title}**`,
    `Reaction: \`${mech.reaction}\``,
    '',
    `${mech.steps.length} steps:`,
  ];
  mech.steps.forEach((step, i) => {
    lines.push(`\n**Step ${i + 1}:** ${step.description}`);
  });
  lines.push('\nUse the ▶ Play Mechanism button in the panel to see the animation!');
  return lines.join('\n');
}

function compareNodes(a, b) {
  const da = a.data;
  const db = b.data;
  return [
    `**${da.label} vs ${db.label}**\n`,
    `Formula: ${da.formula} vs ${db.formula}`,
    `Series: ${da.details?.series ?? '—'} vs ${db.details?.series ?? '—'}`,
    da.details?.hybridization
      ? `Hybridisation: ${da.details.hybridization} vs ${db.details?.hybridization ?? '—'}`
      : null,
    da.details?.bondAngle
      ? `Bond angle: ${da.details.bondAngle} vs ${db.details?.bondAngle ?? '—'}`
      : null,
    da.details?.functionalGroup
      ? `Functional group: ${da.details.functionalGroup} vs ${db.details?.functionalGroup ?? '—'}`
      : null,
    `\n${da.label}: ${da.description}`,
    `\n${db.label}: ${db.description}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function compareReactions(a, b) {
  return [
    `**${a.name} vs ${b.name}**\n`,
    `Type: ${a.type} vs ${b.type}`,
    `Reagents: ${a.reagents} vs ${b.reagents}`,
    `Catalyst: ${a.catalyst ?? 'none'} vs ${b.catalyst ?? 'none'}`,
    `Conditions: ${a.conditions} vs ${b.conditions}`,
    `\n${a.name}: ${a.summary}`,
    `\n${b.name}: ${b.summary}`,
  ].join('\n');
}

function notFound(query) {
  return `I couldn't find "${query}" in OrganicFlow's knowledge base. Try searching by IUPAC name (e.g. "ethanol", "propanone") or reaction name (e.g. "esterification", "hydration").`;
}

// ─── Context-aware fallback ───────────────────────────────────────────────────

function contextFallback(input, context) {
  if (!context) return generalFallback(input);

  const q = normalize(input);
  const node = findNode(context.label);

  // Keyword triggers on context
  if (q.includes('formula') || q.includes('structure')) return handlers.formula([null, context.label], context);
  if (q.includes('reaction') || q.includes('react'))    return handlers.reactions([null, context.label], context);
  if (q.includes('mechanism') || q.includes('step'))    return handlers.mechanism([null, context.label], context);
  if (q.includes('reagent') || q.includes('use'))       return handlers.reagents([null, context.label], context);
  if (q.includes('condition'))                           return handlers.conditions([null, context.label], context);
  if (q.includes('test') || q.includes('identify'))     return handlers.test([null, context.label], context);
  if (q.includes('make') || q.includes('synthes'))      return handlers.synthesis([null, context.label], context);
  if (q.includes('related') || q.includes('connect'))   return handlers.related([null, context.label], context);
  if (q.includes('series') || q.includes('group') || q.includes('family')) return handlers.series([null, context.label], context);

  // Default: describe the context item
  if (context.type === 'reaction') {
    const ri = getReactionInfo(context.label);
    if (ri) return formatReactionInfo(ri);
  }
  if (node) return formatNodeInfo(node);

  return generalFallback(input);
}

function generalFallback(input) {
  const suggestions = [
    'what is ethanol',
    'reactions of propene',
    'mechanism of esterification',
    'formula of propanone',
    'compare aldehyde and ketone',
    'how to make bromoethane',
    'list all alkanes',
    'test for alkene',
    'reagents for hydration',
  ];
  const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
  return `I didn't quite catch that. I can answer questions about molecules, reactions, mechanisms, reagents, and conditions from OrganicFlow's knowledge base.\n\nTry asking: "${pick}"`;
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

/**
 * Processes a user message and returns a string answer using local data only.
 * @param {string} input - The user's message
 * @param {object|null} context - The currently selected node/edge context
 * @returns {string} - Formatted answer
 */
export function answerQuery(input, context = null) {
  if (!input?.trim()) return 'Please type a question!';

  const text = input.trim();

  // Try each intent pattern
  for (const { pattern, handler } of INTENTS) {
    const match = text.match(pattern);
    if (match && handlers[handler]) {
      try {
        const result = handlers[handler](match, context);
        if (result) return result;
      } catch (e) {
        console.error('ChemBot handler error:', e);
      }
    }
  }

  // Context-aware fallback
  return contextFallback(text, context);
}

/**
 * Returns suggested questions based on the current context
 * @param {object|null} context
 * @returns {string[]}
 */
export function getSuggestions(context) {
  if (!context) {
    return [
      'What is ethanol?',
      'List all alkanes',
      'How does hydrogenation work?',
      'Compare aldehyde and ketone',
    ];
  }

  const label = context.label;
  if (context.type === 'reaction') {
    return [
      `What are the reagents for ${label}?`,
      `What are the conditions for ${label}?`,
      `Explain the mechanism of ${label}`,
      `Give me an example of ${label}`,
    ];
  }
  return [
    `What is ${label}?`,
    `Reactions of ${label}`,
    `How to make ${label}?`,
    `Which series is ${label} in?`,
  ];
}
