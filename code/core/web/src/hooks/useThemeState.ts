import { supportsDynamicColorIOS, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useReducer,
  useRef,
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
import type { ThemeUpdateState } from '../helpers/themeUpdateState'

type ID = string

export const ThemeStateContext = createContext<ID>('')

const allListeners = new Map<ID, Function>()
const listenersByParent: Record<ID, Set<ID>> = {}
const HasRenderedOnce = new WeakMap<object, boolean>()
const HadTheme = new WeakMap<object, boolean>()
const PendingUpdate = new Map<any, boolean | 'force'>()

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

const themeUpdateLayers = new Map<ID, ThemeUpdateState>()
const themeProviderParents = new Map<ID, ID>()

export const getThemeUpdateLayer = (id: ID) => themeUpdateLayers.get(id)
export const getThemeProviderParent = (id: ID) => themeProviderParents.get(id)

export const getThemeProviderChainSizes = () => ({
  layers: themeUpdateLayers.size,
  parents: themeProviderParents.size,
})

const registerThemeProviderChain = (
  id: ID,
  parentId: ID,
  props: UseThemeWithStateProps
) => {
  themeProviderParents.set(id, parentId)
  if (props._themeUpdate) {
    themeUpdateLayers.set(id, props._themeUpdate)
  } else {
    themeUpdateLayers.delete(id)
  }
}

let cacheVersion = 0
const themeNameCache = new Map<string, string | null>()
let themeNameCacheVer = -1

let themes: Record<string, ThemeParsed> | null = null

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

const getThemeBaseName = (name: string) => name.replace(/^(light|dark)_/, '')

const incReducer = (c: number): number => c + 1

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>,
  schemeKeys?: MutableRefObject<Set<string> | null>,
  cascadeOnChange = false,
  optimizeForFirstRender = false
): ThemeState => {
  'use no memo'

  const { disable } = props
  const parentId = useContext(ThemeStateContext)

  if (!parentId && !isRoot) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? `${MISSING_THEME_MESSAGE}\n\nLooked for theme${props.name ? ` "${props.name}"` : ''}, but no parent theme context was found (parentId: ${parentId}).`
        : MISSING_THEME_MESSAGE
    )
  }

  if (disable) {
    return (
      states.get(parentId) || {
        id: '',
        name: 'light',
        theme: getConfig().themes.light,
      }
    )
  }

  const id = useId()
  const propsKey = getPropsKey(props)

  if (cascadeOnChange) {
    registerThemeProviderChain(id, parentId, props)
  }

  const ref = useRef<ThemeStateRef>(null as any)
  const r = (ref.current ||= {
    id,
    parentId,
    props,
    propsKey,
    isRoot,
    keys,
    schemeKeys,
    optimizeForFirstRender,
    renderVersion: 0,
  })
  r.props = props
  r.propsKey = propsKey
  r.isRoot = isRoot
  r.keys = keys
  r.schemeKeys = schemeKeys
  r.parentId = parentId
  r.renderVersion++

  const [, forceUpdate] = useReducer(incReducer, 0)
  const state = getSnapshotImpl(r)
  r.lastSnap = state

  useEffect(() => {
    const renderVersion = r.renderVersion

    if (r.lastSnap && !states.has(r.id)) {
      states.set(r.id, r.lastSnap)
      localStates.set(r.id, r.lastSnap)
    }

    if (cascadeOnChange && !themeProviderParents.has(r.id)) {
      registerThemeProviderChain(r.id, r.parentId, r.props)
    }

    if (r.unsubscribe && r.subscribedParentId !== r.parentId) {
      cleanupThemeSubscription(r)
    }

    if (shouldSubscribeToTheme(r, cascadeOnChange)) {
      if (!r.unsubscribe) {
        const pid = r.parentId
        const sid = r.id
        const cb = (forced?: boolean) => {
          const next = getSnapshotImpl(r)
          if (next !== r.lastSnap) {
            r.lastSnap = next
            if (!forced && r.props.nativeUpdate?.(next)) {
              return
            }
            forceUpdate()
          }
        }

        ;(listenersByParent[pid] ||= new Set()).add(sid)
        allListeners.set(sid, () => {
          const forced = shouldForce
          PendingUpdate.set(sid, forced ? 'force' : true)
          cb(forced)
        })
        r.subscribedParentId = pid
        r.unsubscribe = () => {
          allListeners.delete(sid)
          listenersByParent[pid]?.delete(sid)
          localStates.delete(sid)
          states.delete(sid)
          PendingUpdate.delete(sid)
          r.unsubscribe = undefined
          r.subscribedParentId = undefined
        }
      }
    } else if (r.unsubscribe) {
      cleanupThemeSubscription(r)
    }

    return () => {
      if (r.renderVersion === renderVersion) {
        cleanupThemeState(r)
      }
    }
  })

  if (cascadeOnChange) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      scheduleUpdate(id)
      HadTheme.set(keys, true)
    }, [keys, propsKey])
  }

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
  optimizeForFirstRender: boolean
}

