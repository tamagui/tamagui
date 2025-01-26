import { isClient, isWeb } from '@tamagui/constants'

import { getThemes } from '../config'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from '../constants/constants'
import type { ColorScheme, ThemeParsed, ThemeProps } from '../types'

type ThemeListener = (
  name: string | null,
  themeManager: ThemeManager,
  forced: boolean | 'self'
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
  parentName?: string
  theme?: ThemeParsed | null
  isComponent?: boolean

  // if a theme is fixed to light/dark, we need to track
  // so that dynamiccolorIOS knows its fixed a certain way
  isSchemeFixed?: boolean

  className?: string
  scheme?: ColorScheme
}

const emptyState: ThemeManagerState = { name: '' }

export function getHasThemeUpdatingProps(props: ThemeProps) {
  return Boolean(props.name || props.componentName || props.inverse || props.reset)
}

let uid = 0

export class ThemeManager {
  id = 0
  themeListeners = new Set<ThemeListener>()
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState

  constructor(
    public props: ThemeProps = {},
    parentManager?: ThemeManager | 'root' | null | undefined
  ) {
    uid = (uid + 1) % Number.MAX_VALUE
    this.id = uid

    if (parentManager === 'root') {
      this.updateStateFromProps(props, false)
      return
    }

    if (!parentManager) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(
          `No parent manager given, this is likely due to duplicated Tamagui dependencies. Check your lockfile for mis-matched versions. It could also be from an error somewhere else in your stack causing Tamagui to recieve undefined context, you can try putting some ErrorBoundary components around other areas of your app, or a Suspense boundary.`
        )
      }
      throw `❌ 000`
    }

    // this is used in updateStateFromProps so must be set
    this.parentManager = parentManager

    if (this.updateStateFromProps(props, false)) {
      return
    }

    return parentManager
  }

  updateStateFromProps(
    props: ThemeProps & { forceTheme?: ThemeParsed } = this.props || {},
    shouldNotify = true
  ) {
    this.props = props

    if (props.forceTheme) {
      this.state.theme = props.forceTheme
      this.state.name = props.name || ''
      this.updateState(this.state, true)
      return this.state
    }

    const nextState = this.getStateIfChanged(props)
    if (nextState) {
      this.updateState(nextState, shouldNotify)
      return nextState
    }
  }

  getParents() {
    const parents: ThemeManager[] = []
    let current: ThemeManager | null = this
    while (current) {
      parents.push(current)
      current = current.parentManager
    }
    return parents
  }

  updateState(nextState: ThemeManagerState, shouldNotify = true) {
    this.state = nextState
    this._allKeys = null
    // if (shouldNotify) {
    //   if (process.env.TAMAGUI_TARGET === 'native') {
    //     // native is way slower with queueMicrotask
    //     this.notify()
    //   } else {
    //     // web is way faster this way
    //     queueMicrotask(() => {
    //       this.notify()
    //     })
    //   }
    // }
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
    if (process.env.NODE_ENV !== 'production') {
      this['_numChangeEventsSent'] ??= 0
      this['_numChangeEventsSent']++
    }
  }

  _selfListener?: ThemeListener

  selfUpdate() {
    this._selfListener?.(this.state.name, this, 'self')
  }

  onChangeTheme(cb: ThemeListener, debugId?: number | true) {
    if (process.env.NODE_ENV !== 'production' && debugId) {
      // @ts-ignore
      this._listeningIds ??= new Set()
      // @ts-ignore
      this._listeningIds.add(debugId)
    }

    if (debugId === true) {
      this._selfListener = cb
    }

    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
    }
  }
}

const cache: Record<string, ThemeManagerState | null> = {}

function getState(
  props: ThemeProps,
  manager?: ThemeManager | null
): ThemeManagerState | null {
  if (!getHasThemeUpdatingProps(props)) {
    return null
  }
  const [allManagers] = getManagers(manager)
  const cacheKey = `${props.name || ''}${props.componentName || ''}${props.inverse || ''}${props.reset || ''}${allManagers.map((x) => x?.state.name || '.').join('')}`
  const cached = cache[cacheKey]
  if (!cached) {
    const res = getStateUncached(props, manager)
    cache[cacheKey] = res
    return res
  }
  return cached
}

