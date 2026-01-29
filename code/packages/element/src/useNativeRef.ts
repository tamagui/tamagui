import { useComposedRefs } from '@tamagui/compose-refs'
import * as React from 'react'
import type { TextInput } from 'react-native'
import type { TamaguiNativeElement } from './types'

/**
 * Creates a ref for native-only code that properly types to View.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeRef(forwardedRef)
 * // ref.current is typed as View
 * ```
 */
export function useNativeRef(forwardedRef?: React.ForwardedRef<any>) {
  const ref = React.useRef<TamaguiNativeElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef as any)
  return { ref, composedRef }
}

/**
 * Creates a ref for native TextInput components.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeInputRef(forwardedRef)
 * // ref.current is typed as TextInput
 * ```
 */
export function useNativeInputRef(forwardedRef?: React.ForwardedRef<any>) {
  const ref = React.useRef<TextInput>(null)
  const composedRef = useComposedRefs(ref, forwardedRef as any)
  return { ref, composedRef }
}
