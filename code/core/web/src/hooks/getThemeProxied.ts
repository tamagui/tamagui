import { isIos } from '@tamagui/constants'
import type { MutableRefObject } from 'react'
import { getConfig, getSetting } from '../config'
import type { Variable } from '../createVariable'
import { getVariable } from '../createVariable'
import type {
  ThemeParsed,
  Tokens,
  UseThemeWithStateProps,
  VariableVal,
  VariableValGeneric,
} from '../types'
import { doesRootSchemeMatchSystem } from './doesRootSchemeMatchSystem'
import type { ThemeState } from './useThemeState'

export type ThemeProxied = {
  [Key in keyof ThemeParsed | keyof Tokens['color']]: ThemeGettable<
    Key extends keyof ThemeParsed ? ThemeParsed[Key] : Variable<any>
  >
} & {
  // fallback to other tokens
  [Key in string & {}]?: ThemeGettable<Variable<any>>
}

type ThemeGettable<Val> = Val & {
  /**
   * Tries to return an optimized value that avoids the need for re-rendering:
   * On web a CSS variable, on iOS a dynamic color, on Android it doesn't
   * optimize and returns the underyling value.
   *
   * See: https://reactnative.dev/docs/dynamiccolorios
   *
   * @param platform when "web" it will only return the dynamic value for web, avoiding the iOS dynamic value.
   * For things like SVG, gradients, or other external components that don't support it, use this option.
   */
  get: (
    platform?: 'web'
  ) =>
    | string
    | (Val extends Variable<infer X>
        ? X extends VariableValGeneric
          ? any
          : Exclude<X, Variable>
        : Val extends VariableVal
          ? string | number
          : unknown)
}

// only proxy each theme one time, after that we know that renders are sync,
// so we can just change the focus of the proxied theme and it can be re-used
const cache: Map<ThemeParsed, ThemeProxied> = new Map()

let curKeys: MutableRefObject<Set<string> | null>
let curProps: UseThemeWithStateProps
let curState: ThemeState | null

const emptyObject = {}

export function getThemeProxied(
  // underscore to prevent accidental usage below
  _props: UseThemeWithStateProps,
  _state: ThemeState | null,
  _keys: MutableRefObject<Set<string> | null>
): ThemeProxied {
  if (!_state?.theme) {
    return emptyObject
  }

  curKeys = _keys
  curProps = _props
  curState = _state

  if (cache.has(curState.theme)) {
    const proxied = cache.get(curState.theme)!
    return proxied
  }

  // first time running on this theme, create:
  // from here on only use current*

  const config = getConfig()

  function track(key: string) {
    if (!curKeys) return
    if (!curKeys.current) {
      curKeys.current = new Set()
    }
    curKeys.current.add(key)
    if (process.env.NODE_ENV === 'development' && curProps.debug) {
      console.info(` 🎨 useTheme() tracking new key: ${key}`, curKeys)
    }
  }

  const proxied = Object.fromEntries(
    Object.entries(_state.theme).flatMap(([key, value]) => {
      const proxied = {
        ...value,
        get val() {
          // when they touch the actual value we only track it if its a variable (web), its ignored!
          if (!globalThis.tamaguiAvoidTracking) {
            // always track .val
            track(key)
          }
          return value.val
        },
        get(platform?: 'web') {
          if (!curState) return

          const outVal = getVariable(value)
          const { name, scheme, inverses } = curState

          if (process.env.TAMAGUI_TARGET === 'native') {
            // ios can avoid re-rendering in some cases when we are using a root light/dark
            // disabled in cases where we have animations
            const shouldOptimize =
              scheme &&
              platform !== 'web' &&
              isIos &&
              !curProps.deopt &&
              getSetting('fastSchemeChange') &&
              inverses === 0 &&
              doesRootSchemeMatchSystem()

            if (shouldOptimize) {
              const oppositeScheme = scheme === 'dark' ? 'light' : 'dark'
              const oppositeName = name.replace(scheme, oppositeScheme)
              const color = getVariable(config.themes[name]?.[key])
              const oppositeColor = getVariable(config.themes[oppositeName]?.[key])

              const dynamicVal = {
                dynamic: {
                  [scheme]: color,
                  [oppositeScheme]: oppositeColor,
                },
              }

              return dynamicVal
            }

            if (process.env.NODE_ENV === 'development' && curProps.debug) {
              console.info(` 🎨 useTheme() tracking new key because of: 
                not web: ${platform !== 'web'}
                isIOS: ${isIos}
                deopt: ${curProps.deopt}
                fastScheme: ${getSetting('fastSchemeChange')}
              `)
            }

            track(key)
          }

          return outVal
        },
      }

      return [
        [key, proxied],
        [`$${key}`, proxied],
      ]
    })
  ) as ThemeProxied

  cache.set(_state.theme, proxied)

  return proxied
}
