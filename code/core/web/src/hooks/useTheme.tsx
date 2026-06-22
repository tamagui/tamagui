import { useRef, type MutableRefObject } from 'react'
import type { ThemeParsed, ThemeState, UseThemeWithStateProps } from '../types'
import { getThemeProxied, type ThemeProxied } from './getThemeProxied'
import { useThemeState } from './useThemeState'

const EMPTY = {}

type KeysBag = {
  keys: MutableRefObject<Set<string> | null>
  schemeKeys: MutableRefObject<Set<string> | null>
}

export const useTheme = () => {
  'use no memo'

  const [theme] = useThemeWithState(EMPTY)
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
  'use no memo'

  // single useRef holding both keys + schemeKeys; saves one hook slot per
  // component vs separate useRef calls. these still look like MutableRefObject
  // to getThemeProxied which only reads/writes `.current`.
  const bag = useRef<KeysBag | null>(null)
  if (!bag.current) {
    bag.current = {
      keys: { current: null },
      schemeKeys: { current: null },
    }
  }
  const { keys, schemeKeys } = bag.current
  const themeState = useThemeState(props, isRoot, keys, schemeKeys)

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
