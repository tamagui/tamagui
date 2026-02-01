/**
 * Wrapped Text component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's Text via babel plugin to ensure ALL text views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */

import { forwardRef, useRef, useCallback, createElement, type Ref } from 'react'
import { Text as RNText, type TextProps } from 'react-native'
import { link } from '../index'
import type { ThemeStyleMap } from '../types'

/**
 * Wrapped Text that registers with the style registry.
 * When styles have __styles metadata (from compiler), the native module
 * will update this view's styles directly on theme change without re-render.
 */
const WrappedText = forwardRef<RNText, TextProps & { __styles?: ThemeStyleMap }>(
  function WrappedText(props, forwardedRef) {
    const { __styles, style, ...rest } = props
    const cleanupRef = useRef<(() => void) | null>(null)

    const handleRef = useCallback(
      (instance: RNText | null) => {
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
    return createElement(RNText, { ...rest, ref: handleRef, style })
  }
)

export default WrappedText
export { WrappedText as Text }
