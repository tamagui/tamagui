import React from 'react'

import type { StoreInfo } from './interfaces'

// const { ReactCurrentOwner } = (React as any)
//   .__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
export const useCurrentComponent = () => {
  return {}
  // return ReactCurrentOwner &&
  //   ReactCurrentOwner.current &&
  //   ReactCurrentOwner.current.elementType
  //   ? ReactCurrentOwner.current.elementType
  //   : {}
}

export function useDebugStoreComponent(StoreCons: any) {
  const cmp = useCurrentComponent()

  // add in outer loop to pickup immediately
  DebugStores.add(StoreCons)
  if (!DebugComponents.has(cmp)) {
    DebugComponents.set(cmp, new Set())
  }
  const stores = DebugComponents.get(cmp)!
  stores.add(StoreCons)

  React.useLayoutEffect(() => {
    return () => {
      DebugStores.delete(StoreCons)
      stores.delete(StoreCons)
    }
  }, [])
}

export const shouldDebug = (component: any, info: Pick<StoreInfo, 'storeInstance'>) => {
  const StoreCons = info.storeInstance?.constructor
  return DebugComponents.get(component)?.has(StoreCons)
}

export const DebugComponents = new Map<any, Set<any>>()
export const DebugStores = new Set<any>()
