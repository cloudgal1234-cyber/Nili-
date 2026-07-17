import type { Template } from '../engine/types';

/**
 * A tiny 5x4 demo template with one real intersection between an across
 * word (length 3) and a down word (length 4):
 *
 *        col0            col1        col2      col3
 * row0   ▓block▓         ◤clue:↓D-1-1◢ ▓block▓  ▓block▓
 * row1   ◤clue:←A-1-1◢   [letter]     [letter]  [letter]
 * row2   ▓block▓         [letter]    ▓block▓   ▓block▓
 * row3   ▓block▓         [letter]    ▓block▓   ▓block▓
 * row4   ▓block▓         [letter]    ▓block▓   ▓block▓
 *
 * (1,1) is shared: the first letter of both words. Giving across and down
 * different lengths (3 vs 4) matters for solvability, not just layout —
 * with matching lengths the two words could always be swapped between
 * slots and still satisfy every constraint, so a puzzle can never be
 * *uniquely* solvable that way. See engine/generator.test.ts.
 */
export const sampleTemplate: Template = [
  [
    { kind: 'block' },
    { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-1-1' }] },
    { kind: 'block' },
    { kind: 'block' },
  ],
  [
    { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-1-1' }] },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
  ],
  [{ kind: 'block' }, { kind: 'letter' }, { kind: 'block' }, { kind: 'block' }],
  [{ kind: 'block' }, { kind: 'letter' }, { kind: 'block' }, { kind: 'block' }],
  [{ kind: 'block' }, { kind: 'letter' }, { kind: 'block' }, { kind: 'block' }],
];
