import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useSyncExternalStore,
  type MutableRefObject,
} from 'react'
import { getConfig } from '../config'
import type { ThemeParsed, UseThemeWithStateProps } from '../types'

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
  console.warn('UPDATE')
}

export const getThemeState = (id: ID) => states.get(id)

let rootThemeState: ThemeState | null = null
export const getRootThemeState = () => rootThemeState

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: MutableRefObject<Set<string> | null>
): ThemeState => {
  const { disable } = props
  const id = useId()

  if (process.env.NODE_ENV === 'development' && props.debug) {
    console.info(` · useTheme(${id}) render`)
  }

  const { themes } = getConfig()

  if (disable) {
    return {
      id,
      name: 'light',
      theme: themes.light,
      inverses: 0,
    }
  }

  const parentId = useContext(ThemeStateContext)
  const propsKey = `${props.componentName || ''}${props.name || ''}${props.inverse || ''}${props.reset || ''}`

  // useLayoutEffect(() => {
  //   if (!propsKey) return
  //   if (process.env.NODE_ENV === 'development' && props.debug) {
  //     console.info(` · useTheme(${id}) new props detected ${propsKey}`)
  //   }
  //   allListeners.get(id)?.()
  // }, [id, propsKey])

  const getSnapshot = (): ThemeState => {
    const currentKeys = keys?.current
    const lastState = states.get(id)
    const parentState = states.get(parentId)

    const name = getNewThemeName(parentState?.name, propsKey, props)

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

    const shouldSkipUpdate =
      lastState &&
      parentState?.name === lastState.parentName &&
      !isRoot &&
      (!currentKeys || !currentKeys.size)

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
      notifyChildren(id)
    }

    return nextState
  }

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

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return state.id === id ? { ...state, isNew: true } : state
}

function notifyChildren(id: string) {
  const children = listenersByParent[id]
  children?.forEach((id) => {
    allListeners.get(id)?.()
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
  propsKey: string,
  props: UseThemeWithStateProps
): string | null {
  if (props.name && props.reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  if (!propsKey) {
    return null
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

  if (found === parentName) {
    return null
  }

  return found
}
