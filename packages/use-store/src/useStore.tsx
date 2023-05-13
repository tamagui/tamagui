import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

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
import { Selector, StoreInfo, UseStoreOptions } from './interfaces'
import {
  ADD_TRACKER,
  SHOULD_DEBUG,
  Store,
  StoreTracker,
  TRACK,
  TRIGGER_UPDATE,
  disableTracking,
  setDisableStoreTracking,
} from './Store'
import { useAsyncExternalStore } from './useAsyncExternalStore'
import {
  DebugStores,
  shouldDebug,
  useCurrentComponent,
  useDebugStoreComponent,
} from './useStoreDebug'

// sanity check types here
// class StoreTest extends Store<{ id: number }> {}
// const storeTest = createStore(StoreTest, { id: 3 })
// const useStoreTest = createUseStore(StoreTest)
// const useStoreSelectorTest = createUseStoreSelector(StoreTest, (s) => s.props.id)
// const num = useStoreSelectorTest({ id: 0 })
// const ya = useStoreTest({ id: 1 })
// const yb = useStoreTest({ id: 1 }, (x) => x.props.id)
// const z = useStore(StoreTest)
// const abc = useGlobalStore(storeTest)
// const abc2 = useGlobalStore(storeTest)
// const abcSel = useGlobalStoreSelector(storeTest, (x) => x.props.id)

const idFn = (_) => _
const shouldUseSyncDefault =
  typeof window !== 'undefined' && window.location.hash.includes(`sync-store`)

// no singleton, just react
export function useStore<A extends Store<B>, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  options: UseStoreOptions<A, any> = defaultOptions
): A {
  const selectorCb = useCallback(options.selector || idFn, [])
  const selector = options.selector ? selectorCb : options.selector

  if (options.debug) {
    useDebugStoreComponent(StoreKlass)
  }

  // if (options.once) {
  //   const key = props ? getKey(props) : ''
  //   const info = useMemo(() => {
  //     return getOrCreateStoreInfo(StoreKlass, props, { avoidCache: true }, key)
  //   }, [key])
  //   return useStoreFromInfo(info, selector)
  // }

  const info = getOrCreateStoreInfo(StoreKlass, props)
  return useStoreFromInfo(info, selector)
}

export function useStoreDebug<A extends Store<B>, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  useDebugStoreComponent(StoreKlass)
  return useStore(StoreKlass, props, selector)
}

// singleton
export function createStore<A extends Store<B>, B extends Object>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  return getOrCreateStoreInfo(StoreKlass, props).store as any
}
// use singleton with react
// TODO selector support with types...

export function useGlobalStore<A extends Store<B>, B extends Object>(
  instance: A,
  debug?: boolean
): A {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  if (debug) {
    useDebugStoreComponent(store.constructor)
  }
  return useStoreFromInfo(info)
}

export function useGlobalStoreSelector<
  A extends Store<B>,
  B extends Object,
  Selector extends (store: A) => any
>(
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
  if (debug) {
    useDebugStoreComponent(store.constructor)
  }
  return useStoreFromInfo(info, selector)
}

// for creating a usable store hook
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store)
) {
  return function <Res, C extends Selector<Store, Res>, Props extends Object>(
    props?: Props,
    options?: UseStoreOptions
    // super hacky workaround for now, ts is unknown to me tbh
  ): C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store {
    return useStore(StoreKlass as any, props, options)
  }
}

// for creating a usable selector hook
export function createUseStoreSelector<
  A extends Store<Props>,
  Props extends Object,
  Selected
>(
  StoreKlass: (new (props: Props) => A) | (new () => A),
  selector: Selector<A, Selected>
): (props?: Props) => Selected {
  return (props?: Props) => {
    return useStore(StoreKlass, props, { selector }) as any
  }
}

// selector hook
export function useStoreSelector<
  A extends Store<B>,
  B extends Object,
  S extends Selector<any, Selected>,
  Selected
>(StoreKlass: (new (props: B) => A) | (new () => A), selector: S, props?: B): Selected {
  return useStore(StoreKlass, props, { selector }) as any
}

