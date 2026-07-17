import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PuzzleBoard, Direction } from '../types/grid';
import { checkBoardCompletion } from '../engine/validator';
import { normalizeHebrewWord } from '../utils/hebrew';

interface CellRef {
  row: number;
  col: number;
}

interface GameState {
  board: PuzzleBoard | null;
  userValues: string[][];
  activeCell: CellRef | null;
  activeDirection: Direction;
  isComplete: boolean;
  completedAt: string | null;

  loadBoard: (board: PuzzleBoard) => void;
  setActiveCell: (cell: CellRef) => void;
  toggleDirection: () => void;
  inputLetter: (letter: string) => void;
  deleteLetter: () => void;
  reset: () => void;
}

function emptyGrid(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
}

function findFirstLetterCell(board: PuzzleBoard): CellRef | null {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.cells[r][c].type === 'letter') return { row: r, col: c };
    }
  }
  return null;
}

/** Walks in one grid direction from `from` and returns the next letter cell, or null at the edge. */
function walkToLetterCell(board: PuzzleBoard, from: CellRef, dr: number, dc: number): CellRef | null {
  let r = from.row + dr;
  let c = from.col + dc;
  while (r >= 0 && r < board.rows && c >= 0 && c < board.cols) {
    if (board.cells[r][c].type === 'letter') return { row: r, col: c };
    r += dr;
    c += dc;
  }
  return null;
}

/**
 * Central game state. `inputLetter` / `deleteLetter` are the only ways the
 * grid changes, and every mutation re-derives `isComplete` from
 * `checkBoardCompletion` — there is no separate "mark as done" action, so
 * the Answers page can never be unlocked by anything other than an
 * actually-correct, fully-filled grid.
 */
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      board: null,
      userValues: [],
      activeCell: null,
      activeDirection: 'across',
      isComplete: false,
      completedAt: null,

      loadBoard: (board) =>
        set({
          board,
          userValues: emptyGrid(board.rows, board.cols),
          activeCell: findFirstLetterCell(board),
          activeDirection: 'across',
          isComplete: false,
          completedAt: null,
        }),

      setActiveCell: (cell) =>
        set((state) => {
          if (!state.board || state.board.cells[cell.row][cell.col].type !== 'letter') return state;
          return { activeCell: cell };
        }),

      toggleDirection: () =>
        set((state) => ({ activeDirection: state.activeDirection === 'across' ? 'down' : 'across' })),

      inputLetter: (letter) =>
        set((state) => {
          const { board, activeCell, activeDirection, userValues } = state;
          if (!board || !activeCell) return state;
          const normalized = normalizeHebrewWord(letter);
          if (!normalized) return state;

          const next = userValues.map((row) => [...row]);
          next[activeCell.row][activeCell.col] = normalized;

          const isComplete = checkBoardCompletion(next, board);
          const [dr, dc] = activeDirection === 'across' ? [0, 1] : [1, 0];
          const advance = walkToLetterCell(board, activeCell, dr, dc);

          return {
            userValues: next,
            activeCell: advance ?? activeCell,
            isComplete,
            completedAt: isComplete ? new Date().toISOString() : null,
          };
        }),

      deleteLetter: () =>
        set((state) => {
          const { board, activeCell, activeDirection, userValues } = state;
          if (!board || !activeCell) return state;
          const next = userValues.map((row) => [...row]);

          if (next[activeCell.row][activeCell.col]) {
            next[activeCell.row][activeCell.col] = '';
            return { userValues: next, isComplete: false, completedAt: null };
          }

          const [dr, dc] = activeDirection === 'across' ? [0, -1] : [-1, 0];
          const prev = walkToLetterCell(board, activeCell, dr, dc);
          if (prev) next[prev.row][prev.col] = '';
          return { userValues: next, activeCell: prev ?? activeCell, isComplete: false, completedAt: null };
        }),

      reset: () =>
        set((state) =>
          state.board
            ? { userValues: emptyGrid(state.board.rows, state.board.cols), isComplete: false, completedAt: null }
            : state
        ),
    }),
    {
      name: 'hatashvatznili-progress',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only what's needed to resume a puzzle after the app is killed;
      // re-deriving isComplete on load (rather than trusting the persisted
      // flag) means a corrupted/tampered cache can't unlock Answers on its own.
      partialize: (state) => ({ board: state.board, userValues: state.userValues, activeDirection: state.activeDirection }),
      onRehydrateStorage: () => (state) => {
        if (state?.board) {
          state.isComplete = checkBoardCompletion(state.userValues, state.board);
          state.activeCell = state.activeCell ?? findFirstLetterCell(state.board);
        }
      },
    }
  )
);
