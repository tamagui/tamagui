import { isServer, isWeb } from '@tamagui/constants'
import { useEffect, useReducer, useRef } from 'react'
import { getSetting } from '../config'
import { resetMediaStyleCache } from '../helpers/createMediaStyle'
import { matchMedia } from '../helpers/matchMedia'
import { mediaObjectToString } from '../helpers/mediaObjectToString'
import {
  getMedia,
  mediaKeys,
  mediaQueryConfig,
  setMediaState,
} from '../helpers/mediaState'
import type {
  ComponentContextI,
  DebugProp,
  GetStyleState,
  IsMediaType,
  MediaQueryState,
  TamaguiInternalConfig,
  UseMediaState,
  WidthHeight,
} from '../types'
import { defaultMediaImportance } from '../helpers/pseudoDescriptors'

const mediaKeyRegex = /\$(platform|theme|group)-/

export const isMediaKey = (key: string): boolean => {
  if (key[0] !== '$') return false
  if (mediaKeys.has(key)) return true
  if (mediaKeyRegex.test(key)) return true
  return false
}

export const getMediaKey = (key: string): IsMediaType => {
  if (key[0] !== '$') return false
  if (mediaKeys.has(key)) return true
  const match = key.match(mediaKeyRegex)
  if (match) return match[1] as 'platform' | 'theme' | 'group'
  return false
}

// for SSR capture it at time of startup
let initState: MediaQueryState

let mediaKeysOrdered: string[]

export const getMediaKeyImportance = (key: string) => {
  if (process.env.NODE_ENV === 'development' && key[0] === '$') {
    throw new Error('use short key')
  }

  // + 100 because we set base usedKeys=1, pseudos are 2-N (however many we have)
  // all media go above all pseudos so we need to pad it based on that
  // right now theres 5 pseudos but in the future could be a few more
  return mediaKeysOrdered.indexOf(key) + 100
}

const dispose = new Set<Function>()

let mediaVersion = 0

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media } = config
  const mediaQueryDefaultActive = getSetting('mediaQueryDefaultActive')
  if (!media) return
  mediaVersion++
  // reset cached media style prefixes/selectors so they get recalculated with new key order
  resetMediaStyleCache()
  // touch-tracker getter object depends on the current media key set
  resetMediaTouchTracker()
  for (const key in media) {
    getMedia()[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeys.add(`$${key}`)
  }
  Object.assign(mediaQueryConfig, media)
  initState = { ...getMedia() }
  mediaKeysOrdered = Object.keys(media)
  setupMediaListeners()
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
  if (process.env.IS_STATIC) return

  // avoid setting up more than once per config
  if (setupVersion === mediaVersion) return
  setupVersion = mediaVersion

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

    function update() {
      const next = !!getMatch().matches
      if (next === getMedia()[key]) return
      setMediaState({ ...getMedia(), [key]: next })
      updateMediaListeners()
    }

    update()
  }
}

const listeners = new Set<any>()

export function updateMediaListeners() {
  listeners.forEach((cb) => cb(getMedia()))
}

type MediaState = {
  enabled?: boolean
  keys?: Set<string> | null
}

const States = new WeakMap<any, MediaState>()

// shared "touch tracker" prototype: one object whose enumerable getter
// properties are pre-defined for every configured media key. Hermes inlines
// getter calls; the old `new Proxy(state, { get })` path forced an interpreted
// trap on every access — the dominant per-component cost in benchmarks. Each
// component owns just an Object.create(proto) with a Symbol-keyed slot
// pointing at its tracking set + current snapshot.
type MediaRefSlot = {
  proxyTarget: MediaQueryState
  keys: Set<string>
}
let touchTrackerProto: object | null = null
const refSlot = Symbol('mediaRefSlot')

function buildTouchTrackerProto(): object {
  const proto: PropertyDescriptorMap = {}
  for (const fullKey of mediaKeys) {
    const key = fullKey[0] === '$' ? fullKey.slice(1) : fullKey
    proto[key] = {
      enumerable: true,
      configurable: true,
      get(this: { [refSlot]: MediaRefSlot }) {
        const slot = this[refSlot]
        if (!disableMediaTouch) {
          slot.keys.add(key)
        }
        return slot.proxyTarget[key]
      },
    }
  }
  return Object.create(null, proto)
}

function getTouchTrackerProto(): object {
  if (!touchTrackerProto) touchTrackerProto = buildTouchTrackerProto()
  return touchTrackerProto
}

function resetMediaTouchTracker() {
  touchTrackerProto = null
}

export function setMediaShouldUpdate(
  ref: any,
  enabled?: boolean,
  keys?: MediaState['keys']
) {
  const cur = States.get(ref)

  if (!cur || cur.enabled !== enabled || keys) {
    States.set(ref, {
      ...cur,
      enabled,
      keys,
    })
  }
}

function subscribe(subscriber: () => void) {
  listeners.add(subscriber)
  return () => {
    listeners.delete(subscriber)
  }
}

