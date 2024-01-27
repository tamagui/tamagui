import { simpleHash } from '@tamagui/simple-hash'

import type { StoreInfo } from './interfaces'

export function getStoreUid(Constructor: any, props: string | Object | void) {
  return simpleHash(
    `${Constructor}${
      !props ? '' : typeof props === 'string' ? props : JSON.stringify(props)
    }`,
    'strict'
  )
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
