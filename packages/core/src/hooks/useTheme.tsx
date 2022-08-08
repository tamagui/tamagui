import { useForceUpdate } from '@tamagui/use-force-update'
import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getConfig } from '../conf'
import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { ThemeContext } from '../contexts/ThemeContext'
import { areEqualSets } from '../helpers/areEqualSets'
import {
  GetNextThemeProps,
  ThemeManager,
  ThemeManagerContext,
  emptyManager,
} from '../helpers/ThemeManager'
import { ThemeName, ThemeObject } from '../types'
import { GetThemeUnwrapped } from './getThemeUnwrapped'
import { useConstant } from './useConstant'

export type ThemeProps = {
  className?: string
  disableThemeClass?: boolean
  name: Exclude<ThemeName, number> | null
  componentName?: string
  children?: any
  reset?: boolean
  debug?: boolean | 'verbose'
}

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = (
  themeName?: string | null,
  componentName?: string,
  props?: ThemeProps,
  forceUpdate?: any
): ThemeObject => {
  const { name, theme, themes, themeManager, className } = useChangeThemeEffect(
    themeName,
    componentName,
    props,
    forceUpdate
  )

  if (process.env.NODE_ENV === 'development') {
    if (props?.debug === 'verbose') {
      console.log('  🔹 useTheme', { themeName, componentName, name, className })
    }
  }

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

  const debugProp = props && props['debug']

  if (!theme) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No theme', { themeName, theme, componentName, className })
    }
    return themes[getConfig().defaultTheme || Object.keys(themes)[0]]
  }

  return useMemo(() => {
    return new Proxy(theme, {
      has(_, key) {
        if (typeof key === 'string') {
          if (key[0] === '$') {
            key = key.slice(1)
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
        if (key === 'name') {
          return name
        }
        if (key === 'className') {
          return className
        }
        if (!name || key === '__proto__' || typeof key === 'symbol' || key === '$typeof') {
          return Reflect.get(_, key)
        }
        if (!themeManager) {
          console.error('No themeManager')
          return
        }
        // auto convert variables to plain
        if (key[0] === '$') {
          key = key.slice(1)
        }
        if (state.current.isRendering && !state.current.keys.has(key)) {
          state.current.keys.add(key)
          if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            console.log('  🔸 tracking theme', key)
          }
        }
        return themeManager.getValue(key)
      },
    })
  }, [name, theme, componentName, className, debugProp])
}

const GetThemeManager = Symbol()

export const getThemeManager = (theme: any): ThemeManager | undefined => {
  if (!theme) return
  return theme[GetThemeManager]
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

export const activeThemeManagers = new Set<ThemeManager>()

export const useChangeThemeEffect = (
  name?: string | null,
  componentName?: string,
  props?: ThemeProps,
  forceUpdateProp?: any
) => {
  const debug = props && props['debug']
  const parentManager = useContext(ThemeManagerContext) || emptyManager
  const { themes } = useContext(ThemeContext)!
  const reset = props?.reset || false
  const getThemeProps: GetNextThemeProps = { name, componentName, themes, reset }
  const next = parentManager.getNextTheme(getThemeProps, debug)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const forceUpdate = forceUpdateProp || useForceUpdate()

  const themeManager = useConstant<ThemeManager | null>(() => {
    if (!next) return null
    return new ThemeManager(next.name, next.theme, parentManager, reset)
  })

  // if not SSR
  if (!isWeb || typeof document !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (!themeManager) return

      activeThemeManagers.add(themeManager)

      if (next?.name) {
        themeManager.update(next)
      }

      const disposeParentOnChange = parentManager.onChangeTheme(() => {
        const next = parentManager.getNextTheme(getThemeProps, debug)
        if (!next) return
        if (themeManager.update(next)) {
          forceUpdate()
        }
      })

      return () => {
        activeThemeManagers.delete(themeManager)
        disposeParentOnChange()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themes, name, componentName, debug, next?.name])
  }

  return {
    ...(parentManager && {
      name: parentManager.name,
      theme: parentManager.theme,
    }),
    ...next,
    themes,
    themeManager,
  }
}
