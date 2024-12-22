import { currentPlatform } from '@tamagui/constants'

export function isActivePlatform(key: string) {
  if (!key.startsWith('$platform')) {
    return true
  }
  const platform = key.slice(10)
  return (
    // web, ios, android
    platform === currentPlatform ||
    // web, native
    platform === process.env.TAMAGUI_TARGET
  )
}
