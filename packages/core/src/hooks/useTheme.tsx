/* eslint-disable no-console */
import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import { useContext, useEffect, useMemo, useState } from 'react'

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

export const useTheme = (props: ThemeProps = emptyProps): ThemeParsed => {
  return (isRSC ? null : useThemeWithState(props)?.theme) || getDefaultThemeProxied()
}

export const useThemeWithState = (props: ThemeProps) => {
  const keys = useServerRef([])

  const changedTheme = useChangeThemeEffect(
    props,
    false,
    isClient
      ? () => {
          return props.shouldUpdate?.() ?? keys.current.length === 0
        }
      : undefined
  )

  const { themeManager, isNewTheme, theme, name, className } = changedTheme

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    // prettier-ignore
    if (isWeb && isNewTheme && className === themeManager?.parentManager?.state.className) {
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

  if (!changedTheme.theme) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No theme found', name, props, themeManager)
    }
    return null
  }

  const proxiedTheme = useMemo(() => {
    return getThemeProxied(changedTheme as any)
  }, [theme, isNewTheme, name, className, themeManager])

  return {
    ...changedTheme,
    theme: proxiedTheme,
  }
}

export function getThemeProxied({
  theme,
  themeManager,
  keys,
}: Partial<ChangedThemeResponse> & {
  theme: ThemeParsed
  keys?: React.RefObject<string[]>
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
      }
      if (
        key === 'undefined' ||
        key === '__proto__' ||
        key === '$typeof' ||
        typeof key !== 'string' ||
        !themeManager
      ) {
        return Reflect.get(_, key)
      }
      const keyString = key
      // auto convert variables to plain
      if (key[0] === '$') {
        key = key.slice(1)
      }
      const val = themeManager.getValue(key)
      const currentKeys = keys?.current
      if (val && currentKeys) {
        return new Proxy(val as any, {
          // when they touch the actual value we only track it
          // if its a variable (web), its ignored!
          get(_, subkey) {
            if (subkey === 'val' && !currentKeys.includes(keyString)) {
              currentKeys.push(keyString)
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
  disableUpdate?: () => boolean
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
    if (!parentManager) throw `❌`
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
      // const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
      //   // console.log('hi', props, state, name, manager)
      //   if (state.theme !== manager.state.theme) {
      //     console.warn('now update to', manager.state.name)
      //     updateState(manager)
      //   }
      // })
      return () => {
        activeThemeManagers.delete(themeManager)
        // disposeChangeListener?.()
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
    if (prev && disableUpdate?.()) {
      return prev
    }
    // returns previous theme manager if no change
    const _ = new ThemeManager(props, root ? 'root' : parentManager)
    const isNewTheme = _ !== parentManager
    // prettier-ignore

    // if (prev?.isNewTheme && _.state.theme !== parentManager?.state.theme) {
    //   console.warn('notify')
    //   _.notify()
    // }

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

  function updateState(updatingManager?: ThemeManager) {
    if (disableUpdate?.()) {
      return
    }
    const manager = updatingManager ?? themeManager
    const next = manager.getState(props, parentManager)
    const shouldChange = manager.getStateShouldChange(next, isNewTheme ? state : null)
    // console.log(`got it`, next, isNewTheme, shouldChange, { ...updatingManager?.state })
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
