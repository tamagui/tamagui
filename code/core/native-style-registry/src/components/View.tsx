/**
 * Wrapped View component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's View via babel plugin to ensure ALL views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */

import { forwardRef, useRef, useCallback, createElement } from 'react'
import { View as RNView, type ViewProps } from 'react-native'
import { link } from '../index'
import type { ThemeStyleMap } from '../types'

const WrappedView = forwardRef<RNView, ViewProps & { __styles?: ThemeStyleMap }>(
  function WrappedView(props, forwardedRef) {
    const { __styles, style, ...rest } = props
    const unlinkRef = useRef<(() => void) | null>(null)

    const handleRef = useCallback(
      (instance: RNView | null) => {
        if (unlinkRef.current) {
          unlinkRef.current()
          unlinkRef.current = null
        }

        if (typeof forwardedRef === 'function') {
          forwardedRef(instance)
        } else if (forwardedRef) {
          forwardedRef.current = instance
        }

        if (instance && __styles) {
          unlinkRef.current = link(instance, __styles)
        }
      },
      [forwardedRef, __styles]
    )

    return createElement(RNView, { ...rest, ref: handleRef, style })
  }
)

export default WrappedView
export { WrappedView as View }
