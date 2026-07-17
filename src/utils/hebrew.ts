/** Maps final letter forms to their regular form, e.g. ך -> כ. */
const FINAL_TO_REGULAR: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

const HEBREW_WORD_PATTERN = /^[א-ת]+$/;

/**
 * Strips nikud/cantillation marks and unifies final letter forms so two
 * Hebrew strings can be compared regardless of typing convention. This is
 * what lets `checkBoardCompletion` treat ם and מ as equal even though the
 * stored solution may use one and the player's keyboard produced the other.
 */
export function normalizeHebrewWord(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/[֑-ׇ]/g, '')
    .trim()
    .split('')
    .map((ch) => FINAL_TO_REGULAR[ch] ?? ch)
    .join('');
}

/** True if `word` (after normalization) consists only of Hebrew letters, length >= 2. */
export function isValidHebrewWord(word: string): boolean {
  const normalized = normalizeHebrewWord(word);
  return HEBREW_WORD_PATTERN.test(normalized) && normalized.length >= 2;
}

/**
 * Given a normalized word and the index of a letter within it, returns the
 * letter in its correct visual form — final form if it's the last letter
 * and a final form exists, regular form otherwise. Used by the keyboard so
 * players never have to hunt for ך/ם/ן/ף/ץ manually.
 */
export function letterFormForPosition(word: string, index: number): string {
  const letter = word[index];
  if (index !== word.length - 1) return letter;
  const finalForm = Object.entries(FINAL_TO_REGULAR).find(([, regular]) => regular === letter);
  return finalForm ? finalForm[0] : letter;
}

/** Regular-form Hebrew alphabet, in keyboard order (final forms are auto-applied, never typed directly). */
export const HEBREW_ALPHABET = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
  'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ',
  'ק', 'ר', 'ש', 'ת',
];
