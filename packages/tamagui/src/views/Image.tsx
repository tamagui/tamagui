import { GetProps, StackProps, getExpandedShorthands, styled } from '@tamagui/core'
import React from 'react'
import { Image as RNImage } from 'react-native'

React['createElement']

const StyledImage = styled(
  RNImage,
  // @ts-ignore TODO we need to make GetProps only use StackStylePropsBase and then later build that up better in styled()
  {
    name: 'Image',
  },
  {
    inlineProps: new Set(['src', 'width', 'height']),
  }
)

type StyledImageProps = GetProps<typeof StyledImage>

export type ImageProps = StackProps &
  Omit<StyledImageProps, 'source'> & {
    src?: string | StyledImageProps['source']
  }

export const Image: React.FC<ImageProps> = StyledImage.extractable((inProps) => {
  const props = getExpandedShorthands(inProps)
  const { src, width = '100%', height = 'auto', ...rest } = props
  const sourceProp = typeof src === 'string' ? { uri: src, width, height } : src

  if (!sourceProp) {
    // placeholder with customizability
    return null
  }
  // must set defaultSource to allow SSR, default it to the same as src
  // @ts-ignore
  return <StyledImage defaultSource={sourceProp as any} source={sourceProp} {...rest} />
})
