import { currentPlatform, isAndroid, isIos, isTV } from '@tamagui/constants'

/**
 * Returns the specificity bump for a platform media key so that more specific
 * platform selectors reliably override more general ones regardless of the order
 * props are declared.
 *
 * Cascade (low → high importance):
 *   $platform-native / $platform-web         → bump 0  (widest)
 *   $platform-android / $platform-ios        → bump 1  (OS-specific)
 *   $platform-tv                             → bump 2  (TV subset of Android/iOS)
 *   $platform-androidtv / $platform-tvos     → bump 3  (most specific)
 *
 * @param mediaKeyShort - Platform media key without the leading '$' (e.g. 'platform-tv', 'platform-androidtv')
 */
export function getPlatformSpecificityBump(mediaKeyShort: string): number {
  if (mediaKeyShort === 'platform-androidtv' || mediaKeyShort === 'platform-tvos')
    return 3
  if (mediaKeyShort === 'platform-tv') return 2
  if (mediaKeyShort === 'platform-android' || mediaKeyShort === 'platform-ios') return 1
  return 0
}

export function isActivePlatform(key: string) {
  if (!key.startsWith('$platform')) {
    return true
  }
  const platform = key.slice(10)
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
