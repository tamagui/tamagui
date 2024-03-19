import type React from 'react'

import type { FocusOutsideEvent, PointerDownOutsideEvent } from './Dismissable'

export interface DismissableProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `Dismissable`. Users will need to click twice on outside elements to
   * interact with them: once to close the `Dismissable`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `Dismissable`.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  /**
   * Event handler called when the focus moves outside of the `Dismissable`.
   * Can be prevented.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void
  /**
   * Event handler called when an interaction happens outside the `Dismissable`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void

  /**
   * Handler called when the `Dismissable` should be dismissed
   */
  onDismiss?: () => void

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
}
