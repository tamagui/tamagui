import { isWeb } from '@tamagui/constants'
import type { StackProps } from '@tamagui/core'
import { View, styled } from '@tamagui/core'
import { forwardRef } from 'react'
import { Image as RNImage } from 'react-native'

import type { ImageSourcePropType, ImageProps as RNImageProps } from 'react-native'

export type ImageProps = Partial<Omit<RNImageProps, keyof StackProps | 'source'>> &
  StackProps & {
    /**
     * @deprecated
     */
    source?: ImageSourcePropType
  }

type RNImageType = typeof RNImage

type ImageType = React.FC<ImageProps> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}

const StyledImage = styled(isWeb ? View : RNImage, {
  name: 'Image',
})

let hasWarned = false

export const Image = StyledImage.styleable<{ cat: boolean }>(
  forwardRef((inProps, ref) => {
    // if (process.env.NODE_ENV === 'development') {
    //   if (typeof src === 'string') {
    //     if (
    //       (typeof props.width === 'string' && props.width[0] !== '$') ||
    //       (typeof props.height === 'string' && props.height[0] !== '$')
    //     ) {
    //       if (!hasWarned) {
    //         hasWarned = true
    //         console.warn(
    //           `React Native expects a numerical width/height. If you want to use a percent you must define the "source" prop with width, height, and uri.`
    //         )
    //       }
    //     }
    //   }
    // }

    // let finalSource =
    //   typeof src === 'string'
    //     ? { uri: src, ...(isWeb && { width: props.width, height: props.height }) }
    //     : source ?? src

    // if (finalSource && typeof finalSource === 'object') {
    //   if (process.env.TAMAGUI_TARGET === 'native') {
    //     // fix: normalize import style images
    //     if (!Array.isArray(finalSource)) {
    //       if (typeof finalSource.uri === 'number') {
    //         finalSource = finalSource.uri
    //         if (source && typeof source === 'object' && !Array.isArray(source)) {
    //           // @ts-ignore
    //           style.width ??= source.width
    //           // @ts-ignore
    //           style.height ??= source.height
    //         }
    //       }
    //     }
    //   }

    //   // require compat across native/web
    //   if (finalSource['default']) {
    //     finalSource = finalSource['default']
    //   }
    // }

    // must set defaultSource to allow SSR, default it to the same as src

    return (
      <StyledImage
        // ref={ref}
        {...inProps}

        // source={finalSource} style={style}

        // {...(rest as any)}
      />
    )
  })
) as any as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
