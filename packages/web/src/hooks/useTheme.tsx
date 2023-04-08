/* eslint-disable no-console */
import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config.js'
import { isDevTools } from '../constants/isDevTools.js'
import { isVariable } from '../createVariable.js'
import { createProxy } from '../helpers/createProxy.js'
import {
  ThemeManager,
  ThemeManagerState,
  hasNoThemeUpdatingProps,
} from '../helpers/ThemeManager.js'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext.js'
import type { ThemeParsed, ThemeProps } from '../types.js'
import { GetThemeUnwrapped } from './getThemeUnwrapped.js'
import { useServerRef } from './useServerHooks.js'

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

export const useTheme = (props: ThemeProps = emptyProps): ThemeParsed => {
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
) {
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
            if (subkey === 'val' && !keys.includes(keyString)) {
              keys.push(keyString)
            }
            return Reflect.get(val as any, subkey)
          },
        })
      }

      return val
    },
  })
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
  const parentManager = useContext(ThemeManagerContext)

  const {
    debug,
    // @ts-expect-error internal use only
    disable,
  } = props

  if (disable) {
    if (!parentManager) throw `❌`
    return {
      isNewTheme: false,
      ...parentManager.state,
      themeManager: parentManager,
    }
  }

  const [themeState, setThemeState] = useState<State>(createState)
  const { state, themeManager, mounted, isNewTheme } = themeState
  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)
  const shouldReturnParentState = isInversingOnMount

  if (shouldReturnParentState) {
    if (!parentManager) throw 'impossible'
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
      console.log(
        'useTheme hasNoThemeUpdatingProps',
        parentManager.state.name,
        'isInversingOnMount',
        isInversingOnMount
      )
    }
    return {
      isNewTheme: false,
      ...parentManager.state,
      className: isInversingOnMount ? '' : parentManager.state.className,
      themeManager: parentManager,
    }
  }

  function getNextThemeManagerState(manager = themeManager) {
    console.log(
      `GET`,
      props,
      parentManager === themeManager,
      parentManager?.state,
      themeManager.state
    )

    return manager.getState(
      props,
      parentManager === themeManager ? parentManager.parentManager : parentManager
    )
  }

  function getThemeManagerNextStateIfChanged(manager = themeManager) {
    const next = getNextThemeManagerState()
    if (!next) return
    if (disableUpdate?.() === true) return
    if (!manager.getStateShouldChange(next, state)) return
    return next
  }

  if (!isServer) {
    useEffect(() => {
      if (!isNewTheme) return
      if (!themeManager) return
      if (disable) return
      // SSR safe inverse (because server can't know prefers scheme)
      // could be done through fancy selectors like how we do prefers-media
      // but may be a bit of explosion of selectors
      if (props.inverse && !mounted) {
        setThemeState({ ...themeState, mounted: true })
        return
      }
      activeThemeManagers.add(themeManager)

      return () => {
        activeThemeManagers.delete(themeManager)
      }
    }, [isNewTheme, themeManager, disable, state, debug])

    // listen for parent change + notify children change
    useLayoutEffect(() => {
      const nextState = getThemeManagerNextStateIfChanged(themeManager)

      console.log(
        `huh?`,
        themeManager.id,
        themeState,
        nextState,
        props,
        getNextThemeManagerState(themeManager)
      )

      if (nextState) {
        if (isNewTheme) {
          // if it's a new theme we can just update + publish to children
          themeManager.updateState(nextState, true)
        }
        // if not we will be creating a whole new themeManager
        setThemeState(createState)
      }

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        console.log(`got change`, manager.id, name)
        if (keys?.length) {
          if (process.env.NODE_ENV === 'development' && props['debug'] && keys?.length) {
            console.log(`onChangeTheme`, { props, name, manager, parentManager, keys })
          }
          setThemeState(createState)
        }
      })

      return () => {
        disposeChangeListener?.()
      }
    }, [isNewTheme, props.componentName, props.inverse, props.name, props.reset])
  }

  return {
    ...state,
    isNewTheme,
    themeManager,
  }

  function createState(prev?: State): State {
    if (prev && disableUpdate?.()) {
      return prev
    }

    //  returns previous theme manager if no change
    let themeManager: ThemeManager

    if (prev?.themeManager) {
      themeManager = prev.themeManager

      const nextState = getThemeManagerNextStateIfChanged(themeManager)

      if (nextState) {
        console.warn(`got a new state`, themeManager.id, nextState)
      }

      if (prev.isNewTheme) {
        // just update in place
      } else {
        console.log(`should create new one now`)
        themeManager = new ThemeManager(props, root ? 'root' : parentManager)
      }
    } else {
      themeManager = new ThemeManager(props, root ? 'root' : parentManager)
    }

    const isNewTheme = Boolean(
      themeManager !== parentManager ||
        (prev && themeManager.state.name !== prev.state.name)
    )

    // only inverse relies on this for ssr
    const mounted = !props.inverse ? true : root || prev?.mounted
    const state = isNewTheme ? { ...themeManager.state } : { ...parentManager!.state }
    const response = {
      state,
      themeManager,
      isNewTheme,
      mounted,
    }

    if (process.env.NODE_ENV === 'development' && props['debug']) {
      console.groupCollapsed(` 🔷 useChangeThemeEffect createState`)
      console.log({ props, parentManager, themeManager, prev, response })
      console.groupEnd()
    }

    return response
  }
}
