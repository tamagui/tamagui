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
}

const emptyState: ThemeManagerState = { name: '-' }

export class ThemeManager {
  keys = new Map<string, Set<string> | undefined>()
  themeListeners = new Set<ThemeListener>()
  ogParentManager: ThemeManager | null = null
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState

  constructor(
    parentManagerIn?: ThemeManager | 'root' | null | undefined,
    public props?: ThemeProps,
    public ref?: any
  ) {
    if (parentManagerIn && parentManagerIn !== 'root') {
      this.ogParentManager = parentManagerIn
    }
    if (parentManagerIn === 'root') {
      this.updateState(props, false, false)
      return
    }
    this.parentManager = parentManagerIn || null
    const didUpdate = this.updateState(props, false, false)
    if (!didUpdate && parentManagerIn) {
      return parentManagerIn
    }
  }

  updateState(
    props: ThemeProps & { forceTheme?: ThemeParsed } = this.props || {},
    forceUpdate = false,
    notify = true
  ) {
    let shouldTryUpdate = forceUpdate || !this.parentManager
    if (!shouldTryUpdate) {
      const nextKey = this.#getPropsKey(props)
      if (
        (this.parentManager && nextKey !== this.parentManager.#getPropsKey()) ||
        this.#getPropsKey() !== nextKey
      ) {
        shouldTryUpdate = true
      }
    }
    if (props.forceTheme) {
      this.state.theme = props.forceTheme
      this.state.name = props.name || ''
      notify && this.notify()
      return true
    }
    if (shouldTryUpdate) {
      const nextState = this.#getStateIfChanged(props)
      if (nextState) {
        this.state = nextState
        notify && this.notify()
        return true
      }
    }
    return false
  }

  #getStateIfChanged(props: ThemeProps | undefined = this.props): ThemeManagerState | null {
    if (!props) {
      return null
    }
    const next = getNextThemeState(props, this.parentManager)
    if (!next || !next.theme) {
      return null
    }
    if (next.theme === this.state.theme) {
      return null
    }
    if (this.parentManager && next && next.theme === this.parentManager.state.theme) {
      return null
    }
    return next
  }

  #getPropsKey(props: ThemeProps | undefined = this.props) {
    if (!props) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`No props given to ThemeManager.getPropsKey()`)
      }
      return ``
    }
    const { name, inverse, reset, componentName } = props
    const key = `${name || 0}${inverse || 0}${reset || 0}${componentName || 0}`
    return key
  }

  #allKeys: Set<string> | null = null
  get allKeys() {
    if (!this.#allKeys) {
      this.#allKeys = new Set([
        ...(this.ogParentManager?.allKeys || []),
        ...Object.keys(this.state.theme || {}),
      ])
    }
    return this.#allKeys
  }

  get parentName() {
    return this.parentManager?.state.name || null
  }

  get fullName(): string {
    return this.state?.name || this.props?.name || ''
  }

  // gets value going up to parents
  getValue(key: string) {
    let theme = this.state.theme
    let manager = this as ThemeManager | null
    while (theme && manager) {
      if (key in theme) {
        return theme[key]
      }
      manager = manager.parentManager
      theme = manager?.state.theme
    }
  }

  isTracking(uuid: string) {
    return Boolean(this.keys.get(uuid)?.size)
  }

  track(uuid: any, keys: Set<string>) {
    this.keys.set(uuid, keys)
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

function getNextThemeState(
  props: ThemeProps,
  parentManager?: ThemeManager | null
): ThemeManagerState | null {
  const themes = getThemes()

  if (props.name && props.reset) {
    throw new Error(`Cannot reset and also set a new name`)
  }
  if (props.reset && !parentManager?.parentManager) {
    throw new Error(`Cannot reset theme if no grandparent theme exists`)
  }

  const parentName = parentManager?.state.name || ''
  let nextName = props.reset
    ? parentManager?.parentManager?.state.name || ''
    : props.name || parentManager?.state.name || ''

  const parentParts = parentName.split(THEME_NAME_SEPARATOR)

  // components look for specific, others fallback upwards
  const prefixes = props.componentName
    ? [parentName]
    : parentParts
        .map((_, i) => {
          return parentParts.slice(0, i + 1).join(THEME_NAME_SEPARATOR)
        })
        // most specific first
        .reverse()

  const potentialComponent = props.componentName

  // order important (most specific to least)
  const newPotentials = prefixes.flatMap((prefix) => {
    const res: string[] = []
    if (potentialComponent && nextName) {
      res.push([prefix, nextName, potentialComponent].join(THEME_NAME_SEPARATOR))
    }
    if (!potentialComponent && nextName) {
      res.push([prefix, nextName].join(THEME_NAME_SEPARATOR))
    }
    if (potentialComponent) {
      res.push([prefix, potentialComponent].join(THEME_NAME_SEPARATOR))
    }
    return res
  })

  if (potentialComponent && nextName) {
    for (const prefix of prefixes) {
      newPotentials.push([prefix, nextName].join(THEME_NAME_SEPARATOR))
    }
  }

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

  if (props.debug) {
    // prettier-ignore
    // eslint-disable-next-line no-console
    console.log('ThemeManager.getState', { props, potentialComponent, nextName, prefixes, newPotentials, parentParts })
  }

  const theme = themes[nextName]

  return {
    name: nextName,
    theme: getThemeUnwrapped(theme),
    className: getNextThemeClassName(nextName, props.inverse),
  }
}

const inverseTheme = (themeName: string) => {
  return themeName.startsWith('light')
    ? themeName.replace(/^light/, 'dark')
    : themeName.replace(/^dark/, 'light')
}

export const ThemeManagerContext = createContext<ThemeManager | null>(null)

const withoutComponentName = (name: string) => name.replace(/(_[A-Z][a-zA-Z]+)+$/g, '')
