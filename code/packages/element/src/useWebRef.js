import { useComposedRefs } from '@tamagui/compose-refs'
import * as React from 'react'
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
export function useWebRef(forwardedRef) {
  const ref = React.useRef(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  return { ref, composedRef }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlV2ViUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlV2ViUmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUN2RCxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUc5Qjs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQ3ZCLFlBQWlEO0lBRWpELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLENBQUE7SUFDakMsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxZQUFtQixDQUFDLENBQUE7SUFDN0QsT0FBTyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQTtBQUM3QixDQUFDIn0=
