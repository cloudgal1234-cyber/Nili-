/**
 * Shared visual language for the app: a petrol-ink & brass palette (a
 * printed-puzzle-book feel) instead of default React Native blues/greys.
 * Centralizing it here means every screen/component pulls from the same
 * few values instead of re-inventing colors inline.
 */
export const colors = {
  // Backdrop
  stageBg: '#0F2521',
  paper: '#F4EEDD',
  paperLine: '#D8CCA8',

  // Ink / text
  ink: '#20302B',
  inkMuted: '#6B6152',

  // Grid chrome
  block: '#16211F',
  clueText: '#F4EEDD',

  // Accents
  brass: '#C68A2E',
  brassLight: '#E4B75B',
  petrol: '#1F6F63',
  petrolDark: '#134C43',

  // Feedback
  success: '#3F8F5F',
  successBg: '#E4F1E6',
  active: '#F6E3AE',
  activeBorder: '#C68A2E',
  inWord: '#F4E9C9',

  white: '#FFFFFF',
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
