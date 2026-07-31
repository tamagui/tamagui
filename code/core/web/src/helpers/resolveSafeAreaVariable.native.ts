import { getSafeArea } from '@tamagui/native'
import { getSafeAreaEdge } from '@tamagui/style-grammar'

const safeArea = getSafeArea()
let didWarnMissingSetup = false

export function resolveSafeAreaVariable(name: string): number | undefined {
  const edge = getSafeAreaEdge(name)
  if (!edge) return undefined

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
  return safeArea.subscribe(listener)
}
