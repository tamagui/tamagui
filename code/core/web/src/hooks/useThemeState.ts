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

export const keysToId = new WeakMap()

const allListeners = new Map<ID, Function>()
const listenersByParent: Record<ID, Set<ID>> = {}
const hasRenderedOnce = new WeakMap<any, boolean>()
const pendingUpdate = new Map<any, boolean>()

// TODO this will gain memory over time but its not going to be a ton
const states: Map<ID, ThemeState | undefined> = new Map()

export const forceUpdateThemes = () => {
  allListeners.forEach((cb) => cb())
}

export const getThemeState = (id: ID) => states.get(id)

const cache = new Map<string, ThemeState>()
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
        pendingUpdate.set(id, true)
        cb()
      })
      return () => {
        allListeners.delete(id)
        listenersByParent[parentId].delete(id)
      }
    },
    [id, parentId]
  )

  const propsKey = getPropsKey(props)

  const getSnapshot = () => {
    const last = states.get(id)
    const needsUpdate =
      props.name === 'light' || props.name === 'dark'
        ? true
        : !hasRenderedOnce.get(keys)
          ? true
          : keys?.current?.size
            ? true
            : props.needsUpdate?.()

    const parentState = states.get(parentId)
    const cacheKey = `${id}${propsKey}${parentState?.name || ''}${isRoot}`

    if (!needsUpdate) {
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!
      }
    }

    const next = getSnapshotFrom(
      last,
      props,
      propsKey,
      isRoot,
      id,
      parentId,
      needsUpdate,
      pendingUpdate.get(id)
    )

    if (last !== next) {
      pendingUpdate.delete(id)
      states.set(id, next)
      cache.set(id, next)
      if (
        process.env.NODE_ENV === 'development' &&
        props.debug &&
        props.debug !== 'profile'
      ) {
        console.warn(` · useTheme(${id}) UPDATE from`, last, 'to', next)
      }
    }

    return next
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-prep-uses`

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useIsomorphicLayoutEffect(() => {
    if (!hasRenderedOnce.get(keys)) {
      hasRenderedOnce.set(keys, true)
      return
    }
    if (!propsKey) return
    if (
      process.env.NODE_ENV === 'development' &&
      props.debug &&
      props.debug !== 'profile'
    ) {
      console.warn(` · useTheme(${id}) scheduleUpdate`, propsKey, states.get(id)?.name)
    }
    scheduleUpdate(id)
  }, [keys, propsKey])

  return state.id === id ? { ...state, isNew: true } : state
}

const getSnapshotFrom = (
  lastState: ThemeState | undefined,
  props: UseThemeWithStateProps,
  propsKey: string,
  isRoot = false,
  id: string,
  parentId: string,
  needsUpdate: boolean | undefined,
  pendingUpdate = false
): ThemeState => {
  const parentState = states.get(parentId)

  if (!themes) {
    themes = getConfig().themes
  }

  const name = !propsKey ? null : getNewThemeName(parentState?.name, props, !!needsUpdate)

  const isSameAsParent = !name && propsKey // name = null if matching parent and has props

  if (
    process.env.NODE_ENV === 'development' &&
    props.debug &&
    props.debug !== 'profile'
  ) {
    const message = ` · useTheme(${id}) snapshot ${name}, parent ${parentState?.id} needsUpdate ${needsUpdate}`
    if (process.env.TAMAGUI_TARGET === 'native') {
      console.info(message)
    } else {
      console.groupCollapsed(message)
      console.trace({ name, lastState, parentState, props, propsKey, id, isSameAsParent })
      console.groupEnd()
    }
  }

  if (parentState && isSameAsParent) {
    return parentState
  }

  if (!name) {
    const next = lastState ?? parentState!

    if (needsUpdate && pendingUpdate) {
      const updated = { ...(parentState || lastState)! }
      return updated
    }

    return next
  }

  if (lastState && lastState.name === name) {
    return lastState
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
  } satisfies ThemeState

  if (
    process.env.NODE_ENV === 'development' &&
    props.debug &&
    props.debug !== 'profile'
  ) {
    console.groupCollapsed(` · useTheme(${id}) ⏭️2 ${name}`)
    console.info('state', nextState)
    console.groupEnd()
  }

  if (isRoot) {
    rootThemeState = nextState
  }

  // we still update the state (not changing identity), that way children can properly resolve the right state
  // but this one wont trigger an update
  if (lastState && !needsUpdate) {
    Object.assign(lastState, nextState)
    return lastState
  }

  return nextState
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
  { name, reset, componentName, inverse }: UseThemeWithStateProps,
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

  if (found && inverse) {
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
