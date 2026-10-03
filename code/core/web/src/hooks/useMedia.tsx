import { isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEffect, useReducer, useRef } from 'react'
import { getSetting } from '../config'
import { formatDiagnostic } from '../helpers/formatDiagnostic'
import { isOptimizedForFirstRender } from './isOptimizedForFirstRender'
import { matchMedia } from '../helpers/matchMedia'
import { mediaObjectToString } from '../helpers/mediaObjectToString'
import {
  getMedia,
  mediaKeyMatch,
  mediaKeys,
  mediaQueryConfig,
  setMediaState,
} from '../helpers/mediaState'
export { mediaKeyMatch } from '../helpers/mediaState'
import type {
  ComponentContextI,
  DebugProp,
  MediaQueryState,
  TamaguiInternalConfig,
  UseMediaState,
  WidthHeight,
} from '../types'

// for SSR capture it at time of startup
let initState: MediaQueryState

const dispose = new Set<Function>()

let mediaVersion = 0

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media } = config
  const mediaQueryDefaultActive = getSetting('mediaQueryDefaultActive')
  if (!media) return
  mediaVersion++
  // touch-tracker getter object depends on the current media key set
  resetMediaTouchTracker()
  // a replaced key set invalidates the diff baseline
  publishedState = null
  for (const key in media) {
    getMedia()[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeys.add(key)
  }
  Object.assign(mediaQueryConfig, media)
  initState = { ...getMedia() }
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
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? formatDiagnostic(
              'TAMAGUI_MEDIA_MATCH',
              'useMedia',
              'matchMedia returned no MediaQueryList',
              'Provide a matchMedia implementation that returns a MediaQueryList',
              'key,query,platform',
              { key, query: str, platform: isWeb ? 'web' : 'native' }
            )
          : '❌ Error 013'
      )
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

type MediaListener = (state: MediaQueryState) => void

// subscribers indexed by the media key they actually read, so a breakpoint
// change wakes only the components that read that breakpoint instead of every
// media subscriber on the page. `globalListeners` holds the subscribers that
// can't be keyed: first-render mode hands out the raw state object with no
// getter tracking, so its snapshot compares by identity and any publish counts.
const listenersByKey = new Map<string, Set<MediaListener>>()
const globalListeners = new Set<MediaListener>()

// last state published to subscribers, so a publish can wake only the buckets
// whose key value actually changed. null means "no baseline": configureMedia
// resets it so the first publish after a config swap reaches every bucket.
let publishedState: MediaQueryState | null = null

/**
 * instrumentation for the media render-count fixture. `notified` counts
 * subscriber callbacks actually invoked, which is a different number from
 * committed React renders: a woken callback re-reads its snapshot and usually
 * bails out, and the native fast path can commit a style without a render.
 */
export const _mediaListenerStats = {
  publishes: 0,
  notified: 0,
}

export function updateMediaListeners() {
  _mediaListenerStats.publishes++
  const media = getMedia()
  const prev = publishedState
  publishedState = media

  if (listenersByKey.size) {
    // dedupe: one subscriber can sit in several key buckets
    const woken = new Set<MediaListener>()
    for (const key of mediaKeys) {
      if (prev !== null && media[key] === prev[key]) continue
      const bucket = listenersByKey.get(key)
      if (bucket) {
        for (const cb of bucket) woken.add(cb)
      }
    }
    for (const cb of woken) {
      _mediaListenerStats.notified++
      cb(media)
    }
  }

  globalListeners.forEach((cb) => {
    _mediaListenerStats.notified++
    cb(media)
  })
}

type MediaState = {
  enabled?: boolean
  keys?: Set<string> | null
}

// per-component media-update state, keyed on a per-instance object
// (createComponent passes stateRef.current). never key this on a shared object
// like componentContext: every component under a provider would write to the
// same entry and the last sibling to render would win, disabling media updates
// for any earlier-rendered media-dependent sibling.
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
  for (const key of mediaKeys) {
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
  keys?: MediaState['keys'],
  optimizeForFirstRender = false
) {
  if (optimizeForFirstRender) return

  const cur = States.get(ref)

  if (!cur || cur.enabled !== enabled || keys) {
    States.set(ref, {
      ...cur,
      enabled,
      keys,
    })
  }
}

