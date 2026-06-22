import { supportsDynamicColorIOS, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createContext,
  useContext,
  useId,
  useRef,
  useSyncExternalStore,
  type MutableRefObject,
} from 'react'
import { getConfig, getSetting } from '../config'
import { MISSING_THEME_MESSAGE } from '../constants/constants'
import type {
  ThemeParsed,
  ThemeProps,
  ThemeState,
  UseThemeWithStateProps,
} from '../types'

type ID = string

// The context now carries the resolved ThemeState snapshot directly.
// This is THE moonshot change: components below a <Theme> simply read this
// snapshot via useContext, instead of running their own useSyncExternalStore
// subscription. Theme/media changes are rare; paying a context-driven re-render
// on those rare events is dramatically cheaper than running an external-store
// subscription on every component on every render.
//
// We default to null so the first <Theme _isRoot> can detect "no parent".
export const ThemeStateContext = createContext<ThemeState | null>(null)

const allListeners = new Map<ID, Function>()
// kept for the root Theme: forceUpdateThemes iterates all listeners
const listenersByParent: Record<ID, Set<ID>> = {}
const HasRenderedOnce = new WeakMap<object, boolean>()
const HadTheme = new WeakMap<object, boolean>()
const PendingUpdate = new Map<any, boolean | 'force'>()

// these caches survive for the lifetime of the app and grow only with the
// number of <Theme> instances (typically a handful), not with the number of
// styled components.
const states: Map<ID, ThemeState | undefined> = new Map()
const localStates: Map<ID, ThemeState | undefined> = new Map()

let shouldForce = false
export const forceUpdateThemes = () => {
  cacheVersion++
  shouldForce = true
  allListeners.forEach((cb) => cb())
  shouldForce = false
}

export const getThemeState = (id: ID) => states.get(id)

let cacheVersion = 0

// cache for getNewThemeName - invalidated on cacheVersion change
const themeNameCache = new Map<string, string | null>()
let themeNameCacheVer = -1

let themes: Record<string, ThemeParsed> | null = null

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

// extracts base name without scheme: "light_red_surface1" -> "red_surface1"
const getThemeBaseName = (name: string) => name.replace(/^(light|dark)_/, '')

const EMPTY_KEYS: MutableRefObject<Set<string> | null> = { current: null }

// =====================================================================
// useThemeState — the only entry point. It auto-routes between the
// subscribed path (used by <Theme> instances) and the lightweight
// context-read path (used by every styled component). Differentiator:
// the third arg `keys` is non-empty for <Theme>/useThemeWithState (a real ref
// from caller), and we treat an entry coming from <Theme> as the owner of a
// subscription. Components reach this only through useThemeStateAtComponent
// (below), which short-circuits the subscription entirely.
// =====================================================================

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>,
  schemeKeys?: MutableRefObject<Set<string> | null>
): ThemeState => {
  'use no memo'

  return useThemeStateSubscribed(props, isRoot, keys, schemeKeys)
}

// =====================================================================
// useThemeStateAtComponent — HOT PATH for every styled component render.
//
// Reads the parent ThemeState snapshot from context (microseconds), then
// synchronously derives a component-specific theme if `componentName`
// resolves to a sub-theme like `red_Button`. No useSyncExternalStore,
// no useId, no useRef, no useIsomorphicLayoutEffect.
// =====================================================================
export const useThemeStateAtComponent = (
  props: UseThemeWithStateProps
): ThemeState => {
  'use no memo'

  const { disable, passThrough } = props

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-atc-pre-useContext`
  const parentState = useContext(ThemeStateContext)
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-atc-useContext`

  if (!parentState) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? `${MISSING_THEME_MESSAGE}

Looked for theme${props.name ? ` "${props.name}"` : ''}${props.componentName ? ` (component: ${props.componentName})` : ''}, but no parent theme context was found.`
        : MISSING_THEME_MESSAGE
    )
  }

  if (disable || passThrough) {
    if (process.env.NODE_ENV === 'development' && globalThis.time)
      globalThis.time`theme-atc-passthrough`
    return parentState
  }

  const propsKey = getPropsKey(props)
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-atc-getPropsKey`
  if (!propsKey) {
    // nothing to derive (no name, no reset, no componentName), use parent as-is.
    // <Theme> strips isNew before propagating via context, so parent is already
    // safe to return without allocating.
    if (process.env.NODE_ENV === 'development' && globalThis.time)
      globalThis.time`theme-atc-nopropskey`
    return parentState
  }

  if (!themes) {
    themes = getConfig().themes
  }

  const name = getNewThemeName(parentState.name, props, false)
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-atc-getNewThemeName`
  if (!name || name === parentState.name) {
    if (process.env.NODE_ENV === 'development' && globalThis.time)
      globalThis.time`theme-atc-same-as-parent`
    return parentState
  }

  // synchronous derivation — no subscription, no per-render ref/closure churn
  const scheme = getScheme(name)
  const isInverse = scheme !== parentState.scheme
  const next: ThemeState = {
    id: parentState.id,
    name,
    theme: themes[name],
    scheme,
    parentId: parentState.id,
    parentName: parentState.name,
    isInverse,
    isNew: true,
  }
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-atc-derive`
  return next
}

// =====================================================================
// useThemeStateSubscribed — kept for <Theme>/useThemeWithState callers that
// need the full subscription path (forceUpdateThemes invalidation, key tracking,
// re-render gating). This runs at most a few times per app (once per <Theme>),
// not once per component.
// =====================================================================
export const useThemeStateSubscribed = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>,
  schemeKeys?: MutableRefObject<Set<string> | null>
): ThemeState => {
  'use no memo'

  const { disable } = props
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-pre-useContext`
  const parentState = useContext(ThemeStateContext)
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-useContext`
  const parentId = parentState?.id || ''

  if (!parentState && !isRoot) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? `${MISSING_THEME_MESSAGE}

