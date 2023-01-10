import { startTransition, useEffect, useMemo, useSyncExternalStore } from 'react'

import { getConfig } from '../config'
import { createProxy } from '../helpers/createProxy'
import { matchMedia } from '../helpers/matchMedia'
import {
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
  TamaguiInternalConfig,
} from '../types'
import { useSafeRef } from './useSafeRef'

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
export const mediaKeysWithAndWithout$ = new Set<string>()

// for SSR capture it at time of startup
let initState: MediaQueryState
export const getInitialMediaState = () => {
  return (getConfig().disableSSR ? mediaState : initState) || {}
}

let mediaKeysOrdered: string[]
export const getMediaKeyImportance = (key: string) => {
  if (process.env.NODE_ENV === 'development' && key[0] === '$') {
    throw new Error('use short key')
  }
  // + 2 because we set base usedKeys=1 in getSplitStyles and all media go above 1
  return mediaKeysOrdered.indexOf(key) + 2
}

const dispose = new Set<Function>()

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media, mediaQueryDefaultActive } = config
  if (!media) return
  for (const key in media) {
    mediaState[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeysWithAndWithout$.add(key)
    mediaKeysWithAndWithout$.add(`$${key}`)
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
function setupMediaListeners() {
  // avoid setting up more than once per config
  const nextKey = JSON.stringify(mediaQueryConfig)
  if (nextKey === configuredKey) return
  configuredKey = nextKey

  // hmr, undo existing before re-binding
  unlisten()

  for (const key in mediaQueryConfig) {
    const str = mediaObjectToString(mediaQueryConfig[key])
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
  useEffect(() => {
    setupMediaListeners()
  }, [])
}

const currentStateListeners = new Set<any>()
let isFlushing = false

function updateCurrentState() {
  if (isFlushing) return
  isFlushing = true
  setTimeout(() => {
    startTransition(() => {
      currentStateListeners.forEach((cb) => cb(mediaState))
    })
    isFlushing = false
  }, 0)
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
  currentStateListeners.add(subscriber)
  return () => currentStateListeners.delete(subscriber)
}

export function useMedia(uid?: any, debug?: any): UseMediaState {
  const internal = useSafeRef<UseMediaInternalState>(undefined as any)
  if (!internal.current) {
    internal.current = {
      prev: initState,
    }
  }
  const state = useSyncExternalStore<MediaQueryState>(
    subscribe,
    () => {
      const { touched, prev } = internal.current
      const componentState = uid ? shouldUpdate.get(uid) : undefined
      if (componentState?.enabled === false) {
        return prev
      }
      const testKeys =
        componentState?.keys ?? (componentState?.enabled && touched ? [...touched] : [])
      if (testKeys.every((key) => mediaState[key] === prev[key])) {
        return prev
      }

      internal.current.prev = mediaState
      return mediaState
    },
    () => initState
  )

  return useMemo(() => {
    return new Proxy(state, {
      get(_, key) {
        if (typeof key === 'string') {
          internal.current.touched ||= new Set()
          internal.current.touched.add(key)
        }
        return Reflect.get(state, key)
      },
    })
  }, [state])
}

/**
 * Useful for more complex components that need access to the currently active props,
 * accounting for the currently active media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries.
 *
 * */
export function useMediaPropsActive<A extends Object>(
  props: A
): {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
} {
  const media = useMedia()

  return useMemo(() => {
    const next = {} as A
    const importancesUsed = {}
    const propNames = Object.keys(props)

    for (let i = propNames.length - 1; i >= 0; i--) {
      const key = propNames[i]
      const val = props[key]
      if (key[0] === '$') {
        const mediaKey = key.slice(1)
        if (!media[mediaKey]) continue
        if (val && typeof val === 'object') {
          const subKeys = Object.keys(val)
          for (let j = subKeys.length; j--; j >= 0) {
            const subKey = subKeys[j]
            mergeMediaByImportance(next, mediaKey, subKey, val[subKey], importancesUsed)
          }
        }
      } else {
        mergeMediaByImportance(next, '', key, val, importancesUsed)
      }
    }

    return next
  }, [media, props])
}

export const getMediaImportanceIfMoreImportant = (
  mediaKey: string,
  key: string,
  importancesUsed: Record<string, number>
) => {
  const importance = getMediaKeyImportance(mediaKey)
  return !importancesUsed[key] || importance > importancesUsed[key] ? importance : null
}

export function mergeMediaByImportance(
  onto: Record<string, any>,
  mediaKey: string,
  key: string,
  value: any,
  importancesUsed: Record<string, number>
) {
  const importance = getMediaImportanceIfMoreImportant(mediaKey, key, importancesUsed)
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

export function mediaObjectToString(query: string | MediaQueryObject) {
  if (typeof query === 'string') {
    return query
  }
  return Object.entries(query)
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
}
