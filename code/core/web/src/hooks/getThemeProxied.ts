import { supportsDynamicColorIOS } from '@tamagui/constants'
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
const trackingCache: Map<ThemeParsed, ThemeProxied> = new Map()
const untrackedCache: Map<ThemeParsed, ThemeProxied> = new Map()

let curKeys: MutableRefObject<Set<string> | null>
let curSchemeKeys: MutableRefObject<Set<string> | null>
let curProps: UseThemeWithStateProps
let curState: ThemeState | null

const emptyObject = {}

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

export function getThemeProxied(
  // underscore to prevent accidental usage below
  _props: UseThemeWithStateProps,
  _state: ThemeState | null,
  _keys: MutableRefObject<Set<string> | null>,
  _schemeKeys?: MutableRefObject<Set<string> | null>,
  optimizeForFirstRender = false
): ThemeProxied {
  if (!_state?.theme) {
    return emptyObject
  }

  if (!optimizeForFirstRender) {
    curKeys = _keys
    curSchemeKeys = _schemeKeys!
  }
  curProps = _props
  curState = _state

  const cache = optimizeForFirstRender ? untrackedCache : trackingCache
  if (cache.has(curState.theme)) {
    const proxied = cache.get(curState.theme)!
    return proxied
  }

  // first time running on this theme, create:
  // from here on only use current*

  const config = getConfig()

  const proxied = Object.fromEntries(
    Object.entries(_state.theme).flatMap(([key, value]) => {
      const get = (platform?: 'web') => {
        if (!curState) return

        const outVal = getVariable(value)
        const { name, scheme } = curState

        if (process.env.TAMAGUI_TARGET === 'native') {
          // ios can avoid re-rendering for scheme changes (light↔dark) when using DynamicColorIOS.
          // DynamicColorIOS always resolves by the OS appearance, so this is only correct for a
          // subtree that follows the OS scheme. it does NOT work when a <Theme> forces a scheme
          // away from the OS/root — at any depth. `inverses` counts scheme flips from the root, so
          // `inverses === 0` is exactly "this subtree still follows the OS". isInverse alone was
          // wrong: a sub-theme keeping its parent's forced scheme (dark_blue under a forced dark,
          // light root) has isInverse=false yet must NOT optimize, or iOS would pick the OS-scheme
          // value (light) instead of the forced dark value.
          const fastSchemeChange = getSetting('fastSchemeChange')
          const rootMatchesSystem = doesRootSchemeMatchSystem()
          const shouldOptimize =
            scheme &&
            platform !== 'web' &&
            supportsDynamicColorIOS &&
            !curProps.deopt &&
            !curState.inverses &&
            fastSchemeChange &&
            rootMatchesSystem

          if (process.env.NODE_ENV === 'development' && curProps.debug === 'verbose') {
            console.info(
              ` 🎨 useTheme().get(${key}) theme=${name} scheme=${scheme}`,
              `\n   shouldOptimize=${shouldOptimize} (dynamicColorIOS=${supportsDynamicColorIOS} deopt=${curProps.deopt} inverses=${curState.inverses} fastScheme=${fastSchemeChange} rootMatch=${rootMatchesSystem})`
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

            if (!optimizeForFirstRender) {
              // track as scheme-optimized - can skip re-render for scheme changes
              track(key, true)
            }

            return dynamicVal
          }

          if (process.env.NODE_ENV === 'development' && curProps.debug) {
            console.info(
              ` 🎨 useTheme().get(${key}) tracking key (not optimizing)`,
              `\n   platform=${platform} dynamicColorIOS=${supportsDynamicColorIOS} deopt=${curProps.deopt} fastScheme=${fastSchemeChange}`
            )
          }

          if (!optimizeForFirstRender) {
            track(key, false)
          }
        }

        return outVal
      }

      const proxied = optimizeForFirstRender
        ? {
            ...value,
            val: value.val,
            get,
          }
        : {
            ...value,
            get val() {
              // when they touch the actual value we only track it if its a variable (web), its ignored!
              if (!globalThis.tamaguiAvoidTracking) {
                // always track .val - not scheme optimized since they're getting raw value
                track(key, false)
              }
              return value.val
            },
            get,
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
