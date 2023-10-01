import { isClient, isIos, isServer } from '@tamagui/constants'
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getConfig } from '../config'
import { Variable, getVariable } from '../createVariable'
import { createProxy } from '../helpers/createProxy'
import {
  ThemeManager,
  ThemeManagerState,
  getHasThemeUpdatingProps,
} from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import type {
  DebugProp,
  ThemeParsed,
  ThemeProps,
  UseThemeWithStateProps,
  VariableVal,
  VariableValGeneric,
} from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'

export type ChangedThemeResponse = {
  state?: ThemeManagerState
  themeManager?: ThemeManager | null
  isNewTheme: boolean
  mounted?: boolean
}

const emptyProps = { name: null }

let cached: any
function getDefaultThemeProxied() {
  if (cached) return cached
  const config = getConfig()
  const name = config.themes.light ? 'light' : Object.keys(config.themes)[0]
  const defaultTheme = config.themes[name]
  cached = getThemeProxied({ theme: defaultTheme, name })
  return cached
}

export type ThemeGettable<Val> = Val & {
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

export type UseThemeResult = {
  [Key in keyof ThemeParsed]: ThemeGettable<ThemeParsed[Key]>
}

export const useTheme = (props: ThemeProps = emptyProps) => {
  const [_, theme] = useThemeWithState(props)
  const res = theme || getDefaultThemeProxied()
  return res as UseThemeResult
}

export const useThemeWithState = (
  props: UseThemeWithStateProps
): [ChangedThemeResponse, ThemeParsed] => {
  const keys = useRef<string[]>([])

  const changedThemeState = useChangeThemeEffect(
    props,
    false,
    keys.current,
    !isServer
      ? () => {
          const next =
            props.shouldUpdate?.() ?? (keys.current.length > 0 ? true : undefined)

          if (
            process.env.NODE_ENV === 'development' &&
            props.debug &&
            props.debug !== 'profile'
          ) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(`  🎨 useTheme() shouldUpdate?`, next, {
              shouldUpdateProp: props.shouldUpdate?.(),
              keys: [...keys.current],
            })
          }
          return next
        }
      : undefined
  )

  const { themeManager, state } = changedThemeState

  if (!state?.theme) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
        console.warn(
          `[tamagui] No theme found, this could be due to an invalid theme name (given theme props ${JSON.stringify(
            props
          )}).\n\nIf this is intended and you are using Tamagui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1`
        )
      }
    }
  }

  const themeProxied = useMemo(() => {
    if (!themeManager || !state?.theme) {
      return {}
    }
    return getThemeProxied(state, props.deopt, themeManager, keys.current, props.debug)
  }, [state, themeManager, props.deopt, props.debug])

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed('  🔹 useTheme =>', state?.name)
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('returning state', changedThemeState, 'from props', props)
    console.groupEnd()
  }

  return [changedThemeState, themeProxied]
}

