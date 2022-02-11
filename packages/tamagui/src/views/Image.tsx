import { styled } from '@tamagui/core'
import { ImageProps, Image as RNImage } from 'react-native'

export const Image = styled<ImageProps>(
  RNImage as any,
  {},
  {
    isReactNativeWeb: true,
  }
)