export function useMedia(
  componentContext?: ComponentContextI,
  debug?: DebugProp
): UseMediaState {
  'use no memo'

  type MediaRef = {
    keys: Set<string>
    lastState: MediaQueryState
    pendingState?: MediaQueryState
    // stable per-component closures + reusable Proxy. allocating new ones each
    // render (via useSyncExternalStore + `new Proxy(state, ...)`) was a real
    // per-component-per-render cost; we hold one Proxy whose target is swapped
    // by mutating `proxyTarget` and re-reading it in the get trap.
    proxyTarget: MediaQueryState
    proxy: UseMediaState
    getSnapshot: () => MediaQueryState
    componentContext?: ComponentContextI
    debug?: DebugProp
  }

  const internalRef = useRef<MediaRef | null>(null)
  if (!internalRef.current) {
    const initial = getMedia()
    const r: MediaRef = {
      keys: new Set<string>(),
      lastState: initial,
      proxyTarget: initial,
      proxy: undefined as unknown as UseMediaState,
      getSnapshot: undefined as unknown as () => MediaQueryState,
      componentContext,
      debug,
    }
    // proxy → Object.create(getterProto) with a Symbol slot. Per-key get is a
    // monomorphic getter call (Hermes-fast) instead of a Proxy trap.
    const tracker = Object.create(getTouchTrackerProto())
    tracker[refSlot] = { proxyTarget: initial, keys: r.keys } as MediaRefSlot
    r.proxy = tracker as UseMediaState
    r.getSnapshot = () => {
      const curKeys = r.componentContext
        ? States.get(r.componentContext)?.keys || r.keys
        : r.keys
      const { lastState, pendingState } = r

      if (!curKeys.size) {
        return lastState
      }

      const ms = getMedia()
      for (const key of curKeys) {
        if (ms[key] !== (pendingState || lastState)[key]) {
          if (process.env.NODE_ENV === 'development' && r.debug) {
            console.warn(`useMedia() ✍️`, key, lastState[key], '=>', ms[key])
          }

          // in emitter mode (no-rerender) avoid changing state, instead emit
          if (r.componentContext?.mediaEmit) {
            r.componentContext.mediaEmit(ms)
            r.pendingState = ms
            return lastState
          }

          r.lastState = ms

          return ms
        }
      }

      return lastState
    }
    internalRef.current = r
  } else {
    // refresh per-render inputs the closures read through the ref
    internalRef.current.componentContext = componentContext
    internalRef.current.debug = debug
  }

  const ref = internalRef.current

  // reset on next render
  if (ref.pendingState) {
    ref.lastState = ref.pendingState
    ref.pendingState = undefined
  }

  // clear each render to track only rendered touched keys
  if (ref.keys.size) {
    ref.keys.clear()
  }

  // manual subscription (same shape as useThemeStateSubscribed): same
  // granular bailout via getSnapshot returning the same MediaQueryState ref
  // when none of the component's touched keys changed, but fewer
  // React-internal hook slots on Hermes than useSyncExternalStore.
  const [, forceUpdate] = useReducer(incReducer, 0)
  const state = isServer ? initState : ref.getSnapshot()
  ref.proxyTarget = state
  ;(ref.proxy as any)[refSlot].proxyTarget = state

  useEffect(() => {
    const cb = () => {
      const next = ref.getSnapshot()
      if (next !== ref.proxyTarget) {
        ref.proxyTarget = next
        ;(ref.proxy as any)[refSlot].proxyTarget = next
        forceUpdate()
      }
    }
    return subscribe(cb)
  }, [])

  return ref.proxy
}

const incReducer = (c: number): number => c + 1

const getServerSnapshot = () => initState

let disableMediaTouch = false
export function _disableMediaTouch(val: boolean) {
  disableMediaTouch = val
}

export function getMediaState(mediaGroups: Set<string>, layout: WidthHeight) {
  disableMediaTouch = true
  let res: Record<string, boolean>
  try {
    res = Object.fromEntries(
      [...mediaGroups].map((mediaKey) => {
        return [mediaKey, mediaKeyMatch(mediaKey, layout as any)]
      })
    )
  } finally {
    disableMediaTouch = false
  }
  return res
}

export const getMediaImportanceIfMoreImportant = (
  mediaKey: string,
  key: string,
  styleState: GetStyleState,
  isSizeMedia: boolean
) => {
  const importance = isSizeMedia
    ? getMediaKeyImportance(mediaKey)
    : defaultMediaImportance
  const usedKeys = styleState.usedKeys
  return !usedKeys[key] || importance > usedKeys[key] ? importance : null
}

const cachedMediaKeyToQuery: Record<string, string> = {}

export function mediaKeyToQuery(key: string) {
  return (
    cachedMediaKeyToQuery[key] ||
    (cachedMediaKeyToQuery[key] = mediaObjectToString(mediaQueryConfig[key]))
  )
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
