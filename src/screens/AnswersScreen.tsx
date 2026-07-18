import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../state/gameStore';
import { colors, radii, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Answers'>;

/**
 * The strict gate lives here, not in the navigator: even if something
 * navigates or deep-links straight to "Answers" (back button, restored
 * navigation state, a bug elsewhere), this screen re-checks
 * useGameStore().isComplete itself and bounces back to the puzzle if it's
 * false. isComplete is derived purely from checkBoardCompletion — there is
 * no code path that sets it to true without a fully correct grid.
 */
export default function AnswersScreen({ navigation }: Props) {
  const board = useGameStore((s) => s.board);
  const isComplete = useGameStore((s) => s.isComplete);

  useEffect(() => {
    if (!isComplete) {
      navigation.replace('Game', { puzzleId: board?.id ?? '' });
    }
  }, [isComplete, board?.id, navigation]);

  if (!board || !isComplete) {
    return (
      <View style={styles.locked}>
        <Text style={styles.lockedText}>דף התשובות ייפתח רק לאחר פתרון מלא ונכון של התשבץ.</Text>
      </View>
    );
  }

  const words = Object.values(board.words).sort((a, b) => (a.direction === b.direction ? 0 : a.direction === 'across' ? -1 : 1));

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>תשובות</Text>
        <Text style={styles.subtitle}>{board.title}</Text>

        {words.map((word) => (
          <View key={word.id} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.answer}>{word.answer}</Text>
              <Text style={styles.clue} numberOfLines={2}>
                {word.clueCell ? clueTextFor(board, word.id) : ''}
              </Text>
            </View>
            <Text style={styles.direction}>{word.direction === 'across' ? '←' : '↓'}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>חזרה לתשבץ</Text>
      </Pressable>
    </View>
  );
}

function clueTextFor(board: ReturnType<typeof useGameStore.getState>['board'], wordId: string): string {
  if (!board) return '';
  const word = board.words[wordId];
  const clueCell = board.cells[word.clueCell.row][word.clueCell.col];
  if (clueCell.type !== 'clue') return '';
  return clueCell.arrows.find((a) => a.wordId === wordId)?.text ?? '';
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  container: { padding: spacing.lg, paddingTop: 56, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', writingDirection: 'rtl', color: colors.ink, textAlign: 'right' },
  subtitle: { fontSize: 14, color: colors.inkMuted, writingDirection: 'rtl', textAlign: 'right', marginTop: 2, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.paperLine,
    gap: spacing.sm,
  },
  rowText: { flex: 1 },
  answer: { fontSize: 18, fontWeight: '700', writingDirection: 'rtl', textAlign: 'right', color: colors.ink },
  clue: { fontSize: 12, color: colors.inkMuted, writingDirection: 'rtl', textAlign: 'right', marginTop: 2 },
  direction: { fontSize: 18, color: colors.brass, fontWeight: '700' },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.stageBg },
  lockedText: { fontSize: 16, textAlign: 'center', writingDirection: 'rtl', color: colors.paper, lineHeight: 24 },
  backButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.petrol,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  backButtonText: { color: colors.white, fontWeight: '800', fontSize: 15, writingDirection: 'rtl' },
});
