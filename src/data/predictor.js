// =============================================================================
// INTENT DETECTION + ROUTING (FIXED VERSION)
// =============================================================================

import { REACTION_SYNONYMS } from './reactions';
import { COMPOUND_INFO } from './compounds';

// Utility: strict word match
const wordMatch = (text, word) => {
  return new RegExp(`\\b${word}\\b`, 'i').test(text);
};

// Utility: best scoring match
const getBestMatch = (text, map) => {
  let best = null;
  let maxScore = 0;

  for (const [key, value] of Object.entries(map)) {
    if (text.includes(key)) {
      let score = key.length;
      if (score > maxScore) {
        maxScore = score;
        best = value;
      }
    }
  }

  return best;
};

export function detectIntent(input) {
  const lower = input.toLowerCase();

  // ============================================================
  // 🔥 STEP 1: STRONG REACTION INTENT (PRIORITY)
  // ============================================================
  const reactionIntentWords = [
    'reagent',
    'reagents',
    'mechanism',
    'reaction',
    'product',
    'convert',
    'conversion',
    'synthesis',
    'prepare',
    'how'
  ];

  if (reactionIntentWords.some(word => lower.includes(word))) {
    const reaction = getBestMatch(lower, REACTION_SYNONYMS);
    if (reaction) {
      return { type: 'reaction', key: reaction };
    }
  }

  // ============================================================
  // 🔥 STEP 2: DIRECT REACTION MATCH
  // ============================================================
  for (const [kw, reactionKey] of Object.entries(REACTION_SYNONYMS)) {
    if (wordMatch(lower, kw)) {
      return { type: 'reaction', key: reactionKey };
    }
  }

  // ============================================================
  // 🔥 STEP 3: COMPOUND DETECTION (STRICT)
  // ============================================================
  for (const [compound, data] of Object.entries(COMPOUND_INFO)) {
    const names = data.names || [];

    if (names.some(name => wordMatch(lower, name))) {
      return { type: 'compound', key: compound };
    }
  }

  // ============================================================
  // 🔥 STEP 4: FALLBACK (TRY REACTION AGAIN)
  // ============================================================
  const fallbackReaction = getBestMatch(lower, REACTION_SYNONYMS);
  if (fallbackReaction) {
    return { type: 'reaction', key: fallbackReaction };
  }

  // ============================================================
  // UNKNOWN
  // ============================================================
  return { type: 'unknown' };
}