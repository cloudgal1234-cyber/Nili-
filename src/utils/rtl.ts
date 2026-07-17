import { I18nManager } from 'react-native';

/**
 * Forces RTL layout app-wide. On native platforms `I18nManager.forceRTL`
 * writes a persisted native preference and only takes effect after the JS
 * bundle reloads — call this once at startup and, if it returns true
 * (layout direction changed), trigger a reload (e.g. `Updates.reloadAsync()`
 * in an Expo build, or prompt the user on the first native run).
 */
export function ensureRTLLayout(): boolean {
  const changed = !I18nManager.isRTL;
  if (changed) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
  return changed;
}
