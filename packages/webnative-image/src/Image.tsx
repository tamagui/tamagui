import { isWeb } from '@tamagui/constants'
import type { StackProps } from '@tamagui/core'
import { View, getTokenValue, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'

import type {
  ImageResizeMode,
  ImageSourcePropType,
  ImageProps as RNImageProps,
} from 'react-native'

type RNImageType = typeof RNImage

const StyledImage = styled(isWeb ? View : RNImage, {
  name: 'Image',
  ...(isWeb && {
    tag: 'img',
  }),
})

type ImageProps = StackProps &
  Omit<RNImageProps, keyof StackProps | 'source' | 'resizeMode'> & {
    /**
     * @deprecated
     * use src instead
     */
    source?: ImageSourcePropType
    /**
     * @deprecated
     * use objectFit instead
     */
    resizeMode?: ImageResizeMode
  } & Omit<HTMLImageElement['style'], 'width' | 'height'> &
  Omit<React.HTMLProps<HTMLImageElement>, 'width' | 'height' | 'style'> &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'style'>

type ImageType = React.FC<Partial<ImageProps>> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}

let hasWarned = false

export const Image = StyledImage.styleable<ImageProps>((inProps, ref) => {
  const {
    src,
    width,
    height,
    objectFit,
    objectPosition,
    // native only props
    blurRadius,
    capInsets,
    defaultSource,
    fadeDuration,
    loadingIndicatorSource,
    onLoadEnd,
    onPartialLoad,
    progressiveRenderingEnabled,
    resizeMethod,
    tintColor,
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

  let webOnlyProps: Partial<ImageProps> | undefined = {}
  if (process.env.TAMAGUI_TARGET === 'web') {
    Object.assign(webOnlyProps, {
      objectFit,
      src,
      decoding,
      elementTiming,
      fetchpriority,
      isMap,
      loading,
      sizes,
      useMap,
    })
  }

  let nativeOnlyProps: RNImageProps | undefined
  if (process.env.TAMAGUI_TARGET === 'native') {
    let resizeMode: ImageResizeMode = 'cover'
    if (objectFit) {
      resizeMode = ({
        contain: 'contain',
        cover: 'cover',
        fill: 'stretch',
        none: 'center',
        scaleDown: 'contain',
      }[objectFit] || 'cover') as ImageResizeMode
    }
    nativeOnlyProps = {
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
      blurRadius,
      capInsets,
      fadeDuration,
      loadingIndicatorSource,
      resizeMethod,
      tintColor,
      defaultSource,
      onLoadEnd,
      onPartialLoad,
      progressiveRenderingEnabled,
    }
  }

  const finalProps = {
    width:
      typeof width === 'string' && width[0] === '$' ? getTokenValue(width as any) : width,
    height:
      typeof height === 'string' && height[0] === '$'
        ? getTokenValue(height as any)
        : height,
  }

  return (
    <StyledImage
      {...rest}
      {...webOnlyProps}
      {...nativeOnlyProps}
      ref={ref}
      {...finalProps}
    />
  )
}) as unknown as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
