import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../state/gameStore';
import { samplePuzzle } from '../data/samplePuzzle';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const loadBoard = useGameStore((s) => s.loadBoard);

  const startPuzzle = () => {
    loadBoard(samplePuzzle);
    navigation.navigate('Game', { puzzleId: samplePuzzle.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התשחצנילי</Text>
      <Text style={styles.subtitle}>תשבצים בעברית, ישירות מהטלפון</Text>
      <Pressable style={styles.button} onPress={startPuzzle}>
        <Text style={styles.buttonText}>התחילו תשבץ חדש</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF8F1', padding: 24 },
  title: { fontSize: 34, fontWeight: '800', color: '#1F2937', writingDirection: 'rtl' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, writingDirection: 'rtl' },
  button: { marginTop: 32, backgroundColor: '#2563EB', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700', writingDirection: 'rtl' },
});