Looked for theme${props.name ? ` "${props.name}"` : ''}${props.componentName ? ` (component: ${props.componentName})` : ''}, but no parent theme context was found (parentId: ${parentId}).`
        : MISSING_THEME_MESSAGE
    )
  }

  if (disable) {
    return (
      parentState || {
        id: '',
        name: 'light',
        theme: getConfig().themes.light,
      }
    )
  }

  const id = useId()
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-useId`
  const propsKey = getPropsKey(props)
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-getPropsKey`

  // stable ref-bag for both subscribe and getSnapshot closures so we don't
  // re-allocate them per render.
  const ref = useRef<{
    id: string
    parentId: string
    props: UseThemeWithStateProps
    propsKey: string
    isRoot: boolean
    keys: MutableRefObject<Set<string> | null>
    schemeKeys?: MutableRefObject<Set<string> | null>
    subscribe?: (cb: Function) => () => void
    getSnapshot?: () => ThemeState
  }>(null as any)
  if (!ref.current) {
    ref.current = {
      id,
      parentId,
      props,
      propsKey,
      isRoot,
      keys,
      schemeKeys,
    }
  } else {
    ref.current.props = props
    ref.current.propsKey = propsKey
    ref.current.isRoot = isRoot
    ref.current.keys = keys
    ref.current.schemeKeys = schemeKeys
    if (ref.current.id !== id || ref.current.parentId !== parentId) {
      ref.current.id = id
      ref.current.parentId = parentId
      ref.current.subscribe = undefined
    }
  }

  if (!ref.current.subscribe) {
    const r = ref.current
    const pid = r.parentId
    const sid = r.id
    r.subscribe = (cb: Function) => {
      listenersByParent[pid] = listenersByParent[pid] || new Set()
      listenersByParent[pid].add(sid)
      allListeners.set(sid, () => {
        PendingUpdate.set(sid, shouldForce ? 'force' : true)
        cb()
      })
      return () => {
        allListeners.delete(sid)
        listenersByParent[pid]?.delete(sid)
        localStates.delete(sid)
        states.delete(sid)
        PendingUpdate.delete(sid)
      }
    }
    r.getSnapshot = () => getSnapshotImpl(r)
  }
  const subscribe = ref.current.subscribe!
  const getSnapshot = ref.current.getSnapshot!

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-useRef-prep`

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-useSyncExternalStore`

  useIsomorphicLayoutEffect(() => {
    if (!HasRenderedOnce.get(keys)) {
      HasRenderedOnce.set(keys, true)
      return
    }
    if (!propsKey) {
      if (HadTheme.get(keys)) {
        scheduleUpdate(id)
      }
      HadTheme.set(keys, false)
      return
    }
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
      console.warn(` · useTheme(${id}) scheduleUpdate`, propsKey, states.get(id)?.name)
    }
    scheduleUpdate(id)
    HadTheme.set(keys, true)
  }, [keys, propsKey])

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-sub-useIsoLayoutEffect`

  return state
}

type SnapshotRef = {
  id: string
  parentId: string
  props: UseThemeWithStateProps
  propsKey: string
  isRoot: boolean
  keys: MutableRefObject<Set<string> | null>
  schemeKeys?: MutableRefObject<Set<string> | null>
}

