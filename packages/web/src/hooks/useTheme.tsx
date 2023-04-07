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
  themeManager: ThemeManager | null
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

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    // prettier-ignore
    if (isWeb && className === themeManager?.parentManager?.state.className) {
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

      const val = themeManager.getValue(keyString)

      if (val && keys) {
        return new Proxy(val as any, {
          // when they touch the actual value we only track it
          // if its a variable (web), its ignored!
          get(_, subkey) {
            if (subkey === 'val' && !keys.includes(keyString)) {
              keys.push(keyString)
              console.warn('TRACK', val, subkey, keys)
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
    // prettier-ignore
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') console.log('useTheme hasNoThemeUpdatingProps', parentManager.state.name, 'isInversingOnMount', isInversingOnMount)
    return {
      isNewTheme: false,
      ...parentManager.state,
      className: isInversingOnMount ? '' : parentManager.state.className,
      themeManager: parentManager,
    }
  }

  let updateChildrenKey = ''

  // run inline in render
  const manager = themeManager //updatingManager || themeManager
  const next = manager?.getState(props, parentManager)

  if (manager && next) {
    console.log(`NAME ${props['debug']}  next is ${next?.name}`)

    if (disableUpdate?.() !== true) {
      const shouldChange = manager.getStateShouldChange(next, state)

      if (shouldChange) {
        themeManager.updateState(next)

        console.table([
          {
            name: props['debug'],
            shouldChange,
            currentName: state.name,
            nextName: next?.name,
            parentStateName: parentManager?.state.name,
          },
        ])
        console.log('wtf', { next: { ...next }, state: { ...state }, props })
      }

      console.warn(`..`)

      if (shouldChange) {
        if (next && next.name !== state.name) {
          console.warn('OPTIMISZED CHANGE', next)
          updateChildrenKey = state.name
        }
        setThemeState(createState)
      } else {
        if (!next && parentManager?.state.name !== state.name) {
          // were changing back to parent state
          setThemeState(createState)
        }
      }
    }
  }

  console.log(`updateChildrenKey`, updateChildrenKey)

  if (!isServer) {
    useEffect(() => {
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
    }, [themeManager, disable, state, debug])

    // listen for parent change + notify children change
    useLayoutEffect(() => {
      if (!themeManager) return

      console.log('--------', isNewTheme, updateChildrenKey)

      if (next && isNewTheme && updateChildrenKey !== '') {
        console.warn(`notify`)
        // themeManager.notify()
      }

      const disposeChangeListener = parentManager?.onChangeTheme((name, manager) => {
        if (keys?.length) {
          console.log('parentManager?.onChangeTheme', props['debug'], name)
          // setThemeState(createState)
        }
      })

      return () => {
        disposeChangeListener?.()
      }
    }, [isNewTheme, updateChildrenKey])
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

    // // returns previous theme manager if no change
    const themeManager =
      prev?.themeManager || new ThemeManager(props, root ? 'root' : parentManager)

    const isNewTheme = Boolean(
      themeManager !== parentManager ||
        (prev && themeManager.state.name !== prev.state.name)
    )

    // // returns previous theme manager if no change
    // const _ =  new ThemeManager(props, root ? 'root' : parentManager)

    // only inverse relies on this for ssr
    const mounted = !props.inverse ? true : root || prev?.mounted
    const state = { ...themeManager.state }

    console.warn(`state ${props['debug']}`, state)

    return {
      // ThemeManager returns parentManager if no change
      state,
      themeManager,
      isNewTheme,
      mounted,
    }
  }
}
