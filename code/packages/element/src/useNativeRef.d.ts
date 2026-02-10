import type * as React from 'react'
import type { TextInput } from 'react-native'
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
export declare function useNativeRef(forwardedRef?: React.ForwardedRef<any>): {
  ref: React.RefObject<import('react-native').View | null>
  composedRef: (node: import('react-native').View | null) => void
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
export declare function useNativeInputRef(forwardedRef?: React.ForwardedRef<any>): {
  ref: React.RefObject<TextInput | null>
  composedRef: (node: TextInput | null) => void
}
