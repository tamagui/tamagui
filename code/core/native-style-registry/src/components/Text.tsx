/**
 * Wrapped Text component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's Text via babel plugin to ensure ALL text views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */

import { forwardRef, useRef, useCallback, createElement } from 'react'
import { Text as RNText, type TextProps } from 'react-native'
import { link } from '../index'
import type { ThemeStyleMap } from '../types'

const WrappedText = forwardRef<RNText, TextProps & { __styles?: ThemeStyleMap }>(
  function WrappedText(props, forwardedRef) {
    const { __styles, style, ...rest } = props
    const unlinkRef = useRef<(() => void) | null>(null)

    const handleRef = useCallback(
      (instance: RNText | null) => {
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

    return createElement(RNText, { ...rest, ref: handleRef, style })
  }
)

export default WrappedText
export { WrappedText as Text }
