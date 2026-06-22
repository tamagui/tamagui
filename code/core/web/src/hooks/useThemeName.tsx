import { useContext } from 'react'
import { getSetting } from '../config'
import type { ThemeName } from '../types'
import { ThemeStateValueContext, useThemeState } from './useThemeState'

// can probably simplify this way down
const forceUpdateState = { forceClassName: true, deopt: true, needsUpdate: () => true }
const forceKeys = { current: new Set(['']) }

export function useThemeName(): ThemeName {
  if (getSetting('themeOptimize') === 'initial-render') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContext(ThemeStateValueContext)?.name || ''
  }

  return useThemeState(forceUpdateState, false, forceKeys)?.name || ''
}
