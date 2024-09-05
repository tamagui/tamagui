import React from 'react'

import { isEqualSubsetShallow } from './comparators'
import { configureOpts } from './configureUseStore'
import { UNWRAP_PROXY, defaultOptions } from './constants'
import {
  UNWRAP_STORE_INFO,
  cache,
  getStoreDescriptors,
  getStoreUid,
  simpleStr,
} from './helpers'
import type { Selector, Store, StoreInfo, UseStoreOptions } from './interfaces'
import { DebugStores, shouldDebug, useCurrentComponent } from './useStoreDebug'

const idFn = (_) => _

// no singleton, just react
export function useStore<A, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined,
  props?: B | null,
  options: UseStoreOptions<A, any> = defaultOptions
): A {
  const info = getOrCreateStoreInfo(StoreKlass, props, options)
  return useStoreFromInfo(info, options.selector, options)
}

export function useStoreDebug<A, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B
): A {
  return useStore(StoreKlass, props, { debug: true })
}

// singleton
export function createStore<A, B extends Object>(
  StoreKlass: new (props: B) => A | (new () => A) | null | undefined,
  props?: B,
  options?: UseStoreOptions<A, any>
): A {
  return getOrCreateStoreInfo(StoreKlass, props, options)?.store as any
}
// use singleton with react
// TODO selector support with types...

export function useGlobalStore<A, B extends Object>(instance: A, debug?: boolean): A {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  return useStoreFromInfo(info, undefined, { debug })
}

export function useGlobalStoreSelector<A, Selector extends (store: A) => any>(
  instance: A,
  selector: Selector,
  debug?: boolean
): Selector extends (a: A) => infer C ? C : unknown {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  return useStoreFromInfo(info, selector, { debug })
}

// for creating a usable store hook
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store)
) {
  return <Res, C extends Selector<Store, Res>, Props extends Object>(
    props?: Props,
    options?: UseStoreOptions
  ): C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store =>
    useStore(StoreKlass as any, props, options)
}

// for creating a usable selector hook
export function createUseStoreSelector<
  A extends Store<Props>,
  Props extends Object,
  Selected,
>(
  StoreKlass: (new (props: Props) => A) | (new () => A),
  selector: Selector<A, Selected>
): (props?: Props) => Selected {
  return (props?: Props) => {
    return useStore(StoreKlass, props, { selector }) as any
  }
}

// selector hook
export function useStoreSelector<A, B extends Object, S extends Selector<A, any>>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  selector: S,
  props?: B
): S extends Selector<any, infer R> ? R : unknown {
  return useStore(StoreKlass, props, { selector }) as any
}

type StoreAccessTracker = (store: StoreInfo) => void
const storeAccessTrackers = new Set<StoreAccessTracker>()
export function trackStoresAccess(cb: StoreAccessTracker) {
  storeAccessTrackers.add(cb)
  return () => {
    storeAccessTrackers.delete(cb)
  }
}

export function getStore<A, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined,
  props?: B
): A {
  return getStoreInfo(StoreKlass, props)?.store as any
}

export function getOrCreateStore<A, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined,
  props?: B
): A {
  return getOrCreateStoreInfo(StoreKlass, props, {
    refuseCreation: false,
  })?.store as any
}

// just like getOrCreateStoreInfo but refuses to create
export function getStoreInfo(StoreKlass: any, props: any) {
  return getOrCreateStoreInfo(StoreKlass, props, {
    refuseCreation: true,
  })
}

export type CreateStoreListener = (storeInfo: StoreInfo) => void

const onCreateListeners = new Set<CreateStoreListener>()

export function onCreateStore(cb: CreateStoreListener) {
  onCreateListeners.add(cb)
  return () => {
    onCreateListeners.delete(cb)
  }
}

