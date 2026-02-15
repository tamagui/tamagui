import React from 'react'

import type { DismissableBranchProps, DismissableProps } from './DismissableProps'

// stubs for native - dismissable is a web-only concept
export function dispatchDiscreteCustomEvent<E extends CustomEvent>(
  _target: E['target'],
  _event: E
) {}

export function getDismissableLayerCount(): number {
  return 0
}

export function useHasDismissableLayers(): boolean {
  return false
}

export function useIsInsideDismissable(
  _ref: React.RefObject<HTMLElement | null>
): boolean {
  return false
}

export function useDismissableLayersAbove(
  _ref: React.RefObject<HTMLElement | null>
): number {
  return 0
}

export const Dismissable = React.forwardRef((props: DismissableProps, _ref) => {
  return props.children as any
})

export const DismissableBranch = React.forwardRef(
  (props: DismissableBranchProps, _ref) => {
    return props.children as any
  }
)
