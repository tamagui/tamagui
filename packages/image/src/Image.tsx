import {
  GetProps,
  RadiusTokens,
  StackProps,
  isWeb,
  setupReactNative,
  styled,
  useMediaPropsActive,
} from '@tamagui/core'
import React, { forwardRef } from 'react'
import { Image as RNImage } from 'react-native'

setupReactNative({
  Image: RNImage,
})

const StyledImage = styled(RNImage, {
  name: 'Image',
  position: 'relative',
  source: { uri: '' },
  zIndex: 1,
})

type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
  borderRadius?: RadiusTokens
}

type BaseProps = Omit<
  StyledImageProps,
  'source' | 'width' | 'height' | 'style' | 'onLayout'
> & {
  width: number | string
  height: number | string
  src: string | StyledImageProps['source']
}

export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>

type RNImageType = typeof RNImage

type ImageType = React.FC<ImageProps> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}

export const Image = StyledImage.extractable(
  forwardRef((inProps: ImageProps, ref) => {
    const props = useMediaPropsActive(inProps)
    const { src, ...rest } = props
    const source =
      typeof src === 'string'
        ? { uri: src, ...(isWeb && { width: props.width, height: props.height }) }
        : src

    // must set defaultSource to allow SSR, default it to the same as src
    return <StyledImage ref={ref} source={source} {...(rest as any)} />
  })
) as any as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
