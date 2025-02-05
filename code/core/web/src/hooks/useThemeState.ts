import { useContext, type MutableRefObject } from 'react'
import type { ThemeParsed, UseThemeWithStateProps } from '../types'

export type ThemeState = { id: string; name: string; theme: ThemeParsed }

import React from 'react'

export const ThemeStateContext = React.createContext<ThemeState | null>(null)

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: MutableRefObject<string[] | null>
): ThemeState => {
  const { disable } = props
  const parentState = useContext(ThemeStateContext)
}