const getSnapshotImpl = (r: SnapshotRef): ThemeState => {
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-getSnap-enter`
  const { id, parentId, props, propsKey, isRoot, keys, schemeKeys } = r
  let local = localStates.get(id)
  const parentState = states.get(parentId)

  // fast path: nothing changed since last snapshot
  if (local && !PendingUpdate.has(id)) {
    if (
      parentState &&
      (local as any)._parentName === parentState.name &&
      (local as any)._propsKey === propsKey
    ) {
      if (process.env.NODE_ENV === 'development' && globalThis.time)
        globalThis.time`theme-getSnap-fastpath`
      return local
    }
  }

  const isSchemeOnlyChange =
    process.env.TAMAGUI_TARGET === 'native' &&
    supportsDynamicColorIOS &&
    getSetting('fastSchemeChange') &&
    local &&
    parentState &&
    local.scheme !== parentState.scheme &&
    getThemeBaseName(local.name) === getThemeBaseName(parentState.name)

  const keysSize = keys?.current?.size ?? 0
  const schemeKeysSize = schemeKeys?.current?.size ?? 0
  const allKeysSchemeOptimized = schemeKeysSize === keysSize && keysSize > 0

  const canSkipForSchemeChange = isSchemeOnlyChange && allKeysSchemeOptimized

  const needsUpdate = props.passThrough
    ? false
    : isRoot || props.name === 'light' || props.name === 'dark' || props.name === null
      ? true
      : !HasRenderedOnce.get(keys)
        ? true
        : canSkipForSchemeChange
          ? false
          : keys?.current?.size
            ? true
            : props.needsUpdate?.()

  const [rerender, next] = getNextState(
    local,
    props,
    propsKey,
    isRoot,
    id,
    parentId,
    needsUpdate,
    PendingUpdate.get(id)
  )

  PendingUpdate.delete(id)

  if (!local || rerender) {
    local = { ...next }
    localStates.set(id, local)
  }

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed(` ${id} getSnapshot ${rerender}`, local.name, '>', next.name)
    console.info({
      props,
      propsKey,
      isRoot,
      parentId,
      local,
      next,
      needsUpdate,
      isSchemeOnlyChange,
      allKeysSchemeOptimized,
      canSkipForSchemeChange,
    })
    console.groupEnd()
  }

  if (next !== local) {
    Object.assign(local, next)
    local.id = id
  }
  ;(local as any)._parentName = parentState?.name
  ;(local as any)._propsKey = propsKey
  states.set(id, next)

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-getSnap-slowpath`

  return local
}

const getNextState = (
  lastState: ThemeState | undefined,
  props: UseThemeWithStateProps,
  propsKey: string,
  isRoot = false,
  id: string,
  parentId: string,
  needsUpdate: boolean | undefined,
  pendingUpdate: boolean | 'force' | undefined
): [boolean, ThemeState] => {
  const { debug } = props
  const parentState = states.get(parentId)

  if (props.passThrough) {
    return [false, lastState || parentState || ({ name: '' } as any)]
  }

  if (!themes) {
    themes = getConfig().themes
  }

  const name =
    !propsKey && (!lastState || !lastState?.isNew)
      ? null
      : getNewThemeName(
          parentState?.name,
          props,
          pendingUpdate === 'force' ? true : !!needsUpdate
        )
  const isSameAsParent = parentState && (!name || name === parentState.name)
  const shouldRerender = Boolean(
    pendingUpdate === 'force' ||
    (needsUpdate && (pendingUpdate || lastState?.name !== parentState?.name))
  )

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    const message = ` · useTheme(${id}) getNextState => ${name} needsUpdate ${needsUpdate} shouldRerender ${shouldRerender}`
    if (process.env.TAMAGUI_TARGET === 'native') {
      console.info(message)
    } else {
      console.groupCollapsed(message)
      console.trace({ name, lastState, parentState, props, propsKey, id, isSameAsParent })
      console.groupEnd()
    }
  }

  if (isSameAsParent) {
    if (!shouldRerender && lastState && lastState.name === parentState!.name) {
      return [false, lastState]
    }
    return [shouldRerender, { ...parentState, isNew: false }]
  }

  if (!name) {
    const next = lastState ?? parentState

    if (!next) {
      throw new Error(
        process.env.NODE_ENV === 'development'
          ? `${MISSING_THEME_MESSAGE}

Looked for theme${props.name ? ` "${props.name}"` : ''}${props.componentName ? ` (component: ${props.componentName})` : ''}, but no theme state was resolved (parentId: ${parentId}, id: ${id}).`
          : MISSING_THEME_MESSAGE
      )
    }

    if (shouldRerender) {
      const updated = { ...(parentState || lastState)! }
      return [true, updated]
    }

    return [false, next]
  }

  const scheme = getScheme(name)
  const isInverse = parentState && scheme !== parentState.scheme

  const nextState = {
    id,
    name,
    theme: themes[name],
    scheme,
    parentId,
    parentName: parentState?.name,
    isInverse,
    isNew: true,
  } satisfies ThemeState

  if (isRoot) {
    rootThemeState = nextState
  }

  if (pendingUpdate !== 'force' && lastState && lastState.name === name) {
    return [false, nextState]
  }

  const shouldAvoidRerender =
    pendingUpdate !== 'force' &&
    lastState &&
    !needsUpdate &&
    nextState.name === lastState.name

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.groupCollapsed(
      ` · useTheme(${id}) ⏭️ ${name} shouldAvoidRerender: ${shouldAvoidRerender}`
    )
    console.info({ lastState, needsUpdate, nextState, pendingUpdate })
    console.groupEnd()
  }

  if (shouldAvoidRerender) {
    return [false, nextState]
  }

  return [true, nextState]
}