function getStateUncached(
  props: ThemeProps,
  manager?: ThemeManager | null
): ThemeManagerState | null {
  if (props.name && props.reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  const themes = getThemes()

  const [allManagers, componentManagers] = getManagers(manager)

  const isDirectParentAComponentTheme = !!manager?.state.isComponent
  const startIndex = props.reset && !isDirectParentAComponentTheme ? 1 : 0
  let baseManager = allManagers[startIndex]
  let parentManager = allManagers[startIndex + 1]

  if (!baseManager && props.reset) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Cannot reset, no parent theme exists')
    }
    return null
  }

  const { componentName } = props
  let result: ThemeManagerState | null = null

  let baseName = baseManager?.state.name || ''

  if (baseManager?.state.isComponent) {
    // remove component name
    baseName = baseName.replace(/_[A-Z][A-Za-z]+/, '')
  }

  const nextName = props.reset ? baseName : props.name || ''

  const allComponentThemes = componentManagers.map((x) => x?.state.name || '')
  if (isDirectParentAComponentTheme) {
    allComponentThemes.shift()
  }

  // components look for most specific, fallback upwards
  const base = baseName.split(THEME_NAME_SEPARATOR)
  const max = base.length
  const min =
    props.componentName && !nextName
      ? max // component name only don't search upwards
      : 0

  for (let i = max; i >= min; i--) {
    let prefix = base.slice(0, i).join(THEME_NAME_SEPARATOR)

    if (props.inverse) {
      prefix = inverseThemeName(prefix)
    }

    let potentials: string[] = []

    if (prefix && prefix !== baseName && prefix.includes(nextName)) {
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

    if (componentName && !props.reset) {
      const baseLen = base.length
      let componentPotentials: string[] = []
      // components only look for component themes
      if (nextName && baseLen > 1) {
        const beforeSeparator = base[0]
        componentPotentials.push(`${beforeSeparator}_${nextName}_${componentName}`)
      }
      componentPotentials.push(`${prefix}_${componentName}`)
      if (nextName) {
        // do this one and one level up
        if (i > baseLen) {
          const prefixLessOne = base.slice(0, i - 1).join(THEME_NAME_SEPARATOR)
          if (prefixLessOne) {
            const lessSpecific = `${prefixLessOne}_${nextName}_${componentName}`
            componentPotentials.unshift(lessSpecific)
          }
        }
        const moreSpecific = `${prefix}_${nextName}_${componentName}`
        componentPotentials.unshift(moreSpecific)
      }

      potentials = [...componentPotentials, ...potentials, ...allComponentThemes]
    }

    const found = potentials.find((t) => t in themes)

    if (
      process.env.NODE_ENV !== 'production' &&
      typeof props.debug === 'string' &&
      isClient
    ) {
      console.info(` 🔷 [${manager?.id}] getState`, {
        props,
        found,
        potentials,
        baseManager,
        nextName,
        baseName,
        prefix,
      })
    }

    if (found) {
      const names = found.split('_')
      const [firstName, ...restNames] = names
      const lastName = names[names.length - 1]
      const isComponent = lastName[0] === lastName[0].toUpperCase()
      const scheme =
        firstName === 'light' ? 'light' : firstName === 'dark' ? 'dark' : undefined
      const pre = THEME_CLASSNAME_PREFIX
      const className = !isWeb
        ? ''
        : `${pre}sub_theme ${pre}${
            !scheme || !restNames.length ? firstName : restNames.join('_')
          }`

      // because its a new theme the baseManager is now the parent
      const parentState = (baseManager || parentManager)?.state
      const parentName = parentState?.name

      result = {
        name: found,
        parentName,
        theme: themes[found],
        className,
        isComponent,
        isSchemeFixed: props.name === 'light' || props.name === 'dark',
        scheme,
      }

      break
    }
  }

  if (process.env.NODE_ENV !== 'production' && props.debug === 'verbose' && isClient) {
    console.groupCollapsed('ThemeManager.getState()')
    console.info({ props, baseName, base, min, max })
    console.warn('result', { result })
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

type MaybeThemeManager = ThemeManager | undefined

// components never inherit from components
// example <Switch><Switch.Thumb /></Switch>
// the Switch theme shouldn't be considered parent of Thumb
export function getManagers(themeManager?: ThemeManager | null) {
  const comp: MaybeThemeManager[] = []
  const all: MaybeThemeManager[] = []
  let cur = themeManager
  while (cur) {
    all.push(cur)
    if (cur.state.isComponent) {
      comp.push(cur)
    }
    cur = cur.parentManager
  }
  return [all, comp] as const
}
