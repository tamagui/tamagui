import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { GET_DEFAULT_THEME, THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { isVariable } from '../createVariable'
import { areEqualSets } from '../helpers/areEqualSets'
import { ThemeContext } from '../ThemeContext'
import { ThemeManager, ThemeManagerContext } from '../ThemeManager'
import { ThemeName, ThemeObject } from '../types'
import { useConstant } from './useConstant'

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = (themeName?: string | null, componentName?: string): ThemeObject => {
  const forceUpdate = useForceUpdate()
  const { name, theme, themes, themeManager, className } = useChangeThemeEffect(
    themeName,
    componentName
  )

  const state = useRef() as React.MutableRefObject<UseThemeState>
  if (!state.current) {
    state.current = {
      uuid: {},
      keys: new Set(),
      isRendering: true,
    }
  }
  state.current.isRendering = true

  // track usage
  useIsomorphicLayoutEffect(() => {
    const st = state.current
    st.isRendering = false
    const cur = themeManager?.keys.get(st.uuid)
    if (!cur || !areEqualSets(st.keys, cur)) {
      themeManager?.track(st.uuid, st.keys)
    }
  })

  useEffect(() => {
    return themeManager?.onUpdate(state.current.uuid, forceUpdate)
  }, [])

  return useMemo(
    () => {
      if (!theme || !themeManager) {
        console.log('wut', themeName, theme, themeManager)
        return theme as any
      }
      return new Proxy(theme, {
        get(_, key: string) {
          if (!name) {
            return Reflect.get(_, key)
          }
          let activeTheme = themes[name]
          if (!activeTheme) {
            if (process.env.NODE_ENV !== 'test') {
              console.error('No theme by name', name, 'only:', themes, 'keeping current theme')
            }
            activeTheme = theme
          }
          if (key === 'name') {
            return name
          }
          if (key === 'className') {
            return className
          }
          const val = activeTheme[key]
          if (process.env.NODE_ENV === 'development') {
            if (typeof val === 'undefined') {
              console.warn(`No theme value "${String(key)}" in`, activeTheme)
              return null
            }
            if (!isVariable(val)) {
              console.warn('Non variable!', val)
            } else if (val.name !== key) {
              console.warn('Non-matching name for variable to key', key, val.name)
            }
          }
          if (state.current.isRendering) {
            state.current.keys.add(key)
          }
          return val
        },
      })
    },
    [
      /* if concurrent mode wanted put manager.name here */
    ]
  )
}

export const useThemeName = (opts?: { parent?: true }) => {
  const parent = useContext(ThemeManagerContext)
  const [name, setName] = useState(parent.name)

  useIsomorphicLayoutEffect(() => {
    return parent.onChangeTheme((next, manager) => {
      setName(opts?.parent ? manager.parentName : next)
    })
  }, [parent])

  return name || 'light'
}

export const useDefaultThemeName = () => {
  return useContext(ThemeContext)[GET_DEFAULT_THEME] as any as ThemeName
}

export const useChangeThemeEffect = (shortName?: string | null, componentName?: string) => {
  const parent = useContext(ThemeManagerContext)
  const themes = useContext(ThemeContext)
  const [parentName, setParentName] = useState(parent.name || 'light')
  const nextNameParent = shortName ? `${parentName}-${shortName}` : ''
  const nextNameParentParent = shortName ? `${parent.parentName}-${shortName}` : ''
  const nextParentName =
    nextNameParent in themes
      ? nextNameParent
      : nextNameParentParent in themes
      ? nextNameParentParent
      : null
  const name = !shortName ? null : shortName in themes ? shortName : nextParentName
  const theme = name ? themes[name] : null
  const themeManager = useConstant<ThemeManager | null>(() => {
    if (!theme) {
      return null
    }
    const manager = new ThemeManager()
    if (name) {
      manager.setActiveTheme({ name, theme: themes[name], parentName })
    }
    return manager
  })

  useIsomorphicLayoutEffect(() => {
    if (!themeManager) {
      return
    }
    if (name) {
      themeManager.setActiveTheme({ name, theme, parentName })
    }
    const dispose = parent.onChangeTheme((next) => {
      if (next) {
        themeManager.setActiveTheme({ name: next, theme: themes[next], parentName })
        setParentName(next)
      }
    })
    return () => {
      // TODO should we undo setActiveTheme on dispose?
      dispose()
    }
  }, [themes, name, parentName])

  let className: string | null = null
  if (shortName || componentName) {
    className = nextParentName ?? name ?? parentName
    if (componentName) {
      className += `-${componentName}`
    }
    className = `${THEME_CLASSNAME_PREFIX}${className}`
  }

  return {
    name: name || parentName,
    themes,
    themeManager: themeManager || parent,
    theme: theme || themeManager?.theme || parent.theme || themes['light'],
    className,
  }
}
