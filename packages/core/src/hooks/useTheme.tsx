import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getHasConfigured, getTamagui } from '../conf'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { isVariable } from '../createVariable'
import { areEqualSets } from '../helpers/areEqualSets'
import { ThemeContext } from '../ThemeContext'
import { ThemeManager, ThemeManagerContext, emptyManager } from '../ThemeManager'
import { ThemeObject, Themes } from '../types'
import { useConstant } from './useConstant'

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = (
  themeName?: string | null,
  componentName?: string,
  debug = false
): ThemeObject => {
  const { name, theme, themes, themeManager, className, didChangeTheme } = useChangeThemeEffect(
    themeName,
    componentName,
    debug
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

  return useMemo(() => {
    if (!theme) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No theme', { themeName, theme, componentName, className })
      }
      return themes[getTamagui().defaultTheme || 'light' || Object.keys(themes)[0]]
    }
    return new Proxy(theme, {
      get(_, key) {
        if (!name) {
          return Reflect.get(_, key)
        }
        // TODO make this pattern better
        if (key === GetThemeManager) {
          if (!didChangeTheme) {
            return null
          }
          // TODO
          // console.log('DID CHANGE THEME')
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
            // prettier-ignore
            console.error('No theme by name', name, 'keeping current theme')
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
  }, [name, theme, className, didChangeTheme])
}

const GetThemeManager = Symbol('GetThemeManager')

export const getThemeManager = (theme: any) => {
  return theme?.[GetThemeManager]
}

export const useThemeName = (opts?: { parent?: true }) => {
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

export const useChangeThemeEffect = (
  name?: string | null,
  componentName?: string,
  debug = false
) => {
  const parentManager = useContext(ThemeManagerContext) || emptyManager
  const { themes } = useContext(ThemeContext)!
  const next = parentManager.getNextTheme({ name, componentName, themes }, debug)
  const forceUpdate = useForceUpdate()
  const themeManager = useConstant<ThemeManager | null>(() => {
    if (!next) {
      return null
    }
    return new ThemeManager(next.name, next.theme, parentManager)
  })

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      if (!themeManager) return
      if (next?.name) {
        themeManager.update({ ...next, parentManager })
      }
      return parentManager.onChangeTheme(() => {
        const next = parentManager.getNextTheme({ name, componentName, themes }, debug)
        if (!next) return
        if (themeManager.update({ ...next, parentManager })) {
          forceUpdate()
        }
      })
    }, [themes, name, componentName, debug, next?.name])
  }

  const didChangeTheme = next && parentManager && next.name !== parentManager.fullName

  return {
    ...(parentManager && {
      name: parentManager.name,
      theme: parentManager.theme,
    }),
    ...next,
    didChangeTheme,
    themes,
    themeManager,
  }
}
