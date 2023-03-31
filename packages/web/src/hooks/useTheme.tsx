/* eslint-disable no-console */
import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import { useContext, useEffect, useMemo, useState } from 'react'

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
    return getThemeProxied(changedTheme as any, keys.current)
  }, [theme, isNewTheme, name, className, themeManager])

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
        key === 'undefined' ||
        key === '__proto__' ||
        key === '$typeof' ||
        typeof key !== 'string' ||
        !themeManager
      ) {
        return Reflect.get(_, key)
      }

      // auto convert variables to plain
      const keyString = key[0] === '$' ? key.slice(1) : key

      const val = themeManager.getValue(key)

      if (val && keys) {
        console.warn('??')
        return new Proxy(val as any, {
          // when they touch the actual value we only track it
          // if its a variable (web), its ignored!
          get(_, subkey) {
            console.log('huh', keyString, subkey)
            if (subkey === 'val' && !keys.includes(keyString)) {
              console.warn('TRACK', subkey)
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

  let updateChildrenKey = -1

  // run inline in render
  if (disableUpdate?.() !== true) {
    const manager = themeManager //updatingManager || themeManager
    const next = manager.getState(props, parentManager)
    const shouldChange = manager.getStateShouldChange(next, isNewTheme ? state : null)

    if (shouldChange) {
      if (isNewTheme && next && next.name !== state.name) {
        console.warn('OPTIMISZED CHANGE')
        updateChildrenKey = Math.random()
      } else {
        setThemeState(createState)
      }
    } else {
      if (!next && parentManager?.state.name !== state.name) {
        // were changing back to parent state
        console.warn('??')
        setThemeState(createState)
      }
    }
  }

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

      return () => {
        activeThemeManagers.delete(themeManager)
      }
    }, [disable, state, isNewTheme, debug])

    // listen for parent chang + notify children change
    useEffect(() => {
      if (updateChildrenKey !== -1) {
        console.warn(`notify`)
        themeManager.notify()
      }

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        console.log('PARENT CHANGED', { name })

        console.log('are we listening?', themeManager, keys)

        if (state.theme !== manager.state.theme) {
          console.warn('now update to', manager.state.name)
          // updateState(manager)
        }
      })

      return () => {
        disposeChangeListener?.()
      }
    }, [updateChildrenKey])
  }

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

    if (_ !== prev?.themeManager) {
      console.warn(`changing theme manager`, { _, isNewTheme })
    }

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
}
