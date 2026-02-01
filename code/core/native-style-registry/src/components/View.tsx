/**
 * Wrapped View component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's View via babel plugin to ensure ALL views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */

import { forwardRef, useRef, type ComponentType } from 'react'
import { View as RNView, type ViewProps } from 'react-native'
import { link } from '../index'

// lean view that creates RCTView directly (like Unistyles)
const LeanView = forwardRef<RNView, ViewProps>((props, ref) => {
  // @ts-ignore - direct RCTView creation
  return <RNView {...props} ref={ref} />
}) as ComponentType<ViewProps>

LeanView.displayName = 'RCTView'

/**
 * Wrapped View that registers with the style registry.
 * When styles have __styles metadata (from compiler), the native module
 * will update this view's styles directly on theme change without re-render.
 */
const WrappedView = forwardRef<RNView, ViewProps & { __styles?: Record<string, any> }>(
  (props, forwardedRef) => {
    const { __styles, style, ...rest } = props
    const cleanupRef = useRef<(() => void) | null>(null)

    const handleRef = (instance: RNView | null) => {
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

    return <LeanView {...rest} ref={handleRef} style={style} />
  }
)

WrappedView.displayName = 'TamaguiView'

export default WrappedView
export { WrappedView as View }
