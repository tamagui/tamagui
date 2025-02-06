import { useRef } from 'react'
import type { ThemeParsed, ThemeProps, UseThemeWithStateProps } from '../types'
import { getThemeProxied, type ThemeProxied } from './getThemeProxied'
import type { ThemeState } from './useThemeState'
import { useThemeState } from './useThemeState'

export const useTheme = (props: ThemeProps = {}) => {
  const [theme] = useThemeWithState(props)
  const res = theme
  return res as ThemeProxied
}

export type ThemeWithState = [ThemeParsed, ThemeState]

/**
 * Adds a proxy around themeState that tracks update keys
 */
export const useThemeWithState = (
  props: UseThemeWithStateProps,
  isRoot = false
): ThemeWithState => {
  const keys = useRef<Set<string> | null>(null)
  const themeState = useThemeState(props, isRoot, keys)

  if (process.env.NODE_ENV === 'development') {
    if (!themeState?.theme) {
      if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
        console.error(
          `[tamagui] No theme found, this could be due to an invalid theme name (given theme props ${JSON.stringify(
            props
          )}).\n\nIf this is intended and you are using Tamagui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1`
        )
      }
    }
  }

  const themeProxied = getThemeProxied(props, themeState, keys)

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.info(`  🔹 [${themeState?.id}] useTheme =>`, themeState?.name)
  }

  return [themeProxied, themeState]
}
