import { generateBoard } from '../generator';
import { checkBoardCompletion } from '../validator';
import { sampleTemplate } from '../../data/sampleTemplate';
import { sampleDictionary } from '../../data/sampleDictionary';
import { seededRandom } from '../../utils/random';

describe('checkBoardCompletion', () => {
  const board = generateBoard({
    template: sampleTemplate,
    dictionary: sampleDictionary,
    random: seededRandom(7),
  });

  function emptyGrid(): string[][] {
    return Array.from({ length: board.rows }, () => Array(board.cols).fill(''));
  }

  function solutionGrid(): string[][] {
    const grid = emptyGrid();
    for (const row of board.cells) {
      for (const cell of row) {
        if (cell.type === 'letter') grid[cell.row][cell.col] = cell.solution;
      }
    }
    return grid;
  }

  it('is false for an empty grid', () => {
    expect(checkBoardCompletion(emptyGrid(), board)).toBe(false);
  });

  it('is false when the grid is fully filled but one letter is wrong', () => {
    const grid = solutionGrid();
    const [r, c] = firstLetterCell(board);
    grid[r][c] = grid[r][c] === 'א' ? 'ב' : 'א';
    expect(checkBoardCompletion(grid, board)).toBe(false);
  });

  it('is false when one cell is still empty', () => {
    const grid = solutionGrid();
    const [r, c] = firstLetterCell(board);
    grid[r][c] = '';
    expect(checkBoardCompletion(grid, board)).toBe(false);
  });

  it('is true only once every letter cell exactly matches the solution', () => {
    expect(checkBoardCompletion(solutionGrid(), board)).toBe(true);
  });

  it('treats final and regular Hebrew letter forms as equal', () => {
    // Build a single-cell board whose solution uses a final form (ם), and confirm
    // that typing the regular form (מ) still satisfies completion.
    const miniBoard: ReturnType<typeof generateBoard> = {
      id: 'mini',
      title: 'mini',
      rows: 1,
      cols: 1,
      cells: [[{ row: 0, col: 0, type: 'letter', solution: 'ם', wordIds: ['A-0-0'] }]],
      words: {},
      createdAt: new Date().toISOString(),
      difficulty: 'easy',
    };
    expect(checkBoardCompletion([['מ']], miniBoard)).toBe(true);
  });
});

function firstLetterCell(board: ReturnType<typeof generateBoard>): [number, number] {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.cells[r][c].type === 'letter') return [r, c];
    }
  }
  throw new Error('No letter cell found');
}
