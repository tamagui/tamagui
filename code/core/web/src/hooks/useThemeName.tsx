import type { ThemeName } from '../types'
import { useThemeState } from './useThemeState'

const forceKeys = { current: new Set(['']) }

export function useThemeName(): ThemeName {
  return useThemeState({}, false, forceKeys)?.name || ''
}
