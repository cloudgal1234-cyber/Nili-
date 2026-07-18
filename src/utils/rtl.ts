import { I18nManager, Platform } from 'react-native';

/**
 * Forces RTL layout app-wide.
 *
 * On native platforms `I18nManager.forceRTL` writes a persisted native
 * preference and only takes effect after the JS bundle reloads — call this
 * once at startup and, if it returns true (layout direction changed),
 * trigger a reload (e.g. `Updates.reloadAsync()` in an Expo build, or
 * prompt the user on the first native run).
 *
 * react-native-web's I18nManager is a no-op stub (allowRTL/forceRTL do
 * nothing, isRTL is always false) — see
 * node_modules/react-native-web/dist/exports/I18nManager. Without setting
 * the actual DOM `dir` attribute, RTL Text/flex styles still render, but
 * centered/percentage-width layouts can measure against the wrong
 * containing-block direction and clip. So on web we set
 * `document.documentElement.dir` directly instead of relying on
 * I18nManager at all.
 */
export function ensureRTLLayout(): boolean {
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined' && document.documentElement.dir !== 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
    }
    return false;
  }

  const changed = !I18nManager.isRTL;
  if (changed) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
  return changed;
}
