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

export const forceUpdateThemes = () => {
  allListeners.forEach((cb) => cb())
}

export const getThemeState = (id: ID) => states.get(id)

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

const HasRenderedOnce = new WeakMap<any, boolean>()

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys: MutableRefObject<Set<string> | null>
): ThemeState => {
  const { disable } = props
  const id = useId()

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
    [id, parentId, keys]
  )

  const propsKey = getPropsKey(props)

  const getSnapshot = () => {
    return getSnapshotFrom(props, propsKey, isRoot, id, parentId, keys)
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`theme-prep-uses`

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useLayoutEffect(() => {
    if (!propsKey) return
    if (!HasRenderedOnce.has(keys)) {
      HasRenderedOnce.set(keys, true)
      return
    }
    if (
      process.env.NODE_ENV === 'development' &&
      props.debug &&
      props.debug !== 'profile'
    ) {
      console.warn(` · useTheme(${id}) scheduleUpdate`, propsKey)
    }
    scheduleUpdate(id)
  }, [keys, propsKey])

  if (process.env.NODE_ENV === 'development' && props.debug)
    console.info(` useTheme getSnapshot result`, id, state.id)

  return state.id === id ? { ...state, isNew: true } : state
}

// const cache = new Map<string, ThemeState>()
let themes: Record<string, ThemeParsed> | null = null

const getSnapshotFrom = (
  props: UseThemeWithStateProps,
  propsKey: string,
  isRoot = false,
  id: string,
  parentId: string,
  keys: MutableRefObject<Set<string> | null> | undefined
): ThemeState => {
  const hasKeys = keys?.current?.size
  const parentState = states.get(parentId)

  // const cacheKey = `${id}${propsKey}${hasKeys}${parentState?.name || ''}${isRoot}`
  // if (cache.has(cacheKey)) {
  //   return cache.get(cacheKey)!
  // }

  if (!themes) {
    themes = getConfig().themes
  }

  const lastState = states.get(id)

  const name = !propsKey ? null : getNewThemeName(parentState?.name, props)

  if (
    process.env.NODE_ENV === 'development' &&
    props.debug &&
    props.debug !== 'profile'
  ) {
    console.groupCollapsed(
      ` · useTheme(${id}) getSnapshot ${name}, parent ${parentState?.id}`
    )
    console.info({ lastState, parentState, props, propsKey, id, keys })
    console.groupEnd()
  }

  if (!name) {
    if (lastState && !hasKeys) {
      return lastState
    }
    states.set(id, parentState)
    // cache.set(cacheKey, parentState!)
    return parentState!
  }

  if (
    lastState &&
    lastState.name === name &&
    (!parentState || parentState.name === lastState.parentName)
  ) {
    // cache.set(cacheKey, lastState!)
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
    console.groupCollapsed(` · useTheme(${id}) ⏭️ ${name}`)
    console.info('state', nextState)
    console.groupEnd()
  }

  states.set(id, nextState)
  // cache.set(cacheKey, nextState)

  if (isRoot) {
    rootThemeState = nextState
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
  { name, reset, componentName, inverse }: UseThemeWithStateProps
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

  const subNames = [name, componentName].filter(Boolean) as string[]

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