type StoreAccessTracker = (store: any) => void
const storeAccessTrackers = new Set<StoreAccessTracker>()
export function trackStoresAccess(cb: StoreAccessTracker) {
  storeAccessTrackers.add(cb)
  return () => {
    storeAccessTrackers.delete(cb)
  }
}

// TODO deprecate and replace with usePortal
// for ephemeral stores (alpha, not working correctly yet)
export function useStoreOnce<A extends Store<B>, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  return useStore(StoreKlass, props, { selector, once: true })
}

// get non-singleton outside react (weird)
export function getStore<A extends Store<B>, B extends Object>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B
): A {
  return getOrCreateStoreInfo(StoreKlass, props).store as any
}

function getOrCreateStoreInfo(
  StoreKlass: any,
  props: any,
  opts?: { avoidCache: boolean },
  propsKeyCalculated?: string
) {
  const uid = getStoreUid(StoreKlass, propsKeyCalculated ?? props)

  if (!opts?.avoidCache) {
    const cached = cache.get(uid)
    if (cached) {
      // warn if creating an already existing store!
      // need to detect HMR more cleanly if possible
      if (cached.storeInstance.constructor.toString() !== StoreKlass.toString()) {
        console.warn(
          'Error: Stores must have a unique name (ignore if this is a hot reload)'
        )
      } else {
        return cached
      }
    }
  }

  // init
  const storeInstance = new StoreKlass(props!)

  const getters = {}
  const actions = {}
  const stateKeys: string[] = []
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
        stateKeys.push(key)
      }
    }
  }

  const keyComparators = storeInstance['_comparators']
  const storeInfo = {
    keyComparators,
    storeInstance,
    getters,
    stateKeys,
    actions,
    gettersState: {
      getCache: new Map<string, any>(),
      depsToGetter: new Map<string, Set<string>>(),
      curGetKeys: new Set<string>(),
      isGetting: false,
    },
  }

  const store = createProxiedStore(storeInfo)

  // uses more memory when on
  if (process.env.NODE_ENV === 'development') {
    allStores[uid] = store
  }

  // if has a mount function call it
  store.mount?.()

  const value: StoreInfo = {
    ...storeInfo,
    store,
  }

  if (!opts?.avoidCache) {
    cache.set(uid, value)
  }

  return value
}

export const allStores = {}

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
  info: StoreInfo,
  userSelector?: Selector<any> | undefined
): any {
  const { store } = info
  if (!store) {
    return null
  }
  const internal = useRef<StoreTracker>()
  const component = useCurrentComponent()
  if (!internal.current) {
    internal.current = {
      component,
      isTracking: false,
      firstRun: true,
      tracked: new Set<string>(),
      dispose: null as any,
      last: null,
      lastKeys: null,
    }
    const dispose = store[ADD_TRACKER](internal.current)
    internal.current.dispose = dispose
  }
  const curInternal = internal.current!

  const shouldPrintDebug =
    !!process.env.LOG_LEVEL &&
    (configureOpts.logLevel === 'debug' || shouldDebug(component, info))

  const getSnapshot = useCallback(() => {
    const curInternal = internal.current!
    const keys = curInternal.firstRun ? info.stateKeys : [...curInternal.tracked]

    const nextKeys = `${store._version}${keys.join('')}${userSelector?.toString() || ''}`
    if (nextKeys === curInternal.lastKeys) {
      if (shouldPrintDebug) {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('avoid update', nextKeys, curInternal.lastKeys)
      }
      return curInternal.last
    }
    curInternal.lastKeys = nextKeys

    let snap: any
    // dont track during selector
    setDisableStoreTracking(store, true)
    const last = curInternal.last
    if (userSelector) {
      snap = userSelector(store)
    } else {
      snap = selectKeys(store, keys)
    }
    setDisableStoreTracking(store, false)

    // const isUnchanged = false

    // this wasn't updating in AnimationsStore
    const isUnchanged =
      typeof last !== 'undefined' &&
      isEqualSubsetShallow(last, snap, {
        keyComparators: info.keyComparators,
      })

    if (shouldPrintDebug) {
      // prettier-ignore
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log('🌑 getSnapshot', { userSelector, info, isUnchanged, component, keys, snap, curInternal })
    }
    if (isUnchanged) {
      return last
    }
    curInternal.last = snap
    return snap
  }, [])

  const state = shouldUseSyncDefault
    ? useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
    : useAsyncExternalStore(store.subscribe, getSnapshot, getSnapshot)

  // dispose tracker on unmount
  useEffect(() => {
    return curInternal.dispose
  }, [])

  // we never allow removing selector
  if (!userSelector) {
    // before each render
    curInternal.isTracking = true

    // track access, runs after each render
    useLayoutEffect(() => {
      curInternal.isTracking = false
      curInternal.firstRun = false
      if (shouldPrintDebug) {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('🌑 finish render, tracking', [...curInternal.tracked])
      }
    })
  } else {
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
      if (Reflect.has(state, key)) {
        return Reflect.get(state, key)
      }
      return curVal
    },
  })
}

