import type { Dictionary, DictionaryEntry } from '../types/dictionary';
import type { Cell, PuzzleBoard, WordSlot } from '../types/grid';
import type { Template, WordSlotDef } from './types';
import { deriveWordSlots } from './types';
import { enumerateSolutions } from './csp';
import { indexByLength, indexByWord } from './dictionaryIndex';
import { isBoardUniquelySolvable } from './solver';

export interface GenerateBoardOptions {
  template: Template;
  dictionary: Dictionary;
  id?: string;
  title?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  /** Injectable RNG so puzzle generation can be made deterministic/reproducible in tests. */
  random?: () => number;
}

/**
 * Fills a template with dictionary words via backtracking CSP and returns a
 * fully-solved PuzzleBoard (the ground-truth solution the player is working
 * toward). Throws if no assignment satisfies every crossing constraint —
 * i.e. the template/dictionary combination cannot produce a valid puzzle.
 */
export function generateBoard(opts: GenerateBoardOptions): PuzzleBoard {
  if (opts.template.length === 0 || opts.template[0].length === 0) {
    throw new Error('Template must be a non-empty rows x cols grid.');
  }

  const slotDefs = deriveWordSlots(opts.template);
  if (slotDefs.length === 0) {
    throw new Error('Template defines no word slots (no letter runs of length >= 2).');
  }

  const wordsByLength = indexByLength(opts.dictionary);
  const entryByWord = indexByWord(opts.dictionary);
  const random = opts.random ?? Math.random;

  const cspSlots = slotDefs.map((s) => ({ id: s.id, length: s.length, cells: s.cells }));
  const solutions = enumerateSolutions(
    cspSlots,
    wordsByLength,
    opts.template.length,
    opts.template[0].length,
    random
  );

  const first = solutions.next();
  if (first.done) {
    const neededLengths = [...new Set(slotDefs.map((s) => s.length))].sort((a, b) => a - b);
    throw new Error(
      `No valid crossword could be generated for this template. The dictionary needs enough ` +
        `distinct words of lengths: ${neededLengths.join(', ')} that also satisfy the crossing letters.`
    );
  }

  return buildBoard(opts.template, slotDefs, first.value, entryByWord, opts, random);
}

/**
 * `generateBoard` returns the FIRST assignment the backtracker finds —
 * that's satisfiable, but not necessarily the puzzle's only solution (a
 * logically correct player could fill in a different, equally valid word
 * and never match the stored solution). This wraps it in a
 * generate-then-verify loop: keep regenerating with fresh randomness until
 * `isBoardUniquelySolvable` confirms there is exactly one way to fill the
 * grid, which is the actual "100% solvable, no dead ends" guarantee a
 * shipped puzzle needs.
 */
export function generateUniqueBoard(opts: GenerateBoardOptions & { maxAttempts?: number }): PuzzleBoard {
  const maxAttempts = opts.maxAttempts ?? 25;
  const random = opts.random ?? Math.random;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const board = generateBoard({ ...opts, random });
      if (isBoardUniquelySolvable(board, opts.dictionary)) return board;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw new Error(
    `Could not produce a uniquely solvable board in ${maxAttempts} attempts. ` +
      `Add more distinct words per required length, or simplify the template so fewer ` +
      `words are interchangeable between slots.${lastError ? ` Last error: ${lastError.message}` : ''}`
  );
}

function buildBoard(
  template: Template,
  slotDefs: WordSlotDef[],
  assignment: Record<string, string>,
  entryByWord: Map<string, DictionaryEntry>,
  opts: GenerateBoardOptions,
  random: () => number
): PuzzleBoard {
  const rows = template.length;
  const cols = template[0].length;

  const cells: Cell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c): Cell => ({ row: r, col: c, type: 'block' }))
  );

  const words: Record<string, WordSlot> = {};
  const chosenClue: Record<string, string> = {};

  for (const slot of slotDefs) {
    // `assignment` holds the *normalized* word (final letters collapsed to
    // regular form) used for CSP matching — display/storage must use the
    // dictionary's original spelling, or a word like "כהן" would be shown
    // as the mis-spelled "כהנ".
    const normalizedWord = assignment[slot.id];
    const entry = entryByWord.get(normalizedWord);
    if (!entry) {
      throw new Error(`Internal error: solved word "${normalizedWord}" is missing from the dictionary index.`);
    }
    const displayWord = entry.word;
    chosenClue[slot.id] = entry.clues[Math.floor(random() * entry.clues.length)] ?? entry.clues[0];

    words[slot.id] = {
      id: slot.id,
      direction: slot.direction,
      row: slot.cells[0].row,
      col: slot.cells[0].col,
      length: slot.length,
      cellPositions: slot.cells,
      clueCell: slot.clueCell,
      answer: displayWord,
    };

    // Per-cell solution letters use the *normalized* (regular-form) spelling,
    // not displayWord: a cell can be the LAST letter of one crossing word
    // (which would want a final form, e.g. ן) while being a MIDDLE letter of
    // the other (which wants the regular form, e.g. נ) — the two words only
    // ever agree once finals are collapsed, so that's the only form a
    // single shared cell can consistently hold. `answer` above keeps the
    // correctly-spelled whole word (with finals) for the Answers screen.
    slot.cells.forEach(({ row, col }, idx) => {
      const existing = cells[row][col];
      const wordIds = existing.type === 'letter' ? existing.wordIds : [];
      cells[row][col] = {
        row,
        col,
        type: 'letter',
        solution: normalizedWord[idx],
        wordIds: [...wordIds, slot.id],
      };
    });
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const templateCell = template[r][c];
      if (templateCell.kind !== 'clue') continue;
      cells[r][c] = {
        row: r,
        col: c,
        type: 'clue',
        arrows: (templateCell.arrows ?? []).map((arrow) => ({
          direction: arrow.direction,
          wordId: arrow.slotId,
          text: chosenClue[arrow.slotId] ?? '',
        })),
      };
    }
  }

  return {
    id: opts.id ?? `puzzle-${Date.now()}`,
    title: opts.title ?? 'תשחצנילי',
    rows,
    cols,
    cells,
    words,
    createdAt: new Date().toISOString(),
    difficulty: opts.difficulty ?? 'medium',
  };
}
