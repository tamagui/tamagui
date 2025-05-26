import { getTokenValue, styled } from '@tamagui/web'
import { Image as RNImage } from 'react-native'

import type { ImageResizeMode } from 'react-native'
import type { ImageProps, ImageType } from './types'

const StyledImage = styled(RNImage, {
  name: 'Image',
})

export const Image = StyledImage.styleable<ImageProps>((props, ref) => {
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
    onLoad,
    onError,
    ...rest
  } = props

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

  const size = {
    width:
      typeof width === 'string' && width[0] === '$' ? getTokenValue(width as any) : width,
    height:
      typeof height === 'string' && height[0] === '$'
        ? getTokenValue(height as any)
        : height,
  }

  const finalProps = {
    ...rest,
    source:
      !!src && typeof src !== 'string' // In React Native, if an imported (or required) asset is passed as `src`.
        ? src
        : {
            uri: src,
            ...size,
          },
    resizeMode,
    style: size,
  } as any

  if (onLoad) {
    finalProps.onLoad = (e) => {
      const { source } = e.nativeEvent
      onLoad({
        target: {
          naturalHeight: source?.height,
          naturalWidth: source?.width,
        },
        type: 'load',
      } as any)
    }
  }

  if (onError) {
    finalProps.onError = () => {
      onError({
        type: 'error',
      } as any)
    }
  }

  return <StyledImage ref={ref} {...finalProps} />
}) as unknown as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