let setters = new Set<any>()
const logStack = new Set<Set<any[]> | 'end'>()

function createProxiedStore(storeInfo: Omit<StoreInfo, 'store' | 'source'>) {
  const { actions, storeInstance, getters, gettersState } = storeInfo
  const { getCache, curGetKeys, depsToGetter } = gettersState
  const constr = storeInstance.constructor

  let didSet = false
  let isInAction = false
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
      if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('(debug) startAction', key, { isInAction })
      }
      // dumb for now
      isInAction = true
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
            const isDebugging = DebugStores.has(constr)
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
                      // rome-ignore lint/nursery/noConsoleLog: <explanation>
                      console.log('args', args)
                      // rome-ignore lint/nursery/noConsoleLog: <explanation>
                      console.log('response', res)
                      console.groupCollapsed('trace')
                      console.trace()
                      console.groupEnd()
                      console.groupEnd()
                      for (const [name, ...log] of rest) {
                        console.groupCollapsed(name)
                        // rome-ignore lint/nursery/noConsoleLog: <explanation>
                        console.log(...log)
                        console.groupEnd()
                      }
                    } else {
                      // rome-ignore lint/nursery/noConsoleLog: <explanation>
                      console.log('Weird log', head, ...rest)
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

              // rome-ignore lint/correctness/noUnsafeFinally: ok
              return res
            }
          },
        })
      }
    }
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

  const finishAction = (val?: any) => {
    if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log('(debug) finishAction', { didSet })
    }
    isInAction = false
    if (didSet) {
      storeInstance[TRIGGER_UPDATE]?.()
      didSet = false
    }
    return val
  }

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
      const trackingDisabled = disableTracking.get(storeInstance)
      if (!trackingDisabled) {
        if (storeAccessTrackers.size && !storeAccessTrackers.has(storeInstance)) {
          for (const t of storeAccessTrackers) {
            t(storeInstance)
          }
        }
      }
      if (typeof key !== 'string') {
        return Reflect.get(storeInstance, key)
      }

      // non-actions...

      const shouldPrintDebug =
        process.env.NODE_ENV === 'development' && DebugStores.has(constr)

      if (!trackingDisabled) {
        if (gettersState.isGetting) {
          gettersState.curGetKeys.add(key)
        } else {
          storeInstance[TRACK](key, shouldPrintDebug)
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
        }
        if (process.env.LOG_LEVEL && configureOpts.logLevel !== 'error') {
          setters.add({ key, value })
          if (storeInstance[SHOULD_DEBUG]()) {
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
            console.log('(debug) SET', res, key, value)
          }
        }
        if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log('SET...', { key, value, isInAction })
        }
        if (isInAction) {
          didSet = true
        } else {
          storeInstance[TRIGGER_UPDATE]?.()
        }
      }
      return res
    },
  })

  function clearGetterCache(setKey: string) {
    const getters = depsToGetter.get(setKey)
    getCache.delete(setKey)
    if (!getters) {
      return
    }
    for (const gk of getters) {
      getCache.delete(gk)
      if (depsToGetter.has(gk)) {
        clearGetterCache(gk)
      }
    }
  }

  return proxiedStore
}

let counter = 0

const passThroughKeys = {
  subscribe: true,
  _version: true,
  _trackers: true,
  $$typeof: true,
  _listeners: true,
  _enableTracking: true,
}
