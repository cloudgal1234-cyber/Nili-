import type { Dictionary, DictionaryEntry } from '../types/dictionary';
import { isValidHebrewWord, normalizeHebrewWord } from '../utils/hebrew';

/** Groups normalized, deduplicated dictionary words by length for O(1) domain lookup during CSP search. */
export function indexByLength(dictionary: Dictionary): Map<number, string[]> {
  const map = new Map<number, string[]>();
  const seen = new Set<string>();

  for (const entry of dictionary) {
    const word = normalizeHebrewWord(entry.word);
    if (!isValidHebrewWord(word) || seen.has(word)) continue;
    seen.add(word);
    const list = map.get(word.length) ?? [];
    list.push(word);
    map.set(word.length, list);
  }

  return map;
}

/** Maps each normalized word back to the dictionary entry that defined it (first entry wins on duplicates). */
export function indexByWord(dictionary: Dictionary): Map<string, DictionaryEntry> {
  const map = new Map<string, DictionaryEntry>();
  for (const entry of dictionary) {
    const word = normalizeHebrewWord(entry.word);
    if (!isValidHebrewWord(word) || map.has(word)) continue;
    map.set(word, entry);
  }
  return map;
}