function getOrCreateStoreInfo(
  StoreKlass: any,
  props: any,
  options?: UseStoreOptions & { avoidCache?: boolean; refuseCreation?: boolean },
  propsKeyCalculated?: string
) {
  if (!StoreKlass) {
    return null
  }
  const uid = getStoreUid(StoreKlass, propsKeyCalculated ?? props)
  if (!options?.avoidCache && cache.has(uid)) {
    return cache.get(uid)!
  }
  if (options?.refuseCreation) {
    throw new Error(`No store exists (${StoreKlass.name}) with props: ${props}`)
  }

  // init
  const storeInstance = new StoreKlass(props!)
  // add props
  storeInstance.props = props

  const getters = {}
  const actions = {}
  const stateKeys = new Set<string>()
  const descriptors = getStoreDescriptors(storeInstance)
  for (const key in descriptors) {
    const descriptor = descriptors[key]
    if (typeof descriptor.value === 'function') {
      // actions
      actions[key] = descriptor.value
    } else if (typeof descriptor.get === 'function') {
      getters[key] = descriptor.get
    } else {
      if (key !== 'props' && key[0] !== '_') {
        stateKeys.add(key)
      }
    }
  }

  const keyComparators = storeInstance['_comparators']
  const listeners = new Set<Function>()

  const storeInfo = {
    uid,
    keyComparators,
    storeInstance,
    getters,
    stateKeys,
    props,
    actions,
    debug: options?.debug,
    disableTracking: false,
    gettersState: {
      getCache: new Map<string, any>(),
      depsToGetter: new Map<string, Set<string>>(),
      curGetKeys: new Set<string>(),
      isGetting: false,
    },
    listeners,
    trackers: new Set(),
    version: 0,
    subscribe: (onChanged: Function) => {
      listeners.add(onChanged)
      return () => {
        listeners.delete(onChanged)
      }
    },
    triggerUpdate: () => {
      storeInfo.version = (storeInfo.version + 1) % Number.MAX_SAFE_INTEGER
      for (const cb of listeners) {
        cb()
      }
    },
  } satisfies Omit<StoreInfo, 'store'>

  const store = createProxiedStore(
    // we assign store right after and proxiedStore never accesses it until later on
    storeInfo as any as StoreInfo
  )

  // uses more memory when on
  if (process.env.NODE_ENV === 'development') {
    allStores[StoreKlass.name + uid] = store
  }

  // if has a mount function call it
  store.mount?.()

  // @ts-ignore
  storeInfo.store = store

  const result = storeInfo as any as StoreInfo

  // still set even when avoidCache is true (hmr)
  cache.set(uid, result)

  onCreateListeners.forEach((cb) => cb(result))

  return result
}

export const allStores = {}

if (process.env.NODE_ENV === 'development') {
  globalThis['Store'] ||= allStores
}

