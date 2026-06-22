import { useRef } from 'react'
import type { ThemeParsed, ThemeState, UseThemeWithStateProps } from '../types'
import { getThemeProxied, type ThemeProxied } from './getThemeProxied'
import {
  useThemeStateAtComponent,
  useThemeStateSubscribed,
} from './useThemeState'

const EMPTY = {}

export const useTheme = () => {
  'use no memo'

  const [theme] = useThemeWithState(EMPTY)
  const res = theme
  return res as ThemeProxied
}

export type ThemeWithState = [ThemeParsed, ThemeState]

/**
 * Adds a proxy around themeState that tracks update keys.
 *
 * Two call sites:
 *  1. <Theme> uses isRoot or has full ThemeProps -> needs the subscribed path
 *     (forceUpdateThemes invalidation, key tracking, scheme-only re-render gating).
 *  2. Every styled component + useTheme()/usePropsAndStyle go through the lite
 *     path that just reads parent ThemeState from context and synchronously
 *     derives a component-specific sub-theme. No useSyncExternalStore on the
 *     per-component hot path.
 */
export const useThemeWithState = (
  props: UseThemeWithStateProps,
  isRoot = false
): ThemeWithState => {
  'use no memo'

  const keys = useRef<Set<string> | null>(null)
  const schemeKeys = useRef<Set<string> | null>(null)

  // <Theme name="..."> / root provider go through the subscribed path; this is
  // O(num_theme_instances) total, not O(num_components_rendered).
  // Everyone else (createComponent, useProps, useTheme) goes through the lite
  // context-read path.
  const themeState = isRoot
    ? useThemeStateSubscribed(props, true, keys, schemeKeys)
    : useThemeStateAtComponent(props)

  if (process.env.NODE_ENV === 'development') {
    if (!props.passThrough && !themeState?.theme) {
      if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
        console.error(
          `[tamagui] No theme found, this could be due to an invalid theme name (given theme props ${JSON.stringify(
            props
          )}).\n\nIf this is intended and you are using Tamagui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1`
        )
      }
    }
  }

  const themeProxied = props.passThrough
    ? {}
    : getThemeProxied(props, themeState, keys, schemeKeys)

  return [themeProxied, themeState]
}
