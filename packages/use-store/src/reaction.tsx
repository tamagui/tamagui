import { useMemo } from 'react'

import { isEqualSubsetShallow } from './comparators'
import { UNWRAP_PROXY } from './constants'
import { Store } from './Store'
import { setIsInReaction } from './useStore'

const dispose = (d: any) => {
  if (typeof d === 'function') {
    d()
  }
}

export function useReaction<
  StoreInstance extends Store<any>,
  Selector extends (a: StoreInstance) => any
>(
  store: StoreInstance,
  selector: Selector,
  receiver: Selector extends (a: StoreInstance) => infer Derived
    ? (a: Derived) => any
    : unknown,
  equalityFn: (a: any, b: any) => boolean = isEqualSubsetShallow,
  memoArgs?: any[]
) {
  return useMemo(() => reaction(store, selector, receiver, equalityFn), [memoArgs])
}

export function reaction<
  StoreInstance extends Store<any>,
  Selector extends (a: StoreInstance) => any
>(
  store: StoreInstance,
  selector: Selector,
  receiver: Selector extends (a: StoreInstance) => infer Derived
    ? (a: Derived) => any
    : unknown,
  equalityFn: (a: any, b: any) => boolean = isEqualSubsetShallow
) {
  let last: any = undefined
  let innerDispose: any

  function updateReaction() {
    try {
      setIsInReaction(true)
      const storeInstance = store[UNWRAP_PROXY] || store
      const next = selector(storeInstance)
      if (!equalityFn(last, next)) {
        if (process.env.NODE_ENV === 'development') {
          console.groupCollapsed(
            `🌑  ⏭ %c${receiver.name.padStart(24)} (${storeInstance.constructor.name}${
              store.props?.id ? `:${store.props.id}` : ''
            }) ${last} => ${next}`,
            'color: chocolate;'
          )
          console.groupCollapsed('trace >')
          console.trace()
          console.groupEnd()
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log('  ARG', next)
          console.groupEnd()
        }
        dispose(innerDispose)
        last = next
        innerDispose = receiver(next)
      }
    } finally {
      setIsInReaction(false)
    }
  }

  const disposeSubscribe = store.subscribe(updateReaction)
  updateReaction()

  return () => {
    disposeSubscribe()
    dispose(innerDispose)
  }
}

// start on simpler reaction
// export function reaction2(fn: () => any): () => void {
//   let state = runStoreSelector(fn)
//   let disposeSubscribe
//   const disposePrev = () => {
//     // treat return functions as dispose
//     if (typeof state.value === 'function') {
//       state.value()
//     }
//   }
//   const dispose = () => {
//     disposeSubscribe?.()
//     disposePrev()
//   }
//   function update() {
//     dispose()
//     disposeSubscribe = subscribeToStores([...state.stores], () => {
//       const next = runStoreSelector(fn)
//       disposePrev()
//       if (!isEqualSubsetShallow(state.stores, next.stores)) {
//         state = next
//         update()
//       } else {
//         state = next
//       }
//     })
//   }
//   update()
//   return dispose
// }
