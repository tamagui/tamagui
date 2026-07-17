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
import { getInlineValuesKey, getMergedInlineTheme } from '../helpers/variables'
import { MISSING_THEME_MESSAGE } from '../constants/constants'
import type {
  ThemeParsed,
  ThemeProps,
  ThemeState,
  UseThemeWithStateProps,
} from '../types'

type ID = string

export const ThemeStateContext = createContext<ID>('')

const allListeners = new Map<ID, Function>()
const listenersByParent: Record<ID, Set<ID>> = {}
const HasRenderedOnce = new WeakMap<object, boolean>()
const HadTheme = new WeakMap<object, boolean>()
const PendingUpdate = new Map<any, boolean | 'force'>()

// TODO this will gain memory over time but its not going to be a ton
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

// useReducer-based force-update; cheaper than useSyncExternalStore's internal
// useState+useLayoutEffect+useEffect+useDebugValue chain on Hermes.
const incReducer = (c: number): number => c + 1

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>,
  schemeKeys?: MutableRefObject<Set<string> | null>,
  // when true, install the propsKey-watching useIsomorphicLayoutEffect that
  // schedules descendant updates via listenersByParent[id]. Only <Theme>
  // providers actually push their themeState.id into ThemeStateContext, so
  // only they can have descendants subscribed under their id. Leaf styled
  // components pass false (the default) and save one hook slot per mount.
  // Stable per call-site (rule of hooks satisfied).
  cascadeOnChange = false,
  optimizeForFirstRender = false
): ThemeState => {
  'use no memo'

  const { disable } = props
  const parentId = useContext(ThemeStateContext)

  if (!parentId && !isRoot) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? `${MISSING_THEME_MESSAGE}

Looked for theme${props.name ? ` "${props.name}"` : ''}${props.componentName ? ` (component: ${props.componentName})` : ''}, but no parent theme context was found (parentId: ${parentId}).`
        : MISSING_THEME_MESSAGE
    )
  }

  if (disable) {
    return (
      states.get(parentId) || {
        id: '',
        name: 'light',
        theme: getConfig().themes.light,
        // inverses: 0,
      }
    )
  }

  // useId keeps theme-provider ids tied to the React tree. A process-wide
  // counter can let children observe a provider context id whose matching
  // states Map entry was never populated in multi-root/native surfaces.
  const id = useId()
  const propsKey = getPropsKey(props)

  // stable ref-bag for render inputs and the optional subscription cleanup.
  // lastSnap caches the last getSnapshot result for the subscription bailout.
  const ref = useRef<ThemeStateRef>(null as any)
  if (!ref.current) {
    ref.current = {
      id,
      parentId,
      props,
      propsKey,
      isRoot,
      keys,
      schemeKeys,
      optimizeForFirstRender,
      renderVersion: 0,
    }
  } else {
    // refresh latest values for the stable closures to read
    ref.current.props = props
    ref.current.propsKey = propsKey
    ref.current.isRoot = isRoot
    ref.current.keys = keys
    ref.current.schemeKeys = schemeKeys
    ref.current.parentId = parentId
  }
  ref.current.renderVersion++

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-prep-uses`

  // manual subscription replaces useSyncExternalStore: same granular bailout
  // (getSnapshot returning the same ref → React doesn't re-render), fewer
  // React-internal hook slots on Hermes. We don't need tearing prevention
  // here: theme/media updates are event-driven, not transition-driven, and
  // useReducer in normal mode already gives same-tick batching.
  const [, forceUpdate] = useReducer(incReducer, 0)
  const state = getSnapshotImpl(ref.current)
  ref.current.lastSnap = state

  useEffect(() => {
    const r = ref.current
    const renderVersion = r.renderVersion

    // strict-mode dev double-invokes effects: cleanup runs between the two
    // invocations with no render in between, so the "unchanged renderVersion
    // means unmount" check below false-positives and deletes this component's
    // registered theme state mid-lifecycle. the registry is only re-populated
    // on this component's next render, so until then children resolve a
    // missing parent and fall back to the root theme state (isNew: true) —
    // which flips getThemedChildren to wrap and re-parents/remounts their
    // hosts, losing focus (keyboard dismiss on first Input tap). per react's
    // strict-mode contract, setup restores whatever cleanup tore down.
    if (r.lastSnap && !states.has(r.id)) {
      states.set(r.id, r.lastSnap)
      localStates.set(r.id, r.lastSnap)
    }

    if (r.unsubscribe && r.subscribedParentId !== r.parentId) {
      cleanupThemeSubscription(r)
    }

    if (shouldSubscribeToTheme(r, cascadeOnChange)) {
      if (!r.unsubscribe) {
        const pid = r.parentId
        const sid = r.id
        const cb = () => {
          const next = getSnapshotImpl(r)
          if (next !== r.lastSnap) {
            r.lastSnap = next
            forceUpdate()
          }
        }

        listenersByParent[pid] = listenersByParent[pid] || new Set()
        listenersByParent[pid].add(sid)
        allListeners.set(sid, () => {
          PendingUpdate.set(sid, shouldForce ? 'force' : true)
          cb()
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
      // react runs passive cleanup before the next effect as well as on unmount.
      // a newer render bumps renderVersion before that cleanup, so equality here
      // means this is the final unmount cleanup.
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
          // we're removing the last theme, make sure to notify
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
  r.optimizeForFirstRender ||
  r.isRoot ||
  cascadeOnChange ||
  hasThemeUpdatingProps(r.props) ||
  !!r.keys.current?.size ||
  !!r.props.needsUpdate?.()

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

  // fast path: nothing changed since last snapshot
  if (local && !PendingUpdate.has(id)) {
    if (
      parentState &&
      (local as any)._parentName === parentState.name &&
      (local as any)._propsKey === propsKey
    ) {
      return local
    }
  }

  // check if this is a scheme-only change (light↔dark) where DynamicColorIOS handles it
  const isSchemeOnlyChange =
    !optimizeForFirstRender &&
    process.env.TAMAGUI_TARGET === 'native' &&
    supportsDynamicColorIOS &&
    getSetting('fastSchemeChange') &&
    local &&
    parentState &&
    local.scheme !== parentState.scheme &&
    getThemeBaseName(local.name) === getThemeBaseName(parentState.name)

  let allKeysSchemeOptimized = false
  if (!optimizeForFirstRender) {
    const keysSize = keys.current?.size ?? 0
    const schemeKeysSize = schemeKeys?.current?.size ?? 0
    allKeysSchemeOptimized = schemeKeysSize === keysSize && keysSize > 0
  }

  const canSkipForSchemeChange = !!isSchemeOnlyChange && allKeysSchemeOptimized

  const needsUpdate = props.passThrough
    ? false
    : optimizeForFirstRender
      ? true
      : isRoot || props.name === 'light' || props.name === 'dark' || props.name === null
        ? true
        : !HasRenderedOnce.get(keys)
          ? true
          : canSkipForSchemeChange
            ? false // skip re-render for scheme-only changes with DynamicColorIOS
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

  // <Variables> inline theme layer: swap in the merged theme so descendants
  // (which read states.get(parentId).theme) see the patched values. The base
  // is always the PARENT state's theme, never this state's own theme —
  // getNextState can return our previous (already-merged) state, and merging
  // over own output would keep removed patch keys alive. Merged objects are
  // identity-cached per (base theme, values, scheme) so bailouts stay stable.
  let next = nextRaw
  if (props.inlineValues && nextRaw?.theme) {
    const parentTheme = states.get(parentId)?.theme || nextRaw.theme
    const merged = getMergedInlineTheme(
      parentTheme,
      props.inlineValues,
      nextRaw.scheme,
      getConfig()
    )
    if (merged !== nextRaw.theme) {
      next = { ...nextRaw, theme: merged as ThemeParsed }
    }
  }

  PendingUpdate.delete(id)

  // we always create a new localState for every component
  // that way we can use it to de-opt and avoid renders granularly
  // we always return the localState object in each component
  // the global state (states) should always be up to date with the latest
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
    // parentState can be transiently missing when a consumer renders in a
    // separate sync flush (a portal/Toast viewport, or a native multi-root
    // surface) before its provider has populated the module-level `states` map.
    // that's recoverable — the next render resolves it — so fall back to the
    // root theme (or a light stub) instead of throwing. the "no parent context"
    // throw above still catches a genuinely missing provider. going back to
    // useSyncExternalStore would avoid the race but force every themed node out
    // of concurrent rendering, so we keep the manual store and tolerate the
    // ordering here.
    const next = lastState ??
      parentState ??
      rootThemeState ?? {
        id,
        name: 'light',
        theme: getConfig().themes.light,
      }

    if (shouldRerender) {
      const updated = { ...(parentState || lastState || next)! }
      return [true, updated]
    }

    return [false, next]
  }

  const scheme = getScheme(name)
  const parentInverses = parentState?.inverses ?? 0
  const isInverse = parentState && scheme !== parentState.scheme
  // cumulative from the root: once any level flips scheme, every descendant is
  // considered inverted vs the OS, even sub-themes that match their immediate
  // parent (dark_blue under dark). gates the DynamicColorIOS optimization below.
  const inverses = parentInverses + (isInverse ? 1 : 0)

  const nextState = {
    id,
    name,
    theme: themes[name],
    scheme,
    parentId,
    parentName: parentState?.name,
    inverses,
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

  // we still update the state (not changing identity), that way children can properly resolve the right state
  // but this one wont trigger an update
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
  const { componentName } = props

  if (name && reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  // check cache
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
    // For reset, we need to go back to the grandparent theme
    // If parentName is just a scheme (like "dark" or "light"),
    // we should return the opposite scheme or a default
    const isSchemeOnly = parentName === 'light' || parentName === 'dark'
    if (isSchemeOnly) {
      // If parent is just a scheme, go to the opposite scheme
      const result = parentName === 'light' ? 'dark' : 'light'
      themeNameCache.set(cacheKey, result)
      return result
    }

    // For compound themes like "dark_blue", extract the scheme
    const lastPartIndex = parentName.lastIndexOf('_')
    // parentName will have format light_{name} or dark_{name}
    const name = lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex)
    const scheme = parentName.slice(0, lastPartIndex)
    const result = themes[name] ? name : scheme
    themeNameCache.set(cacheKey, result)
    return result
  }

  const parentParts = parentName.split('_')

  // always remove component theme if it exists, we never sub a component theme
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

  // If name is provided, try it as a standalone theme first (both with and without scheme)
  // This allows explicit theme overrides like:
  // - <Theme name="blue"><Button theme="dark_green"> → finds "dark_green_Button"
  // - <Theme name="blue"><Button theme="green"> → finds "light_green_Button"
  // - <Theme name="blue"><Button theme="green_active"> → finds "light_green_active_Button"
  if (name) {
    // First try the exact name as-is, but only if it already has a scheme prefix
    // This prevents "green" from matching before we try "light_green_Button"
    const nameHasScheme = getScheme(name)

    if (nameHasScheme) {
      // Name has scheme (like "dark_green"), try as-is with priority to component theme
      for (const subName of subNames) {
        if (subName in themes) {
          found = subName
          break
        }
      }
    }

    // If not found and name doesn't have a scheme, try adding parent's scheme
    if (!found && !nameHasScheme) {
      const parentScheme = getScheme(parentName)

      if (parentScheme) {
        // Try progressively shorter parent bases to preserve color context
        // For parent "light_blue_surface1" + name "surface3":
        //   Try: light_blue_surface1_surface3, light_blue_surface3, light_surface3
        // This ensures color context (blue) is preserved before falling back to scheme-only

        // Build list of potential bases from most specific to least specific
        const potentialBases: string[] = []
        for (let i = parentParts.length; i >= 1; i--) {
          potentialBases.push(parentParts.slice(0, i).join('_'))
        }

        outer: for (const base of potentialBases) {
          // Try with componentName first, then without
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

  // If not found, fall back to the original search algorithm combining with parent
  if (!found) {
    // If we're only adding componentName (no explicit name prop), don't backtrack through parent parts
    // This preserves sub-themes like "light_red_surface1" when adding Button component
    if (!name && componentName) {
      // Just try adding component to full parent
      const potential = `${parentParts.join('_')}_${componentName}`
      if (potential in themes) {
        found = potential
      }
      // If not found, don't add component theme - return null to keep parent theme
    } else {
      // Original backtracking search for when explicit name is provided
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
    // if its a scheme only sub-theme, we always consider it "new" because it likely inverses
    // and we want to avoid reparenting
    !validSchemes[found]
  ) {
    themeNameCache.set(cacheKey, null)
    return null
  }

  themeNameCache.set(cacheKey, found)
  return found
}

const getPropsKey = ({
  name,
  reset,
  forceClassName,
  componentName,
  inlineValues,
}: UseThemeWithStateProps) =>
  `${name || ''}${reset || ''}${forceClassName || ''}${componentName || ''}${
    inlineValues ? getInlineValuesKey(inlineValues) : ''
  }`

export const hasThemeUpdatingProps = (props: UseThemeWithStateProps) =>
  'name' in props || 'reset' in props || 'forceClassName' in props ||
  'inlineValues' in props
