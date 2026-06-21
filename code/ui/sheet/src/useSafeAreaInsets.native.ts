import * as React from 'react'
import { SafeAreaInsetsContext as RNSafeAreaInsetsContext } from 'react-native-safe-area-context'

import type { SafeAreaInsets } from './useSafeAreaInsets'

// the real react-native-safe-area-context insets context, re-typed to the local
// shape so consumers don't depend on the package's types. exported so the Sheet
// can re-propagate it across the portal.
export const SafeAreaInsetsContext =
  RNSafeAreaInsetsContext as unknown as React.Context<SafeAreaInsets | null>

/**
 * Live safe-area insets (notch / status bar / home indicator) read from the
 * context the app's SafeAreaProvider provides.
 *
 * Read this in a component BODY that renders inside the provider. The Sheet does
 * exactly that — only its modal CONTENT is teleported out through the portal, so
 * the body still sees the real insets. This is the one read that works in real
 * native bundles:
 *  - `getSafeArea()` (the @tamagui/native abstraction) is frequently NOT enabled
 *    against the instance a component reads, so it returns 0.
 *  - a dynamic `require('react-native-safe-area-context')` throws "Unknown named
 *    module" in metro/rolldown bundles where the package isn't in the importing
 *    module's graph.
 * A static import + context read avoids both.
 */
export function useSafeAreaInsets(): SafeAreaInsets | null {
  return React.useContext(SafeAreaInsetsContext)
}
