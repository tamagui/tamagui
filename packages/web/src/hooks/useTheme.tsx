/* eslint-disable no-console */
import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { getVariable } from '../createVariable'
import { createProxy } from '../helpers/createProxy'
import {
  ThemeManager,
  ThemeManagerState,
  getHasThemeUpdatingProps,
} from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import type { ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'
import { useServerRef } from './useServerHooks'

export type ChangedThemeResponse = {
  isNewTheme: boolean
  themeManager: ThemeManager | null
  name: string
  theme?: ThemeParsed | null
  className?: string
}

type State = {
  state: ThemeManagerState
  themeManager: ThemeManager
  isNewTheme: boolean
  mounted?: boolean
}

const emptyProps = { name: null }

function getDefaultThemeProxied() {
  const config = getConfig()
  const name = Object.keys(config.themes)[0]
  return getThemeProxied({
    theme: config.themes[name],
    name,
  })
}

type UseThemeResult = {
  [key in keyof ThemeParsed]: ThemeParsed[key] & {
    get: () => string | ThemeParsed[key]['val']
  }
}

export const useTheme = (props: ThemeProps = emptyProps): UseThemeResult => {
  return (isRSC ? null : useThemeWithState(props)?.theme) || getDefaultThemeProxied()
}

export const useThemeWithState = (props: ThemeProps) => {
  const keys = useServerRef<string[]>([])

  const changedTheme = useChangeThemeEffect(
    props,
    false,
    keys.current,
    isClient
      ? () => {
          return props.shouldUpdate?.() ?? keys.current.length === 0
        }
      : undefined
  )

  const { themeManager, theme, name, className } = changedTheme

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed('  🔹 useTheme =>', name)
    const logs = { ...props, name, className, ...(isDevTools && { theme }) }
    for (const key in logs) {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log('  ', key, logs[key])
    }
    console.groupEnd()
  }

  if (!changedTheme.theme) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No theme found', name, props, themeManager)
    }
    return null
  }

  const proxiedTheme = useMemo(() => {
    return getThemeProxied(changedTheme as any, keys.current)
  }, [theme, name, className, themeManager])

  return {
    ...changedTheme,
    theme: proxiedTheme,
  }
}

export function getThemeProxied(
  {
    theme,
    themeManager,
  }: Partial<ChangedThemeResponse> & {
    theme: ThemeParsed
  },
  keys?: string[]
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
      if (
        key === '__proto__' ||
        key === '$typeof' ||
        typeof key !== 'string' ||
        !themeManager
      ) {
        return Reflect.get(_, key)
      }

      // auto convert variables to plain
      const keyString = key[0] === '$' ? key.slice(1) : key
      const val = themeManager.getValue(keyString)

      if (val && keys) {
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
            }
            if (subkey === 'get') {
              return () => getVariable(val)
            }
            return Reflect.get(val as any, subkey)
          },
        })
      }

      return val
    },
  }) as UseThemeResult
}

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  props: ThemeProps,
  root = false,
  keys?: string[],
  disableUpdate?: () => boolean
): ChangedThemeResponse => {
  if (isRSC) {
    // we need context working for this to work well
    return {
      isNewTheme: false,
      ...createState().state,
      themeManager: null,
    }
  }

  const {
    // @ts-expect-error internal use only
    disable,
  } = props

  const parentManager = useContext(ThemeManagerContext)
  const hasThemeUpdatingProps = getHasThemeUpdatingProps(props)

  if (disable) {
    if (!parentManager) throw `❌`
    return {
      isNewTheme: false,
      ...parentManager.state,
      themeManager: parentManager,
    }
  }

  const [themeState, setThemeState] = useState<State>(createState)
  const { state, mounted, isNewTheme, themeManager } = themeState

  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)

  function getShouldUpdateTheme(
    manager = themeManager,
    nextState?: ThemeManagerState | null,
    prevState: ThemeManagerState = state,
    forceShouldChange = false
  ) {
    const next = nextState || manager.getState(props, parentManager)
    // if (props.inverse) return true
    if (!next) return
    if (disableUpdate?.() === true) return
    if (!forceShouldChange && !manager.getStateShouldChange(next, prevState)) return
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

      if (nextState) {
        if (isNewTheme) {
          // if it's a new theme we can just update + publish to children
          themeManager.updateState(nextState, true)
        }

        // if not we will be creating a whole new themeManager
        setThemeState(createState)
      } else {
        if (isNewTheme) {
          // need to revert to parent
          setThemeState(createState)
        }
      }

      // for updateTheme/replaceTheme
      const selfListenerDispose = themeManager.onChangeTheme((_a, _b, forced) => {
        if (forced) {
          setThemeState((prev) => createState(prev, true))
        }
      })

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        const shouldUpdate = Boolean(keys?.length || isNewTheme)
        if (process.env.NODE_ENV === 'development' && props.debug) {
          const logs = { shouldUpdate, props, name, manager, keys }
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(` 🔸 onChange`, themeManager.id, logs)
        }
        if (shouldUpdate) {
          setThemeState(createState)
        }
      }, themeManager.id)

      return () => {
        selfListenerDispose()
        disposeChangeListener?.()
        activeThemeManagers.delete(themeManager)
      }
    }, [
      parentManager,
      isNewTheme,
      props.componentName,
      props.inverse,
      props.name,
      props.reset,
      themeState.mounted,
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
    if (!parentManager) throw '❌'
    return {
      isNewTheme: false,
      ...parentManager.state,
      className: '',
      themeManager: parentManager,
    }
  }

  return {
    ...state,
    isNewTheme,
    themeManager,
  }

  function createState(prev?: State, force = false): State {
    if (prev && disableUpdate?.()) {
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
      state,
      themeManager,
      isNewTheme,
      mounted,
    }

    if (process.env.NODE_ENV === 'development' && props['debug']) {
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