export function getThemeProxied(
  { theme, name }: ThemeManagerState,
  deopt = false,
  themeManager?: ThemeManager,
  keys?: string[],
  debug?: DebugProp
): UseThemeResult {
  if (!theme) return {}

  const config = getConfig()

  function track(key: string) {
    if (keys && !keys.includes(key)) {
      keys.push(key)
      if (process.env.NODE_ENV === 'development' && debug) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(` 🎨 useTheme() tracking new key: ${key}`)
      }
    }
  }

  return createProxy(theme, {
    has(_, key) {
      if (Reflect.has(theme, key)) {
        return true
      }
      if (typeof key === 'string') {
        if (key[0] === '$') key = key.slice(1)
        return themeManager?.allKeys.has(key)
      }
    },
    get(_, key) {
      if (key === GetThemeUnwrapped) {
        return theme
      }

      if (
        // dont ask me, idk why but on hermes you can see that useTheme()[undefined] passes in STRING undefined to proxy
        // if someone is crazy enough to use "undefined" as a theme key then this not working is on them
        key !== 'undefined' &&
        typeof key === 'string'
      ) {
        // auto convert variables to plain
        const keyString = key[0] === '$' ? key.slice(1) : key
        const val = theme[keyString]

        if (val && typeof val === 'object') {
          // TODO this could definitely be done better by at the very minimum
          // proxying it up front and just having a listener here
          return new Proxy(val as any, {
            // when they touch the actual value we only track it
            // if its a variable (web), its ignored!
            get(_, subkey) {
              if (subkey === 'val') {
                // always track .val
                track(keyString)
              } else if (subkey === 'get') {
                return (platform?: 'web') => {
                  const outVal = getVariable(val)

                  if (process.env.TAMAGUI_TARGET === 'native') {
                    // ios can avoid re-rendering in some cases when we are using a root light/dark
                    // disabled in cases where we have animations
                    if (
                      platform !== 'web' &&
                      isIos &&
                      !deopt &&
                      config.settings.fastSchemeChange
                    ) {
                      const isDark = name.startsWith('dark')
                      const isLight = !isDark && name.startsWith('light')
                      if (isDark || isLight) {
                        const oppositeThemeName = name.replace(
                          isDark ? 'dark' : 'light',
                          isDark ? 'light' : 'dark'
                        )
                        const oppositeTheme = config.themes[oppositeThemeName]
                        const oppositeVal = getVariable(oppositeTheme?.[keyString])
                        if (oppositeVal) {
                          const dynamicVal = {
                            dynamic: {
                              dark: isDark ? outVal : oppositeVal,
                              light: isLight ? outVal : oppositeVal,
                            },
                          }
                          return dynamicVal
                        }
                      }
                    }

                    // if we dont return early with a dynamic val on native, always track
                    track(keyString)
                  }

                  return outVal
                }
              }

              return Reflect.get(val as any, subkey)
            },
          })
        }
      }

      return Reflect.get(_, key)
    },
  }) as UseThemeResult
}

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: string[],
  shouldUpdate?: () => boolean | undefined
): ChangedThemeResponse => {
  const { disable } = props

  const parentManager = useContext(ThemeManagerContext)

  if ((!isRoot && !parentManager) || disable) {
    return {
      isNewTheme: false,
      state: parentManager?.state,
      themeManager: parentManager,
    }
  }

  // for testing performance can bail it out early with this fake response:
  // i found most of the cost was just having a useState at all, at least 30%
  // if (!disable && parentManager) {
  //   return {
  //     isNewTheme: false,
  //     state: {
  //       name: 'light',
  //       theme: getConfig().themes.light,
  //     },
  //     themeManager: parentManager!,
  //   }
  // }

  const [themeState, setThemeState] = useState<ChangedThemeResponse>(createState)
  const { state, mounted, isNewTheme, themeManager } = themeState
  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)

  function getShouldUpdateTheme(
    manager = themeManager,
    nextState?: ThemeManagerState | null,
    prevState: ThemeManagerState | undefined = state,
    forceShouldChange = false
  ) {
    const forceUpdate = shouldUpdate?.()
    if (!manager || (!forceShouldChange && forceUpdate === false)) return
    const next = nextState || manager.getState(props, parentManager)
    if (forceShouldChange) return next
    if (!next) return
    if (forceUpdate !== true && !manager.getStateShouldChange(next, prevState)) {
      return
    }
    return next
  }

  if (!isServer) {
    // listen for parent change + notify children change
    useLayoutEffect(() => {
      if (!themeManager) return

      // SSR safe inverse (because server can't know prefers scheme)
      // could be done through fancy selectors like how we do prefers-media
      // but may be a bit of explosion of selectors
      if (props.inverse && !mounted) {
        setThemeState({ ...themeState, mounted: true })
        return
      }

      if (isNewTheme && themeManager) {
        activeThemeManagers.add(themeManager)
      }

      if (isNewTheme || getShouldUpdateTheme(themeManager)) {
        setThemeState(createState)
      }

      // for updateTheme/replaceTheme
      const selfListenerDispose = themeManager.onChangeTheme((_a, _b, forced) => {
        if (forced) {
          setThemeState((prev) => createState(prev, true))
        }
      })

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        const force =
          shouldUpdate?.() ||
          props.deopt ||
          // this fixes themeable() not updating with the new fastSchemeChange setting
          (process.env.TAMAGUI_TARGET === 'native'
            ? props['disable-child-theme']
            : undefined)

        const shouldTryUpdate = force ?? Boolean(keys?.length || isNewTheme)

        if (process.env.NODE_ENV === 'development' && props.debug) {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(` 🔸 onChange`, themeManager.id, {
            force,
            shouldTryUpdate,
            props,
            name,
            manager,
            keys,
          })
        }

        if (shouldTryUpdate) {
          setThemeState(createState)
        }
      }, themeManager.id)

      return () => {
        selfListenerDispose()
        disposeChangeListener?.()
        activeThemeManagers.delete(themeManager)
      }
    }, [
      themeManager,
      parentManager,
      isNewTheme,
      props.componentName,
      props.inverse,
      props.name,
      props.reset,
      mounted,
    ])

    if (process.env.NODE_ENV === 'development' && props.debug !== 'profile') {
      useEffect(() => {
        globalThis['TamaguiThemeManagers'] ??= new Set()
        globalThis['TamaguiThemeManagers'].add(themeManager)
        return () => {
          globalThis['TamaguiThemeManagers'].delete(themeManager)
        }
      }, [themeManager])
    }
  }

  if (isInversingOnMount) {
    return {
      isNewTheme: false,
      themeManager: parentManager,
      state: {
        name: '',
        ...parentManager?.state,
        className: '',
      },
    }
  }

  return {
    state,
    isNewTheme,
    themeManager,
  }

  function createState(prev?: ChangedThemeResponse, force = false): ChangedThemeResponse {
    if (prev && shouldUpdate?.() === false) {
      return prev
    }

    //  returns previous theme manager if no change
    let themeManager: ThemeManager = parentManager!
    let state: ThemeManagerState | undefined
    const hasThemeUpdatingProps = getHasThemeUpdatingProps(props)

    if (hasThemeUpdatingProps) {
      const getNewThemeManager = () => {
        return new ThemeManager(props, isRoot ? 'root' : parentManager)
      }

      if (prev?.themeManager) {
        themeManager = prev.themeManager

        // this could be a bit better, problem is on toggling light/dark the state is actually
        // showing light even when the last was dark. but technically allso onChangeTheme should
        // basically always call on a change, so i'm wondering if we even need the shouldUpdate
        // at all anymore. this forces updates onChangeTheme for all dynamic style accessed components
        // which is correct, potentially in the future we can avoid forceChange and just know to
        // update if keys.length is set + onChangeTheme called
        const forceChange = Boolean(keys?.length)
        const next = themeManager.getState(props, parentManager)
        const nextState = getShouldUpdateTheme(
          themeManager,
          next,
          prev.state,
          forceChange
        )

        if (nextState) {
          state = nextState

          if (!prev.isNewTheme) {
            themeManager = getNewThemeManager()
          } else {
            themeManager.updateState(nextState)
          }
        } else {
          if (prev.isNewTheme) {
            // reset to parent
            if (parentManager && !next) {
              themeManager = parentManager
            }
          }
        }
      } else {
        themeManager = getNewThemeManager()
        state = { ...themeManager.state }
      }
    }

    const isNewTheme = Boolean(themeManager !== parentManager || props.inverse)

    // only inverse relies on this for ssr
    const mounted = !props.inverse ? true : isRoot || prev?.mounted

    if (!state) {
      if (isNewTheme) {
        state = themeManager.state
      } else {
        state = parentManager!.state
        themeManager = parentManager!
      }
    }

    if (!force && state?.name === prev?.state?.name) {
      return prev
    }

    const response = {
      state,
      themeManager,
      isNewTheme,
      mounted,
    } satisfies ChangedThemeResponse

    if (process.env.NODE_ENV === 'development' && props['debug'] && isClient) {
      console.groupCollapsed(` 🔷 ${themeManager.id} useChangeThemeEffect createState`)
      const parentState = { ...parentManager?.state }
      const parentId = parentManager?.id
      const themeManagerState = { ...themeManager.state }
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log({
        props,
        parentState,
        parentId,
        themeManager,
        prev,
        response,
        themeManagerState,
      })
      console.groupEnd()
    }

    return response
  }
}
