import { GetProps, styled } from '@tamagui/core'
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native'

export type ImageProps = Omit<StyledImageProps, 'source'> & {
  src?: string | StyledImageProps['source']
}

const StyledImage = styled<RNImageProps>(
  RNImage as any,
  {},
  {
    isReactNativeWeb: true,
    deoptProps: new Set(['src', 'width', 'height']),
  }
)

type StyledImageProps = GetProps<typeof StyledImage>

export const Image = StyledImage.extractable(({ src, width, height, ...rest }: ImageProps) => {
  const sourceProp = typeof src === 'string' ? { uri: src, width, height } : src
  if (!sourceProp) {
    return null
  }
  // must set defaultSource to allow SSR, default it to the same as src
  return <StyledImage defaultSource={sourceProp as any} source={sourceProp} {...rest} />
})
