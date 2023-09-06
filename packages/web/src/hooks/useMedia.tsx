import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useMemo, useRef, useSyncExternalStore } from 'react'

import { getConfig, getToken } from '../config'
import { Variable } from '../createVariable'
import { createProxy } from '../helpers/createProxy'
import { matchMedia } from '../helpers/matchMedia'
import { getTokenForKey } from '../helpers/propMapper'
import { pseudoDescriptors } from '../helpers/pseudoDescriptors'
import type {
  GetStyleState,
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
  ResolveVariableAs,
  TamaguiInternalConfig,
  VariableVal,
} from '../types'
import { ThemeGettable, UseThemeResult, useTheme } from './useTheme'

export let mediaState: MediaQueryState =
  // development only safeguard
  process.env.NODE_ENV === 'development'
    ? createProxy(
        {},
        {
          get(target, key) {
            if (
              typeof key === 'string' &&
              key[0] === '$' &&
              // dont error on $$typeof
              key[1] !== '$'
            ) {
              throw new Error(`Access mediaState should not use "$": ${key}`)
            }
            return Reflect.get(target, key)
          },
        }
      )
    : ({} as any)

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => mediaState

export const mediaKeys = new Set<string>() // with $ prefix

export const isMediaKey = (key: string) =>
  mediaKeys.has(key) ||
  (key[0] === '$' &&
    (key.startsWith('$platform-') ||
      key.startsWith('$theme-') ||
      key.startsWith('$group-')))

// for SSR capture it at time of startup
let initState: MediaQueryState
export const getInitialMediaState = () => {
  return (getConfig().disableSSR ? mediaState : initState) || {}
}

// media always above pseudos
const defaultMediaImportance = Object.keys(pseudoDescriptors).length

let mediaKeysOrdered: string[]

export const getMediaKeyImportance = (key: string) => {
  if (process.env.NODE_ENV === 'development' && key[0] === '$') {
    throw new Error('use short key')
  }

  const conf = getConfig()
  if (conf.settings.mediaPropOrder) {
    return defaultMediaImportance
  }

  // + 100 because we set base usedKeys=1, pseudos are 2-N (however many we have)
  // all media go above all pseudos so we need to pad it based on that
  // right now theres 5 pseudos but in the future could be a few more
  return mediaKeysOrdered.indexOf(key) + 100
}

const dispose = new Set<Function>()

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media, mediaQueryDefaultActive } = config
  if (!media) return
  for (const key in media) {
    mediaState[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeys.add(`$${key}`)
  }
  Object.assign(mediaQueryConfig, media)
  initState = { ...mediaState }
  updateCurrentState()
  mediaKeysOrdered = Object.keys(media)
  if (config.disableSSR) {
    setupMediaListeners()
  }
}

function unlisten() {
  dispose.forEach((cb) => cb())
  dispose.clear()
}

/**
 * Note: This should *not* set the state on the first render!
 * Because to avoid hydration issues SSR must match the server
 * *and then* re-render with the actual media query state.
 */
let configuredKey = ''
export function setupMediaListeners() {
  // avoid setting up more than once per config
  const nextKey = JSON.stringify(mediaQueryConfig)
  if (nextKey === configuredKey) return
  configuredKey = nextKey

  // hmr, undo existing before re-binding
  unlisten()

  for (const key in mediaQueryConfig) {
    const str = mediaObjectToString(mediaQueryConfig[key], key)
    const getMatch = () => matchMedia(str)
    const match = getMatch()
    if (!match) {
      throw new Error('⚠️ No match')
    }
    // react native needs these deprecated apis for now
    match.addListener(update)
    dispose.add(() => {
      match.removeListener(update)
    })

    update()

    function update() {
      const next = !!getMatch().matches
      if (next === mediaState[key]) return
      mediaState = { ...mediaState, [key]: next }
      updateCurrentState()
    }
  }
}

export function useMediaListeners(config: TamaguiInternalConfig) {
  if (config.disableSSR) return

  useIsomorphicLayoutEffect(() => {
    setupMediaListeners()
  }, [])
}

const listeners = new Set<any>()
let flushing = false
function updateCurrentState() {
  if (flushing) return
  flushing = true
  Promise.resolve().then(() => {
    flushing = false
    listeners.forEach((cb) => cb(mediaState))
  })
}

type MediaKeysState = {
  [key: string]: any
}

type UseMediaState = {
  [key in MediaQueryKey]: boolean
}

type UpdateState = {
  enabled: boolean
  keys: MediaQueryKey[]
}

const shouldUpdate = new WeakMap<any, UpdateState>()

export function setMediaShouldUpdate(ref: any, props: UpdateState) {
  return shouldUpdate.set(ref, props)
}

type UseMediaInternalState = {
  prev: MediaKeysState
  touched?: Set<string>
}

function subscribe(subscriber: any) {
  listeners.add(subscriber)
  return () => listeners.delete(subscriber)
}

