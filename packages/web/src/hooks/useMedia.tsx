import { isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useRef, useState, useSyncExternalStore } from 'react'

import { getConfig } from '../config'
import { matchMedia } from '../helpers/matchMedia'
import { pseudoDescriptors } from '../helpers/pseudoDescriptors'
import type {
  ComponentContextI,
  IsMediaType,
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
  TamaguiInternalConfig,
  UseMediaState,
} from '../types'
import { getDisableSSR } from './useDisableSSR'
import { useDidHydrateOnce } from './useDidHydrateOnce'

export let mediaState: MediaQueryState =
  // development only safeguard
  process.env.NODE_ENV === 'development'
    ? new Proxy(
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

export const isMediaKey = (key: string): IsMediaType => {
  if (mediaKeys.has(key)) return true
  if (key[0] === '$') {
    if (key.startsWith('$platform-')) return 'platform'
    if (key.startsWith('$theme-')) return 'theme'
    if (key.startsWith('$group-')) return 'group'
  }
  return false
}

// for SSR capture it at time of startup
let initState: MediaQueryState

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

let mediaVersion = 0

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media, mediaQueryDefaultActive } = config
  if (!media) return
  mediaVersion++
  for (const key in media) {
    mediaState[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeys.add(`$${key}`)
  }
  Object.assign(mediaQueryConfig, media)
  initState = { ...mediaState }
  mediaKeysOrdered = Object.keys(media)

  if (config.disableSSR) {
    setupMediaListeners()
  } else {
    updateCurrentState()
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
let setupVersion = -1
export function setupMediaListeners() {
  if (isWeb && isServer) return

  // avoid setting up more than once per config
  if (setupVersion === mediaVersion) return
  setupVersion = mediaVersion

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

const listeners = new Set<any>()
let flushing = false
let flushVersion = -1
function updateCurrentState() {
  // only avoid flush if they haven't re-configured media queries since
  if (flushing && flushVersion === mediaVersion) {
    return
  }
  flushVersion = mediaVersion
  flushing = true
  Promise.resolve().then(() => {
    flushing = false
    listeners.forEach((cb) => cb(mediaState))
  })
}

type MediaKeysState = {
  [key: string]: any
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

function useLayoutExternalStore<State>(
  subscriber,
  getSnapshot,
  getServerSnapshot
): State {
  const hasHydrated = useDidHydrateOnce()
  const [state, setState] = useState(hasHydrated ? mediaState : getServerSnapshot)

  useIsomorphicLayoutEffect(() => {
    function update() {
      setState((prev) => {
        const next = getSnapshot()
        if (next !== prev) {
          return next
        }
        return prev
      })
    }

    update()

    return subscriber(update)
  }, [])

  return state
}

export function useMedia(uid?: any, componentContext?: ComponentContextI): UseMediaState {
  const internal = useRef<UseMediaInternalState | undefined>()
  // performance boost to avoid using context twice
  const disableSSR = getDisableSSR(componentContext)
  const initialState = (disableSSR || !isWeb ? mediaState : initState) || {}

  const state = useLayoutExternalStore<MediaQueryState>(
    subscribe,
    () => {
      if (!internal.current) {
        return mediaState
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
    () => initialState
  )

  return new Proxy(state, {
    get(_, key) {
      if (typeof key === 'string') {
        internal.current ||= { prev: initialState }
        internal.current.touched ||= new Set()
        internal.current.touched.add(key)
      }
      return Reflect.get(state, key)
    },
  })
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
