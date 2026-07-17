/**
 * Generic constraint-satisfaction backtracking core shared by the generator
 * (which wants ONE valid solution) and the solver (which wants to know HOW
 * MANY solutions exist, to prove a generated puzzle is unambiguous).
 *
 * This is a classic word-square / crossword-fill CSP:
 *   - variables = word slots
 *   - domain(slot) = dictionary words of the right length that don't
 *     conflict with letters already placed by intersecting slots
 *   - constraint = every crossing cell must agree between the two words
 *     that share it
 *
 * We use a most-constrained-variable ordering (slots with the most
 * crossings, and longest, go first) so that bad guesses fail fast near the
 * root of the search tree instead of deep inside it — this is what keeps
 * the backtracking from blowing up on anything but pathological templates.
 */

export interface CspSlot {
  id: string;
  length: number;
  cells: Array<{ row: number; col: number }>;
}

/**
 * Lazily yields every full assignment (slot id -> word) that satisfies all
 * crossing constraints. Consumers decide how many to pull:
 *   - the generator takes the first one (with a shuffled candidate order,
 *     so repeated calls produce different-looking puzzles)
 *   - the solver pulls up to N to check for uniqueness
 */
export function* enumerateSolutions(
  slots: CspSlot[],
  wordsByLength: Map<number, string[]>,
  rows: number,
  cols: number,
  random: () => number = Math.random
): Generator<Record<string, string>> {
  const grid: Array<Array<string | null>> = Array.from({ length: rows }, () =>
    Array<string | null>(cols).fill(null)
  );
  const used = new Set<string>();
  const assignment: Record<string, string> = {};
  const order = orderByConstraint(slots);

  function* backtrack(i: number): Generator<Record<string, string>> {
    if (i >= order.length) {
      yield { ...assignment };
      return;
    }

    const slot = order[i];
    const pool = wordsByLength.get(slot.length) ?? [];
    const candidates = shuffle(pool, random).filter(
      (word) =>
        !used.has(word) &&
        slot.cells.every(({ row, col }, idx) => {
          const placed = grid[row][col];
          return placed === null || placed === word[idx];
        })
    );

    for (const word of candidates) {
      slot.cells.forEach(({ row, col }, idx) => {
        grid[row][col] = word[idx];
      });
      used.add(word);
      assignment[slot.id] = word;

      yield* backtrack(i + 1);

      delete assignment[slot.id];
      used.delete(word);
      // Only clear a cell if no other already-placed slot still owns it —
      // crossing cells must survive this word's own backtrack-out.
      slot.cells.forEach(({ row, col }) => {
        const stillOwned = order.some(
          (other, oi) =>
            oi !== i &&
            assignment[other.id] !== undefined &&
            other.cells.some((cell) => cell.row === row && cell.col === col)
        );
        if (!stillOwned) grid[row][col] = null;
      });
    }
  }

  yield* backtrack(0);
}

function orderByConstraint(slots: CspSlot[]): CspSlot[] {
  const owners = new Map<string, number>();
  for (const slot of slots) {
    for (const { row, col } of slot.cells) {
      const key = `${row},${col}`;
      owners.set(key, (owners.get(key) ?? 0) + 1);
    }
  }
  const crossingCount = (slot: CspSlot) =>
    slot.cells.reduce((sum, { row, col }) => sum + ((owners.get(`${row},${col}`) ?? 1) - 1), 0);

  return [...slots].sort((a, b) => crossingCount(b) - crossingCount(a) || b.length - a.length);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
