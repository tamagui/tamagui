import { currentPlatform, isAndroid, isIos, isTV } from '@tamagui/constants'

/**
 * Returns the specificity bump for a platform media key so that more specific
 * platform selectors reliably override more general ones regardless of the order
 * props are declared.
 *
 * Cascade (low → high importance):
 *   $native / $web         → bump 0  (widest)
 *   $android / $ios        → bump 1  (OS-specific)
 *   $tv                    → bump 2  (TV subset of Android/iOS)
 *   $androidtv / $tvos     → bump 3  (most specific)
 *
 * @param mediaKeyShort - Platform media key without the leading '$' (e.g. 'tv', 'androidtv')
 */
export function getPlatformSpecificityBump(mediaKeyShort: string): number {
  if (mediaKeyShort === 'androidtv' || mediaKeyShort === 'tvos') return 3
  if (mediaKeyShort === 'tv') return 2
  if (mediaKeyShort === 'android' || mediaKeyShort === 'ios') return 1
  return 0
}

export function isActivePlatform(key: string) {
  if (key[0] !== '$') {
    return true
  }
  const platform = key.slice(1)
  if (
    platform !== 'web' &&
    platform !== 'native' &&
    platform !== 'android' &&
    platform !== 'ios' &&
    platform !== 'tv' &&
    platform !== 'androidtv' &&
    platform !== 'tvos'
  ) {
    return true
  }
  return (
    // exact platform match (web, ios, android)
    platform === currentPlatform ||
    // native matches all non-web platforms (iOS, Android, tvOS, Android TV)
    (platform === 'native' && currentPlatform !== 'web') ||
    // TAMAGUI_TARGET fallback (web or native build target)
    platform === process.env.TAMAGUI_TARGET ||
    // tv matches both Android TV and tvOS
    (platform === 'tv' && isTV) ||
    // androidtv matches Android TV specifically
    (platform === 'androidtv' && isAndroid && isTV) ||
    // tvos matches tvOS specifically
    (platform === 'tvos' && isIos && isTV)
  )
}
