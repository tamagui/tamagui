import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { ThemeContext } from '../contexts/ThemeContext'
import { areEqualSets } from '../helpers/areEqualSets'
import { createProxy } from '../helpers/createProxy'
import {
  GetNextThemeProps,
  ThemeManager,
  ThemeManagerContext,
  emptyManager,
} from '../helpers/ThemeManager'
import { ThemeName, ThemeParsed } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'
import { useServerRef } from './useServerHooks'

export interface ThemeProps {
  className?: string
  disableThemeClass?: boolean
  name: Exclude<ThemeName, number> | null
  componentName?: string
  children?: any
  reset?: boolean
  debug?: boolean | 'verbose'
}

interface UseThemeState {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = (
  themeName?: string | null,
  componentName?: string,
  props?: ThemeProps,
  forceUpdate?: any
): ThemeParsed => {
  // TODO this can use useChangeThemeEffect almost ready
  if (isRSC) {
    const config = getConfig()
    // @ts-ignore
    return getThemeProxied(config.themes[config.defaultTheme], config.defaultTheme)
  }

  const state = useServerRef() as React.MutableRefObject<UseThemeState>
  if (!state.current) {
    state.current = {
      uuid: {},
      keys: new Set(),
      isRendering: true,
    }
  }

  const { name, theme, themes, themeManager, className } = useChangeThemeEffect(
    themeName,
    componentName,
    props,
    forceUpdate,
    state.current.uuid
  )

  if (process.env.NODE_ENV === 'development') {
    if (props?.debug === 'verbose') {
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 useTheme =>', name)
      const logs = { themeName, componentName, name, className, ...(isDevTools && { theme }) }
      for (const key in logs) {
        // eslint-disable-next-line no-console
        console.log('  ', key, logs[key])
      }
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }

  // track usage
  state.current.isRendering = true
  useIsomorphicLayoutEffect(() => {
    const st = state.current
    st.isRendering = false
    const cur = themeManager?.keys.get(st.uuid)
    if (!cur || !areEqualSets(st.keys, cur)) {
      themeManager?.track(st.uuid, st.keys)
    }
  })

  const debugProp = props && props['debug']

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('No theme with name', themeName)
    }
    return themes[getConfig().defaultTheme || 'light']
  }

  return useMemo(() => {
    return getThemeProxied(theme, name, className, themeManager, state, debugProp)
  }, [theme, name, className, themeManager, state, debugProp])
}

function getThemeProxied(
  theme: any,
  name: string,
  className?: string,
  themeManager?: ThemeManager | null,
  state?: React.MutableRefObject<UseThemeState>,
  debugProp?: boolean | 'verbose'
) {
  return createProxy(theme, {
    has(_, key) {
      if (typeof key === 'string' && key[0] === '$') {
        key = key.slice(1)
      }
      return Reflect.has(theme, key)
    },
    get(_, key) {
      if (key === GetThemeUnwrapped) {
        return theme
      }
      if (key === GetThemeManager) {
        return themeManager
      }
      if (key === 'name') {
        return name
      }
      if (key === 'className') {
        return className
      }
      if (!name || key === '__proto__' || typeof key === 'symbol' || key === '$typeof') {
        return Reflect.get(_, key)
      }
      // auto convert variables to plain
      if (key[0] === '$') {
        key = key.slice(1)
      }
      if (!themeManager) {
        return theme[key]
      }
      if (state) {
        if (state.current.isRendering && !state.current.keys.has(key)) {
          state.current.keys.add(key)
          if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            // eslint-disable-next-line no-console
            console.log('  🔸 tracking theme', key)
          }
        }
      }
      return themeManager.getValue(key)
    },
  })
}

const GetThemeManager = Symbol()

export const getThemeManager = (theme: any): ThemeManager | undefined => {
  if (!theme) return
  return theme[GetThemeManager]
}

export const useThemeName = (opts?: { parent?: true }) => {
  if (isRSC) {
    const config = getConfig()
    return config.defaultTheme || 'light'
  }
  const parent = useContext(ThemeManagerContext)
  const [name, setName] = useState(parent?.name || '')

  useIsomorphicLayoutEffect(() => {
    if (!parent) return
    return parent.onChangeTheme((next, manager) => {
      const name = opts?.parent ? manager.parentName || next : next
      if (!name) return
      setName(name)
    })
  }, [parent])

  return name
}

export const useDefaultThemeName = () => {
  return useContext(ThemeContext)?.defaultTheme
}

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  name?: string | null,
  componentName?: string,
  props?: ThemeProps,
  forceUpdateProp?: any,
  uuid?: Object
): {
  themes: Record<string, ThemeParsed>
  themeManager: ThemeManager | null
  name: string
  theme: ThemeParsed | null
  className?: string
} => {
  const config = getConfig()

  if (process.env.NODE_ENV === 'development') {
    if (!config) {
      throw new Error(
        `Missing tamagui config, you either have a duplicate config, or haven't set it up. Be sure createTamagui is called before rendering.`
      )
    }
  }

  const { themes } = config

  if (isRSC) {
    // we need context working for this to work well
    const parentManager = new ThemeManager('light', 'light', themes.light)
    const next = parentManager.getNextTheme({
      name,
      componentName,
      themes,
      reset: props?.reset,
    })
    return {
      ...next,
      themes,
      themeManager: null,
    }
  }

  const debug = props && props['debug']
  const parentManager = useContext(ThemeManagerContext) || emptyManager
  const reset = props?.reset || false
  const getThemeProps: GetNextThemeProps = {
    name,
    componentName,
    themes,
    reset,
  }
  const next = parentManager.getNextTheme(getThemeProps, debug)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const forceUpdate = forceUpdateProp || useForceUpdate()

  const themeManager = useMemo(() => {
    return new ThemeManager(next.name, next.className, next.theme, parentManager, reset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // not concurrent safe but fixes native (but breaks SSR and not needed on web (i think) so leave only on native)
  let didChange = false
  if (process.env.TAMAGUI_TARGET === 'native') {
    didChange = Boolean(
      next?.name !== themeManager.name || next?.className !== themeManager.className
    )
    if (didChange) {
      themeManager.update(next, false, false)
    }
  }

  if (!isServer) {
    useLayoutEffect(() => {
      themeManager.update(next, didChange)
      activeThemeManagers.add(themeManager)

      const disposeParentOnChange = parentManager.onChangeTheme(() => {
        const next = parentManager.getNextTheme(getThemeProps, debug)
        if (!next) return
        if (themeManager.update(next)) {
          if (uuid && !themeManager.isTracking(uuid)) {
            // no need to re-render if not tracking any keys
            return
          }
          if (process.env.NODE_ENV === 'development' && debug) {
            // eslint-disable-next-line no-console
            console.log('Changed theme', componentName, next, { props })
          }
          forceUpdate()
        }
      })

      return () => {
        activeThemeManagers.delete(themeManager)
        disposeParentOnChange()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [didChange, themes, next?.name, next?.className, componentName, debug])
  }

  return {
    ...(parentManager && {
      name: parentManager.name,
      theme: parentManager.theme,
    }),
    ...next,
    className: next.className === parentManager.className ? undefined : next.className,
    themes,
    themeManager,
  }
}
