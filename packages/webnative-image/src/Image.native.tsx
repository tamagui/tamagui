import { getTokenValue, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'

import type { ImageResizeMode } from 'react-native'
import { ImageProps, ImageType } from './types'

const StyledImage = styled(RNImage, {
  name: 'Image',
})

export const Image = StyledImage.styleable<ImageProps>((inProps, ref) => {
  const {
    src,
    width,
    height,
    objectFit,
    objectPosition,
    // web only props
    decoding,
    //@ts-ignore
    elementTiming,
    //@ts-ignore
    fetchpriority,
    //@ts-ignore
    isMap,
    loading,
    sizes,
    useMap,
    ...rest
  } = inProps

  let resizeMode: ImageResizeMode = 'cover'
  if (objectFit) {
    resizeMode = objectFit as ImageResizeMode
    if (objectFit === 'fill') {
      resizeMode = 'stretch'
    } else if (objectFit === 'none') {
      resizeMode = 'center'
    } else if (objectFit === 'scale-down') {
      resizeMode = 'contain'
    } else if (objectFit === 'contain') {
      resizeMode = 'contain'
    } else if (objectFit === 'cover') {
      resizeMode = 'cover'
    } else {
      resizeMode = 'cover'
    }
  }

  const finalProps = {
    source: {
      uri: src,
      width:
        typeof width === 'string' && width[0] === '$'
          ? getTokenValue(width as any)
          : width,
      height:
        typeof height === 'string' && height[0] === '$'
          ? getTokenValue(height as any)
          : height,
    },
    resizeMode,
  }

  return <StyledImage {...(rest as any)} ref={ref} {...finalProps} />
}) as unknown as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
