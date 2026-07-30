import { getSafeArea } from '@tamagui/native'
import * as React from 'react'
import { SafeAreaInsetsContext as RNSafeAreaInsetsContext } from 'react-native-safe-area-context'

import type { SafeAreaInsets } from './useSafeAreaInsets'

// the real react-native-safe-area-context insets context, re-typed to the local
// shape so consumers don't depend on the package's types. exported so the Sheet
// can re-propagate it across the portal.
export const SafeAreaInsetsContext =
  RNSafeAreaInsetsContext as unknown as React.Context<SafeAreaInsets | null>

const safeArea = getSafeArea()
const useStoreFeed = safeArea.state.useSafeAreaInsets

function useContextInsets(): SafeAreaInsets | null {
  return React.useContext(SafeAreaInsetsContext)
}

/**
 * live safe-area insets (notch / status bar / home indicator).
 *
 * setup-safe-area installs a context-to-store feed so every store subscriber
 * sees provider updates. Without that setup, keep the direct context read that
 * lets Sheet work independently.
 */
export function useSafeAreaInsets(): SafeAreaInsets | null {
  const contextInsets = (useStoreFeed || useContextInsets)()
  const storeInsets = React.useSyncExternalStore(
    safeArea.subscribe,
    safeArea.getInsets,
    safeArea.getInsets
  )

  return useStoreFeed ? storeInsets : contextInsets
}
