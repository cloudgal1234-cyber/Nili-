import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { LetterCell } from '../types/grid';
import { useGameStore } from '../state/gameStore';
import { colors } from '../theme/colors';

interface Props {
  cell: LetterCell;
  size: number;
  isInActiveWord: boolean;
}

/** A single white input cell. Tapping it makes it active for the custom keyboard — no native TextInput/keyboard is used, so nothing can overlap the grid. */
export default function GridCell({ cell, size, isInActiveWord }: Props) {
  const value = useGameStore((s) => s.userValues[cell.row]?.[cell.col] ?? '');
  const activeCell = useGameStore((s) => s.activeCell);
  const setActiveCell = useGameStore((s) => s.setActiveCell);

  const isActive = activeCell?.row === cell.row && activeCell?.col === cell.col;
  const style = useMemo(
    () => [
      styles.cell,
      { width: size, height: size },
      isInActiveWord && !isActive && styles.inWord,
      isActive && styles.active,
    ],
    [size, isActive, isInActiveWord]
  );

  return (
    <Pressable onPress={() => setActiveCell({ row: cell.row, col: cell.col })} style={style} hitSlop={2}>
      <Text style={[styles.letter, { fontSize: size * 0.46 }]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.paperLine,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  inWord: { backgroundColor: colors.inWord },
  active: {
    backgroundColor: colors.active,
    borderColor: colors.activeBorder,
    borderWidth: 2,
  },
  letter: { fontWeight: '700', color: colors.ink, writingDirection: 'rtl' },
});
