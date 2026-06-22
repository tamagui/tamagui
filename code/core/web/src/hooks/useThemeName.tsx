import { useContext } from 'react'
import type { ThemeName } from '../types'
import { ThemeStateContext } from './useThemeState'

export function useThemeName(): ThemeName {
  // moonshot: just read the current theme snapshot from context. No subscription,
  // no useId, no refs. Context updates propagate when the root <Theme> re-renders.
  const state = useContext(ThemeStateContext)
  return (state?.name as ThemeName) || ''
}
