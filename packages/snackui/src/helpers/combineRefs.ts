// https://github.com/seznam/compose-react-refs/blob/master/combineRefs.ts

import { MutableRefObject, Ref } from 'react'

type OptionalRef<T> = Ref<T> | undefined

export function combineRefs<T>(
  ...refs: [OptionalRef<T>, OptionalRef<T>, ...Array<OptionalRef<T>>]
): Ref<T> {
  if (refs.length === 2) {
    // micro-optimize the hot path
    return composeTwoRefs(refs[0], refs[1]) || null
  }

  const composedRef = refs
    .slice(1)
    .reduce(
      (semiCombinedRef: OptionalRef<T>, refToInclude: OptionalRef<T>) =>
        composeTwoRefs(semiCombinedRef, refToInclude),
      refs[0]
    )
  return composedRef || null
}

type NonNullRef<T> = NonNullable<Ref<T>>
const composedRefCache = new WeakMap<
  NonNullRef<unknown>,
  WeakMap<NonNullRef<unknown>, NonNullRef<unknown>>
>()

function composeTwoRefs<T>(
  ref1: OptionalRef<T>,
  ref2: OptionalRef<T>
): OptionalRef<T> {
  if (ref1 && ref2) {
    const ref1Cache =
      composedRefCache.get(ref1) ||
      new WeakMap<NonNullRef<unknown>, NonNullRef<unknown>>()
    composedRefCache.set(ref1, ref1Cache)

    const composedRef =
      ref1Cache.get(ref2) ||
      ((instance: T): void => {
        updateRef(ref1, instance)
        updateRef(ref2, instance)
      })
    ref1Cache.set(ref2, composedRef)

    return composedRef as NonNullRef<T>
  }

  if (!ref1) {
    return ref2
  } else {
    return ref1
  }
}

function updateRef<T>(ref: NonNullRef<T>, instance: null | T): void {
  if (typeof ref === 'function') {
    ref(instance)
  } else {
    ;(ref as MutableRefObject<T | null>).current = instance
  }
}
