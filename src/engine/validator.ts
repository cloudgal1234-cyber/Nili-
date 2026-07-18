import type { PuzzleBoard } from '../types/grid';
import type { Dictionary } from '../types/dictionary';
import { isValidHebrewWord, normalizeHebrewWord } from '../utils/hebrew';

export interface ValidationIssue {
  code:
    | 'WORD_NOT_IN_DICTIONARY'
    | 'INVALID_HEBREW'
    | 'ORPHAN_CELL'
    | 'DUPLICATE_WORD'
    | 'INTERSECTION_MISMATCH';
  message: string;
  row?: number;
  col?: number;
}

/**
 * Structural + lexical validation of a generated board: every answer is a
 * real dictionary word made only of Hebrew letters, no word is reused, no
 * letter cell is orphaned (belongs to zero words), and every crossing cell
 * agrees between the words that share it. This does NOT check uniqueness
 * of solution — use `isBoardUniquelySolvable` from ./solver for that.
 */
export function validateGeneratedBoard(board: PuzzleBoard, dictionary: Dictionary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const dictSet = new Set(dictionary.map((e) => normalizeHebrewWord(e.word)));
  const seenWords = new Set<string>();

  for (const slot of Object.values(board.words)) {
    const answer = normalizeHebrewWord(slot.answer);

    if (!isValidHebrewWord(answer)) {
      issues.push({
        code: 'INVALID_HEBREW',
        message: `"${slot.answer}" (${slot.id}) contains characters outside the Hebrew alphabet.`,
      });
    }
    if (!dictSet.has(answer)) {
      issues.push({
        code: 'WORD_NOT_IN_DICTIONARY',
        message: `"${slot.answer}" (${slot.id}) is not present in the dictionary.`,
      });
    }
    if (seenWords.has(answer)) {
      issues.push({ code: 'DUPLICATE_WORD', message: `"${slot.answer}" is used more than once in this puzzle.` });
    }
    seenWords.add(answer);
  }

  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.type !== 'letter') continue;
      if (cell.wordIds.length === 0) {
        issues.push({
          code: 'ORPHAN_CELL',
          message: 'Letter cell does not belong to any word.',
          row: cell.row,
          col: cell.col,
        });
        continue;
      }
      for (const wordId of cell.wordIds) {
        const slot = board.words[wordId];
        if (!slot) continue;
        const idx = slot.cellPositions.findIndex((p) => p.row === cell.row && p.col === cell.col);
        // Compare normalized: cell.solution is deliberately stored in
        // regular-letter form (see generator.ts) so a cell that's the final
        // letter of one crossing word but a medial letter of the other has
        // one consistent value; slot.answer keeps the correctly-spelled
        // whole word, so it must be normalized here before comparing.
        if (idx >= 0 && normalizeHebrewWord(slot.answer)[idx] !== cell.solution) {
          issues.push({
            code: 'INTERSECTION_MISMATCH',
            message: `Cell letter "${cell.solution}" does not match word "${slot.answer}" (${wordId}) at this position.`,
            row: cell.row,
            col: cell.col,
          });
        }
      }
    }
  }

  return issues;
}

/**
 * The single source of truth for unlocking the Answers page: every letter
 * cell in the board must be filled AND correct. Comparison is done through
 * `normalizeHebrewWord` per-letter so a player typing a regular-form letter
 * where the solution uses a final form (or vice versa) still counts as
 * correct — the game is checking spelling, not keyboard trivia.
 */
export function checkBoardCompletion(userGrid: string[][], board: PuzzleBoard): boolean {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const cell = board.cells[r][c];
      if (cell.type !== 'letter') continue;

      const userLetter = normalizeHebrewWord(userGrid[r]?.[c] ?? '');
      const solutionLetter = normalizeHebrewWord(cell.solution);
      if (!userLetter || userLetter !== solutionLetter) {
        return false;
      }
    }
  }
  return true;
}
