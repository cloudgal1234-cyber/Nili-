import { generateBoard, generateUniqueBoard } from '../generator';
import { validateGeneratedBoard } from '../validator';
import { isBoardUniquelySolvable, countSolutions } from '../solver';
import { deriveWordSlots } from '../types';
import type { Template } from '../types';
import { sampleTemplate } from '../../data/sampleTemplate';
import { sampleDictionary } from '../../data/sampleDictionary';
import { seededRandom } from '../../utils/random';

describe('deriveWordSlots', () => {
  it('finds exactly the across and down word in the sample template', () => {
    const slots = deriveWordSlots(sampleTemplate);
    const ids = slots.map((s) => s.id).sort();
    expect(ids).toEqual(['A-1-1', 'D-1-1']);
  });

  it('throws when a letter run has no clue cell pointing at it', () => {
    const brokenTemplate = [
      [{ kind: 'letter' as const }, { kind: 'letter' as const }],
    ];
    expect(() => deriveWordSlots(brokenTemplate)).toThrow(/no clue cell/);
  });
});

describe('generateBoard', () => {
  const board = generateBoard({
    id: 'test-1',
    template: sampleTemplate,
    dictionary: sampleDictionary,
    random: seededRandom(7),
  });

  it('fills every letter cell and leaves clue/block cells untouched', () => {
    for (const row of board.cells) {
      for (const cell of row) {
        if (cell.type === 'letter') {
          expect(cell.solution).toMatch(/^[א-ת]$/);
        }
      }
    }
  });

  it('produces intersecting letters that agree at the crossing cell', () => {
    // (1,1) is the shared cell between the across and down word.
    const crossing = board.cells[1][1];
    expect(crossing.type).toBe('letter');
    if (crossing.type === 'letter') {
      expect(crossing.wordIds.sort()).toEqual(['A-1-1', 'D-1-1']);
      expect(board.words['A-1-1'].answer[0]).toBe(crossing.solution);
      expect(board.words['D-1-1'].answer[0]).toBe(crossing.solution);
    }
  });

  it('passes structural + lexical validation with no issues', () => {
    expect(validateGeneratedBoard(board, sampleDictionary)).toEqual([]);
  });

  it('is uniquely solvable given the sample dictionary constraints', () => {
    expect(isBoardUniquelySolvable(board, sampleDictionary)).toBe(true);
  });

  it('throws a clear error when the dictionary cannot fill the template', () => {
    expect(() =>
      generateBoard({ template: sampleTemplate, dictionary: [], random: seededRandom(1) })
    ).toThrow(/No valid crossword/);
  });
});

describe('isBoardUniquelySolvable', () => {
  it('detects an ambiguous board: two same-length crossing words can always be swapped', () => {
    // A 3x3 template where the across and down word both have length 2 and
    // share only their first letter — nothing distinguishes which word
    // "belongs" in which slot, so any valid fill has a mirror-image twin.
    const ambiguousTemplate: Template = [
      [{ kind: 'block' }, { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-1-1' }] }, { kind: 'block' }],
      [
        { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-1-1' }] },
        { kind: 'letter' },
        { kind: 'letter' },
      ],
      [{ kind: 'block' }, { kind: 'letter' }, { kind: 'block' }],
    ];
    const dictionary = [
      { id: 'a', word: 'אב', length: 2, clues: ['x'] },
      { id: 'b', word: 'אג', length: 2, clues: ['x'] },
    ];
    const board = generateBoard({ template: ambiguousTemplate, dictionary, random: seededRandom(1) });

    expect(countSolutions(board, dictionary, 5)).toBeGreaterThan(1);
    expect(isBoardUniquelySolvable(board, dictionary)).toBe(false);
  });
});

describe('generateUniqueBoard', () => {
  it('returns a board that is guaranteed to have exactly one solution', () => {
    const board = generateUniqueBoard({ template: sampleTemplate, dictionary: sampleDictionary, random: seededRandom(7) });
    expect(isBoardUniquelySolvable(board, sampleDictionary)).toBe(true);
  });

  it('throws with a helpful message when uniqueness is unreachable within maxAttempts', () => {
    const ambiguousTemplate: Template = [
      [{ kind: 'block' }, { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-1-1' }] }, { kind: 'block' }],
      [
        { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-1-1' }] },
        { kind: 'letter' },
        { kind: 'letter' },
      ],
      [{ kind: 'block' }, { kind: 'letter' }, { kind: 'block' }],
    ];
    const dictionary = [
      { id: 'a', word: 'אב', length: 2, clues: ['x'] },
      { id: 'b', word: 'אג', length: 2, clues: ['x'] },
    ];
    expect(() =>
      generateUniqueBoard({ template: ambiguousTemplate, dictionary, random: seededRandom(1), maxAttempts: 3 })
    ).toThrow(/Could not produce a uniquely solvable board/);
  });
});
