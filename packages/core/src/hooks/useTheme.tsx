import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { GET_DEFAULT_THEME } from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { isVariable } from '../createVariable'
import { ThemeName, ThemeObject } from '../types'
import { ThemeContext } from '../views/ThemeContext'
import { ThemeManagerContext } from '../views/ThemeManagerContext'

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

const areEqualSets = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false
  for (const val in a) {
    if (!b.has(val)) {
      return false
    }
  }
  return true
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

export const useTheme = (): ThemeObject => {
  const forceUpdate = useForceUpdate()
  const manager = useContext(ThemeManagerContext)
  const themes = useContext(ThemeContext) || {}

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
    const cur = manager.keys.get(st.uuid)
    if (!cur || !areEqualSets(st.keys, cur)) {
      manager.track(st.uuid, st.keys)
    }
  })

  useEffect(() => {
    return manager.onUpdate(state.current.uuid, forceUpdate)
  }, [])

  const theme = (manager.name ? themes[manager.name] : themes.light) ?? themes.light ?? {}

  return useMemo(
    () => {
      return new Proxy(theme, {
        get(_, key: string) {
          const name = manager.name
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
          const val = activeTheme[key]
          if (process.env.NODE_ENV === 'development') {
            if (typeof val === 'undefined') {
              console.warn(`No theme value "${String(key)}" in`, activeTheme)
              return null
            }
            if (!isVariable(val)) {
              console.warn('Non variable!', val)
            }
            if (val.name !== key) {
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
