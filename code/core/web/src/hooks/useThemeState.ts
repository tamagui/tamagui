import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useSyncExternalStore,
  type MutableRefObject,
} from 'react'
import { getConfig } from '../config'
import type { ThemeParsed, ThemeProps, UseThemeWithStateProps } from '../types'

type ID = string

export type ThemeState = {
  id: ID
  name: string
  theme: ThemeParsed
  inverses: number
  parentName?: string
  isInverse?: boolean
  isNew?: boolean
  parentId?: ID
  scheme?: 'light' | 'dark'
}

export const ThemeStateContext = createContext<ID>('')

const allListeners = new Map<ID, Function>()
const listenersByParent: Record<ID, Set<ID>> = {}
const HasRenderedOnce = new WeakMap<Object, boolean>()
const HadTheme = new WeakMap<Object, boolean>()
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

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>
): ThemeState => {
  const { disable } = props
  const parentId = useContext(ThemeStateContext)

  if (!parentId && !isRoot) {
    throw new Error(`No parent?`)
  }

  if (disable) {
    return (
      states.get(parentId) || {
        id: '',
        name: 'light',
        theme: getConfig().themes.light,
        inverses: 0,
      }
    )
  }

  const id = useId()

  const subscribe = useCallback(
    (cb: Function) => {
      listenersByParent[parentId] ||= new Set()
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

    const needsUpdate =
      isRoot || props.name === 'light' || props.name === 'dark' || props.name === null
        ? true
        : !HasRenderedOnce.get(keys)
          ? true
          : keys?.current?.size
            ? true
            : props.needsUpdate?.()

    // const parentState = states.get(parentId)
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

    if (
      process.env.NODE_ENV === 'development' &&
      props.debug &&
      props.debug !== 'profile'
    ) {
      console.groupCollapsed(` ${id} 🪄 ${rerender}`, local.name, '>', next.name)
      console.info({ props, propsKey, isRoot, parentId, local, next, needsUpdate })
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
    if (
      process.env.NODE_ENV === 'development' &&
      props.debug &&
      props.debug !== 'profile'
    ) {
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
    needsUpdate && (pendingUpdate || lastState?.name !== parentState?.name)
  )

  if (process.env.NODE_ENV === 'development' && debug && debug !== 'profile') {
    const message = ` · useTheme(${id}) => ${name} needsUpdate ${needsUpdate} shouldRerender ${shouldRerender}`
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
      throw new Error(`No theme and no parent?`)
    }

    if (shouldRerender) {
      const updated = { ...(parentState || lastState)! }
      return [true, updated]
    }

    return [false, next]
  }

  const scheme = getScheme(name)
  const parentInverses = parentState?.inverses ?? 0
  const isInverse = parentState && scheme !== parentState.scheme
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

  if (process.env.NODE_ENV === 'development' && debug && debug !== 'profile') {
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

const regexParentScheme = /^(light|dark)_/

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
  { name, reset, componentName, inverse, debug }: UseThemeWithStateProps,
  forceUpdate = false
): string | null {
  if (name && reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  if (reset) {
    if (!parentName) throw new Error(`‼️`)
    const lastPartIndex = parentName.lastIndexOf('_')
    return lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex)
  }

  const { themes } = getConfig()
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

  if (inverse) {
    found ||= parentName
    const scheme = found.split('_')[0]
    found = found.replace(new RegExp(`^${scheme}`), scheme === 'light' ? 'dark' : 'light')
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

const getPropsKey = ({
  name,
  reset,
  inverse,
  forceClassName,
  componentName,
}: ThemeProps) =>
  `${name || ''}${inverse || ''}${reset || ''}${forceClassName || ''}${componentName || ''}`

export const hasThemeUpdatingProps = (props: ThemeProps) =>
  'inverse' in props || 'name' in props || 'reset' in props || 'forceClassName' in props
