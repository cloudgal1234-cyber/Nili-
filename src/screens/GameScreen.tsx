import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { PuzzleBoard, Direction } from '../types/grid';
import { useGameStore } from '../state/gameStore';
import CrosswordGrid from '../components/CrosswordGrid';
import HebrewKeyboard from '../components/HebrewKeyboard';
import { colors, radii, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ navigation }: Props) {
  const board = useGameStore((s) => s.board);
  const isComplete = useGameStore((s) => s.isComplete);
  const userValues = useGameStore((s) => s.userValues);
  const activeCell = useGameStore((s) => s.activeCell);
  const activeDirection = useGameStore((s) => s.activeDirection);

  if (!board) return null;

  const filledCount = userValues.flat().filter(Boolean).length;
  const totalLetterCells = board.cells.flat().filter((c) => c.type === 'letter').length;
  const progress = totalLetterCells === 0 ? 0 : filledCount / totalLetterCells;

  const activeClue = getActiveClueText(board, activeCell, activeDirection);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{board.title}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {filledCount} / {totalLetterCells}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.clueStrip}>
        <Text style={styles.clueArrow}>{activeDirection === 'across' ? '←' : '↓'}</Text>
        <Text style={styles.clueText} numberOfLines={2}>
          {activeClue ?? 'בחרו משבצת כדי להתחיל'}
        </Text>
      </View>

      <CrosswordGrid board={board} />
      <HebrewKeyboard />

      {/*
        This modal, gated by isComplete straight from the store (itself
        derived from checkBoardCompletion on every keystroke), is the ONLY
        UI path to the Answers screen. There is no "skip" or "give up"
        button that navigates there early.
      */}
      <Modal visible={isComplete} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>פתרתם את התשבץ!</Text>
            <Text style={styles.modalBody}>כל האותיות נכונות. אפשר עכשיו לצפות בדף התשובות.</Text>
            <Pressable style={styles.modalButton} onPress={() => navigation.navigate('Answers', { puzzleId: board.id })}>
              <Text style={styles.modalButtonText}>לדף התשובות ←</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

function getActiveClueText(
  board: PuzzleBoard,
  activeCell: { row: number; col: number } | null,
  direction: Direction
): string | null {
  if (!activeCell) return null;
  const cell = board.cells[activeCell.row][activeCell.col];
  if (cell.type !== 'letter') return null;
  const wordId = cell.wordIds.find((id) => board.words[id]?.direction === direction) ?? cell.wordIds[0];
  if (!wordId) return null;
  const word = board.words[wordId];
  const clueCell = board.cells[word.clueCell.row][word.clueCell.col];
  if (clueCell.type !== 'clue') return null;
  const arrow = clueCell.arrows.find((a) => a.wordId === wordId);
  return arrow?.text ?? null;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.stageBg },
  header: { paddingTop: 56, paddingBottom: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '800', writingDirection: 'rtl', color: colors.paper },
  progressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 6 },
  progressLabel: { fontSize: 12, color: 'rgba(244,238,221,0.7)', fontVariant: ['tabular-nums'] },
  progressTrack: { width: 90, height: 5, borderRadius: 3, backgroundColor: 'rgba(244,238,221,0.2)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.brass },
  clueStrip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.block,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 20,
  },
  clueArrow: { color: colors.brassLight, fontSize: 16, fontWeight: '700' },
  clueText: { flex: 1, color: colors.paper, fontSize: 14, writingDirection: 'rtl', textAlign: 'right', lineHeight: 19 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(8,16,14,0.7)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: colors.paper, borderRadius: radii.lg, padding: spacing.lg, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 23, fontWeight: '800', writingDirection: 'rtl', color: colors.ink },
  modalBody: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    writingDirection: 'rtl',
    lineHeight: 20,
  },
  modalButton: { backgroundColor: colors.success, paddingVertical: 12, paddingHorizontal: spacing.lg, borderRadius: radii.md },
  modalButtonText: { color: colors.white, fontWeight: '800', writingDirection: 'rtl' },
});
