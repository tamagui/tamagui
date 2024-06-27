import { isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useRef, useState, useSyncExternalStore } from 'react'

import { getConfig } from '../config'
import { matchMedia } from '../helpers/matchMedia'
import { pseudoDescriptors } from '../helpers/pseudoDescriptors'
import type {
  ComponentContextI,
  DebugProp,
  IsMediaType,
  MediaQueries,
  MediaQueryObject,
  MediaQueryState,
  TamaguiInternalConfig,
  UseMediaState,
} from '../types'
import { getDisableSSR } from './useDisableSSR'

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

const mediaKeyRegex = /\$(platform|theme|group)-/

export const isMediaKey = (key: string): IsMediaType => {
  if (mediaKeys.has(key)) return true
  if (key[0] === '$') {
    const match = key.match(mediaKeyRegex)
    if (match) return match[1] as 'platform' | 'theme' | 'group'
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

type MediaState = {
  prev?: MediaKeysState
  enabled?: boolean
  keys?: Record<string, boolean> | null
}

const States = new WeakMap<any, MediaState>()

export function setMediaShouldUpdate(ref: any, props: MediaState) {
  return States.set(ref, {
    ...(States.get(ref) as any),
    ...props,
  })
}

type UseMediaInternalState = {
  prev: MediaKeysState
  keys?: string[]
}

function subscribe(subscriber: any) {
  listeners.add(subscriber)
  return () => {
    listeners.delete(subscriber)
  }
}

export function useMedia(
  uidIn?: any,
  componentContext?: ComponentContextI,
  debug?: DebugProp
): UseMediaState {
  const uid = uidIn ?? useRef()
  // performance boost to avoid using context twice
  const disableSSR = getDisableSSR(componentContext)
  const initialState = (disableSSR || !isWeb ? mediaState : initState) || {}

  let componentState = States.get(uid)
  if (!componentState) {
    componentState = { prev: initialState }
    States.set(uid, componentState)
  }

  const getSnapshot = () => {
    if (!componentState) {
      return initialState
    }

    const { enabled, keys, prev = initialState } = componentState

    if (enabled === false) {
      return prev
    }

    const testKeys = keys ?? (enabled && keys) ?? null
    const hasntUpdated =
      !testKeys || Object.keys(testKeys).every((key) => mediaState[key] === prev[key])

    if (hasntUpdated) {
      return prev
    }

    componentState.prev = mediaState
    return mediaState
  }

  let state: MediaQueryState

  if (process.env.TAMAGUI_SYNC_MEDIA_QUERY) {
    state = useSyncExternalStore<MediaQueryState>(
      subscribe,
      getSnapshot,
      () => initialState
    )
  } else {
    const [_state, setState] = useState(initialState)
    state = _state

    useIsomorphicLayoutEffect(() => {
      function update() {
        setState(getSnapshot)
      }

      update()

      // fix media getting stuck on first render causing weird issues in dialogs not positioning
      if (!disableSSR) {
        Promise.resolve().then(() => {
          update()
        })
      }

      return subscribe(update)
    }, [])
  }

  return new Proxy(state, {
    get(_, key) {
      if (typeof key === 'string') {
        componentState.keys ||= {}
        componentState.keys[key] = true
        if (process.env.NODE_ENV === 'development' && debug) {
          console.info(`useMedia() TOUCH`, key)
        }
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
