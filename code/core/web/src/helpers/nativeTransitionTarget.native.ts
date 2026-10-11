import { Platform } from 'react-native'
import type { NativeTransitionTarget } from '@tamagui/style-grammar/runtime'

// the native transition capability matrix is version-gated with NO default:
// an unknown React Native minor is a diagnostic upstream, never a guessed
// literal (CODEX-1's recorded wiring precondition). detection reads the
// platform's own constants; null means "could not detect".
export function detectNativeTransitionTarget(): NativeTransitionTarget | null {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null
  const version = (Platform.constants as any)?.reactNativeVersion
  const minor = version?.minor
  if (typeof minor !== 'number' || !Number.isInteger(minor)) return null
  const target: NativeTransitionTarget = {
    platform: Platform.OS,
    reactNativeMinor: minor,
  }
  if (Platform.OS === 'android') {
    const api = Number(Platform.Version)
    if (Number.isInteger(api)) target.androidApi = api
  }
  return target
}
