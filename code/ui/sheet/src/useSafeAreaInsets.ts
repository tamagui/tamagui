import * as React from 'react'

export interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

// web uses CSS env(safe-area-inset-*) for safe areas, so there is no native
// safe-area context to read here — the keyboard-avoidance path uses the visual
// viewport offset instead. this stub keeps the import resolvable on web (where
// react-native-safe-area-context isn't a dependency) and is the canonical type
// source for both platform variants.
export const SafeAreaInsetsContext = React.createContext<SafeAreaInsets | null>(null)

export function useSafeAreaInsets(): SafeAreaInsets | null {
  return null
}
