import { normalizeHebrewWord, isValidHebrewWord, letterFormForPosition } from './hebrew';

describe('normalizeHebrewWord', () => {
  it('maps final letter forms to their regular form', () => {
    expect(normalizeHebrewWord('ם')).toBe('מ');
    // 'שלום' ends in the final form ם -> normalized last letter becomes regular מ.
    expect(normalizeHebrewWord('שלום')).toBe('שלומ');
    expect(normalizeHebrewWord('שלום')[3]).toBe('מ');
  });

  it('strips nikud marks', () => {
    expect(normalizeHebrewWord('שָׁלוֹם')).toBe('שלומ');
  });

  it('trims whitespace', () => {
    expect(normalizeHebrewWord('  אבג  ')).toBe('אבג');
  });
});

describe('isValidHebrewWord', () => {
  it('accepts pure Hebrew words of length >= 2', () => {
    expect(isValidHebrewWord('שלום')).toBe(true);
  });

  it('rejects single letters, empty strings, and non-Hebrew characters', () => {
    expect(isValidHebrewWord('א')).toBe(false);
    expect(isValidHebrewWord('')).toBe(false);
    expect(isValidHebrewWord('abc')).toBe(false);
    expect(isValidHebrewWord('שלום123')).toBe(false);
  });
});

describe('letterFormForPosition', () => {
  it('returns the final form for the last letter when one exists', () => {
    expect(letterFormForPosition('שלום', 3)).toBe('ם');
  });

  it('returns the regular form for non-final positions', () => {
    expect(letterFormForPosition('שלום', 0)).toBe('ש');
  });
});
