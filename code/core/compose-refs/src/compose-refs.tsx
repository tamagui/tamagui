// from radix
// https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/compose-refs/src/composeRefs.tsx

import * as React from 'react'

type PossibleRef<T> =
  | React.Ref<T>
  | React.ForwardedRef<T>
  | React.RefObject<T>
  | React.Dispatch<React.SetStateAction<T | null>>
  | undefined

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
export function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node))
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  return React.useCallback(composeRefs(...refs), refs)
}
