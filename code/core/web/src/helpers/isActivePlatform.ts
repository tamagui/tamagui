import { currentPlatform, isAndroid, isIos, isTV } from '@tamagui/constants'

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
