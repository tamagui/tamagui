import type { GetProps, GetRef, StylePiece } from '@tamagui/web'
import { styled, useStyle } from '@tamagui/web'
import React from 'react'
import {
  ScrollView as ReactNativeScrollView,
  type ScrollViewProps as ReactNativeScrollViewProps,
} from 'react-native'

type NativeScrollViewProps = Omit<ReactNativeScrollViewProps, 'contentContainerStyle'> & {
  contentContainerStyle?: StylePiece
}

const ScrollViewNative = React.forwardRef<ReactNativeScrollView, NativeScrollViewProps>(
  ({ contentContainerStyle, ...props }, ref) => (
    <ReactNativeScrollView
      {...props}
      ref={ref}
      contentContainerStyle={
        useStyle(
          contentContainerStyle
        ) as ReactNativeScrollViewProps['contentContainerStyle']
      }
    />
  )
)

export const ScrollView = styled(
  ScrollViewNative,
  {
    displayName: 'ScrollView',
    scrollEnabled: true,
  },
  {
    neverFlatten: true,
  }
)

export type ScrollView = GetRef<typeof ScrollView>

export type ScrollViewProps = Omit<
  GetProps<typeof ScrollView>,
  'contentContainerStyle'
> & {
  contentContainerStyle?: StylePiece
}
