import { styled } from '@tamagui/core'
import { ImageProps, Image as RNImage } from 'react-native'

export const Image = styled<ImageProps, any, any>(
  RNImage as any,
  {},
  {
    isReactNativeWeb: true,
    keepAsProp: new Set(['width', 'height']),
  }
)
