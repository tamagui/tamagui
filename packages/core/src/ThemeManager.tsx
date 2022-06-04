import { createContext } from 'react'

import { getThemes } from './conf'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from './constants/constants'
import { ThemeObject, Themes } from './types'

type ThemeListener = (name: string | null, themeManager: ThemeManager) => void

export type SetActiveThemeProps = {
  className?: string
  parentManager?: ThemeManager | null
  name?: string | null
  theme?: any
}

export type GetNextThemeProps = {
  themes?: Themes
  name?: string | null
  componentName?: string | null
  reset?: boolean
}

export class ThemeManager {
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  themeListeners = new Set<ThemeListener>()
  className: string | null = null

  constructor(
    public name: string = '',
    public theme: ThemeObject | null = null,
    public parentManager: ThemeManager | null = null,
    public reset: boolean = false
  ) {
    // find the nearest different parentManager
    let parent = parentManager
    let tries = 0
    while (true) {
      tries++
      if (tries > 10) {
        throw new Error(`Nested 10 of the same theme in a row, likely error`)
      }
      if (!parent) break
      if (parent.name === name) {
        // go up if same
        parent = parent.parentManager
      } else {
        this.parentManager = parent
        break
      }
    }
  }

  get parentName() {
    return this.parentManager?.name || null
  }

  get fullName(): string {
    return this.getNextTheme().name || this.name || ''
    // const parentName = this.parentManager?.fullName || ''
    // const name = this.name || ''
    // const parts = [...new Set([...`${parentName}_${name}`.split('_')])].filter(Boolean)
    // return parts.join('_')
  }

  // gets value going up to parents
  getValue(key: string) {
    let theme = this.theme
    let manager = this as ThemeManager | null
    while (true) {
      if (!theme) return
      if (key in theme) {
        return theme[key]
      }
      manager = this.parentManager
      if (!manager) {
        return
      }
      if (manager.theme === theme) {
        return
      }
      theme = manager.theme
    }
  }

  update({ name, theme, className }: SetActiveThemeProps = {}) {
    // className compare on web, avoids light/dark re-renders
    const nameChanged = name !== this.name
    if (!nameChanged) {
      return false
    }
    this.className = className || null
    this.name = name || ''
    this.theme = theme
    this.notifyListeners()
    return true
  }

  getNextTheme(props: GetNextThemeProps = {}, debug?: any) {
    const { themes = getThemes(), name, componentName } = props

    if (props.reset && name) {
      return {
        name: name,
        theme: themes[name],
        className: this.#getClassName(name),
      }
    }

    const parentIsReset = this.parentManager?.reset

    if (!name) {
      if (componentName) {
        // allow for _Card_Button or just _Button
        const names = [
          `${this.name}_${componentName}`,
          `${withoutComponentName(this.name)}_${componentName}`,
        ]
        for (const name of names) {
          if (name in themes) {
            const className = this.#getClassName(name)
            return { name, theme: themes[name], className }
          }
        }
      }
      return {
        name: this.name,
        theme: this.theme,
      }
    }

    let nextName = name || this.name || ''
    let parentName = parentIsReset ? this.parentName || this.fullName : this.fullName

    while (true) {
      if (nextName in themes) {
        break
      }
      nextName = `${parentName}_${name}`
      if (nextName in themes) {
        break
      }
      if (!parentName.includes(THEME_NAME_SEPARATOR)) {
        // not found!
        console.warn('theme not found', name)
        // this happens in next during _document.getInitialProps and has a terrible/non-existent stack trace
        // throw new Error(`Theme not found: ${name}`)
        break
      }
      // go up one
      parentName = parentName.slice(0, parentName.lastIndexOf(THEME_NAME_SEPARATOR))
    }

    if (componentName) {
      // allow for _Card_Button or just _Button
      const names = [
        `${nextName}_${componentName}`,
        `${withoutComponentName(nextName)}_${componentName}`,
      ]
      for (const name of names) {
        if (name in themes) {
          nextName = name
        }
      }
    }

    let theme = themes[nextName]
    if (!theme) {
      theme = themes[`light_${nextName}`]
    }

    if (process.env.NODE_ENV === 'development' && debug) {
      console.log('getNextTheme', { props, nextName, parentName }, this)
    }

    return {
      name: nextName,
      theme,
      className: this.#getClassName(nextName),
    }
  }

  #getClassName(name: string) {
    return `${THEME_CLASSNAME_PREFIX}${name} tui_theme`.replace('light_', '').replace('dark_', '')
  }

  track(uuid: any, keys: Set<string>) {
    if (!this.name) return
    this.keys.set(uuid, keys)
  }

  notifyListeners() {
    if (!this.name) {
      this.keys.clear()
    }
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)?.()
      }
    }
    this.themeListeners.forEach((cb) => cb(this.name, this))
  }

  onChangeTheme(cb: ThemeListener) {
    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
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

export const ThemeManagerContext = createContext<ThemeManager | null>(null)
export const emptyManager = new ThemeManager()

const withoutComponentName = (name: string) => name.replace(/(\_[A-Z][a-zA-Z]+)+$/g, '')
