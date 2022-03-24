import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import {
  GET_DEFAULT_THEME,
  THEME_CLASSNAME_PREFIX,
  THEME_NAME_SEPARATOR,
} from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { isVariable } from '../createVariable'
import { areEqualSets } from '../helpers/areEqualSets'
import { ThemeContext } from '../ThemeContext'
import { ThemeManager, ThemeManagerContext } from '../ThemeManager'
import { ThemeName, ThemeObject } from '../types'
import { useConstant } from './useConstant'

const SEP = THEME_NAME_SEPARATOR

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
      if (!theme) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No theme', { themeName, theme })
        }
        return theme as any
      }
      return new Proxy(theme, {
        get(_, key) {
          if (!name) {
            return Reflect.get(_, key)
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
          let activeTheme = themes[name]
          if (!activeTheme) {
            if (process.env.NODE_ENV !== 'test') {
              console.error('No theme by name', name, 'only:', themes, 'keeping current theme')
            }
            activeTheme = theme
          }
          if (typeof key === 'string') {
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
          }
          return Reflect.get(_, key)
        },
      })
    },
    [
      /* if concurrent mode wanted put manager.name here */
    ]
  )
}

const GetThemeManager = Symbol('GetThemeManager')

export const getThemeManager = (theme: any) => {
  return theme?.[GetThemeManager]
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
  const nextNameParent = shortName ? `${parentName}${SEP}${shortName}` : ''
  const nextNameParentParent = shortName ? `${parent.parentName}${SEP}${shortName}` : ''
  const nextParentName =
    nextNameParent in themes
      ? nextNameParent
      : nextNameParentParent in themes
      ? nextNameParentParent
      : null
  const nextName = !shortName ? null : shortName in themes ? shortName : nextParentName
  const nextTheme = nextName ? themes[nextName] : null
  const themeManager = useConstant<ThemeManager | null>(() => {
    if (!nextTheme) {
      return null
    }
    const manager = new ThemeManager()
    if (nextName) {
      manager.setActiveTheme({ name: nextName, theme: themes[nextName], parentName })
    }
    return manager
  })

  useIsomorphicLayoutEffect(() => {
    if (!themeManager) {
      return
    }
    if (nextName) {
      themeManager.setActiveTheme({ name: nextName, theme: nextTheme, parentName })
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
  }, [themes, nextName, parentName])

  let className: string | null = null
  const classNamePost = shortName ?? componentName
  if (classNamePost) {
    className = `${THEME_CLASSNAME_PREFIX}${classNamePost}`
  }

  return {
    name: nextName || parentName,
    themes,
    themeManager,
    theme: nextTheme || themeManager?.theme || parent.theme || themes['light'],
    className,
  }
}
