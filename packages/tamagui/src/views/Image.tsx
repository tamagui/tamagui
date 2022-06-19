import { GetProps, StackProps, getExpandedShorthands, styled } from '@tamagui/core'
import React from 'react'
import { Image as RNImage } from 'react-native'

React['createElement']

const StyledImage = styled(
  RNImage,
  {
    name: 'Image',
    zIndex: 1,
    position: 'relative',
    source: { uri: '' },
  },
  {
    inlineProps: new Set(['src', 'width', 'height']),
  }
)

type StyledImageProps = GetProps<typeof StyledImage>

type BaseProps = Omit<StyledImageProps, 'source' | 'width' | 'height' | 'style' | 'onLayout'> & {
  width: number
  height: number
  src: string | StyledImageProps['source']
}

export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>

export const Image: React.FC<ImageProps> = StyledImage.extractable((inProps) => {
  const props = getExpandedShorthands(inProps)
  const { src, width = 100, height = 100, ...rest } = props
  const source = typeof src === 'string' ? { uri: src, width, height } : src
  const defaultSource = Array.isArray(source) ? source[0] : source

  if (!defaultSource) {
    // placeholder with customizability
    return null
  }

  // must set defaultSource to allow SSR, default it to the same as src
  // @ts-ignore we pass all react-native-web props down
  return <StyledImage defaultSource={defaultSource} source={source} {...rest} />
})
