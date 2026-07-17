import type { PuzzleBoard } from '../types/grid';
import type { Dictionary } from '../types/dictionary';
import { enumerateSolutions } from './csp';
import { indexByLength } from './dictionaryIndex';

/**
 * Counts how many distinct full solutions the crossing constraints +
 * dictionary admit for this board's word slots, stopping as soon as `cap`
 * is reached (we only ever need to distinguish 0 / 1 / "more than 1").
 */
export function countSolutions(board: PuzzleBoard, dictionary: Dictionary, cap = 2): number {
  const wordsByLength = indexByLength(dictionary);
  const slots = Object.values(board.words).map((w) => ({
    id: w.id,
    length: w.length,
    cells: w.cellPositions,
  }));

  let count = 0;
  for (const _ of enumerateSolutions(slots, wordsByLength, board.rows, board.cols)) {
    count++;
    if (count >= cap) break;
  }
  return count;
}

/**
 * A board is "100% solvable" in the strict sense we promise players when:
 *   - at least one solution exists (countSolutions >= 1), and
 *   - that solution is the ONLY one (countSolutions === 1, i.e. no other
 *     word choice could also satisfy every crossing letter).
 * If a puzzle has >1 valid solution, a logically correct player could fill
 * in a "wrong" but equally valid word and get stuck failing the exact
 * solution check — so we reject ambiguous boards before shipping them.
 */
export function isBoardUniquelySolvable(board: PuzzleBoard, dictionary: Dictionary): boolean {
  return countSolutions(board, dictionary, 2) === 1;
}
