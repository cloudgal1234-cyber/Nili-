import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useGameStore } from '../state/gameStore';
import { HEBREW_ALPHABET } from '../utils/hebrew';

const ROWS = [HEBREW_ALPHABET.slice(0, 8), HEBREW_ALPHABET.slice(8, 16), HEBREW_ALPHABET.slice(16)];

/**
 * Custom in-app keyboard docked below the grid. We deliberately don't use
 * the native TextInput keyboard: it would float above the content, cover
 * clue cells on small screens, and offer QWERTY-adjacent Hebrew layouts
 * that don't match this alphabetical layout — all overlap/positioning
 * problems this component avoids by being a normal, non-floating view.
 */
export default function HebrewKeyboard() {
  const inputLetter = useGameStore((s) => s.inputLetter);
  const deleteLetter = useGameStore((s) => s.deleteLetter);
  const toggleDirection = useGameStore((s) => s.toggleDirection);
  const activeDirection = useGameStore((s) => s.activeDirection);

  return (
    <SafeAreaView style={styles.keyboard}>
      {ROWS.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((letter) => (
            <Pressable key={letter} style={styles.key} onPress={() => inputLetter(letter)}>
              <Text style={styles.keyText}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <Pressable style={[styles.key, styles.wideKey]} onPress={toggleDirection}>
          <Text style={styles.keyText}>{activeDirection === 'across' ? '↓ עבור למאונך' : '← עבור למאוזן'}</Text>
        </Pressable>
        <Pressable style={[styles.key, styles.wideKey]} onPress={deleteLetter}>
          <Text style={styles.keyText}>⌫ מחק</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboard: { backgroundColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 4 },
  row: { flexDirection: 'row-reverse', justifyContent: 'center', marginVertical: 2 },
  key: {
    minWidth: 32,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  wideKey: { minWidth: 110, paddingHorizontal: 8 },
  keyText: { fontSize: 15, writingDirection: 'rtl' },
});
