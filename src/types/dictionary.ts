/** A single dictionary entry: a candidate word plus its possible clues. */
export interface DictionaryEntry {
  id: string;
  /** Hebrew word, no nikud. May use final letter forms (ך/ם/ן/ף/ץ) or not — both are accepted. */
  word: string;
  length: number;
  /** One or more clue phrasings; the generator picks one per puzzle. */
  clues: string[];
  /** Optional topical tags, useful for themed puzzles ("animals", "food", ...). */
  tags?: string[];
}

export type Dictionary = DictionaryEntry[];
