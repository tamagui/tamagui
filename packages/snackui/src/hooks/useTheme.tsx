//
// for types:
//
//   interface MyTheme {}
//   interface MyThemes { dark: MyTheme }
//   const myThemes = { dark: {} }
//   configureThemes(myThemes)
//   declare module 'snackui' {
//     interface Theme extends MyTheme
//     interface Themes extends MyThemes
//   }
//

import { isEqual } from '@dish/fast-compare'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { defaultThemes } from '../defaultThemes'
import { isWeb, useIsomorphicLayoutEffect } from '../platform'
import { ThemeName, Themes } from '../themeTypes'
import { useConstant } from './useConstant'
import { useForceUpdate } from './useForceUpdate'

const PREFIX = `theme--`

export let hasConfigured = false

export const invertStyleVariableToValue: {
  [key: string]: { [subKey: string]: string }
} = {}

let themes: Themes = defaultThemes

export const getThemes = () => themes

export const configureThemes = (userThemes: Themes = defaultThemes) => {
  if (hasConfigured) {
    // console.warn(`Already configured themes once`)
    return
  }
  hasConfigured = userThemes !== defaultThemes
  themes = userThemes

  // insert css variables
  const tag = createStyleTag()
  for (const themeName in userThemes) {
    const theme = userThemes[themeName]
    invertStyleVariableToValue[themeName] = invertStyleVariableToValue[themeName] || {}
    let vars = ''
    for (const themeKey in theme) {
      const themeVal = theme[themeKey]
      const variableName = `--${themeKey}`
      invertStyleVariableToValue[themeName][`var(${variableName})`] = themeVal
      vars += `${variableName}: ${themeVal};`
    }
    const rule = `.${PREFIX}${themeName} { ${vars} }`
    tag?.sheet?.insertRule(rule)
  }
}

export type ThemeProps = {
  name: ThemeName | null
  children?: any
}

export const Theme = (props: ThemeProps) => {
  const name = (props.name as string) || null
  const parent = useContext(ThemeManagerContext)
  const themeManager = useConstant<ThemeManager>(() => {
    const manager = new ThemeManager()
    try {
      return manager
    } finally {
      if (name) {
        manager.setActiveTheme(name)
      }
    }
  })

  useIsomorphicLayoutEffect(() => {
    themeManager.setActiveTheme(name ?? parent.name)
    if (!name) {
      return parent.onChangeTheme((next) => {
        if (!name && next) {
          themeManager.setActiveTheme(next)
        }
      })
    }
  }, [name])

  const contents = themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {props.children}
    </ThemeManagerContext.Provider>
  ) : (
    props.children
  )

  if (isWeb) {
    return (
      <div className={getThemeParentClassName(name)} style={{ display: 'contents' }}>
        {contents}
      </div>
    )
  }

  return contents
}

function getThemeParentClassName(themeName?: string | null) {
  return `theme-parent ${themeName ? `${PREFIX}${themeName}` : ''}`
}

class ThemeManager {
  name: string | null = 'light'
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  callbacks = new Set<Function>()

  setActiveTheme(name: string | null) {
    if (name === this.name) return
    this.name = name
    this.update()
  }

  track(uuid: any, keys: Set<string>) {
    if (!this.name) return
    this.keys.set(uuid, keys)
  }

  update() {
    if (!this.name) {
      this.keys.clear()
    }
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)?.()
      }
    }
    this.callbacks.forEach((cb) => cb(this.name))
  }

  onChangeTheme(cb: (name: string | null) => void) {
    this.callbacks.add(cb)
    return () => {
      this.callbacks.delete(cb)
    }
  }

  onUpdate(uuid: any, cb: Function) {
    this.listeners.set(uuid, cb)
    return () => {
      this.listeners.delete(uuid)
      this.keys.delete(uuid)
    }
  }
}

const ThemeContext = createContext<Themes>(themes)
export const ThemeManagerContext = createContext<ThemeManager>(new ThemeManager())

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useThemeName = () => {
  const parent = useContext(ThemeManagerContext)
  const [name, setName] = useState(parent.name)

  useEffect(() => {
    return parent.onChangeTheme((next) => {
      setName((prev) => {
        if (prev === next) return prev
        return next
      })
    })
  }, [parent])

  return name || 'light'
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
    if (!isEqual(st.keys, manager.keys.get(st.uuid))) {
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
          const activeTheme = themes[name]
          const val = activeTheme[key]
          if (!val) {
            if (process.env.NODE_ENV === 'development') {
              if (typeof key === 'string') {
                try {
                  if (!activeTheme) {
                    throw new Error(`No theme! ${name} in ${Object.keys(themes)}`)
                  }
                  if (!val) {
                    throw new Error(
                      `No theme value "${String(key)}" in: ${Object.keys(activeTheme)}`
                    )
                  }
                } catch (err: any) {
                  // no need to destroy rendering ever
                  console.error(err.message, err.stack)
                }
              }
            }
            return Reflect.get(_, key)
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

export const ThemeProvider = (props: {
  themes: Themes
  defaultTheme: ThemeName
  children?: any
}) => {
  if (!hasConfigured) {
    throw new Error(`Missing configureThemes() call, add to your root file`)
  }

  // ensure theme is attached to root body node as well to work with modals by default
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      const cns = getThemeParentClassName(`${props.defaultTheme}`).split(' ')
      cns.forEach((cn) => document.body.classList.add(cn))
      return () => {
        cns.forEach((cn) => document.body.classList.remove(cn))
      }
    }
  }, [])

  return (
    <ThemeContext.Provider value={props.themes}>
      <Theme name={props.defaultTheme}>{props.children}</Theme>
    </ThemeContext.Provider>
  )
}

function createStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null
  }
  const tag = document.createElement('style')
  tag.className = 'snackui-css-vars'
  tag.setAttribute('type', 'text/css')
  tag.appendChild(document.createTextNode(''))
  if (!document.head) {
    throw new Error('expected head')
  }
  document.head.appendChild(tag)
  return tag
}
