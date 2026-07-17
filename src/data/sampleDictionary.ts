import type { DictionaryEntry } from '../types/dictionary';

/**
 * A small seed dictionary for local development and tests. A production
 * build should load thousands of entries (see README "Growing the
 * dictionary") from a bundled JSON file or a remote content service —
 * the engine itself doesn't care about dictionary size.
 */
export const sampleDictionary: DictionaryEntry[] = [
  // Exactly one of these starts with ש ("שיר") and exactly one 4-letter word
  // exists at all ("שמלה") — see sampleTemplate.ts: that's what makes the
  // sample puzzle's across/down crossing at ש uniquely solvable instead of
  // just satisfiable (no other word could take either slot's place).
  { id: 'w1', word: 'שיר', length: 3, clues: ['יצירה מושרת', 'מילים ולחן יחד'] },
  { id: 'w2', word: 'צמח', length: 3, clues: ['גדל באדמה, ירוק'] },
  { id: 'w3', word: 'ילד', length: 3, clues: ['בן קטן'] },
  { id: 'w4', word: 'ספר', length: 3, clues: ['יש בו דפים לקריאה'] },
  { id: 'w5', word: 'גשם', length: 3, clues: ['יורד מהעננים'] },
  { id: 'w6', word: 'לחם', length: 3, clues: ['אופים אותו מקמח'] },
  { id: 'w7', word: 'חלב', length: 3, clues: ['שותים אותו, לבן'] },
  { id: 'w8', word: 'מלך', length: 3, clues: ['שליט הממלכה'] },
  { id: 'w9', word: 'ירח', length: 3, clues: ['נראה בשמיים בלילה'] },
  { id: 'w10', word: 'דלת', length: 3, clues: ['נכנסים ויוצאים דרכה'] },
  { id: 'w11', word: 'פרח', length: 3, clues: ['עלים צבעוניים ונעימי ריח'] },
  { id: 'w12', word: 'אור', length: 3, clues: ['ההפך מחושך'] },
  { id: 'w13', word: 'שמלה', length: 4, clues: ['בגד לאישה'] },
];
