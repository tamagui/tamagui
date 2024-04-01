import { isWeb } from '@tamagui/constants'
import type { StackProps } from '@tamagui/core'
import { Stack, View, getTokenForKey, getTokenValue, styled } from '@tamagui/core'
import { HTMLProps, forwardRef } from 'react'
import { Image as RNImage } from 'react-native'

import type { ImageSourcePropType, ImageProps as RNImageProps } from 'react-native'

// export type ImageProps = Partial<Omit<RNImageProps, keyof StackProps | 'source'>> &
//   StackProps & {
//     /**
//      * @deprecated
//      */
//     source?: ImageSourcePropType
//   }

// type RNImageType = typeof RNImage

// type ImageType = React.FC<ImageProps> & {
//   getSize: RNImageType['getSize']
//   getSizeWithHeaders: RNImageType['getSizeWithHeaders']
//   prefetch: RNImageType['prefetch']
//   prefetchWithMetadata: RNImageType['prefetchWithMetadata']
//   abortPrefetch: RNImageType['abortPrefetch']
//   queryCache: RNImageType['queryCache']
// }

const StyledImage = styled(isWeb ? View : RNImage, {
  name: 'Image',
  ...(isWeb && {
    tag: 'img',
  }),
})

type ImageProps = StackProps & Omit<HTMLImageElement, 'width' | 'height'>

let hasWarned = false

export const Image = StyledImage.styleable<Partial<ImageProps>>((inProps, ref) => {
  const { src, alt, srcset, referrerPolicy, crossOrigin, width, height, ...webProps } =
    inProps
  const bothPlatfromProps = {
    src,
    alt,
    srcset,
    referrerPolicy,
    crossOrigin,
    width,
    height,
  }
  let nativeOnlyProps: RNImageProps | undefined
  if (process.env.TAMAGUI_TARGET === 'native') {
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
    }
  }

  return (
    <StyledImage
      {...(process.env.TAMAGUI_TARGET === 'web' && webProps)}
      {...(nativeOnlyProps as any)}
      ref={ref}
      {...bothPlatfromProps}
    />
  )
})

// Image.getSize = RNImage.getSize
// Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
// Image.prefetch = RNImage.prefetch
// Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
// Image.abortPrefetch = RNImage.abortPrefetch
// Image.queryCache = RNImage.queryCache
