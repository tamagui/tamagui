/**
 * Wrapped Text component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's Text via babel plugin to ensure ALL text views are
 * registered for atomic theme updates (no tearing).
 */

import { forwardRef, useRef, type ComponentType } from 'react'
import { Text as RNText, type TextProps } from 'react-native'
import { link } from '../index'

// lean text that creates RCTText directly
const LeanText = forwardRef<RNText, TextProps>((props, ref) => {
  // @ts-ignore - direct RCTText creation
  return <RNText {...props} ref={ref} />
}) as ComponentType<TextProps>

LeanText.displayName = 'RCTText'

/**
 * Wrapped Text that registers with the style registry.
 */
const WrappedText = forwardRef<RNText, TextProps & { __styles?: Record<string, any> }>(
  (props, forwardedRef) => {
    const { __styles, style, ...rest } = props
    const cleanupRef = useRef<(() => void) | null>(null)

    const handleRef = (instance: RNText | null) => {
      // cleanup previous registration
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      // forward the ref
      if (typeof forwardedRef === 'function') {
        forwardedRef(instance)
      } else if (forwardedRef) {
        forwardedRef.current = instance
      }

      // register with style registry if we have __styles
      if (instance && __styles) {
        cleanupRef.current = link(instance, __styles)
      }
    }

    return <LeanText {...rest} ref={handleRef} style={style} />
  }
)

WrappedText.displayName = 'TamaguiText'

export default WrappedText
export { WrappedText as Text }
