import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../state/gameStore';
import CrosswordGrid from '../components/CrosswordGrid';
import HebrewKeyboard from '../components/HebrewKeyboard';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ navigation }: Props) {
  const board = useGameStore((s) => s.board);
  const isComplete = useGameStore((s) => s.isComplete);

  if (!board) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{board.title}</Text>
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
            <Text style={styles.modalTitle}>כל הכבוד! 🎉</Text>
            <Text style={styles.modalBody}>פתרתם את התשבץ בהצלחה. אפשר עכשיו לצפות בדף התשובות.</Text>
            <Pressable style={styles.modalButton} onPress={() => navigation.navigate('Answers', { puzzleId: board.id })}>
              <Text style={styles.modalButtonText}>לדף התשובות</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FBF8F1' },
  header: { paddingTop: 56, paddingBottom: 12, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', writingDirection: 'rtl' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '800', writingDirection: 'rtl' },
  modalBody: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginTop: 8, writingDirection: 'rtl' },
  modalButton: { marginTop: 20, backgroundColor: '#16A34A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  modalButtonText: { color: 'white', fontWeight: '700', writingDirection: 'rtl' },
});
