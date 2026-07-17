import type { Direction } from '../types/grid';

export type TemplateCellKind = 'letter' | 'block' | 'clue';

export interface TemplateArrow {
  direction: Direction;
  /** The id of the word slot (see slotId()) this arrow points to. */
  slotId: string;
}

export interface TemplateCell {
  kind: TemplateCellKind;
  /** Only meaningful when kind === 'clue'. Up to 2 arrows (across + down). */
  arrows?: TemplateArrow[];
}

/**
 * The empty "skeleton" of a puzzle: which cells are letters, which are
 * black blocks, and which are clue cells (with arrows wired to the word
 * slots they describe). Designers build this by hand or generate it
 * algorithmically; `generateBoard` fills in the letters.
 */
export type Template = TemplateCell[][];

export interface WordSlotDef {
  id: string;
  direction: Direction;
  length: number;
  cells: Array<{ row: number; col: number }>;
  clueCell: { row: number; col: number };
}

/** Deterministic id for the word starting at (row, col) in the given direction. */
export function slotId(direction: Direction, row: number, col: number): string {
  return `${direction === 'across' ? 'A' : 'D'}-${row}-${col}`;
}

/**
 * Scans a template for runs of consecutive letter cells (length >= 2) and
 * returns one WordSlotDef per run, resolving each run's clue cell by
 * searching the template for an arrow that references its slot id.
 *
 * Throws if a run of letters has no clue cell pointing at it — that is a
 * template authoring bug (an unsolvable/unclued word), and we want to catch
 * it at build time rather than ship a broken puzzle.
 */
export function deriveWordSlots(template: Template): WordSlotDef[] {
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const isLetter = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols && template[r][c].kind === 'letter';

  const slots: WordSlotDef[] = [];

  // Across runs.
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (isLetter(r, c) && !isLetter(r, c - 1)) {
        const startCol = c;
        let len = 0;
        while (isLetter(r, startCol + len)) len++;
        if (len >= 2) {
          const cells = Array.from({ length: len }, (_, i) => ({ row: r, col: startCol + i }));
          slots.push({
            id: slotId('across', r, startCol),
            direction: 'across',
            length: len,
            cells,
            clueCell: findClueCell(template, 'across', r, startCol),
          });
        }
        c = startCol + Math.max(len, 1);
      } else {
        c++;
      }
    }
  }

  // Down runs.
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      if (isLetter(r, c) && !isLetter(r - 1, c)) {
        const startRow = r;
        let len = 0;
        while (isLetter(startRow + len, c)) len++;
        if (len >= 2) {
          const cells = Array.from({ length: len }, (_, i) => ({ row: startRow + i, col: c }));
          slots.push({
            id: slotId('down', startRow, c),
            direction: 'down',
            length: len,
            cells,
            clueCell: findClueCell(template, 'down', startRow, c),
          });
        }
        r = startRow + Math.max(len, 1);
      } else {
        r++;
      }
    }
  }

  return slots;
}

function findClueCell(
  template: Template,
  direction: Direction,
  startRow: number,
  startCol: number
): { row: number; col: number } {
  const id = slotId(direction, startRow, startCol);
  for (let r = 0; r < template.length; r++) {
    for (let c = 0; c < template[r].length; c++) {
      const cell = template[r][c];
      if (cell.kind === 'clue' && cell.arrows?.some((a) => a.slotId === id)) {
        return { row: r, col: c };
      }
    }
  }
  throw new Error(
    `Invalid template: no clue cell points to word "${id}" (${direction} word starting at ` +
      `row ${startRow}, col ${startCol}). Every word slot needs an arrow cell, or the puzzle is unsolvable.`
  );
}
