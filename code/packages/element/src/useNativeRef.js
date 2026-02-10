import { useComposedRefs } from '@tamagui/compose-refs'
import * as React from 'react'
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
export function useNativeRef(forwardedRef) {
  const ref = React.useRef(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
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
export function useNativeInputRef(forwardedRef) {
  const ref = React.useRef(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  return { ref, composedRef }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlTmF0aXZlUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlTmF0aXZlUmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUN2RCxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUk5Qjs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLFlBQXNDO0lBQ2pFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQXVCLElBQUksQ0FBQyxDQUFBO0lBQ3BELE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUUsWUFBbUIsQ0FBQyxDQUFBO0lBQzdELE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUE7QUFDN0IsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxZQUFzQztJQUN0RSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFZLElBQUksQ0FBQyxDQUFBO0lBQ3pDLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUUsWUFBbUIsQ0FBQyxDQUFBO0lBQzdELE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUE7QUFDN0IsQ0FBQyJ9
