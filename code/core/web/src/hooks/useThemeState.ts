import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
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

// TODO this will gain memory over time but its not going to be a ton
const states: Map<ID, ThemeState | undefined> = new Map()

globalThis['themeStates'] = states

export const forceUpdateThemes = () => {
  allListeners.forEach((cb) => cb())
}

export const getThemeState = (id: ID) => states.get(id)

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

const hasRenderedOnce = new WeakMap<any, boolean>()

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>
): ThemeState => {
  const { disable } = props
  const id = useId()

  if (process.env.NODE_ENV === 'development' && props.debug) {
    console.info(` · useTheme(${id}) render`)
  }

  if (disable) {
    return {
      id,
      name: 'light',
      theme: getConfig().themes.light,
      inverses: 0,
    }
  }

  const parentId = useContext(ThemeStateContext)

  const subscribe = useCallback(
    (cb: Function) => {
      listenersByParent[parentId] ||= new Set()
      listenersByParent[parentId].add(id)
      allListeners.set(id, cb)
      return () => {
        allListeners.delete(id)
        listenersByParent[parentId].delete(id)
      }
    },
    [parentId]
  )

  const propsKey = getPropsKey(props)

  const getSnapshot = () => {
    return getSnapshotFrom(props, propsKey, isRoot, id, keys, parentId)
  }

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useLayoutEffect(() => {
    if (!propsKey) return
    if (!hasRenderedOnce.has(keys)) {
      hasRenderedOnce.set(keys, true)
      return
    }
    console.warn('now should update children', id)
    scheduleUpdate(id)
  }, [keys, propsKey])

  return state.id === id ? { ...state, isNew: true } : state
}

const getSnapshotFrom = (
  props: UseThemeWithStateProps,
  propsKey: string,
  isRoot = false,
  id: string,
  keys: MutableRefObject<Set<string> | null> | undefined,
  parentId: string,
  onChange?: () => void
): ThemeState => {
  const { themes } = getConfig()
  const lastState = states.get(id)
  const parentState = states.get(parentId)

  const name = !propsKey ? null : getNewThemeName(parentState?.name, props)

  if (process.env.NODE_ENV === 'development' && props.debug) {
    console.info(` · useTheme(${id}) getSnapshot ${name}, parent ${parentState?.id}`)
  }

  if (!name) {
    states.delete(id)
    if (!parentState) throw new Error(`‼️`)
    return parentState
  }

  if (lastState?.name === name) {
    return lastState
  }

  const currentKeys = keys?.current
  const shouldSkipUpdate =
    lastState &&
    parentState?.name === lastState.parentName &&
    !isRoot &&
    (!currentKeys || !currentKeys.size) &&
    // if its a direct scheme, always update
    !validSchemes[name]

  if (shouldSkipUpdate) {
    if (process.env.NODE_ENV === 'development' && props.debug) {
      console.info(` · useTheme(${id}) skip update`)
    }
    return lastState
  }

  const scheme = getScheme(name)
  const parentInverses = parentState?.inverses ?? 0
  const isInverse = parentState && scheme !== parentState.scheme

  const nextState = {
    id,
    name,
    theme: themes[name],
    scheme,
    parentId,
    parentName: parentState?.name,
    inverses: parentInverses + (isInverse ? 1 : 0),
    isInverse,
  } satisfies ThemeState

  if (process.env.NODE_ENV === 'development' && props.debug) {
    console.groupCollapsed(` · useTheme(${id}) ⏭️ ${name}`)
    console.info(nextState)
    console.groupEnd()
  }

  states.set(id, nextState)
  if (isRoot) {
    rootThemeState = nextState
  }

  if (lastState) {
    onChange?.()
  }

  return nextState
}

function scheduleUpdate(id: string) {
  const queue = [id]
  const visited = new Set<string>(queue)

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

  visited.delete(id)
  for (const childId of visited) {
    allListeners.get(childId)?.()
  }
}

const validSchemes = {
  light: 'light',
  dark: 'dark',
} as const

function getScheme(name: string) {
  return validSchemes[name.split('_')[0]]
}

function getNewThemeName(parentName = '', props: UseThemeWithStateProps): string | null {
  if (props.name && props.reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  if (props.reset) {
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

  const subNames = [props.name, props.componentName].filter(Boolean) as string[]

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

  if (found && props.inverse) {
    const scheme = found.split('_')[0]
    found = found.replace(new RegExp(`^${scheme}`), scheme === 'light' ? 'dark' : 'light')
  }

  if (
    found === parentName &&
    // if its a scheme only sub-theme, we always consider it "new" because it likely inverses
    // and we want to avoid reparenting
    !validSchemes[found]
  ) {
    return null
  }

  return found
}

const getPropsKey = (props: ThemeProps) =>
  `${props.name || ''}${props.inverse || ''}${props.reset || ''}${props.forceClassName || ''}`

export const hasThemeUpdatingProps = (props: ThemeProps) =>
  'inverse' in props || 'name' in props || 'reset' in props || 'forceClassName' in props
