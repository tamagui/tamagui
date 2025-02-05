import {
  createContext,
  useContext,
  useId,
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
  isNew?: boolean
  parentId?: ID
  scheme?: 'light' | 'dark'
  inversed?: boolean | 'parent'
}

export const ThemeStateContext = createContext<ID>('')

const listeners = new Set<Function>()

const subscribe = (cb: Function) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

// TODO this will gain memory over time but its not going to be a ton
const states: Map<ID, ThemeState | undefined> = new Map()

export const forceUpdateThemes = () => {
  listeners.forEach((cb) => cb())
}

export const getThemeState = (id: ID) => states.get(id)

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: MutableRefObject<string[] | null>
): ThemeState => {
  const { disable } = props

  if (disable) {
    console.warn('?????')
    // return {

    // }
  }

  const id = useId()
  const parentId = useContext(ThemeStateContext)
  const { themes } = getConfig()

  const getSnapshot = (): ThemeState => {
    const parentState = states.get(parentId)

    const name = getNextThemeName(parentState?.name, props)

    if (!name) {
      if (!parentState) throw new Error(`‼️`)
      return parentState
    }

    const found = states.get(id)
    if (found?.name === name) {
      return found
    }

    const scheme = getScheme(name)
    const parentInversed =
      parentState && (parentState?.inversed || scheme !== parentState?.scheme)
        ? 'parent'
        : undefined

    console.log('wtf', id, props.name, parentState, scheme, parentInversed)

    const nextState = {
      id,
      name,
      theme: themes[name],
      scheme,
      parentId,
      inversed: props.inverse === true ? props.inverse : parentInversed,
    } satisfies ThemeState

    states.set(id, nextState)

    return nextState
  }

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return state.id === id ? { ...state, isNew: true } : state
}

const validSchemes = {
  light: 'light',
  dark: 'dark',
} as const

function getScheme(name: string) {
  return validSchemes[name.split('_')[0]]
}

function getNextThemeName(parentName = '', props: UseThemeWithStateProps): string | null {
  if (props.name && props.reset) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌004`
        : 'Cannot reset and set a new name at the same time.'
    )
  }

  if (!props.componentName && !props.name && !props.inverse && !props.reset) {
    return null
  }

  if (props.reset) {
    if (!parentName) throw new Error(`‼️`)
    const lastPartIndex = parentName.lastIndexOf('_')
    return lastPartIndex <= 0 ? parentName : parentName.slice(lastPartIndex)
  }

  const { themes } = getConfig()
  const parentParts = ['', ...parentName.split('_')]

  // always remove component theme if it exists, we never sub a component theme
  const lastName = parentParts[parentParts.length - 1]
  if (lastName && lastName[0].toLowerCase() !== lastName[0]) {
    parentParts.pop()
  }

  const subNames = [props.name, props.componentName].filter(Boolean) as string[]

  let found: string | null = null

  while (parentParts.length) {
    const base = parentParts.join('_')
    for (const subName of subNames) {
      const potential = base ? `${base}_${subName}` : subName
      if (potential in themes) {
        found = potential
        break
      }
    }
    parentParts.pop()
  }

  if (!found) {
    return null
    // console.error(`not found theme info`, parentName, props, themes)
    // debugger
    // throw new Error(`theme not found!`)
  }

  if (props.inverse) {
    const scheme = found.split('_')[0]
    return found.replace(new RegExp(`^${scheme}`), scheme === 'light' ? 'dark' : 'light')
  }

  return found
}