export function useMedia(uid?: any): UseMediaState {
  const internal = useRef<UseMediaInternalState | undefined>()

  const state = useSyncExternalStore<MediaQueryState>(
    subscribe,
    () => {
      if (!internal.current) {
        return initState
      }

      const { touched, prev } = internal.current
      const componentState = uid ? shouldUpdate.get(uid) : undefined

      if (componentState && componentState.enabled === false) {
        return prev
      }

      const testKeys =
        componentState?.keys ??
        ((!componentState || componentState.enabled) && touched ? [...touched] : null)

      const hasntUpdated =
        !testKeys || testKeys?.every((key) => mediaState[key] === prev[key])

      if (hasntUpdated) {
        return prev
      }

      internal.current.prev = mediaState

      return mediaState
    },
    () => initState
  )

  return new Proxy(state, {
    get(_, key) {
      if (typeof key === 'string') {
        internal.current ||= { prev: initState }
        internal.current.touched ||= new Set()
        internal.current.touched.add(key)
      }
      return Reflect.get(state, key)
    },
  })
}

/**
 *
 * @deprecated use useProps instead which is the same but also expands shorthands (which you can disable)
 *
 * Useful for more complex components that need access to the currently active props,
 * accounting for the currently active media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries.
 *
 * */
export function useMediaPropsActive<A extends Object>(
  props: A,
  opts?: {
    expandShorthands?: boolean
    resolveValues?: ResolveVariableAs
  }
): {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
} {
  const media = useMedia()
  const resolveAs = opts?.resolveValues || 'none'
  const theme = resolveAs ? useTheme() : null
  const styleState = { theme } as Partial<GetStyleState>
  const shouldExpandShorthands = opts?.expandShorthands

  return useMemo(() => {
    const config = getConfig()
    const next = {} as A
    const importancesUsed = {}
    const propNames = Object.keys(props)
    const len = propNames.length

    for (let i = 0; i < len; i++) {
      let key = propNames[i]
      const val = props[key]
      if (key[0] === '$') {
        const mediaKey = key.slice(1)
        if (!media[mediaKey]) continue
        if (val && typeof val === 'object') {
          const subKeys = Object.keys(val)
          for (let j = subKeys.length; j--; j >= 0) {
            let subKey = subKeys[j]
            const value = getTokenForKey(subKey, val[subKey], resolveAs, styleState)
            if (shouldExpandShorthands) {
              subKey = config.shorthands[subKey] || subKey
            }
            mergeMediaByImportance(next, mediaKey, subKey, value, importancesUsed, true)
          }
        }
      } else {
        if (shouldExpandShorthands) {
          key = config.shorthands[key] || key
        }
        mergeMediaByImportance(
          next,
          '',
          key,
          getTokenForKey(key, val, resolveAs, styleState),
          importancesUsed,
          true
        )
      }
    }

    return next
  }, [media, props, theme, resolveAs])
}

export const getMediaImportanceIfMoreImportant = (
  mediaKey: string,
  key: string,
  importancesUsed: Record<string, number>,
  isSizeMedia: boolean
) => {
  const conf = getConfig()
  const importance =
    isSizeMedia && !conf.settings.mediaPropOrder
      ? getMediaKeyImportance(mediaKey)
      : defaultMediaImportance
  return !importancesUsed[key] || importance > importancesUsed[key] ? importance : null
}

export function mergeMediaByImportance(
  onto: Record<string, any>,
  mediaKey: string,
  key: string,
  value: any,
  importancesUsed: Record<string, number>,
  isSizeMedia: boolean,
  importanceBump?: number
) {
  let importance = getMediaImportanceIfMoreImportant(
    mediaKey,
    key,
    importancesUsed,
    isSizeMedia
  )
  if (importanceBump) {
    importance = (importance || 0) + importanceBump
  }
  if (importance === null) {
    return false
  }
  importancesUsed[key] = importance
  onto[key] = value
  return true
}

function camelToHyphen(str: string) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()
}

const cache = new WeakMap<any, string>()
const cachedMediaKeyToQuery: Record<string, string> = {}

export function mediaObjectToString(query: string | MediaQueryObject, key?: string) {
  if (typeof query === 'string') {
    return query
  }
  if (cache.has(query)) {
    return cache.get(query)!
  }
  const res = Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'string') {
        return `(${feature}: ${value})`
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
  if (key) {
    cachedMediaKeyToQuery[key] = res
  }
  cache.set(query, res)
  return res
}

export function mediaKeyToQuery(key: string) {
  return cachedMediaKeyToQuery[key] || mediaObjectToString(mediaQueryConfig[key], key)
}

export function mediaKeyMatch(
  key: string,
  dimensions: { width: number; height: number }
) {
  const mediaQueries = mediaQueryConfig[key]
  const result = Object.keys(mediaQueries).every((query) => {
    const expectedVal = +mediaQueries[query]
    const isMax = query.startsWith('max')
    const isWidth = query.endsWith('Width')
    const givenVal = dimensions[isWidth ? 'width' : 'height']
    // if not max then min
    return isMax ? givenVal < expectedVal : givenVal > expectedVal
  })
  return result
}