function scheduleUpdate(id: string) {
  const queue = [id]
  const visited = new Set<string>()

  while (queue.length) {
    const parent = queue.shift()!
    const children = listenersByParent[parent]
    if (children) {
      for (const childId of children) {
        if (!visited.has(childId)) {
          visited.add(childId)
          queue.push(childId)
        }
      }
    }
  }

  visited.forEach((childId) => {
    const cb = allListeners.get(childId)
    cb?.()
  })
}

const validSchemes = {
  light: 'light',
  dark: 'dark',
} as const

function getScheme(name: string) {
  return validSchemes[name.split('_')[0]]
}

function getNewThemeName(
  parentName = '',
  props: UseThemeWithStateProps,
  forceUpdate = false
): string | null {
  const { name, reset } = props
  const componentName = props.unstyled ? undefined : props.componentName

  if (name && reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  const cacheKey = `${parentName}|${name || ''}|${componentName || ''}|${reset ? 1 : 0}|${forceUpdate ? 1 : 0}`
  if (themeNameCacheVer !== cacheVersion) {
    themeNameCache.clear()
    themeNameCacheVer = cacheVersion
  } else {
    const cached = themeNameCache.get(cacheKey)
    if (cached !== undefined) return cached
  }

  const { themes } = getConfig()

  if (reset) {
    const isSchemeOnly = parentName === 'light' || parentName === 'dark'
    if (isSchemeOnly) {
      const result = parentName === 'light' ? 'dark' : 'light'
      themeNameCache.set(cacheKey, result)
      return result
    }

    const lastPartIndex = parentName.lastIndexOf('_')
    const name = lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex)
    const scheme = parentName.slice(0, lastPartIndex)
    const result = themes[name] ? name : scheme
    themeNameCache.set(cacheKey, result)
    return result
  }

  const parentParts = parentName.split('_')

  const lastName = parentParts[parentParts.length - 1]
  if (lastName && lastName[0].toLowerCase() !== lastName[0]) {
    parentParts.pop()
  }

  const subNames = [
    name && componentName ? `${name}_${componentName}` : undefined,
    name,
    componentName,
  ].filter(Boolean) as string[]

  let found: string | null = null

  if (name) {
    const nameHasScheme = getScheme(name)

    if (nameHasScheme) {
      for (const subName of subNames) {
        if (subName in themes) {
          found = subName
          break
        }
      }
    }

    if (!found && !nameHasScheme) {
      const parentScheme = getScheme(parentName)

      if (parentScheme) {
        const potentialBases: string[] = []
        for (let i = parentParts.length; i >= 1; i--) {
          potentialBases.push(parentParts.slice(0, i).join('_'))
        }

        outer: for (const base of potentialBases) {
          const candidates = [
            componentName ? `${base}_${name}_${componentName}` : undefined,
            `${base}_${name}`,
          ].filter(Boolean) as string[]

          for (const potential of candidates) {
            if (potential in themes) {
              found = potential
              break outer
            }
          }
        }
      }
    }
  }

  if (!found) {
    if (!name && componentName) {
      const potential = `${parentParts.join('_')}_${componentName}`
      if (potential in themes) {
        found = potential
      }
    } else {
      const max = parentParts.length

      for (let i = 0; i <= max; i++) {
        const base = (i === 0 ? parentParts : parentParts.slice(0, -i)).join('_')

        for (const subName of subNames) {
          const potential = base ? `${base}_${subName}` : subName

          if (potential in themes) {
            found = potential
            break
          }
        }

        if (found) break
      }
    }
  }

  if (
    !forceUpdate &&
    found === parentName &&
    !validSchemes[found]
  ) {
    themeNameCache.set(cacheKey, null)
    return null
  }

  themeNameCache.set(cacheKey, found)
  return found
}

const getPropsKey = ({ name, reset, forceClassName, componentName }: ThemeProps) =>
  `${name || ''}${reset || ''}${forceClassName || ''}${componentName || ''}`

export const hasThemeUpdatingProps = (props: ThemeProps) =>
  'name' in props || 'reset' in props || 'forceClassName' in props
