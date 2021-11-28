import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { Variable } from '../createVariable'
import { ThemeName } from '../types'
import { ThemeContext } from '../views/ThemeContext'
import { ThemeManagerContext } from '../views/ThemeManagerContext'
import { GET_DEFAULT_THEME } from '../views/ThemeProvider'

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

export const useTheme = () => {
  const forceUpdate = useForceUpdate()
  const manager = useContext(ThemeManagerContext)
  const themes = useContext(ThemeContext)
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

  const theme = (manager.name ? themes[manager.name] : themes.light) ?? themes.light

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
            console.error('No theme by name', name, 'only:', themes, 'keeping current theme')
            activeTheme = theme
          }
          const val = activeTheme[key]
          if (process.env.NODE_ENV === 'development') {
            if (typeof val === 'undefined') {
              console.warn(`No theme value "${String(key)}" in: ${Object.keys(activeTheme)}`)
              return null
            }
          }
          if (state.current.isRendering) {
            state.current.keys.add(key)
          }
          // TODO costly, can make faster (we need name mapping to og name, but val pointing to new val)
          // console.log('returning new variable', val, key)
          return new Variable({ val: val.val, name: key })
        },
      })
    },
    [
      /* if concurrent mode wanted put manager.name here */
    ]
  )
}
