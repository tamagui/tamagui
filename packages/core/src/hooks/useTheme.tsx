/* eslint-disable no-console */
import {
  isClient,
  isRSC,
  isServer,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { createProxy } from '../helpers/createProxy'
import {
  ThemeManager,
  ThemeManagerState,
  hasNoThemeUpdatingProps,
} from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'
import { useServerRef } from './useServerHooks'

export type ChangedThemeResponse = {
  themeManager: ThemeManager | null
  name: string
  isNewTheme?: boolean
  theme?: ThemeParsed | null
  className?: string
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

interface UseThemeState {
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = (props: ThemeProps = emptyProps): ThemeParsed => {
  if (isRSC) {
    return getDefaultThemeProxied()
  }

  const state = useServerRef() as React.MutableRefObject<UseThemeState>
  if (!state.current) {
    state.current = {
      keys: new Set(),
      isRendering: true,
    }
  }

  const { name, theme, themeManager, className, isNewTheme } = useChangeThemeEffect(
    props,
    false,
    () => !state.current.isRendering && state.current.keys.size > 0
  )

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    if (
      isWeb &&
      isNewTheme &&
      className === themeManager?.parentManager?.state.className
    ) {
      console.error('Should always change, duplicating ThemeMananger bug', themeManager)
    }
    if (props.debug === 'verbose') {
      console.groupCollapsed('  🔹 useTheme =>', name)
      const logs = { ...props, name, className, ...(isDevTools && { theme }) }
      for (const key in logs) {
        console.log('  ', key, logs[key])
      }
      console.groupEnd()
    }
  }

  // track key usage
  state.current.isRendering = true
  useIsomorphicLayoutEffect(() => {
    state.current.isRendering = false
  })

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No theme found', name, props, themeManager)
    }
    return getDefaultThemeProxied()
  }

  return useMemo(() => {
    return getThemeProxied({
      isNewTheme,
      theme,
      name,
      className,
      themeManager,
      state,
    })
  }, [theme, isNewTheme, name, className, themeManager])
}

function getThemeProxied({
  theme,
  name,
  className,
  themeManager,
  isNewTheme,
  state,
}: {
  theme: any
  name: string
  className?: string
  themeManager?: ThemeManager | null
  isNewTheme?: boolean
  state?: React.RefObject<UseThemeState>
}) {
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
      } else if (key === GetThemeManager) {
        return themeManager
      } else if (key === GetIsNewTheme) {
        return isNewTheme
      } else if (key === 'name') {
        return name
      } else if (key === 'className') {
        return className
      } else if (
        !name ||
        key === '__proto__' ||
        typeof key === 'symbol' ||
        key === '$typeof'
      ) {
        return Reflect.get(_, key)
      }
      // auto convert variables to plain
      if (key[0] === '$') key = key.slice(1)
      if (!themeManager) {
        return theme[key]
      }
      const val = themeManager.getValue(key)
      if (val) {
        return new Proxy(val as any, {
          get(_, subkey) {
            if (subkey === 'val' && state?.current?.isRendering) {
              state.current.keys.add(key as any)
            }
            return Reflect.get(val, subkey)
          },
        })
      }
      return val
    },
  })
}

const GetThemeManager = Symbol()
const GetIsNewTheme = Symbol()

export const getThemeManager = (theme: any): ThemeManager | undefined =>
  theme?.[GetThemeManager]
export const getThemeIsNewTheme = (theme: any): ThemeManager | undefined =>
  theme?.[GetIsNewTheme]

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  props: ThemeProps,
  root = false,
  shouldUpdate?: () => boolean
): ChangedThemeResponse => {
  if (isRSC) {
    // we need context working for this to work well
    return {
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
    if (!parentManager) throw new Error('Disable topmost')
    return {
      ...parentManager.state,
      isNewTheme: false,
      themeManager: parentManager,
    }
  }

  type State = {
    isNewTheme: boolean
    state: ThemeManagerState
    themeManager: ThemeManager
    mounted?: boolean
  }

  const [themeState, setThemeState] = useState<State>(createState)
  const { isNewTheme, state, themeManager, mounted } = themeState

  if (!isServer) {
    useEffect(() => {
      if (disable) return
      // SSR safe inverse (because server can't know prefers scheme)
      // could be done through fancy selectors like how we do prefers-media
      // but may be a bit of explosion of selectors
      if (props.inverse && !mounted) {
        setThemeState({ ...themeState, mounted: true })
        return
      }
      activeThemeManagers.add(themeManager)
      const disposeChangeListener = parentManager?.onChangeTheme(() => {
        if (!(isNewTheme || isWeb)) {
          setThemeState({
            ...themeState,
            state: { ...themeManager.state },
            isNewTheme: false,
          })
        } else {
          updateState()
        }
      })
      return () => {
        activeThemeManagers.delete(themeManager)
        disposeChangeListener?.()
      }
    }, [disable, state, isNewTheme, debug])
  }

  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)
  const shouldReturnParentState = hasNoThemeUpdatingProps(props) || isInversingOnMount

  if (shouldReturnParentState) {
    if (!parentManager) throw 'impossible'
    // prettier-ignore
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') console.log('useTheme hasNoThemeUpdatingProps', parentManager.state.name, 'isInversingOnMount', isInversingOnMount)
    return {
      ...parentManager.state,
      className: isInversingOnMount ? '' : parentManager.state.className,
      themeManager: parentManager,
      isNewTheme: false,
    }
  }

  // run inline in render
  updateState()

  return {
    ...state,
    isNewTheme,
    themeManager,
  }

  function createState(prev?: State) {
    // returns previous theme manager if no change
    const _ = new ThemeManager(props, root ? 'root' : parentManager)

    const isNewTheme = _ !== parentManager
    // prettier-ignore
    if (process.env.NODE_ENV === 'development' && debug) [console.groupCollapsed('useTheme create() isNewTheme', isNewTheme),console.log('parent.state.name', parentManager?.state.name, '\n', 'props', props, '\n', isClient ? parentManager : '', 'getState', isNewTheme && isClient ? _.getState(props) : '', '\n', 'state', isClient ? { ..._.state } : ''),console.groupEnd()]
    // only inverse relies on this for ssr
    const mounted = !props.inverse ? true : root || prev?.mounted
    return {
      // ThemeManager returns parentManager if no change
      isNewTheme,
      state: { ..._.state },
      themeManager: _,
      mounted,
    }
  }

  function updateState() {
    if (shouldUpdate?.() === false) {
      return
    }

    const next = themeManager.getState(props, parentManager)
    const shouldChange = themeManager.getStateShouldChange(
      next,
      isNewTheme ? state : null
    )
    if (shouldChange) {
      setThemeState(createState)
    } else {
      if (!next && parentManager?.state.name !== state.name) {
        // were changing back to parent state
        setThemeState(createState)
      }
    }
  }
}