type MediaRef = {
  keys: Set<string> | null
  lastState: MediaQueryState
  pendingState?: MediaQueryState
  renderVersion: number
  // the callback registered in the buckets, stable for the life of the hook
  onChange?: MediaListener
  // which buckets `onChange` currently sits in. a Set is a copy of the touched
  // keys at the last commit (`keys` is cleared and refilled every render), null
  // is the whole-object bucket, undefined means not subscribed at all.
  listeningTo?: Set<string> | null
  // stable per-component closures + reusable Proxy. allocating new ones each
  // render (via useSyncExternalStore + `new Proxy(state, ...)`) was a real
  // per-component-per-render cost; we hold one Proxy whose target is swapped
  // by mutating `proxyTarget` and re-reading it in the get trap.
  proxyTarget: MediaQueryState
  proxy: UseMediaState
  getSnapshot: () => MediaQueryState
  componentContext?: ComponentContextI
  uid?: object
  debug?: DebugProp
  optimizeForFirstRender: boolean
}

// the media keys a subscriber observes. null means the whole state object:
// first-render mode has no getter tracking, so it can only compare identity.
// getSnapshot and the bucket index MUST agree here, or a component gets skipped
// for a key it reads.
function mediaListenKeys(ref: MediaRef): Set<string> | null {
  if (ref.optimizeForFirstRender) return null
  return (ref.uid ? States.get(ref.uid)?.keys : undefined) || ref.keys!
}

function indexMediaListener(ref: MediaRef) {
  const keys = mediaListenKeys(ref)
  const cur = ref.listeningTo
  if (cur !== undefined && sameMediaKeys(cur, keys)) return

  unindexMediaListener(ref)
  const cb = ref.onChange!

  if (keys === null) {
    globalListeners.add(cb)
    ref.listeningTo = null
    return
  }

  ref.listeningTo = new Set(keys)
  for (const key of keys) {
    let bucket = listenersByKey.get(key)
    if (!bucket) {
      bucket = new Set()
      listenersByKey.set(key, bucket)
    }
    bucket.add(cb)
  }
}

function unindexMediaListener(ref: MediaRef) {
  const keys = ref.listeningTo
  if (keys === undefined) return
  ref.listeningTo = undefined

  const cb = ref.onChange!
  if (keys === null) {
    globalListeners.delete(cb)
    return
  }

  for (const key of keys) {
    const bucket = listenersByKey.get(key)
    if (!bucket) continue
    bucket.delete(cb)
    // drop empties so a key removed by configureMedia leaves no bucket behind
    if (!bucket.size) listenersByKey.delete(key)
  }
}

function sameMediaKeys(a: Set<string> | null, b: Set<string> | null) {
  if (a === null || b === null) return a === b
  if (a.size !== b.size) return false
  for (const key of b) {
    if (!a.has(key)) return false
  }
  return true
}

