import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../state/gameStore';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>תשובות</Text>
      {Object.values(board.words).map((word) => (
        <View key={word.id} style={styles.row}>
          <Text style={styles.answer}>{word.answer}</Text>
          <Text style={styles.direction}>{word.direction === 'across' ? '←' : '↓'}</Text>
        </View>
      ))}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>חזרה לתשבץ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: '800', writingDirection: 'rtl', marginBottom: 16 },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  answer: { fontSize: 18, writingDirection: 'rtl' },
  direction: { fontSize: 16, color: '#6B7280' },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  lockedText: { fontSize: 16, textAlign: 'center', writingDirection: 'rtl', color: '#4B5563' },
  backButton: { marginTop: 24, alignSelf: 'center', backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  backButtonText: { color: 'white', fontWeight: '700', writingDirection: 'rtl' },
});
