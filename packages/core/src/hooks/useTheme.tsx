/* eslint-disable no-console */
import { isClient, isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { createProxy } from '../helpers/createProxy'
import { ThemeManager, hasNoThemeUpdatingProps } from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { ThemeName, ThemeParsed, ThemeProps } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'

const emptyProps = { name: null }
export const useTheme = (props: ThemeProps = emptyProps): ThemeParsed => {
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
      console.error(`Should always change, duplicating ThemeMananger bug`, themeManager)
      // eslint-disable-next-line no-debugger
      debugger
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

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No theme found', name, props, themeManager)
    }
    return themes[Object.keys(themes)[0]]
  }

  return useMemo(() => {
    return getThemeProxied({
      isNewTheme,
      theme,
      name,
      className,
      themeManager,
    })
  }, [theme, isNewTheme, name, className, themeManager])
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
      const name = opts?.parent ? manager.state.parentName || next : next
      if (!name) return
      setName(name)
    })
  }, [manager])

  return name
}

export const activeThemeManagers = new Set<ThemeManager>()

export type ChangedTheme = {
  themes: Record<string, ThemeParsed>
  themeManager: ThemeManager | null
  name: string
  isNewTheme?: boolean
  theme?: ThemeParsed | null
  className?: string
}

export const useChangeThemeEffect = (props: ThemeProps, root = false): ChangedTheme => {
  const parentManager = useContext(ThemeManagerContext)
  const config = getConfig()
  const { debug, disable } = props
  const { themes } = config
  if (isRSC) {
    // we need context working for this to work well
    return {
      ...create().state,
      themes,
      themeManager: null,
    }
  }
  if (disable) {
    if (!parentManager) throw new Error(`Disable topmost`)
    return {
      ...parentManager.state,
      isNewTheme: false,
      themes,
      themeManager: parentManager,
    }
  }

  const [{ isNewTheme, state, themeManager }, setThemeManager] = useState(create)

  if (!isServer) {
    useLayoutEffect(() => {
      if (disable) return
      if (!isNewTheme) return
      activeThemeManagers.add(themeManager)
      // !!
      // themeManager.notify()
      const disposeChangeListener = parentManager?.onChangeTheme(update)
      return () => {
        activeThemeManagers.delete(themeManager)
        disposeChangeListener?.()
      }
    }, [disable, state, isNewTheme, debug])
  }

  // prettier-ignore
  if (process.env.NODE_ENV === 'development' && debug) console.log('useTheme before update isNewTheme', props, isNewTheme, themeManager.state.name, parentManager?.state.name)

  // this seems unnecessary
  if (hasNoThemeUpdatingProps(props)) {
    if (!parentManager) throw new Error(`Nada`)
    return {
      ...parentManager.state,
      themes,
      themeManager: parentManager,
      isNewTheme: false,
    }
  }

  update()

  return {
    ...state,
    isNewTheme,
    themes,
    themeManager,
  }

  function create() {
    const _ = new ThemeManager(props, root ? 'root' : parentManager)
    const isNewTheme = _ !== parentManager
    // prettier-ignore
    if (process.env.NODE_ENV === 'development' && debug) [console.groupCollapsed('useTheme create() isNewTheme', isNewTheme), console.log('parent.state', { ...parentManager?.state }, '\n', 'props', props, '\n', 'getState',isNewTheme ? _.getState(props) : '', '\n', 'state', { ..._.state }), console.groupEnd()]
    return {
      // ThemeManager returns parentManager if no change
      isNewTheme,
      state: { ..._.state },
      themeManager: _,
    }
  }

  function update() {
    const newState = themeManager.getStateIfChanged(props, state, parentManager)
    if (newState) {
      if (!isNewTheme) {
        // prettier-ignore
        if (process.env.NODE_ENV === 'development' && debug) [console.groupCollapsed('useTheme create() via update()', parentManager?.state?.name, '=>'), console.log({ props, newState, parentManager, themeManager }), console.groupEnd()]
        setThemeManager(create)
      } else {
        const next = themeManager.updateState(props)
        if (next) {
          // prettier-ignore
          if (process.env.NODE_ENV === 'development' && debug) console.log('useTheme update()', parentManager?.state?.name, '=>', next.name)
          setThemeManager({
            themeManager,
            // may not need spread
            state: { ...next },
            isNewTheme: true,
          })
        }
      }
    }
  }
}
