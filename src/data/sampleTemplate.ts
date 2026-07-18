import type { Template } from '../engine/types';

/**
 * A 6x8 "snowflake": a length-5 down spine and a length-7 across spine
 * crossing at their centers, each also crossed by two branch words at its
 * first and last letter — across-branches (top/bottom) are length 3,
 * down-branches (left/right) are length 4. Six real, interlocking words,
 * not isolated pairs.
 *
 * Every branch pair gets a length distinct from every OTHER pair it could
 * possibly be confused with (5 vs 7 for the spines, 3 vs 4 for the
 * branches) — see engine/__tests__/generator.test.ts's note on why two
 * same-length crossing words with no other distinguishing constraint can
 * always be swapped. That swap risk sank the very first version of this
 * template (all six slots were length 3 or 5 in matching same-length
 * pairs) — it produced 8 equally-valid fills instead of one.
 */
export const sampleTemplate: Template = [
  [
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-1-4' }] },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'block' },
  ],
  [
    { kind: 'block' },
    { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-2-1' }] },
    { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-1-3' }] },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'clue', arrows: [{ direction: 'down', slotId: 'D-2-7' }] },
  ],
  [
    { kind: 'block' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'letter' },
  ],
  [
    { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-3-1' }] },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
  ],
  [
    { kind: 'block' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'block' },
    { kind: 'letter' },
  ],
  [
    { kind: 'block' },
    { kind: 'letter' },
    { kind: 'clue', arrows: [{ direction: 'across', slotId: 'A-5-3' }] },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'letter' },
    { kind: 'block' },
    { kind: 'letter' },
  ],
];
