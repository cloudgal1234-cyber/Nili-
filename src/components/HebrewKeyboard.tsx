import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useGameStore } from '../state/gameStore';
import { HEBREW_ALPHABET } from '../utils/hebrew';
import { colors, radii } from '../theme/colors';

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
            <Pressable
              key={letter}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
              onPress={() => inputLetter(letter)}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.key, styles.wideKey, pressed && styles.keyPressed]}
          onPress={toggleDirection}
        >
          <Text style={styles.wideKeyText}>{activeDirection === 'across' ? '↓ מאונך' : '← מאוזן'}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.key, styles.wideKey, styles.deleteKey, pressed && styles.keyPressed]}
          onPress={deleteLetter}
        >
          <Text style={styles.wideKeyText}>⌫ מחק</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboard: { backgroundColor: colors.petrolDark, paddingVertical: 10, paddingHorizontal: 4 },
  row: { flexDirection: 'row-reverse', justifyContent: 'center', marginVertical: 3 },
  key: {
    minWidth: 33,
    height: 42,
    marginHorizontal: 2,
    borderRadius: radii.sm,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 2 },
  },
  keyPressed: { backgroundColor: colors.active, transform: [{ translateY: 1 }] },
  wideKey: { minWidth: 110, paddingHorizontal: 8, backgroundColor: colors.brassLight },
  deleteKey: { backgroundColor: '#E4A98F' },
  keyText: { fontSize: 16, fontWeight: '600', writingDirection: 'rtl', color: colors.ink },
  wideKeyText: { fontSize: 14, fontWeight: '700', writingDirection: 'rtl', color: colors.ink },
});