type ThemeStateRef = SnapshotRef & {
  renderVersion: number
  unsubscribe?: () => void
  subscribedParentId?: string
  lastSnap?: ThemeState
}

const shouldSubscribeToTheme = (r: ThemeStateRef, cascadeOnChange: boolean): boolean =>
  Boolean(
    r.optimizeForFirstRender ||
    r.isRoot ||
    cascadeOnChange ||
    hasThemeUpdatingProps(r.props) ||
    r.keys.current?.size ||
    r.props.needsUpdate?.()
  )

function cleanupThemeSubscription(r: ThemeStateRef) {
  r.unsubscribe?.()
}

function cleanupThemeState(r: ThemeStateRef) {
  if (r.unsubscribe) {
    cleanupThemeSubscription(r)
  } else {
    localStates.delete(r.id)
    states.delete(r.id)
    PendingUpdate.delete(r.id)
  }
  themeUpdateLayers.delete(r.id)
  themeProviderParents.delete(r.id)
}

const getSnapshotImpl = (r: SnapshotRef): ThemeState => {
  const {
    id,
    parentId,
    props,
    propsKey,
    isRoot,
    keys,
    schemeKeys,
    optimizeForFirstRender,
  } = r
  let local = localStates.get(id)
  const parentState = states.get(parentId)

  if (local && !PendingUpdate.has(id)) {
    if (
      parentState &&
      (local as any)._parentName === parentState.name &&
      (local as any)._propsKey === propsKey
    ) {
      return local
    }
  }

  const isSchemeOnlyChange =
    !optimizeForFirstRender &&
    process.env.TAMAGUI_TARGET === 'native' &&
    supportsDynamicColorIOS &&
    getSetting('fastSchemeChange') &&
    local &&
    parentState &&
    local.scheme !== parentState.scheme &&
    getThemeBaseName(local.name) === getThemeBaseName(parentState.name)

  const allKeysSchemeOptimized =
    !optimizeForFirstRender &&
    Boolean(keys.current?.size && schemeKeys?.current?.size === keys.current.size)

  const canSkipForSchemeChange = Boolean(isSchemeOnlyChange && allKeysSchemeOptimized)

  const needsUpdate = props.passThrough
    ? false
    : optimizeForFirstRender
      ? true
      : isRoot || props.name === 'light' || props.name === 'dark' || props.name === null
        ? true
        : !HasRenderedOnce.get(keys)
          ? true
          : canSkipForSchemeChange
            ? false
            : keys?.current?.size
              ? true
              : props.needsUpdate?.()

  const [rerender, nextRaw] = getNextState(
    local,
    props,
    propsKey,
    isRoot,
    id,
    parentId,
    needsUpdate,
    PendingUpdate.get(id)
  )

  let next = nextRaw
  if (props._themeUpdate && nextRaw?.theme) {
    const parentTheme = states.get(parentId)?.theme || nextRaw.theme
    const merged = props._themeUpdate.getTheme(parentTheme, nextRaw.name, getConfig())
    if (merged !== nextRaw.theme) {
      next = { ...nextRaw, theme: merged as ThemeParsed }
    }
  }

  PendingUpdate.delete(id)

  if (!local || rerender) {
    local = { ...next }
    localStates.set(id, local)
  }

  if (next !== local) {
    Object.assign(local, next)
    local.id = id
  }
  ;(local as any)._parentName = parentState?.name
  ;(local as any)._propsKey = propsKey
  states.set(id, next)

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
  const parentState = states.get(parentId)

  if (props.passThrough) {
    return [false, lastState || parentState || ({ name: '' } as any)]
  }

  themes ||= getConfig().themes

  const name =
    !propsKey && (!lastState || !lastState.isNew)
      ? null
      : getNewThemeName(
          parentState?.name,
          props,
          pendingUpdate === 'force' ? true : !!needsUpdate
        )
  const isSameAsParent = Boolean(parentState && (!name || name === parentState.name))
  const shouldRerender = Boolean(
    pendingUpdate === 'force' ||
    (needsUpdate && (pendingUpdate || lastState?.name !== parentState?.name))
  )

  if (isSameAsParent) {
    if (!shouldRerender && lastState && lastState.name === parentState!.name) {
      return [false, lastState]
    }
    return [shouldRerender, { ...parentState!, isNew: false }]
  }

  if (!name) {
    const next = lastState ??
      parentState ??
      rootThemeState ?? {
        id,
        name: 'light',
        theme: getConfig().themes.light,
      }

    if (shouldRerender) {
      return [true, { ...(parentState || lastState || next) }]
    }

    return [false, next]
  }

  const scheme = getScheme(name)
  const parentInverses = parentState?.inverses ?? 0
  const isInverse = Boolean(parentState && scheme !== parentState.scheme)
  const inverses = parentInverses + (isInverse ? 1 : 0)

  const nextState: ThemeState = {
    id,
    name,
    theme: themes[name],
    scheme,
    parentId,
    parentName: parentState?.name,
    inverses,
    isInverse,
    isNew: true,
  }

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

  return [!shouldAvoidRerender, nextState]
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
    allListeners.get(childId)?.()
  })
}

