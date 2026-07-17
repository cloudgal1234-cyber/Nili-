import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { PuzzleBoard } from '../types/grid';
import GridCell from './GridCell';
import ClueCell from './ClueCell';

interface Props {
  board: PuzzleBoard;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const CELL_SIZE = 42;

/**
 * Renders the puzzle grid with pinch-to-zoom and pan, so small text in
 * clue cells stays usable on a phone screen. Rows use `row-reverse` so the
 * grid reads right-to-left like the rest of the Hebrew UI: array column 0
 * is the rightmost visual column.
 */
export default function CrosswordGrid({ board }: Props) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={styles.viewport}>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[styles.grid, { width: board.cols * CELL_SIZE, height: board.rows * CELL_SIZE }, animatedStyle]}
        >
          {board.cells.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell) => {
                if (cell.type === 'clue') return <ClueCell key={`${r}-${cell.col}`} cell={cell} size={CELL_SIZE} />;
                if (cell.type === 'letter') return <GridCell key={`${r}-${cell.col}`} cell={cell} size={CELL_SIZE} />;
                return (
                  <View key={`${r}-${cell.col}`} style={[styles.block, { width: CELL_SIZE, height: CELL_SIZE }]} />
                );
              })}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  viewport: { flex: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'column' },
  row: { flexDirection: 'row-reverse' },
  block: { backgroundColor: '#1F2937' },
});
