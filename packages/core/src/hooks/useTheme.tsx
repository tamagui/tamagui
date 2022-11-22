import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { createProxy } from '../helpers/createProxy'
import { ThemeManager, ThemeManagerContext } from '../helpers/ThemeManager'
import { ThemeName, ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'

type UseThemeProps = ThemeProps

const emptyProps = { name: null }
export const useTheme = (props: UseThemeProps = emptyProps): ThemeParsed => {
  if (isRSC) {
    const config = getConfig()
    const name = Object.keys(config.themes)[0]
    return getThemeProxied({
      theme: config.themes[name],
      name,
    })
  }

  const { name, theme, themes, themeManager, className, isNewTheme } = useChangeThemeEffect(props)

  if (process.env.NODE_ENV === 'development') {
    // ensure we aren't creating too many ThemeManagers
    if (isNewTheme && className === themeManager?.parentManager?.state.className) {
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
      isNewTheme,
      theme,
      name,
      className,
      themeManager,
    })
  }, [theme, isNewTheme, name, className, themeManager, debug])
}

function getThemeProxied({
  theme,
  name,
  className,
  themeManager,
  isNewTheme,
}: {
  theme: any
  name: string
  className?: string
  themeManager?: ThemeManager | null
  isNewTheme?: boolean
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
      } else if (!name || key === '__proto__' || typeof key === 'symbol' || key === '$typeof') {
        return Reflect.get(_, key)
      }
      // auto convert variables to plain
      if (key[0] === '$') key = key.slice(1)
      if (!themeManager) {
        return theme[key]
      }
      return themeManager.getValue(key)
    },
  })
}

const GetThemeManager = Symbol()
const GetIsNewTheme = Symbol()

export const getThemeManager = (theme: any): ThemeManager | undefined => theme?.[GetThemeManager]
export const getThemeIsNewTheme = (theme: any): ThemeManager | undefined => theme?.[GetIsNewTheme]

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
  isNewTheme?: boolean
  theme?: ThemeParsed | null
  className?: string
} => {
  const config = getConfig()
  const { debug } = props
  const { themes } = config

  if (isRSC) {
    // we need context working for this to work well
    return {
      ...create().state,
      themes,
      themeManager: null,
    }
  }

  const parentManager = useContext(ThemeManagerContext)
  const [{ isNewTheme, state, themeManager }, setThemeManager] = useState(create)

  function create() {
    const _ = new ThemeManager(parentManager, props)
    const isNewTheme = _ !== parentManager
    return {
      // ThemeManager returns parentManager if no change
      isNewTheme,
      state: isNewTheme ? { ..._.state } : _.state,
      themeManager: _,
    }
  }

  function update() {
    const next = themeManager.updateState(props)
    if (next) {
      if (isNewTheme) {
        setThemeManager({
          themeManager,
          state: next,
          isNewTheme: true,
        })
      } else {
        create()
      }
    }
  }

  update()

  if (!isServer) {
    useLayoutEffect(() => {
      if (!isNewTheme) return
      activeThemeManagers.add(themeManager)
      // themeManager.notify()
      const disposeChangeListener = parentManager?.onChangeTheme(update)
      return () => {
        activeThemeManagers.delete(themeManager)
        disposeChangeListener?.()
      }
    }, [state, debug])
  }

  return {
    ...state,
    isNewTheme,
    themes,
    themeManager,
  }
}
