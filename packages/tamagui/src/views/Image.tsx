import { GetProps, StackProps, styled } from '@tamagui/core'
import React from 'react'
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native'

React['createElement']

const StyledImage = styled<RNImageProps>(
  RNImage as any,
  {
    // @ts-ignore
    className: 'tamagui-image',
  },
  {
    isReactNativeWeb: true,
    deoptProps: new Set(['src', 'width', 'height']),
  }
)

type StyledImageProps = GetProps<typeof StyledImage>

export type ImageProps = StackProps &
  Omit<StyledImageProps, 'source'> & {
    src?: string | StyledImageProps['source']
  }

export const Image: React.FC<ImageProps> = StyledImage.extractable(
  ({ src, width, height, ...rest }) => {
    const sourceProp =
      typeof src === 'string' ? { uri: src, width: width ?? '100%', height: height ?? '100%' } : src

    if (!sourceProp) {
      // placeholder with customizability
      return null
    }
    // must set defaultSource to allow SSR, default it to the same as src
    // @ts-ignore
    return <StyledImage defaultSource={sourceProp as any} source={sourceProp} {...rest} />
  }
)
