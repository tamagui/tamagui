import { isWeb } from '@tamagui/constants'

import { getThemes } from '../config'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from '../constants/constants'
import { ThemeParsed, ThemeProps } from '../types'

type ThemeListener = (
  name: string | null,
  themeManager: ThemeManager,
  forced: boolean
) => void

export type SetActiveThemeProps = {
  className?: string
  parentManager?: ThemeManager | null
  name?: string | null
  theme?: any
  reset?: boolean
}

export type ThemeManagerState = {
  name: string
  theme?: ThemeParsed | null
  className?: string
  parentName?: string
  componentName?: string
  inverse?: boolean
}

const emptyState: ThemeManagerState = { name: '' }

export function getHasThemeUpdatingProps(props: ThemeProps) {
  return props.name || props.componentName || props.inverse || props.reset
}

let uid = 0

export class ThemeManager {
  id = uid++
  isComponent = false
  themeListeners = new Set<ThemeListener>()
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState
  scheme: 'light' | 'dark' | null = null

  constructor(
    public props: ThemeProps = {},
    parentManagerIn?: ThemeManager | 'root' | null | undefined
  ) {
    if (parentManagerIn === 'root') {
      this.updateStateFromProps(props, false)
      return
    }

    if (!parentManagerIn) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(
          `No parent manager given, this is likely due to duplicated Tamagui dependencies. Check your lockfile for mis-matched versions. It could also be from an error somewhere else in your stack causing Tamagui to recieve undefined context, you can try putting some ErrorBoundary components around other areas of your app, or a Suspense boundary.`
        )
      }
      throw `❌ 0`
    }

    this.parentManager = parentManagerIn

    if (this.updateStateFromProps(props, false)) {
      return
    }

    return parentManagerIn || this
  }

  updateStateFromProps(
    props: ThemeProps & { forceTheme?: ThemeParsed } = this.props || {},
    shouldNotify = true
  ) {
    this.props = props
    if (props.forceTheme) {
      this.state.theme = props.forceTheme
      this.state.name = props.name || ''
      return true
    }
    const nextState = this.getStateIfChanged(props)
    if (nextState) {
      this.updateState(nextState, shouldNotify)
      return nextState
    }
  }

  updateState(nextState: ThemeManagerState, shouldNotify = true) {
    this.state = nextState
    const names = this.state.name.split('_')
    const lastName = names[names.length - 1][0]
    this.isComponent = lastName[0] === lastName[0].toUpperCase()
    this._allKeys = null
    this.scheme = names[0] === 'light' ? 'light' : names[0] === 'dark' ? 'dark' : null
    if (process.env.NODE_ENV === 'development') {
      this['_numChangeEventsSent'] ??= 0
      this['_numChangeEventsSent']++
    }
    if (shouldNotify) {
      queueMicrotask(() => {
        this.notify()
      })
    }
  }

  getStateIfChanged(
    props = this.props,
    state: ThemeManagerState | null = this.state,
    parentManager = this.parentManager
  ) {
    const _ = this.getState(props, parentManager)

    // is removing
    if (state && state !== emptyState && !_) {
      return parentManager?.state
    }
    if (this.getStateShouldChange(_, state)) {
      return _
    }
  }

  getStateShouldChange(
    nextState: ThemeManagerState | null,
    state: ThemeManagerState | null = this.state
  ) {
    if (!nextState?.theme || nextState.theme === state?.theme) {
      return false
    }
    return true
  }

  getState(props = this.props, parentManager = this.parentManager) {
    const next =
      getState(props, parentManager) ||
      (process.env.TAMAGUI_TARGET === 'native' ? parentManager?.state || null : null)
    return next
  }

  _allKeys: Set<string> | null = null
  get allKeys() {
    this._allKeys ||= new Set([
      ...(this.parentManager?.allKeys || []),
      ...Object.keys(this.state.theme || {}),
    ])
    return this._allKeys
  }

  notify(forced = false) {
    this.themeListeners.forEach((cb) => cb(this.state.name, this, forced))
  }

  onChangeTheme(cb: ThemeListener, debugId?: number) {
    if (process.env.NODE_ENV === 'development' && debugId) {
      // @ts-ignore
      this._listeningIds ??= new Set()
      // @ts-ignore
      this._listeningIds.add(debugId)
    }

    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
    }
  }
}

function getNextThemeClassName(name: string) {
  const next = `t_sub_theme ${THEME_CLASSNAME_PREFIX}${name}`
  return next.replace('light_', '').replace('dark_', '')
}

