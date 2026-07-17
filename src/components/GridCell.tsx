import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { LetterCell } from '../types/grid';
import { useGameStore } from '../state/gameStore';

interface Props {
  cell: LetterCell;
  size: number;
}

/** A single white input cell. Tapping it makes it active for the custom keyboard — no native TextInput/keyboard is used, so nothing can overlap the grid. */
export default function GridCell({ cell, size }: Props) {
  const value = useGameStore((s) => s.userValues[cell.row]?.[cell.col] ?? '');
  const activeCell = useGameStore((s) => s.activeCell);
  const setActiveCell = useGameStore((s) => s.setActiveCell);

  const isActive = activeCell?.row === cell.row && activeCell?.col === cell.col;
  const style = useMemo(() => [styles.cell, { width: size, height: size }, isActive && styles.active], [size, isActive]);

  return (
    <Pressable onPress={() => setActiveCell({ row: cell.row, col: cell.col })} style={style} hitSlop={2}>
      <Text style={styles.letter}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  active: { backgroundColor: '#DBEAFE', borderColor: '#2563EB', borderWidth: 2 },
  letter: { fontSize: 20, fontWeight: '600', writingDirection: 'rtl' },
});
