/**
 * Wrapped View component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's View via babel plugin to ensure ALL views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */

import { forwardRef, useRef, useCallback, createElement, type Ref } from 'react'
import { View as RNView, type ViewProps } from 'react-native'
import { link } from '../index'
import type { ThemeStyleMap } from '../types'

/**
 * Wrapped View that registers with the style registry.
 * When styles have __styles metadata (from compiler), the native module
 * will update this view's styles directly on theme change without re-render.
 */
const WrappedView = forwardRef<RNView, ViewProps & { __styles?: ThemeStyleMap }>(
  function WrappedView(props, forwardedRef) {
    const { __styles, style, ...rest } = props
    const cleanupRef = useRef<(() => void) | null>(null)

    const handleRef = useCallback(
      (instance: RNView | null) => {
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
      },
      [forwardedRef, __styles]
    )

    // use createElement directly for slightly faster rendering
    return createElement(RNView, { ...rest, ref: handleRef, style })
  }
)

export default WrappedView
export { WrappedView as View }
