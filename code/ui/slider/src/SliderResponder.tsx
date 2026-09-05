import type { TamaguiElement } from '@tamagui/core'
import { View } from '@tamagui/core'
import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import * as React from 'react'

import type { SliderResponderProps } from './types'

/**
 * The slider is dragged through the responder system, and tamagui views stopped
 * carrying responder props on web. This is the same responder system
 * react-native-web runs, used directly, so dragging behaves as it did when this
 * was a react-native `View`.
 */
export const SliderResponder = ({
  onResponderGrant,
  onResponderMove,
  onResponderRelease,
  children,
}: SliderResponderProps) => {
  const ref = React.useRef<TamaguiElement>(null)

  useResponderEvents(ref, {
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetResponder: () => true,
    onStartShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant,
    onResponderMove,
    onResponderRelease,
  })

  return (
    <View ref={ref} position="absolute" inset={0}>
      {children}
    </View>
  )
}
