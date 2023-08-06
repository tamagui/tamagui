import { useEffect, useState } from 'react'

import { isEqualSubsetShallow } from './comparators'
import { UNWRAP_PROXY } from './constants'
import { StoreInfo } from './interfaces'
import { trackStoresAccess } from './useStore'

// TODO i think we can just replace reaction() with this, its not worse in any way

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
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('  next', next)
        console.groupEnd()
      }
    : null

// // TODO test this works the same as useSelector
// export function selector(fn: () => any) {
//   let prev = runStoreSelector(fn)
//   let disposeValue: Function | null = null
//   const subscribe = () => {
//     return subscribeToStores([...prev.storeInfos], () => {
//       try {
//         disposeValue?.()
//         setIsInReaction(true)
//         const next = runStoreSelector(fn)
//         if (typeof next.value === 'function') {
//           disposeValue = next.value
//           if (process.env.NODE_ENV === 'development') {
//             logUpdate!(fn, [...next.storeInfos], '(fn)', '(fn)')
//           }
//           return
//         }
//         if (
//           isEqualSubsetShallow(prev.stores, next.stores) &&
//           isEqualSubsetShallow(prev.value, next.value)
//         ) {
//           return
//         }
//         if (process.env.NODE_ENV === 'development') {
//           logUpdate!(fn, [...next.stores], prev.value, next.value)
//         }
//         prev = next
//         dispose()
//         dispose = subscribe()
//       } finally {
//         setIsInReaction(false)
//       }
//     })
//   }
//   let dispose = subscribe()
//   return () => {
//     dispose()
//     disposeValue?.()
//   }
// }

export function useSelector<A>(fn: () => A): A {
  const [state, setState] = useState(() => {
    return runStoreSelector(fn)
  })

  useEffect(() => {
    let dispose
    const unsub = subscribeToStores([...state.storeInfos], () => {
      dispose?.()
      const next = runStoreSelector(fn)

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

function runStoreSelector<A>(selector: () => A): {
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

function subscribeToStores(stores: StoreInfo[], onUpdate: () => any) {
  const disposes: Function[] = []
  for (const store of stores) {
    disposes.push(store.subscribe(onUpdate))
  }
  return () => {
    disposes.forEach((x) => x())
  }
}
