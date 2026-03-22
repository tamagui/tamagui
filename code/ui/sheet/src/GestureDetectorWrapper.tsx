import type React from 'react'
import { Platform, View, type ViewStyle } from 'react-native'
import { getGestureHandlerState, isGestureHandlerEnabled } from './gestureState'

interface GestureDetectorWrapperProps {
  gesture: any
  children: React.ReactNode
  style?: ViewStyle
}

/**
 * Conditionally wraps children with GestureDetector when RNGH is available.
 * Uses a plain View wrapper that GestureDetector can attach gesture handlers to.
 */
export function GestureDetectorWrapper({
  gesture,
  children,
  style,
}: GestureDetectorWrapperProps) {
  const { GestureDetector } = getGestureHandlerState()
  const enabled = isGestureHandlerEnabled()

  // console.warn('[RNGH-Wrapper] enabled:', enabled, 'hasDetector:', !!GestureDetector, 'hasGesture:', !!gesture)

  // On TV, skip RNGH wrapping entirely — RNGH's GestureDetector Wrap sets
  // collapsable={false} which is NOT in the tvOS Fabric spec and causes:
  // "TypeError: undefined is not a function" (setter.apply crash) at runtime.
  // TV pan/gesture events aren't needed (remote navigation handles TV interaction).
  if (Platform.isTV) {
    return <View style={style}>{children}</View>
  }

  // only wrap if we have RNGH available AND a gesture to attach
  if (enabled && GestureDetector && gesture) {
    // GestureDetector needs a native View to attach handlers to
    // the View wrapper ensures proper gesture propagation
    // console.warn('[RNGH-Wrapper] WRAPPING')
    return (
      <GestureDetector gesture={gesture}>
        <View style={style} collapsable={false}>
          {children}
        </View>
      </GestureDetector>
    )
  }

  // pass through children in a consistent View wrapper
  return <View style={style}>{children}</View>
}
