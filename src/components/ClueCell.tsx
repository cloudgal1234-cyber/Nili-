import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ClueCell as ClueCellModel, Direction } from '../types/grid';
import { colors } from '../theme/colors';

interface Props {
  cell: ClueCellModel;
  size: number;
}

// Grid rows render with flexDirection: 'row-reverse' (see CrosswordGrid), so
// an across word's letters run visually right-to-left even though they're
// stored left-to-right in the array. The glyph is purely visual — 'across'
// always reads toward the reading-direction side, 'down' always downward.
const ARROW_GLYPH: Record<Direction, string> = {
  across: '←',
  down: '↓',
};

/** A black cell holding one or two clues (across and/or down) with a directional arrow. */
export default function ClueCell({ cell, size }: Props) {
  return (
    <View style={[styles.cell, { width: size, height: size }]}>
      {cell.arrows.map((arrow) => (
        <View key={arrow.direction} style={styles.arrowRow}>
          <Text style={[styles.arrow, { fontSize: size * 0.24 }]}>{ARROW_GLYPH[arrow.direction]}</Text>
          <Text numberOfLines={4} style={[styles.text, { fontSize: size * 0.16 }]}>
            {arrow.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#0B1512',
    backgroundColor: colors.block,
    padding: 2,
    justifyContent: 'center',
    gap: 1,
  },
  arrowRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  arrow: { color: colors.brassLight, marginStart: 2, fontWeight: '700' },
  text: { color: colors.clueText, writingDirection: 'rtl', flexShrink: 1, textAlign: 'right' },
});
