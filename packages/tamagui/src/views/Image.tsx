import { GetProps, StackProps, getExpandedShorthands, styled } from '@tamagui/core'
import React from 'react'
import { Image as RNImage } from 'react-native'

React['createElement']

const StyledImage = styled(
  RNImage,
  // @ts-ignore TODO we need to make GetProps only use StackStylePropsBase and then later build that up better in styled()
  {
    name: 'Image',
    position: 'relative',
  },
  {
    inlineProps: new Set(['src', 'width', 'height']),
  }
)

type StyledImageProps = GetProps<typeof StyledImage>

export type ImageProps = Omit<StackProps, 'width' | 'height'> &
  Omit<StyledImageProps, 'source' | 'width' | 'height'> & {
    width: number
    height: number
    src: string | StyledImageProps['source']
  }

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
  return <StyledImage defaultSource={defaultSource} source={source} {...rest} />
})
