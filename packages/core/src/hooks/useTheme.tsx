import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useForceUpdate } from '@tamagui/use-force-update'
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { createProxy } from '../helpers/createProxy'
import { ThemeManager, ThemeManagerContext } from '../helpers/ThemeManager'
import { ThemeName, ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'

type UseThemeProps = ThemeProps & {
  forceUpdate?: any
}

const emptyProps = { name: null }
export const useTheme = (props: UseThemeProps = emptyProps): ThemeParsed => {
  // TODO this can use useChangeThemeEffect almost ready
  if (isRSC) {
    const config = getConfig()
    const name = Object.keys(config.themes)[0]
    return getThemeProxied({
      theme: config.themes[name],
      name,
    })
  }

  const { name, theme, themes, themeManager, className, didChange } = useChangeThemeEffect(props)

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    if (didChange && className === themeManager?.parentManager?.state.className) {
      // eslint-disable-next-line no-console
      console.error(`Should always change, duplicating ThemeMananger bug`, themeManager)
    }
    if (props.debug === 'verbose') {
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

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('No theme found', name, props, themeManager)
    }
    return themes[Object.keys(themes)[0]]
  }

  const debug = props.debug

  return useMemo(() => {
    return getThemeProxied({
      didChange,
      theme,
      name,
      className,
      themeManager,
    })
  }, [theme, didChange, name, className, themeManager, debug])
}

function getThemeProxied({
  theme,
  name,
  className,
  themeManager,
  didChange,
}: {
  theme: any
  name: string
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
  props: UseThemeProps
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

  const { debug, forceUpdate: forceUpdateProp } = props
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
  const forceUpdate = forceUpdateProp || useForceUpdate()

  // only create once we update it in the effect
  const themeManager = useMemo(() => {
    return new ThemeManager(parentManager, props)
  }, [])

  const didCreate = Boolean(themeManager !== parentManager)
  const didUpdate = useMemo(() => {
    if (!didCreate) return false
    return themeManager.updateState(props, false, false)
  }, [props.name, props.inverse, props.reset, props.componentName])

  const didChange = didCreate || didUpdate

  if (!isServer) {
    useEffect(() => {
      if (!didCreate) return
      activeThemeManagers.add(themeManager)
      return () => {
        activeThemeManagers.delete(themeManager)
      }
    }, [didCreate])

    useLayoutEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        if (props.debug) {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.log('useChangeTheme effect', { props, didChange, didCreate, didUpdate, themeManager, parentManager, activeThemeManagers })
        }
      }

      if (!didChange) return
      themeManager.notify()
      if (!parentManager) return
      return parentManager.onChangeTheme(() => {
        if (themeManager.updateState(props)) {
          forceUpdate()
        }
      })
    }, [didChange, themeManager.state.className, debug])
  }

  return {
    ...themeManager.state,
    didChange,
    themes,
    themeManager,
  }
}
