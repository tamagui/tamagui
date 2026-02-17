import { isIos } from '@tamagui/constants'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createContext,
  useCallback,
  useContext,
  useId,
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
}

export const getThemeState = (id: ID) => states.get(id)

// const cache = new Map<string, ThemeState>()
let cacheVersion = 0

let themes: Record<string, ThemeParsed> | null = null

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

// extracts base name without scheme: "light_red_surface1" -> "red_surface1"
const getThemeBaseName = (name: string) => name.replace(/^(light|dark)_/, '')

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>,
  schemeKeys?: MutableRefObject<Set<string> | null>
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

  const id = useId()
  const subscribe = useCallback(
    (cb: Function) => {
      listenersByParent[parentId] = listenersByParent[parentId] || new Set()
      listenersByParent[parentId].add(id)
      allListeners.set(id, () => {
        PendingUpdate.set(id, shouldForce ? 'force' : true)
        cb()
      })
      return () => {
        allListeners.delete(id)
        listenersByParent[parentId].delete(id)
        localStates.delete(id)
        states.delete(id)
        PendingUpdate.delete(id)
      }
    },
    [id, parentId]
  )

  const propsKey = getPropsKey(props)

  const getSnapshot = () => {
    let local = localStates.get(id)
    const parentState = states.get(parentId)

    // check if this is a scheme-only change (light↔dark) where DynamicColorIOS handles it
    const isSchemeOnlyChange =
      process.env.TAMAGUI_TARGET === 'native' &&
      isIos &&
      getSetting('fastSchemeChange') &&
      local &&
      parentState &&
      local.scheme !== parentState.scheme &&
      getThemeBaseName(local.name) === getThemeBaseName(parentState.name)

    // all tracked keys are scheme-optimized = can skip re-render for scheme changes
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
            ? false // skip re-render for scheme-only changes with DynamicColorIOS
            : keys?.current?.size
              ? true
              : props.needsUpdate?.()

    // const cacheKey = `${cacheVersion}${id}${propsKey}${parentState?.name || ''}${isRoot}`
    // if (!needsUpdate) {
    //   if (cache.has(cacheKey)) {
    //     return cache.get(cacheKey)!
    //   }
    // }

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

    Object.assign(local, next)
    local.id = id
    states.set(id, next)

    return local
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-prep-uses`

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

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

  return state
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
  // const parentInverses = parentState?.inverses ?? 0
  const isInverse = parentState && scheme !== parentState.scheme
  // const inverses = parentInverses + (isInverse ? 1 : 0)

  const nextState = {
    id,
    name,
    theme: themes[name],
    scheme,
    parentId,
    parentName: parentState?.name,
    // inverses,
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
  const componentName = props.unstyled ? undefined : props.componentName

  if (name && reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  const { themes } = getConfig()

  if (reset) {
    // For reset, we need to go back to the grandparent theme
    // If parentName is just a scheme (like "dark" or "light"),
    // we should return the opposite scheme or a default
    const isSchemeOnly = parentName === 'light' || parentName === 'dark'
    if (isSchemeOnly) {
      // If parent is just a scheme, go to the opposite scheme
      return parentName === 'light' ? 'dark' : 'light'
    }

    // For compound themes like "dark_blue", extract the scheme
    const lastPartIndex = parentName.lastIndexOf('_')
    // parentName will have format light_{name} or dark_{name}
    const name = lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex)
    const scheme = parentName.slice(0, lastPartIndex)
    const result = themes[name] ? name : scheme
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
    return null
  }

  return found
}

const getPropsKey = ({ name, reset, forceClassName, componentName }: ThemeProps) =>
  `${name || ''}${reset || ''}${forceClassName || ''}${componentName || ''}`

export const hasThemeUpdatingProps = (props: ThemeProps) =>
  'name' in props || 'reset' in props || 'forceClassName' in props
