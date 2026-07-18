import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useGameStore } from '../state/gameStore';
import { samplePuzzle } from '../data/samplePuzzle';
import { colors, radii, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const loadBoard = useGameStore((s) => s.loadBoard);
  const wordCount = Object.keys(samplePuzzle.words).length;

  const startPuzzle = () => {
    loadBoard(samplePuzzle);
    navigation.navigate('Game', { puzzleId: samplePuzzle.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>תשבץ יומי</Text>
      </View>
      <Text style={styles.title}>התשחצנילי</Text>
      <Text style={styles.subtitle}>תשבצים בעברית, ישירות מהטלפון — הרמזים בתוך הלוח, בדיוק כמו בעיתון</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{samplePuzzle.title}</Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>{wordCount} מילים</Text>
          <View style={styles.dot} />
          <Text style={styles.cardMeta}>קושי: {difficultyLabel(samplePuzzle.difficulty)}</Text>
        </View>
        <Pressable style={styles.button} onPress={startPuzzle}>
          <Text style={styles.buttonText}>התחילו לפתור ←</Text>
        </Pressable>
      </View>
    </View>
  );
}

function difficultyLabel(difficulty: 'easy' | 'medium' | 'hard'): string {
  return { easy: 'קל', medium: 'בינוני', hard: 'קשה' }[difficulty];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stageBg,
    padding: spacing.lg,
  },
  badge: {
    backgroundColor: colors.brass,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.block,
    fontSize: 12,
    fontWeight: '800',
    writingDirection: 'rtl',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.paper,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(244,238,221,0.65)',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    writingDirection: 'rtl',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
    flexShrink: 1,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignSelf: 'stretch',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    writingDirection: 'rtl',
    textAlign: 'right',
    alignSelf: 'stretch',
    flexShrink: 1,
  },
  cardMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.inkMuted,
    writingDirection: 'rtl',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.paperLine,
  },
  button: {
    backgroundColor: colors.petrol,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    writingDirection: 'rtl',
    flexShrink: 1,
  },
});