const emptyObj = {}
const selectKeys = (obj: any, keys: string[]) => {
  if (!keys.length) {
    return emptyObj
  }
  const res = {}
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

let isInReaction = false
export const setIsInReaction = (val: boolean) => {
  isInReaction = val
}

function useStoreFromInfo(
  info: StoreInfo | null | undefined,
  userSelector?: Selector<any> | undefined,
  options?: UseStoreOptions
): any {
  const store = info?.store
  const internal = React.useRef<StoreTracker>()
  const component = useCurrentComponent()
  if (!internal.current) {
    internal.current = {
      component,
      tracked: new Set<string>(),
      last: null,
      lastKeys: null,
    }
  }
  const curInternal = internal.current!
  const shouldPrintDebug = options?.debug

  const getSnapshot = React.useCallback(() => {
    if (!info || !store) return
    const curInternal = internal.current!
    const isTracking = curInternal.tracked.size
    const keys = [...(!isTracking ? info.stateKeys : curInternal.tracked)]
    const nextKeys = `${info.version}${keys.join('')}${userSelector || ''}`
    const lastKeys = curInternal.lastKeys

    // avoid updates
    if (nextKeys === curInternal.lastKeys) {
      return curInternal.last
    }

    curInternal.lastKeys = nextKeys

    let snap: any
    // dont track during selector
    info.disableTracking = true
    const last = curInternal.last
    if (userSelector) {
      snap = userSelector(store)
    } else {
      snap = selectKeys(store, keys)
    }
    info.disableTracking = false

    // this wasn't updating in AnimationsStore
    const isUnchanged =
      (!userSelector && !isTracking && last) ||
      (typeof last !== 'undefined' &&
        isEqualSubsetShallow(last, snap, {
          keyComparators: info.keyComparators,
        }))

    if (shouldPrintDebug) {
      console.info('🌑 getSnapshot', {
        storeState: selectKeys(store, Object.keys(store)),
        userSelector,
        info,
        isUnchanged,
        component,
        keys,
        last,
        snap,
        curInternal,
        nextKeys,
        lastKeys,
      })
    }

    if (isUnchanged) {
      return last
    }

    curInternal.last = snap
    return snap
  }, [store])

  // sync by default
  const state = React.useSyncExternalStore(
    info?.subscribe || idFn,
    getSnapshot,
    getSnapshot
  )

  if (!info || !store || !state) {
    return state
  }

  if (userSelector) {
    return state
  }

  return new Proxy(store, {
    get(target, key) {
      // be sure to touch the value for tracking purposes
      const curVal = Reflect.get(target, key)
      // while in reactions, don't proxy to old state as they aren't inside of react render
      if (isInReaction) {
        return curVal
      }
      const keyString = key as string // fine for our uses

      if (info.stateKeys.has(keyString) || keyString in info.getters) {
        if (shouldPrintDebug) {
          console.info('👀 tracking', keyString)
        }
        curInternal.tracked.add(keyString)
      }
      if (Reflect.has(state, key)) {
        return Reflect.get(state, key)
      }
      return curVal
    },
  })
}

let setters = new Set<any>()
const logStack = new Set<Set<any[]> | 'end'>()

function createProxiedStore(storeInfo: StoreInfo) {
  const { actions, storeInstance, getters, gettersState } = storeInfo
  const { getCache, curGetKeys, depsToGetter } = gettersState
  const constr = storeInstance.constructor
  const shouldDebug = storeInfo.debug ?? DebugStores.has(constr)

  let didSet = false
  const wrappedActions = {}

  // pre-setup actions
  for (const key in actions) {
    if (key === 'subscribe') {
      continue
    }

    // wrap action and call didSet after
    const actionFn = actions[key]

    // yes its odd but bug in router needs to be figured out to fix
    // and all it does is deopt slightly and silence get
    const isGetFn = key.startsWith('get')

    // wrap actions for tracking
    wrappedActions[key] = function useStoreAction(...args: any[]) {
      let res: any
      if (isGetFn || gettersState.isGetting) {
        return Reflect.apply(actionFn, proxiedStore, args)
      }
      if (process.env.NODE_ENV === 'development' && shouldDebug) {
        console.info('(debug) startAction', key)
      }
      res = Reflect.apply(actionFn, proxiedStore, args)
      if (res instanceof Promise) {
        return res.then(finishAction)
      }
      finishAction()
      return res
    }

    // dev mode do nice logging
    if (process.env.NODE_ENV === 'development') {
      if (!key.startsWith('get') && !key.startsWith('_') && key !== 'subscribe') {
        const ogAction = wrappedActions[key]
        wrappedActions[key] = new Proxy(ogAction, {
          apply(target, thisArg, args) {
            const isDebugging = shouldDebug || storeInfo.debug
            const shouldLog =
              process.env.LOG_LEVEL !== '0' &&
              (isDebugging || configureOpts.logLevel !== 'error')

            if (!shouldLog) {
              return Reflect.apply(target, thisArg, args)
            }

            setters = new Set()
            const curSetters = setters
            const isTopLevelLogger = logStack.size == 0
            const logs = new Set<any[]>()
            logStack.add(logs)
            let res
            const id = counter++
            try {
              // 🏃‍♀️ run action here now
              res = Reflect.apply(target, thisArg, args)
            } catch (err) {
              console.error('Error', err)
              throw err
            } finally {
              logStack.add('end')

              const name = constr.name
              const color = strColor(name)
              const simpleArgs = args.map(simpleStr)
              logs.add([
                `%c 🌑 ${id} ${name.padStart(
                  isTopLevelLogger ? 8 : 4
                )}%c.${key}(${simpleArgs.join(', ')})${
                  isTopLevelLogger && logStack.size > 1 ? ` (+${logStack.size - 1})` : ''
                }`,

                `color: ${color};`,
                'color: black;',
              ])
              if (curSetters.size) {
                curSetters.forEach(({ key, value }) => {
                  if (
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean'
                  ) {
                    logs.add([` SET ${key} ${value}`, value])
                  } else {
                    logs.add([` SET ${key}`, value])
                  }
                })
              }

              if (isTopLevelLogger) {
                let error = null
                try {
                  for (const item of [...logStack]) {
                    if (item === 'end') {
                      console.groupEnd()
                      continue
                    }
                    const [head, ...rest] = item
                    if (head) {
                      console.groupCollapsed(...head)
                      console.groupCollapsed('...')
                      console.info('args', args)
                      console.info('response', res)
                      console.groupCollapsed('trace')
                      console.trace()
                      console.groupEnd()
                      console.groupEnd()
                      for (const [name, ...log] of rest) {
                        console.groupCollapsed(name)
                        console.info(...log)
                        console.groupEnd()
                      }
                    } else {
                      console.info('Weird log', head, ...rest)
                    }
                  }
                } catch (err: any) {
                  error = err
                }
                for (const _ of [...logStack]) {
                  console.groupEnd()
                }
                if (error) {
                  console.error(`error loggin`, error)
                }
                logStack.clear()
              }

              // biome-ignore lint/correctness/noUnsafeFinally: ok
              return res
            }
          },
        })
      }

      function hashCode(str: string) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        return hash
      }

      function strColor(str: string) {
        return `hsl(${hashCode(str) % 360}, 90%, 40%)`
      }
    }
  }

  const finishAction = (val?: any) => {
    if (process.env.NODE_ENV === 'development' && shouldDebug) {
      console.info('(debug) finishAction', { didSet })
    }
    if (didSet) {
      storeInfo.triggerUpdate()
      didSet = false
    }
    return val
  }

  let isTriggering = false

  const proxiedStore = new Proxy(storeInstance, {
    // GET
    get(_, key) {
      // setup action one time
      if (key in wrappedActions) {
        return wrappedActions[key]
      }
      if (key in passThroughKeys) {
        return Reflect.get(storeInstance, key)
      }
      if (key === UNWRAP_PROXY) {
        return storeInstance
      }
      if (key === UNWRAP_STORE_INFO) {
        return storeInfo
      }
      if (storeAccessTrackers.size) {
        storeAccessTrackers.forEach((cb) => cb(storeInfo))
      }
      if (typeof key !== 'string') {
        return Reflect.get(storeInstance, key)
      }

      // non-actions...

      if (!storeInfo.disableTracking) {
        if (gettersState.isGetting) {
          gettersState.curGetKeys.add(key)
        } else {
          // storeInstance[TRACK](key, shouldDebug)
        }
      }

      if (key in getters) {
        if (getCache.has(key)) {
          return getCache.get(key)
        }
        // track get deps
        curGetKeys.clear()
        const isSubGetter = gettersState.isGetting
        gettersState.isGetting = true
        const res = getters[key].call(proxiedStore)
        if (!isSubGetter) {
          gettersState.isGetting = false
        }
        // store inverse lookup
        for (const gk of curGetKeys) {
          if (!depsToGetter.has(gk)) {
            depsToGetter.set(gk, new Set())
          }
          const cur = depsToGetter.get(gk)!
          cur.add(key)
        }
        // TODO i added this !isSubGetter, seems logical but haven't validated
        // has diff performance tradeoffs, not sure whats desirable
        // if (!isSubGetter) {
        getCache.set(key, res)
        // }
        return res
      }

      return Reflect.get(storeInstance, key)
    },

    // SET
    set(target, key, value, receiver) {
      const cur = Reflect.get(target, key)
      const res = Reflect.set(target, key, value, receiver)

      // only update if changed, simple compare
      if (res && cur !== value) {
        // clear getters cache that rely on this
        if (typeof key === 'string') {
          clearGetterCache(key)
          if (shouldDebug) {
            setters.add({ key, value })
            if (getShouldDebug(storeInfo)) {
              console.info('(debug) SET', res, key, value)
            }
          }
          if (process.env.NODE_ENV === 'development' && shouldDebug) {
            console.info('SET...', { key, value })
          }
        }

        if (!isTriggering) {
          // trigger only once per event loop
          isTriggering = true
          waitForEventLoop(() => {
            storeInfo.triggerUpdate()
            isTriggering = false
          })
        }
      }
      return res
    },
  })

  function clearGetterCache(setKey: string) {
    const parentGetters = depsToGetter.get(setKey)
    getCache.delete(setKey)

    if (!parentGetters) {
      return
    }
    for (const gk of parentGetters) {
      getCache.delete(gk)
      if (depsToGetter.has(gk)) {
        clearGetterCache(gk)
      }
    }
  }

  return proxiedStore
}

const waitForEventLoop =
  process.env.NODE_ENV === 'test' || process.env.TAMAGUI_TARGET === 'native'
    ? (cb: Function) => cb()
    : queueMicrotask

let counter = 0

const passThroughKeys = {
  subscribe: true,
  _version: true,
  _trackers: true,
  $$typeof: true,
  _listeners: true,
  _enableTracking: true,
}

export type StoreTracker = {
  tracked: Set<string>
  component?: any
  last?: any
  lastKeys?: any
}

function getShouldDebug(storeInfo: StoreInfo) {
  const info = { storeInstance: storeInfo.store }
  const trackers = storeInfo.trackers
  return [...trackers].some(
    (tracker) => tracker.component && shouldDebug(tracker.component, info)
  )
}
