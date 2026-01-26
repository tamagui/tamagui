import { getLinearGradient } from '@tamagui/native'

// re-export types from the web implementation (compatible)
export type { LinearGradientProps, LinearGradientPoint } from 'expo-linear-gradient'

// conditionally use expo-linear-gradient if setup, otherwise use web implementation
import { LinearGradient as WebLinearGradient } from './linear-gradient'

export function LinearGradient(props: any) {
  const state = getLinearGradient().state
  if (state.enabled && state.Component) {
    const ExpoLinearGradient = state.Component
    return <ExpoLinearGradient {...props} />
  }
  // fallback to CSS-based implementation
  return <WebLinearGradient {...props} />
}
