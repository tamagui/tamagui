import { useRef } from 'react'

import { StoreInfo } from './interfaces'

const wkm = new WeakMap<any, string>()
const weakKey = (obj: any, prefix = '') => {
  if (wkm.has(obj)) return wkm.get(obj)!
  const key = `${prefix}-${Math.random()}`
  wkm.set(obj, key)
  return key
}

export function getStoreUid(Constructor: any, props: string | Object | void) {
  // in dev mode we can use name which gives us nice `allStores.StoreName` access
  // in prod mode it usually is minified and mangled, unsafe to use name so use weakkey
  const storeName =
    process.env.NODE_ENV === 'development' ? Constructor.name : weakKey(Constructor)
  const uid = `${storeName}${
    !props ? '' : typeof props === 'string' ? props : getKey(props)
  }`
  return uid
}

export const UNWRAP_STORE_INFO = Symbol('UNWRAP_STORE_INFO')
export const cache = new Map<string, StoreInfo>()

export function getStoreDescriptors(storeInstance: any) {
  const proto = Object.getPrototypeOf(storeInstance)
  const instanceDescriptors = Object.getOwnPropertyDescriptors(storeInstance)
  const protoDescriptors = Object.getOwnPropertyDescriptors(proto)
  const descriptors = {
    ...protoDescriptors,
    ...instanceDescriptors,
  }
  // @ts-ignore
  delete descriptors.constructor
  return descriptors
}

export function get<A>(_: A, b?: any): A extends new (props?: any) => infer B ? B : A {
  return _ as any
}

export function getKey(props: Object) {
  let s = ''
  const sorted = Object.keys(props).sort()
  for (const key of sorted) {
    const v = props[key]
    if (v && typeof v === 'object') {
      s += getKey(v)
    } else {
      s += `.${key}:${v}`
    }
  }
  return s
}

type ResultBox<T> = { v: T }

export default function useConstant<T>(fn: () => T): T {
  const ref = useRef<ResultBox<T>>()
  if (!ref.current) {
    ref.current = { v: fn() }
  }
  return ref.current.v
}

export function simpleStr(arg: any) {
  if (process.env.NODE_ENV === 'development') {
    return typeof arg === 'function'
      ? 'fn'
      : typeof arg === 'string'
      ? `"${arg}"`
      : !arg
      ? arg
      : typeof arg !== 'object'
      ? arg
      : Array.isArray(arg)
      ? '[...]'
      : `{...}`
  }
  return arg
}
// helper for debugging

export function getStoreDebugInfo(store: any) {
  return (
    store[UNWRAP_STORE_INFO] ?? cache.get(getStoreUid(store.constructor, store.props))
  )
}
