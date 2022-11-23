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
  ogParentManager: ThemeManager | null = null
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
      this.ogParentManager = parentManager
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
      ...(this.ogParentManager?.allKeys || []),
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
    throw new Error(`Cannot reset and set new name`)
  }
  if (props.reset && !parentManager?.parentManager) {
    throw new Error(`Cannot reset theme, no grandparent exists`)
  }

  const parentName = parentManager?.state?.name || ''
  let nextName = props.reset ? parentManager?.parentManager?.state?.name || '' : props.name || ''

  const parentParts = parentName.split(THEME_NAME_SEPARATOR).filter(Boolean)

  // components look for specific, others fallback upwards
  const prefixesSet = new Set<string>()
  for (const [i] of parentParts.entries()) {
    const parentsStart = parentParts.slice(0, i + 1)
    if (!parentName.includes(nextName) && !parentParts.includes(nextName)) {
      prefixesSet.add([...parentsStart, nextName].join(THEME_NAME_SEPARATOR))
    }
  }

  const prefixes = [...prefixesSet].reverse()
  const potentialComponent = props.componentName

  // order important (most specific to least)
  const newPotentials = prefixes.flatMap((prefix) => {
    const res: string[] = []
    if (potentialComponent) {
      res.push([prefix, potentialComponent].join(THEME_NAME_SEPARATOR))
    } else {
      res.push(prefix)
    }
    return res
  })

  let potentials = nextName ? [...newPotentials, nextName] : newPotentials
  if (props.inverse) {
    potentials = potentials.map(inverseTheme)
  }

  for (const name of potentials) {
    if (name && name in themes) {
      nextName = name
      break
    }
  }

  if (!nextName && (props.name || props.inverse || props.reset)) {
    // eslint-disable-next-line no-console
    console.warn(`No theme found for props`, props, 'after', parentManager)
  }

  const theme = themes[nextName]

  // prettier-ignore
  // eslint-disable-next-line no-console
  process.env.NODE_ENV === 'development' && props.debug && console.log('getState', nextName, { potentials, parentParts, nextName, props, theme, parentState: parentManager?.state })

  // didn't change
  if (!theme || theme === parentManager?.state.theme) {
    return null
  }

  return {
    // need to put concurrent safe things here
    name: nextName,
    theme: getThemeUnwrapped(theme),
    className: getNextThemeClassName(nextName, props.inverse),
    parentName,
  }
}

const inverseTheme = (themeName: string) => {
  return themeName.startsWith('light')
    ? themeName.replace(/^light/, 'dark')
    : themeName.replace(/^dark/, 'light')
}

export const ThemeManagerContext = createContext<ThemeManager | null>(null)
