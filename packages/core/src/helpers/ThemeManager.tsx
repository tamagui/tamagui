import { createContext } from 'react'

import { getThemes } from '../config'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from '../constants/constants'
import { getThemeUnwrapped } from '../hooks/getThemeUnwrapped'
import { ThemeParsed, ThemeProps } from '../types'

type ThemeListener = (name: string | null, themeManager: ThemeManager) => void

export type SetActiveThemeProps = {
  className?: string
  parentManager?: ThemeManager | null
  name?: string | null
  theme?: any
  reset?: boolean
}

type ThemeManagerState = {
  name: string
  theme?: ThemeParsed | null
  className?: string
  parentName?: string
}

const emptyState: ThemeManagerState = { name: '' }

export class ThemeManager {
  themeListeners = new Set<ThemeListener>()
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState

  constructor(
    public props: ThemeProps = {},
    parentManager?: ThemeManager | 'root' | null | undefined,
    public ref?: any
  ) {
    if (parentManager === 'root') {
      this.updateState(props, false)
      return
    }
    if (parentManager) {
      this.parentManager = parentManager
    }
    const updatedState = this.getStateIfChanged(props)
    if (updatedState) {
      this.state = updatedState
      return
    }
    return parentManager || this
  }

  updateState(props: ThemeProps & { forceTheme?: ThemeParsed } = this.props || {}, notify = true) {
    const shouldFlush = () => {
      if (props.forceTheme) {
        this.state.theme = props.forceTheme
        this.state.name = props.name || ''
        return true
      }
      const nextState = this.getStateIfChanged(props)
      if (nextState) {
        this.state = nextState
        return true
      }
    }
    if (shouldFlush()) {
      // reset any derived state
      this.#allKeys = null
      notify && this.notify()
      return this.state
    }
  }

  getStateIfChanged(props = this.props, state = this.state) {
    const _ = getState(props, this.parentManager)
    if (
      !_ ||
      !_.theme ||
      _.theme === state.theme ||
      (this.parentManager && _ && _.theme === this.parentManager.state.theme)
    ) {
      return null
    }
    return _
  }

  getState(props = this.props) {
    return getState(props, this.parentManager)
  }

  #allKeys: Set<string> | null = null
  get allKeys() {
    this.#allKeys ??= new Set([
      ...(this.parentManager?.allKeys || []),
      ...Object.keys(this.state.theme || {}),
    ])
    return this.#allKeys
  }

  // gets value going up to parents
  getValue(key: string, state?: ThemeManagerState) {
    let theme = (state || this.state).theme
    let manager = this as ThemeManager | null
    while (theme && manager) {
      if (key in theme) {
        return theme[key]
      }
      manager = manager.parentManager
      theme = manager?.state.theme
    }
  }

  notify() {
    this.themeListeners.forEach((cb) => cb(this.state.name, this))
  }

  onChangeTheme(cb: ThemeListener) {
    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
    }
  }
}

function getNextThemeClassName(name: string, isInverting = false) {
  const next = `${THEME_CLASSNAME_PREFIX}${name}`
  if (isInverting) {
    return next
  }
  return next.replace('light_', '').replace('dark_', '')
}

function getState(
  props: ThemeProps,
  parentManager?: ThemeManager | null
): ThemeManagerState | null {
  const themes = getThemes()

  if (props.name && props.reset) {
    throw new Error(`Cannot reset + set new name`)
  }
  if (props.reset && !parentManager?.parentManager) {
    console.warn('parentManager', parentManager)
    throw new Error(`Cannot reset no grandparent exists`)
  }

  const nextName = props.reset ? parentManager?.parentManager?.state?.name || '' : props.name || ''
  const nextNameParts = nextName.split(THEME_NAME_SEPARATOR).length
  const { componentName } = props
  const parentName = parentManager?.state?.name || ''

  // components look for most specific, fallback upwards
  const base = parentName.split(THEME_NAME_SEPARATOR)
  const lastSegment = base[base.length - 1]
  const isParentAComponentTheme = parentName && lastSegment[0].toUpperCase() === lastSegment[0]
  if (isParentAComponentTheme) {
    base.pop() // always remove componentName they can't nest
  }
  const parentBaseTheme = isParentAComponentTheme
    ? base.slice(0, base.length).join(THEME_NAME_SEPARATOR)
    : parentName
  const max = base.length
  const min = componentName
    ? max - 1 // component themes don't search upwards
    : 0

  // console.log('go', props, { parentName, parentBaseTheme, base, min, max })

  for (let i = max; i >= min; i--) {
    let prefix = base.slice(0, i).join(THEME_NAME_SEPARATOR)
    if (props.inverse) {
      prefix = inverseThemeName(prefix)
    }
    let potentials: string[] = []
    if (componentName) {
      // components only look for component themes
      potentials = [`${prefix}_${componentName}`]
      if (nextName) {
        potentials.unshift(`${prefix}_${nextName}_${componentName}`)
      }
    } else {
      if (prefix && prefix !== parentBaseTheme) {
        potentials.push(prefix)
      }
      if (nextName) {
        potentials.unshift(prefix ? `${prefix}_${nextName}` : nextName)
      }
      if (i === 1) {
        const lastSegment = potentials.findIndex((x) => !x.includes('_'))
        if (lastSegment > 0) {
          potentials.splice(lastSegment, 0, nextName) // last try prefer our new name to parent
        }
      }
    }

    const found = potentials.find((t) => t in themes)
    if (found) {
      const theme = themes[found]
      return {
        // need to put concurrent safe things here
        name: found,
        theme: getThemeUnwrapped(theme),
        className: getNextThemeClassName(nextName, props.inverse),
        parentName,
      }
    }
  }

  return null
}

const inverseThemeName = (themeName: string) => {
  return themeName.startsWith('light')
    ? themeName.replace(/^light/, 'dark')
    : themeName.replace(/^dark/, 'light')
}

export const ThemeManagerContext = createContext<ThemeManager | null>(null)
