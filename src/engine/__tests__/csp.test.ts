import { enumerateSolutions } from '../csp';

describe('enumerateSolutions', () => {
  it('finds a valid assignment that satisfies a crossing constraint', () => {
    // 2x2 grid: an across word at row0 (cols0-1) crossing a down word at col0 (rows0-1).
    const slots = [
      { id: 'A-0-0', length: 2, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
      { id: 'D-0-0', length: 2, cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
    ];
    const wordsByLength = new Map<number, string[]>([[2, ['אב', 'אג', 'בג']]]);

    const result = enumerateSolutions(slots, wordsByLength, 2, 2).next();
    expect(result.done).toBe(false);
    const assignment = result.value!;
    // The two words must agree on the shared cell (0,0) — its first letter.
    expect(assignment['A-0-0'][0]).toBe(assignment['D-0-0'][0]);
  });

  it('yields nothing when the only candidates disagree on the crossing letter', () => {
    const slots = [
      { id: 'A-0-0', length: 2, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
      { id: 'D-0-0', length: 2, cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
    ];
    // "אב" starts with א, "בג" starts with ב — no shared first letter, so cell (0,0) can never be satisfied.
    const wordsByLength = new Map<number, string[]>([[2, ['אב', 'בג']]]);
    const result = enumerateSolutions(slots, wordsByLength, 2, 2).next();
    expect(result.done).toBe(true);
  });

  it('does not reuse the same word for two different slots', () => {
    const slots = [
      { id: 'A-0-0', length: 2, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
      { id: 'A-1-0', length: 2, cells: [{ row: 1, col: 0 }, { row: 1, col: 1 }] },
    ];
    const wordsByLength = new Map<number, string[]>([[2, ['אב']]]); // only one candidate word
    const result = enumerateSolutions(slots, wordsByLength, 2, 2).next();
    expect(result.done).toBe(true);
  });
});
