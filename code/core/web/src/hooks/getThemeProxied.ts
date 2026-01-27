import { isIos } from '@tamagui/constants'
import type { MutableRefObject } from 'react'
import { getConfig, getSetting } from '../config'
import { getVariable } from '../createVariable'
import { getDynamicVal } from '../helpers/getDynamicVal'
import type {
  ThemeParsed,
  ThemeState,
  Tokens,
  UseThemeWithStateProps,
  Variable,
  VariableVal,
  VariableValGeneric,
} from '../types'
import { doesRootSchemeMatchSystem } from './doesRootSchemeMatchSystem'

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
let curSchemeKeys: MutableRefObject<Set<string> | null>
let curProps: UseThemeWithStateProps
let curState: ThemeState | null

const emptyObject = {}

export function getThemeProxied(
  // underscore to prevent accidental usage below
  _props: UseThemeWithStateProps,
  _state: ThemeState | null,
  _keys: MutableRefObject<Set<string> | null>,
  _schemeKeys?: MutableRefObject<Set<string> | null>
): ThemeProxied {
  if (!_state?.theme) {
    return emptyObject
  }

  curKeys = _keys
  curSchemeKeys = _schemeKeys!
  curProps = _props
  curState = _state

  if (cache.has(curState.theme)) {
    const proxied = cache.get(curState.theme)!
    return proxied
  }

  // first time running on this theme, create:
  // from here on only use current*

  const config = getConfig()

  function track(key: string, schemeOptimized = false) {
    if (!curKeys) return
    if (!curKeys.current) {
      curKeys.current = new Set()
    }
    curKeys.current.add(key)

    // track scheme-optimized keys separately so we know if a scheme-only
    // change can skip re-render (when all accessed keys use DynamicColorIOS)
    if (schemeOptimized && curSchemeKeys) {
      if (!curSchemeKeys.current) {
        curSchemeKeys.current = new Set()
      }
      curSchemeKeys.current.add(key)
    }

    if (process.env.NODE_ENV === 'development' && curProps.debug) {
      console.info(` 🎨 useTheme() tracking key: ${key} schemeOptimized=${schemeOptimized}`)
    }
  }

  const proxied = Object.fromEntries(
    Object.entries(_state.theme).flatMap(([key, value]) => {
      const proxied = {
        ...value,
        get val() {
          // when they touch the actual value we only track it if its a variable (web), its ignored!
          if (!globalThis.tamaguiAvoidTracking) {
            // always track .val - not scheme optimized since they're getting raw value
            track(key, false)
          }
          return value.val
        },
        get(platform?: 'web') {
          if (!curState) return

          const outVal = getVariable(value)
          const { name, scheme } = curState

          if (process.env.TAMAGUI_TARGET === 'native') {
            // ios can avoid re-rendering for scheme changes (light↔dark) when using DynamicColorIOS
            // this does NOT work for sub-theme changes (red→blue) - those need re-renders
            const fastSchemeChange = getSetting('fastSchemeChange')
            const rootMatchesSystem = doesRootSchemeMatchSystem()
            const shouldOptimize =
              scheme &&
              platform !== 'web' &&
              isIos &&
              !curProps.deopt &&
              fastSchemeChange &&
              rootMatchesSystem

            if (process.env.NODE_ENV === 'development' && curProps.debug === 'verbose') {
              console.info(
                ` 🎨 useTheme().get(${key}) theme=${name} scheme=${scheme}`,
                `\n   shouldOptimize=${shouldOptimize} (iOS=${isIos} deopt=${curProps.deopt} fastScheme=${fastSchemeChange} rootMatch=${rootMatchesSystem})`
              )
            }

            if (shouldOptimize) {
              const oppositeScheme = scheme === 'dark' ? 'light' : 'dark'
              const oppositeName = name.replace(scheme, oppositeScheme)
              const color = getVariable(config.themes[name]?.[key])
              const oppositeColor = getVariable(config.themes[oppositeName]?.[key])

              if (process.env.NODE_ENV === 'development' && curProps.debug === 'verbose') {
                console.info(
                  ` 🎨 useTheme().get(${key}) using DynamicColorIOS`,
                  `\n   color=${color} oppositeColor=${oppositeColor}`
                )
              }

              const dynamicVal = getDynamicVal({
                scheme,
                val: color,
                oppositeVal: oppositeColor,
              })

              // track as scheme-optimized - can skip re-render for scheme-only changes
              track(key, true)

              return dynamicVal
            }

            if (process.env.NODE_ENV === 'development' && curProps.debug) {
              console.info(
                ` 🎨 useTheme().get(${key}) tracking key (not optimizing)`,
                `\n   platform=${platform} isIOS=${isIos} deopt=${curProps.deopt} fastScheme=${fastSchemeChange}`
              )
            }

            // not scheme-optimized
            track(key, false)
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
