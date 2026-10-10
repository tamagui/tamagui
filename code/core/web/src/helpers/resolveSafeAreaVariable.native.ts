import { getSafeArea } from '@tamagui/native'

let didWarnMissingSetup = false

export function resolveSafeAreaVariable(name: string): number | undefined {
  const edge = name.startsWith('safe-area-') ? name.slice(10) : ''
  if (edge !== 'top' && edge !== 'right' && edge !== 'bottom' && edge !== 'left') {
    return
  }

  const safeArea = getSafeArea()
  const state = safeArea.state
  if (!state.didSetup) {
    if (process.env.NODE_ENV !== 'production' && !didWarnMissingSetup) {
      didWarnMissingSetup = true
      console.warn(
        '[tamagui] safe-area variables on native require importing @tamagui/native/setup-safe-area and wrapping the app in the SafeAreaProvider from react-native-safe-area-context.'
      )
    }
    return 0
  }

  return state.enabled ? (state.initialMetrics?.insets[edge] ?? 0) : 0
}

export function subscribeToSafeArea(listener: () => void): () => void {
  return getSafeArea().subscribe(listener)
}
