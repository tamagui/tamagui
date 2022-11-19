import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { areEqualSets } from '../helpers/areEqualSets'
import { createProxy } from '../helpers/createProxy'
import { ThemeManager, ThemeManagerContext } from '../helpers/ThemeManager'
import { ThemeName, ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'
import { useServerRef } from './useServerHooks'

interface UseThemeState {
  uuid: Object
  keys: Set<string>
  isRendering?: boolean
  hasEverChanged?: boolean
}

type UseThemeProps = ThemeProps & {
  forceUpdate?: any
}

export const useTheme = (props: UseThemeProps = { name: null }): ThemeParsed => {
  // TODO this can use useChangeThemeEffect almost ready
  if (isRSC) {
    const config = getConfig()
    const name = Object.keys(config.themes)[0]
    return getThemeProxied({
      theme: config.themes[name],
      name,
    })
  }

  const state = useServerRef() as React.MutableRefObject<UseThemeState>
  if (!state.current) {
    state.current = {
      uuid: {},
      keys: new Set(),
    }
  }

  const { name, theme, themes, themeManager, className, didChange } = useChangeThemeEffect(
    props,
    state.current.uuid
  )

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    if (didChange && className === themeManager?.parentManager?.state.className) {
      console.error(`Should always change, duplicating ThemeMananger bug`, themeManager)
    }
  }

  if (process.env.NODE_ENV === 'development') {
    if (props?.debug === 'verbose') {
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 useTheme =>', name)
      const logs = { ...props, name, className, ...(isDevTools && { theme }) }
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

    // this seems potentially unnecessary?
    const cur = themeManager?.keys.get(st.uuid)
    if (!cur || !areEqualSets(st.keys, cur)) {
      themeManager?.track(st.uuid, st.keys)
    }
  })

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('No theme found', name, props, themeManager)
    }
    return themes[Object.keys(themes)[0]]
  }

  const debug = props?.debug
  const disableTracking = props?.disableTracking

  return useMemo(() => {
    return getThemeProxied({
      didChange,
      theme,
      name,
      className,
      themeManager,
      onStringKeyAccess(key) {
        if (disableTracking) return
        if (state) {
          if (state.current.isRendering && !state.current.keys.has(key)) {
            state.current.keys.add(key)
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              // eslint-disable-next-line no-console
              console.log('  🔸 tracking theme', key)
            }
          }
        }
      },
    })
  }, [theme, didChange, name, className, themeManager, debug, disableTracking])
}

function getThemeProxied({
  theme,
  name,
  className,
  themeManager,
  onStringKeyAccess,
  didChange,
}: {
  theme: any
  name: string
  onStringKeyAccess?: (cb: string) => void
  className?: string
  themeManager?: ThemeManager | null
  didChange?: boolean
}) {
  return createProxy(theme, {
    has(_, key) {
      if (typeof key === 'string') {
        if (key[0] === '$') {
          key = key.slice(1)
        }
        if (themeManager) {
          return themeManager.allKeys.has(key)
        }
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
      if (key === GetDidChange) {
        return didChange
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
      onStringKeyAccess?.(key)
      return themeManager.getValue(key)
    },
  })
}

const GetThemeManager = Symbol()
const GetDidChange = Symbol()

export const getThemeManager = (theme: any): ThemeManager | undefined => theme?.[GetThemeManager]
export const getThemeDidChange = (theme: any): ThemeManager | undefined => theme?.[GetDidChange]

export function useThemeName(opts?: { parent?: true }): ThemeName {
  if (isRSC) {
    const config = getConfig()
    return config.themes[Object.keys(config.themes)[0]] as any
  }
  const manager = useContext(ThemeManagerContext)
  const [name, setName] = useState(manager?.state.name || '')

  useIsomorphicLayoutEffect(() => {
    if (!manager) return
    return manager.onChangeTheme((next, manager) => {
      const name = opts?.parent ? manager.parentName || next : next
      if (!name) return
      setName(name)
    })
  }, [manager])

  return name
}

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  props: UseThemeProps,
  uuid?: Object
): {
  themes: Record<string, ThemeParsed>
  themeManager: ThemeManager | null
  name: string
  didChange?: boolean
  theme?: ThemeParsed | null
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

  const { name, componentName, debug, forceUpdate: forceUpdateProp } = props
  const { themes } = config

  if (isRSC) {
    // we need context working for this to work well
    const next = new ThemeManager(undefined, props)
    return {
      ...next.state,
      themes,
      themeManager: null,
    }
  }

  const parentManager = useContext(ThemeManagerContext)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const forceUpdate = forceUpdateProp || useForceUpdate()

  // only create once we update it in the effect
  const themeManager = useMemo(() => {
    return new ThemeManager(parentManager, props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const didChange = Boolean(themeManager !== parentManager)

  // not concurrent safe but fixes native (but breaks SSR and not needed on web (i think) so leave only on native)
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (didChange) {
      console.warn('may not need anymore')
      themeManager.updateState(props, false, false)
    }
  }

  if (!isServer) {
    useLayoutEffect(() => {
      if (!didChange) return

      themeManager.updateState(props, didChange)
      activeThemeManagers.add(themeManager)

      if (!parentManager) return

      const disposeParentOnChange = parentManager.onChangeTheme(() => {
        if (themeManager.updateState(props)) {
          if (uuid && !themeManager.isTracking(uuid)) {
            // no need to re-render if not tracking any keys
            return
          }
          if (process.env.NODE_ENV === 'development' && debug) {
            // eslint-disable-next-line no-console
            console.log('Changed theme', componentName, themeManager.state, props)
          }
          forceUpdate()
        }
      })

      return () => {
        activeThemeManagers.delete(themeManager)
        disposeParentOnChange()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      didChange,
      parentManager,
      themes,
      themeManager.getKey(),
      componentName,
      debug,
      props.name,
      props.className,
      props.inverse,
    ])
  }

  if (props.debug) {
    console.log(
      'useChangeThemeEffect',
      props,
      didChange,
      themeManager.state.name,
      themeManager.state.className
    )
  }

  return {
    ...themeManager.state,
    didChange,
    themes,
    themeManager,
  }
}
