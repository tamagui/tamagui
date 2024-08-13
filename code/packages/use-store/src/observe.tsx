import React from 'react'

import { isEqualSubsetShallow } from './comparators'
import { UNWRAP_PROXY } from './constants'
import type { StoreInfo } from './interfaces'
import { trackStoresAccess } from './useStore'

const logUpdate =
  process.env.NODE_ENV === 'development'
    ? (fn: any, stores: any[], last: any, next: any) => {
        const getStoreLogName = (store: any) => {
          const str = store[UNWRAP_PROXY] ?? store
          return `${str.constructor.name}${store.props?.id ? `:${store.props.id}` : ''}`
        }
        const storeNames = stores.map(getStoreLogName).join(', ')
        const name = `🌑  ▶️ %c${fn.name} ${storeNames} () ${last} => ${next}`
        console.groupCollapsed(name, 'color: tomato;')
        console.groupCollapsed('trace >')
        console.trace()
        console.groupEnd()
        console.info('  next', next)
        console.groupEnd()
      }
    : null

export function observe(fn: () => any) {
  let prev = getObserverValueAndStoresAccessed(fn)
  let disposeValue: Function | null = null

  const subscribe = () => {
    const stores = [...prev.storeInfos]
    return subscribeToStores(stores, () => {
      disposeValue?.()
      const next = getObserverValueAndStoresAccessed(fn)

      if (typeof next.value === 'function') {
        disposeValue = next.value
        if (process.env.NODE_ENV === 'development') {
          logUpdate!(fn, [...next.storeInfos], '(fn)', '(fn)')
        }
        return
      }
      if (
        isEqualSubsetShallow(prev.storeInfos, next.storeInfos) &&
        isEqualSubsetShallow(prev.value, next.value)
      ) {
        return
      }
      if (process.env.NODE_ENV === 'development') {
        logUpdate!(fn, [...next.storeInfos], prev.value, next.value)
      }
      prev = next
      dispose()
      dispose = subscribe()
    })
  }

  let dispose = subscribe()

  return {
    dispose: () => {
      dispose()
      disposeValue?.()
    },
    getValue: () => prev.value,
  }
}

export function useObserve<A>(fn: () => A): A {
  const [state, setState] = React.useState(() => {
    return getObserverValueAndStoresAccessed(fn)
  })

  React.useEffect(() => {
    let dispose
    const unsub = subscribeToStores([...state.storeInfos], () => {
      dispose?.()
      const next = getObserverValueAndStoresAccessed(fn)

      const nextStoreInfos = [...next.storeInfos]
      const prevStoreInfos = [...state.storeInfos]

      // return function === return disposable
      if (typeof next.value === 'function') {
        if (process.env.NODE_ENV === 'development') {
          logUpdate!(fn, nextStoreInfos, '(fn)', '(fn)')
        }
        dispose = next.value
        return
      }

      setState((prev) => {
        if (
          isEqualSubsetShallow(prevStoreInfos, nextStoreInfos) &&
          isEqualSubsetShallow(prev.value, next.value)
        ) {
          return prev
        }
        if (process.env.NODE_ENV === 'development') {
          logUpdate!(fn, nextStoreInfos, prev.value, next.value)
        }
        return next
      })
    })

    return () => {
      unsub()
      dispose?.()
    }
  }, [[...state.storeInfos].map((i) => i.uid).join(',')])

  return state.value
}

function getObserverValueAndStoresAccessed<A>(selector: () => A): {
  value: A
  storeInfos: Set<StoreInfo>
} {
  const storeInfos = new Set<StoreInfo>()
  const dispose = trackStoresAccess((storeInfo) => {
    storeInfos.add(storeInfo)
  })
  const value = selector()
  dispose()
  return {
    value,
    storeInfos,
  }
}

function subscribeToStores(storeInfos: StoreInfo[], onUpdate: () => any) {
  const disposes: Function[] = []

  // wrap onUpdate to avoid waterfall calls + avoid tracking during onUpdate
  let isUpdating = false
  const onUpdateDebouncedWithoutTracking = () => {
    if (isUpdating) return
    isUpdating = true
    queueMicrotask(() => {
      try {
        for (const storeInfo of storeInfos) {
          storeInfo.disableTracking = true
        }
        onUpdate()
      } finally {
        isUpdating = false
        for (const storeInfo of storeInfos) {
          storeInfo.disableTracking = false
        }
      }
    })
  }

  for (const storeInfo of storeInfos) {
    disposes.push(storeInfo.subscribe(onUpdateDebouncedWithoutTracking))
  }
  return () => {
    disposes.forEach((x) => x())
  }
}
