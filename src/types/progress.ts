/** Persisted player-progress snapshot for a single puzzle. */
export interface UserGridState {
  puzzleId: string;
  /** Same dimensions as the board; '' for an empty letter cell, ignored for block/clue cells. */
  values: string[][];
  startedAt: string;
  lastUpdatedAt: string;
  isComplete: boolean;
  completedAt?: string;
}
