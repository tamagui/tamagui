/* eslint-disable no-console */
import { isClient, isServer, isWeb } from '@tamagui/constants'
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getConfig } from '../config'
import { getVariable } from '../createVariable'
import { createProxy } from '../helpers/createProxy'
import {
  ThemeManager,
  ThemeManagerState,
  getHasThemeUpdatingProps,
} from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import type { DebugProp, ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped, getThemeUnwrapped } from './getThemeUnwrapped'

export type ChangedThemeResponse = {
  state: ThemeManagerState
  parentState?: ThemeManagerState
  themeManager: ThemeManager
  isNewTheme: boolean
  mounted?: boolean
}

const emptyProps = { name: null }

function getDefaultThemeProxied() {
  const config = getConfig()
  return getThemeProxied({
    theme: config.themes[Object.keys(config.themes)[0]],
  })
}

type UseThemeResult = {
  [key in keyof ThemeParsed]: ThemeParsed[key] & {
    get: () => string | ThemeParsed[key]['val']
  }
}

export const useTheme = (props: ThemeProps = emptyProps) => {
  const [_, theme] = useThemeWithState(props)
  const res = theme || getDefaultThemeProxied()
  return res as UseThemeResult
}

export const useThemeWithState = (
  props: ThemeProps
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
          if (process.env.NODE_ENV === 'development' && props.debug) {
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
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
  const { theme, name, className } = state

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `No theme found given props ${JSON.stringify(
          props
        )}. Themes given to tamagui are: ${Object.keys(getConfig().themes)}`
      )
    }
    throw `❌ 1`
  }

  const themeProxied = useMemo(() => {
    return getThemeProxied(
      {
        theme,
        themeManager,
      },
      keys.current,
      props.debug
    )
  }, [theme, name, className, themeManager])

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed('  🔹 useTheme =>', name)
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log('returning state', changedThemeState, 'from props', props)
    console.groupEnd()
  }

  return [changedThemeState, themeProxied]
}

export function getThemeProxied(
  {
    theme,
    themeManager,
  }: {
    theme: ThemeParsed
    themeManager?: ThemeManager
  },
  keys?: string[],
  debug?: DebugProp
): UseThemeResult {
  return createProxy(theme, {
    has(_, key) {
      if (typeof key === 'string') {
        if (key[0] === '$') key = key.slice(1)
        return themeManager?.allKeys.has(key)
      }
      return Reflect.has(theme, key)
    },
    get(_, key) {
      if (key === GetThemeUnwrapped) {
        return theme
      }
      if (typeof key === 'string' && keys) {
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
              // trigger read key that makes it track updates
              if (
                (subkey === 'val' || (subkey === 'get' && !isWeb)) &&
                !keys.includes(keyString)
              ) {
                keys.push(keyString)
                if (process.env.NODE_ENV === 'development' && debug) {
                  console.warn(` 🎨 useTheme() tracking new key: ${keyString}`)
                }
              }
              if (subkey === 'get') {
                return () => getVariable(val)
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
  props: ThemeProps,
  root = false,
  keys?: string[],
  shouldUpdate?: () => boolean | undefined
): ChangedThemeResponse => {
  const {
    // @ts-expect-error internal use only
    disable,
  } = props

  const parentManager = useContext(ThemeManagerContext)
  const hasThemeUpdatingProps = getHasThemeUpdatingProps(props)

  if (disable) {
    if (!parentManager) throw `❌ 2`
    return {
      isNewTheme: false,
      state: parentManager.state,
      themeManager: parentManager,
    }
  }

  const [themeState, setThemeState] = useState<ChangedThemeResponse>(createState)
  const { state, mounted, isNewTheme, themeManager } = themeState
  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)

  function getShouldUpdateTheme(
    manager = themeManager,
    nextState?: ThemeManagerState | null,
    prevState: ThemeManagerState = state,
    forceShouldChange = false
  ) {
    const forceUpdate = shouldUpdate?.()
    if (!forceShouldChange && forceUpdate === false) return
    const next = nextState || manager.getState(props, parentManager)
    if (forceShouldChange) return next
    if (!next) return
    if (forceUpdate !== true) {
      if (!manager.getStateShouldChange(next, prevState)) return
    }
    return next
  }

  if (!isServer) {
    // listen for parent change + notify children change
    useLayoutEffect(() => {
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

      const nextState = getShouldUpdateTheme(themeManager)

      // if (nextState && isNewTheme) {
      //   // if it's a new theme we can just update + publish to children
      //   themeManager.updateState(nextState, true)
      // }

      if (nextState || isNewTheme) {
        setThemeState(createState)
      }

      // for updateTheme/replaceTheme
      const selfListenerDispose = themeManager.onChangeTheme((_a, _b, forced) => {
        if (forced) {
          setThemeState((prev) => createState(prev, true))
        }
      })

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        const force = shouldUpdate?.()
        const doUpdate = force ?? Boolean(keys?.length || isNewTheme)
        if (process.env.NODE_ENV === 'development' && props.debug) {
          // prettier-ignore
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(` 🔸 onChange`, themeManager.id, { force, doUpdate, props, name, manager, keys })
        }
        if (doUpdate) {
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

    if (process.env.NODE_ENV === 'development') {
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
    if (!parentManager) throw '❌ 3'
    return {
      isNewTheme: false,
      themeManager: parentManager,
      state: {
        ...parentManager.state,
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

    const getNewThemeManager = () => {
      return new ThemeManager(props, root ? 'root' : parentManager)
    }

    // only if has updating theme props
    if (hasThemeUpdatingProps) {
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

          if (!prev.isNewTheme || !isWeb) {
            themeManager = getNewThemeManager()
          } else {
            themeManager.updateState(nextState, true)
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

    const isNewTheme = Boolean(themeManager !== parentManager)

    // only inverse relies on this for ssr
    const mounted = !props.inverse ? true : root || prev?.mounted

    if (!state) {
      if (isNewTheme) {
        state = { ...themeManager.state }
      } else {
        state = parentManager!.state
        themeManager = parentManager!
      }
    }

    if (!force && state.name === prev?.state.name) {
      return prev
    }

    const response = {
      parentState: parentManager?.state,
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
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
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
