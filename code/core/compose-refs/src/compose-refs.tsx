// from radix
// https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/compose-refs/src/composeRefs.tsx

import * as React from 'react'
import type { ReactNode, Ref } from 'react'

type PossibleRef<T> =
  | React.Ref<T>
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

export type RefProp<RefType> = {
  ref?: Ref<RefType>
}

export type RefComponent<RefType, Props extends object> = ((
  props: Props & RefProp<RefType>
) => ReactNode) & {
  displayName?: string
  propTypes?: any
}

export function createRefComponent<RefType, Props extends object>(
  render: (props: Props, ref: Ref<RefType> | undefined) => ReactNode
): RefComponent<RefType, Props> {
  function RefComponent(props: Props & RefProp<RefType>) {
    return render(props, props.ref)
  }

  RefComponent.displayName = render.name

  return RefComponent as RefComponent<RefType, Props>
}
