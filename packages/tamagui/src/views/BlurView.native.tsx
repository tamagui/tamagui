import { BlurView as NativeBlurView } from '@react-native-community/blur'
import { styled } from '@tamagui/core'
import React from 'react'
import { StyleSheet } from 'react-native'

import { BlurViewProps } from './BlurView'
import { YStack } from './Stacks'

// @ts-ignore TODO
export const BlurView = styled(NativeBlurView, {
  blurType: 'light',
  blurAmount: 10,

  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

// export function BlurView({
//   blurType = 'light',
//   blurAmount = 10,
//   fallbackBackgroundColor,
//   downsampleFactor,
//   borderRadius,
//   ...props
// }: BlurViewProps) {
//   return (
//       <NativeBlurView
//         // TODO we need a helper fn to ensure variables are converted into theme values
//         {...props}
//         style={[StyleSheet.absoluteFill, { borderRadius: +(borderRadius || 0), zIndex: -1 }, props.style]}
//       />
//   )
// }
// reducedTransparencyFallbackColor
