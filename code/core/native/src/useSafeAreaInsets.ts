import * as React from 'react'

import type { SafeAreaInsets } from './types'

const defaultInsets: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 }

// a stable fallback context so the hook can call useContext unconditionally
// (rules-of-hooks) even when react-native-safe-area-context isn't present.
const fallbackContext = React.createContext<SafeAreaInsets | null>(null)

// resolve the react-native-safe-area-context insets context ONCE. the result
// never changes for the app's lifetime, so useContext below reads a stable
// context object every render.
let _insetsContext: React.Context<SafeAreaInsets | null> | undefined

function getInsetsContext(): React.Context<SafeAreaInsets | null> {
  if (_insetsContext !== undefined) return _insetsContext
  let ctx: React.Context<SafeAreaInsets | null> = fallbackContext
  // web uses CSS env(safe-area-inset-*); no RN context needed
  if (process.env.TAMAGUI_TARGET !== 'web') {
    try {
      // the LIVE context is the single source of truth. unlike
      // getSafeArea().getInsets() (which reads cached/initial metrics and is the
      // wrong empty value when the @tamagui/native instance that setup-safe-area
      // enabled differs from the one a consumer reads — e.g. a duplicated
      // @tamagui install), react-native-safe-area-context resolves to ONE module
      // instance, so its context is always correct.
      ctx =
        require('react-native-safe-area-context').SafeAreaInsetsContext ?? fallbackContext
    } catch {
      ctx = fallbackContext
    }
  }
  _insetsContext = ctx
  return ctx
}

/**
 * Live safe-area insets read from react-native-safe-area-context.
 *
 * Returns zeroed insets on web (use CSS env() there) or when no
 * SafeAreaProvider is mounted. Reactive — re-renders on rotation / inset change.
 *
 * Prefer this over getSafeArea().getInsets() inside components: getInsets()
 * returns non-reactive initial metrics and silently returns 0 when the
 * @tamagui/native instance is duplicated or setup-safe-area didn't run against
 * the instance you read.
 */
export function useSafeAreaInsets(): SafeAreaInsets {
  const insets = React.useContext(getInsetsContext())
  return insets ?? defaultInsets
}
