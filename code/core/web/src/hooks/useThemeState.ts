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
}

export const ThemeStateContext = createContext<ID>('')

const listeners = new Set<Function>()

const subscribe = (cb: Function) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const states: Record<ID, ThemeState | undefined> = {}

export const forceUpdateThemes = () => {
  listeners.forEach((cb) => cb())
}

export const getThemeState = (id: ID) => states[id]

export const useThemeState = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: MutableRefObject<string[] | null>
): ThemeState => {
  const { disable } = props
  const id = useId()
  const parentId = useContext(ThemeStateContext)
  const { themes } = getConfig()

  const getSnapshot = (): ThemeState => {
    const parentState = states[parentId]
    const name = getNextThemeName(parentState?.name, props)

    console.log('GOT', props, name)

    if (!name) {
      if (!parentState) throw new Error(`‼️`)
      return parentState
    }

    if (states[id]?.name === name) {
      return states[id]!
    }

    const nextState = {
      id,
      name,
      theme: themes[name],
      scheme: getScheme(name),
      parentId,
    } satisfies ThemeState

    states[id] = nextState

    return {
      ...nextState,
      isNew: true,
    }
  }

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
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
  const parentParts = parentName.split('_')

  // always remove component theme if it exists, we never sub a component theme
  const lastName = parentParts[parentParts.length - 1]
  if (lastName && lastName[0].toLowerCase() === lastName[0]) {
    parentParts.pop()
  }

  const subNames = [props.name, props.componentName].filter(Boolean)

  let found = parentName

  while (parentParts.length) {
    const base = parentParts.join('_')
    for (const subName of subNames) {
      const potential = `${base}_${subName}`
      if (potential in themes) {
        found = potential
        break
      }
    }
  }

  if (props.inverse) {
    const scheme = found.split('_')[0]
    return found.replace(new RegExp(`^${scheme}`), scheme === 'light' ? 'dark' : 'light')
  }

  console.warn(`theme not found!`, parentName, props)
  return found
}
