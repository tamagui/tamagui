import { View } from 'react-native'

import type { SliderResponderProps } from './types'

export const SliderResponder = ({
  onResponderGrant,
  onResponderMove,
  onResponderRelease,
  children,
}: SliderResponderProps) => {
  return (
    <View
      onMoveShouldSetResponderCapture={() => true}
      onMoveShouldSetResponder={() => true}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={onResponderGrant}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
      style={{ inset: 0, position: 'absolute' }}
    >
      {children}
    </View>
  )
}
