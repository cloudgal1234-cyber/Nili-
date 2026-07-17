import { generateUniqueBoard } from '../engine/generator';
import { sampleTemplate } from './sampleTemplate';
import { sampleDictionary } from './sampleDictionary';
import { seededRandom } from '../utils/random';

/**
 * A ready-to-play, uniquely-solvable board built from the sample template +
 * dictionary at module load time, using a fixed seed so it's reproducible
 * across runs. Swap this for puzzles loaded from a server/JSON file in
 * production — generation (especially generate-then-verify via
 * `generateUniqueBoard`) is cheap for small templates but should not run
 * on-device for large (15x15+) grids; pre-generate those offline.
 */
export const samplePuzzle = generateUniqueBoard({
  id: 'sample-1',
  title: 'תשבץ לדוגמה',
  template: sampleTemplate,
  dictionary: sampleDictionary,
  difficulty: 'easy',
  random: seededRandom(7),
});