function getState(
  props: ThemeProps,
  parentManager?: ThemeManager | null
): ThemeManagerState | null {
  const validManagerAndAllComponentThemes = getNonComponentParentManager(parentManager)
  parentManager = validManagerAndAllComponentThemes[0]
  const allComponentThemes = validManagerAndAllComponentThemes[1]
  const themes = getThemes()
  const isDirectParentAComponentTheme = allComponentThemes.length > 0

  if (props.name && props.reset) {
    throw new Error('Cannot reset + set new name')
  }

  if (!props.name && !props.inverse && !props.reset && !props.componentName) {
    return null
  }

  if (props.reset && !isDirectParentAComponentTheme && !parentManager?.parentManager) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Cannot reset no grandparent exists')
    }
    return null
  }

  let result: ThemeManagerState | null = null

  const nextName = props.reset
    ? isDirectParentAComponentTheme
      ? parentManager?.state?.name || ''
      : parentManager?.parentManager?.state?.name || ''
    : props.name || ''
  const { componentName } = props
  const parentName = props.reset
    ? isDirectParentAComponentTheme
      ? // here because parentManager already skipped componentTheme so we have to only go up once
        parentManager?.parentManager?.state.name || ''
      : parentManager?.parentManager?.parentManager?.state.name || ''
    : isDirectParentAComponentTheme
    ? allComponentThemes[0] || ''
    : parentManager?.state.name || ''

  if (props.reset && isDirectParentAComponentTheme) {
    // skip nearest component theme
    allComponentThemes.shift()
  }

  // components look for most specific, fallback upwards
  const base = parentName.split(THEME_NAME_SEPARATOR)
  const lastSegment = base[base.length - 1]
  const isParentComponentTheme =
    parentName && lastSegment[0].toUpperCase() === lastSegment[0]
  if (isParentComponentTheme) {
    base.pop() // always remove componentName they can't nest
  }
  const parentBaseTheme = isParentComponentTheme
    ? base.slice(0, base.length).join(THEME_NAME_SEPARATOR)
    : parentName
  const max = base.length
  const min =
    componentName && !nextName
      ? max // component name only don't search upwards
      : 0

  if (process.env.NODE_ENV === 'development' && typeof props.debug === 'string') {
    console.groupCollapsed('ThemeManager.getState()')
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log({
      props,
      parentName,
      parentBaseTheme,
      base,
      min,
      max,
      isParentComponentTheme,
    })
  }

  for (let i = max; i >= min; i--) {
    let prefix = base.slice(0, i).join(THEME_NAME_SEPARATOR)

    if (props.inverse) {
      prefix = inverseThemeName(prefix)
    }
    let potentials: string[] = []

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

    if (componentName) {
      let componentPotentials: string[] = []
      // components only look for component themes
      if (nextName) {
        const beforeSeparator = prefix.slice(0, prefix.indexOf(THEME_NAME_SEPARATOR))
        componentPotentials.push(`${beforeSeparator}_${nextName}_${componentName}`)
      }
      componentPotentials.push(`${prefix}_${componentName}`)
      if (nextName) {
        // do this one and one level up
        const prefixLessOne = base.slice(0, i - 1).join(THEME_NAME_SEPARATOR)
        if (prefixLessOne) {
          const lessSpecific = `${prefixLessOne}_${nextName}_${componentName}`
          componentPotentials.unshift(lessSpecific)
        }
        const moreSpecific = `${prefix}_${nextName}_${componentName}`
        componentPotentials.unshift(moreSpecific)
      }
      potentials = [...componentPotentials, ...potentials, ...allComponentThemes]
    }
    const found = potentials.find((t) => t in themes)

    if (process.env.NODE_ENV === 'development' && typeof props.debug === 'string') {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(' - ', { found, potentials, parentManager })
    }

    if (found) {
      result = {
        name: found,
        theme: themes[found],
        className: isWeb ? getNextThemeClassName(found) : '',
        parentName,
        componentName,
        inverse: props.inverse,
      }
      break
    }
  }

  if (
    process.env.NODE_ENV === 'development' &&
    typeof props.debug === 'string' &&
    typeof window !== 'undefined'
  ) {
    console.warn('ThemeManager.getState():', {
      result,
    })
    console.trace()
    console.groupEnd()
  }

  return result
}

const inverseThemeName = (themeName: string) => {
  return themeName.startsWith('light')
    ? themeName.replace(/^light/, 'dark')
    : themeName.replace(/^dark/, 'light')
}

export function getNonComponentParentManager(themeManager?: ThemeManager | null) {
  // components never inherit from components
  // example <Switch><Switch.Thumb /></Switch>
  // the Switch theme shouldn't be considered parent of Thumb
  let res = themeManager
  let componentThemeNames: string[] = []
  while (res) {
    if (res?.isComponent) {
      componentThemeNames.push(res?.state?.name!)
      res = res.parentManager
    } else {
      break
    }
  }
  return [res || null, componentThemeNames] as const
}
