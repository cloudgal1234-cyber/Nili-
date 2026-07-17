/**
 * Core board data model for a Hebrew "Tashvatz" (תשבץ) — a crossword variant
 * where clues live INSIDE the grid (in dedicated black "clue cells" with a
 * directional arrow), rather than in a separate numbered list.
 */

export type Direction = 'across' | 'down';

export type CellType = 'letter' | 'clue' | 'block';

interface BaseCell {
  row: number;
  col: number;
}

/** A white cell the player types a single Hebrew letter into. */
export interface LetterCell extends BaseCell {
  type: 'letter';
  /** The correct letter for this cell (unnormalized, e.g. may be a final form). */
  solution: string;
  /** Id(s) of the word slot(s) that pass through this cell — 1 or 2 (across + down). */
  wordIds: string[];
}

export interface ClueArrow {
  direction: Direction;
  text: string;
  /** The WordSlot.id this arrow/clue describes. */
  wordId: string;
}

/**
 * A black cell that holds one or two clues (an across clue, a down clue, or
 * both) instead of a letter. Rendered with an arrow glyph pointing toward
 * the first letter of the word it describes.
 */
export interface ClueCell extends BaseCell {
  type: 'clue';
  arrows: ClueArrow[];
}

/** A black cell with no content — pure grid filler. */
export interface BlockCell extends BaseCell {
  type: 'block';
}

export type Cell = LetterCell | ClueCell | BlockCell;

export interface WordSlot {
  id: string;
  direction: Direction;
  /** Row/col of the first letter cell (not the clue cell). */
  row: number;
  col: number;
  length: number;
  cellPositions: Array<{ row: number; col: number }>;
  /** Location of the black cell carrying this word's clue text + arrow. */
  clueCell: { row: number; col: number };
  answer: string;
}

export interface PuzzleBoard {
  id: string;
  title: string;
  rows: number;
  cols: number;
  /** Row-major grid: cells[row][col]. */
  cells: Cell[][];
  words: Record<string, WordSlot>;
  createdAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
