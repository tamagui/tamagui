import type React from 'react'

import type { TamaguiChangeEventDetails, TamaguiEventDetails } from '@tamagui/core'

export type PointerDownOutsideDetails = TamaguiChangeEventDetails<
  'outside-press',
  PointerEvent,
  { interaction: 'pointer' }
>

export type FocusOutsideDetails = TamaguiChangeEventDetails<
  'focus-out',
  FocusEvent,
  { interaction: 'focus' }
>

export type InteractOutsideDetails = PointerDownOutsideDetails | FocusOutsideDetails

export type DismissableDismissDetails =
  | TamaguiEventDetails<'escape-key', React.KeyboardEvent>
  | TamaguiEventDetails<'outside-press', PointerEvent, { interaction: 'pointer' }>
  | TamaguiEventDetails<'focus-out', FocusEvent, { interaction: 'focus' }>

export interface DismissableProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `Dismissable`. Users will need to click twice on outside elements to
   * interact with them: once to close the `Dismissable`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean
  /**
   * Optional Set of branch elements that should not trigger dismissal.
   * Pass the same Set to DismissableBranch components to scope them to this Dismissable.
   */
  branches?: Set<HTMLElement>
  /**
   * Event handler called when the escape key is down.
   * Can be canceled.
   */
  onEscapeKeyDown?: (
    details: TamaguiChangeEventDetails<'escape-key', React.KeyboardEvent>
  ) => void
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `Dismissable`.
   * Can be canceled.
   */
  onPointerDownOutside?: (details: PointerDownOutsideDetails) => void
  /**
   * Event handler called when the focus moves outside of the `Dismissable`.
   * Can be canceled.
   */
  onFocusOutside?: (details: FocusOutsideDetails) => void
  /**
   * Event handler called when an interaction happens outside the `Dismissable`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be canceled.
   */
  onInteractOutside?: (details: InteractOutsideDetails) => void

  /**
   * Handler called when the `Dismissable` should be dismissed
   */
  onDismiss?: (details: DismissableDismissDetails) => void

  /**
   * When using animations on exit, may want to simualte force unmount early
   */
  forceUnmount?: boolean

  onPointerDownCapture?: any
  onBlurCapture?: any
  onFocusCapture?: any

  children?: React.ReactNode
}

export interface DismissableBranchProps {
  children?: React.ReactNode
  /**
   * Optional Set to register this branch with.
   * Pass the same Set to the Dismissable to scope this branch to that specific layer.
   */
  branches?: Set<HTMLElement>
}
