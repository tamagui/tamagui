import { BlurView as NativeBlurView } from '@react-native-community/blur'
import React from 'react'
import { StyleSheet } from 'react-native'

import { BlurViewProps } from './BlurView'
import { VStack } from './Stacks'

export function BlurView({
  blurType = 'light',
  blurAmount = 10,
  fallbackBackgroundColor,
  downsampleFactor,
  children,
  borderRadius,
  ...props
}: BlurViewProps) {
  return (
    <VStack borderRadius={borderRadius} {...props}>
      <NativeBlurView
        style={[StyleSheet.absoluteFill, { borderRadius, zIndex: -1 }]}
        {...{
          blurType,
          blurAmount,
          reducedTransparencyFallbackColor: fallbackBackgroundColor,
          downsampleFactor,
        }}
      />
      {children}
    </VStack>
  )
}