export function useMedia(
  componentContext?: ComponentContextI,
  debug?: DebugProp,
  // per-component-instance key for the States map (createComponent passes
  // stateRef.current, matching its setMediaShouldUpdate call)
  uid?: object
): UseMediaState {
  'use no memo'

  const internalRef = useRef<MediaRef | null>(null)
  if (!internalRef.current) {
    // SSR contract (see settings.disableSSR docs): every first WEB render uses
    // mediaQueryDefaultActive so hydration matches the server — including
    // lazily-hydrated boundaries that mount long after the initial pass.
    // a pre-paint layout effect then corrects to the real matchMedia values,
    // so fresh client-only mounts never paint a wrong frame. Native has no
    // hydration: starting from the defaults object made the sync effect's
    // reference check fail on every mount and re-render the entire tree once.
    const initial =
      isWeb && !isServer && !getSetting('disableSSR') ? initState : getMedia()
    const optimizeForFirstRender = isOptimizedForFirstRender()
    const r: MediaRef = {
      keys: optimizeForFirstRender ? null : new Set<string>(),
      lastState: initial,
      renderVersion: 0,
      proxyTarget: initial,
      proxy: undefined as unknown as UseMediaState,
      getSnapshot: undefined as unknown as () => MediaQueryState,
      componentContext,
      uid,
      debug,
      optimizeForFirstRender,
    }
    if (optimizeForFirstRender) {
      r.proxy = initial as UseMediaState
    } else {
      // proxy → Object.create(getterProto) with a Symbol slot. Per-key get is a
      // monomorphic getter call (Hermes-fast) instead of a Proxy trap.
      const tracker = Object.create(getTouchTrackerProto())
      tracker[refSlot] = {
        proxyTarget: initial,
        keys: r.keys!,
      } as MediaRefSlot
      r.proxy = tracker as UseMediaState
    }
    r.getSnapshot = () => {
      if (r.optimizeForFirstRender) {
        const ms = getMedia()
        if (ms === r.lastState) {
          return r.lastState
        }

        if (r.componentContext?.mediaEmit) {
          r.componentContext.mediaEmit(ms)
          r.pendingState = ms
          return r.lastState
        }

        r.lastState = ms
        return ms
      }

      const curKeys = mediaListenKeys(r)!
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
    internalRef.current.uid = uid
    internalRef.current.debug = debug
  }

  const ref = internalRef.current
  ref.renderVersion++

  // reset on next render
  if (ref.pendingState) {
    ref.lastState = ref.pendingState
    ref.pendingState = undefined
  }

  // clear each render to track only rendered touched keys
  if (ref.keys?.size) {
    ref.keys.clear()
  }

  // manual subscription (same shape as useThemeStateSubscribed): the
  // subscription is indexed by the keys this component reads, so a breakpoint
  // change never reaches a component that doesn't read it, and getSnapshot
  // returns the same MediaQueryState ref for anything that slips through.
  // fewer React-internal hook slots on Hermes than useSyncExternalStore.
  const [, forceUpdate] = useReducer(incReducer, 0)
  const state = isServer
    ? initState
    : ref.optimizeForFirstRender && ref.renderVersion === 1
      ? ref.lastState
      : ref.getSnapshot()
  ref.proxyTarget = state
  if (!ref.optimizeForFirstRender) {
    ;(ref.proxy as any)[refSlot].proxyTarget = state
  }

  // correct the defaults-first render to real matchMedia values before paint
  useIsomorphicLayoutEffect(() => {
    const synced = ref.getSnapshot()
    if (synced !== ref.proxyTarget) {
      ref.proxyTarget = synced
      if (!ref.optimizeForFirstRender) {
        ;(ref.proxy as any)[refSlot].proxyTarget = synced
      }
      forceUpdate()
    }
  }, [])

  useEffect(() => {
    const renderVersion = ref.renderVersion
    const shouldSubscribe =
      ref.optimizeForFirstRender || !ref.uid || !!States.get(ref.uid)?.enabled

    if (shouldSubscribe) {
      ref.onChange ||= () => {
        const next = ref.getSnapshot()
        if (next !== ref.proxyTarget) {
          // mirrors update first either way, so a later natural render
          // resolves the same media values the fast path committed
          ref.proxyTarget = next
          if (!ref.optimizeForFirstRender) {
            ;(ref.proxy as any)[refSlot].proxyTarget = next
          }
          // native fast path (experimental): uid is createComponent's
          // stateRef.current; when the component can commit the media-driven
          // style change straight to the native tree, skip the re-render
          if ((ref.uid as any)?.nativeMediaUpdate?.(forceUpdate)) return
          forceUpdate()
        }
      }
      // re-index every commit: the touched-key set is rebuilt each render, so a
      // component that starts or stops reading a breakpoint changes buckets
      indexMediaListener(ref)
    } else {
      unindexMediaListener(ref)
    }

    return () => {
      // react runs passive cleanup before the next effect as well as on unmount.
      // a newer render bumps renderVersion before that cleanup, so equality here
      // means this is the final unmount cleanup.
      if (ref.renderVersion === renderVersion) {
        unindexMediaListener(ref)
      }
    }
  })

  return ref.optimizeForFirstRender ? (state as UseMediaState) : ref.proxy
}

const incReducer = (c: number): number => c + 1

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

const cachedMediaKeyToQuery: Record<string, string> = {}

export function mediaKeyToQuery(key: string) {
  return (
    cachedMediaKeyToQuery[key] ||
    (cachedMediaKeyToQuery[key] = mediaObjectToString(mediaQueryConfig[key]))
  )
}