const validSchemes = {
  light: 'light',
  dark: 'dark',
} as const

function getScheme(name: string) {
  return validSchemes[name.split('_')[0]]
}

export function getNewThemeName(
  parentName = '',
  props: UseThemeWithStateProps,
  forceUpdate = false
): string | null {
  const { name } = props

  const cacheKey = `${parentName}|${name || ''}|${forceUpdate ? 1 : 0}`
  if (themeNameCacheVer !== cacheVersion) {
    themeNameCache.clear()
    themeNameCacheVer = cacheVersion
  } else {
    const cached = themeNameCache.get(cacheKey)
    if (cached !== undefined) return cached
  }

  const result = resolveThemeName(
    parentName,
    name ?? undefined,
    getConfig().themes,
    forceUpdate
  )
  if (themeNameCache.size >= 10_000) {
    themeNameCache.clear()
  }
  themeNameCache.set(cacheKey, result)
  return result
}

export const getThemeNameCacheSize = () => themeNameCache.size

export function resolveThemeName(
  parentName: string,
  name: string | undefined,
  themes: Record<string, any>,
  forceUpdate = false
): string | null {
  const parentParts = parentName ? parentName.split('_') : []
  let found: string | null = null

  if (name) {
    const nameHasScheme = getScheme(name)
    if (nameHasScheme && name in themes) {
      found = name
    }
    if (!found && !nameHasScheme) {
      for (let i = parentParts.length; i >= 0; i--) {
        const base = parentParts.slice(0, i).join('_')
        const potential = base ? `${base}_${name}` : name
        if (potential in themes) {
          found = potential
          break
        }
      }
    }
  }

  if (!forceUpdate && found === parentName && !validSchemes[found]) {
    return null
  }

  return found
}

const getPropsKey = ({ name, forceClassName, _themeUpdate }: UseThemeWithStateProps) =>
  `${name || ''}${forceClassName || ''}${_themeUpdate?.key || ''}`

export const hasThemeUpdatingProps = (props: UseThemeWithStateProps) =>
  'name' in props || 'forceClassName' in props || '_themeUpdate' in props
