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
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { isWeb } from '../constants'
import { useConstant } from './useConstant'
import { useForceUpdate } from './useForceUpdate'

const PREFIX = `theme--`

export interface ThemeObject {
  [key: string]: any
}

export interface Themes {
  [key: string]: ThemeObject
}

type ThemeName = keyof Themes

let hasConfigured = false
let themes: Themes = {}

// for usage later on in mapping value => variable
const inverseValueToVariable: {
  [key: string]: { [subKey: string]: string }
} = {}

export function useGetCssVariable() {
  const activeTheme = useContext(ActiveThemeContext)
  return <A extends string | number>(value: A) => {
    if (!activeTheme) {
      return value
    }
    const themeVal = inverseValueToVariable[activeTheme.name]?.[value]
    return themeVal ?? value
  }
}

export const configureThemes = (userThemes: Themes) => {
  if (hasConfigured) {
    throw new Error(`Already configured themes once`)
  }
  hasConfigured = true
  themes = userThemes

  if (isWeb) {
    // insert css variables
    const tag = createStyleTag()
    for (const themeName in userThemes) {
      const theme = userThemes[themeName]
      inverseValueToVariable[themeName] =
        inverseValueToVariable[themeName] || {}
      let vars = ''
      for (const themeKey in theme) {
        const themeVal = theme[themeKey]
        const variableName = `--${themeKey}`
        inverseValueToVariable[themeName][themeVal] = `var(${variableName})`
        vars += `${variableName}: ${themeVal};`
      }
      const rule = `.${PREFIX}${themeName} { ${vars} }`
      tag?.sheet?.insertRule(rule)
    }
  }
}

class ActiveThemeManager {
  name = ''
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()

  setActiveTheme(name: string) {
    if (name === this.name) return
    this.name = name
    this.update()
  }

  track(uuid: any, keys: Set<string>) {
    this.keys.set(uuid, keys)
  }

  update() {
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)!()
      }
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
const ActiveThemeContext = createContext<ActiveThemeManager>(
  new ActiveThemeManager()
)

type UseThemeState = {
  uuid: Object
  keys: Set<string>
  isRendering: boolean
}

export const useTheme = () => {
  const forceUpdate = useForceUpdate()
  const manager = useContext(ActiveThemeContext)
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
  useLayoutEffect(() => {
    const st = state.current
    st.isRendering = false
    if (!isEqual(st.keys, manager.keys.get(st.uuid))) {
      manager.track(st.uuid, st.keys)
    }
  })

  useEffect(() => {
    return manager.onUpdate(state.current.uuid, forceUpdate)
  }, [])

  return useConstant(() => {
    return new Proxy(themes[manager.name], {
      get(_, key) {
        if (typeof key !== 'string') return
        const activeTheme = themes[manager.name]
        const val = activeTheme[key]
        if (!val) {
          throw new Error(
            `No theme value "${String(key)}" in: ${Object.keys(activeTheme)}`
          )
        }
        if (state.current.isRendering) {
          state.current.keys.add(key)
        }
        return val
      },
    })
  })
}

export const ThemeProvider = (props: {
  themes: Themes
  defaultTheme: ThemeName
  children?: any
}) => {
  if (!hasConfigured) {
    throw new Error(`Missing configureThemes() call, add to your root file`)
  }
  return (
    <ThemeContext.Provider value={props.themes}>
      <Theme name={props.defaultTheme}>{props.children}</Theme>
    </ThemeContext.Provider>
  )
}

export type ThemeProps = {
  name: ThemeName | null
  children?: any
}

export const Theme = (props: ThemeProps) => {
  const parent = useContext(ActiveThemeContext)
  const [themeManager, setThemeManager] = useState<ActiveThemeManager | null>(
    () => {
      if (props.name) {
        const manager = new ActiveThemeManager()
        manager.setActiveTheme(`${props.name}`)
        return manager
      }
      return null
    }
  )

  useLayoutEffect(() => {
    if (props.name === null) {
      setThemeManager(null)
      return
    }
    if (props.name === parent.name) {
      if (themeManager !== parent) {
        setThemeManager(parent)
      }
    } else {
      const next = new ActiveThemeManager()
      next.setActiveTheme(`${props.name}`)
      setThemeManager(next)
    }
  }, [props.name])

  const contents = themeManager ? (
    <ActiveThemeContext.Provider value={themeManager}>
      {props.children}
    </ActiveThemeContext.Provider>
  ) : (
    props.children
  )

  if (isWeb) {
    return (
      <div
        className={`theme-parent ${
          themeManager?.name ? `${PREFIX}${themeManager.name}` : ''
        }`}
        style={{ display: 'contents' }}
      >
        {contents}
      </div>
    )
  }

  return contents
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
