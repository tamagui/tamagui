import { useComposedRefs } from '@tamagui/compose-refs'
import * as React from 'react'
import type { TamaguiElement } from './types'

/**
 * Creates a ref for web-only code that properly types to HTMLElement.
 * Useful when you need to access HTMLElement-specific properties (like selectionStart)
 * that aren't available on the cross-platform TamaguiElement type.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useWebRef<HTMLInputElement>(forwardedRef)
 * // ref.current is typed as HTMLInputElement
 * // composedRef is for passing to components
 * ```
 */
export function useWebRef<T extends TamaguiElement | HTMLElement>(
  forwardedRef?: React.ForwardedRef<any>
) {
  const ref = React.useRef<T>(null)
  const composedRef = useComposedRefs(ref, forwardedRef as any)
  return { ref, composedRef }
}
