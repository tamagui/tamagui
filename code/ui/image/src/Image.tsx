import React from 'react'
import { isWeb } from '@tamagui/constants'
import type {
  GetProps,
  RadiusTokens,
  SizeTokens,
  StackProps,
  ThemeValueFallback,
} from '@tamagui/core'
import { styled, usePropsAndStyle } from '@tamagui/core'
import type { FC } from 'react'
import { Image as RNImage } from 'react-native'

const StyledImage = styled(RNImage, {
  name: 'Image',
})

type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
  borderRadius?: RadiusTokens
}

type BaseProps = Omit<
  StyledImageProps,
  'width' | 'height' | 'style' | 'onLayout' | 'resizeMode'
> & {
  width?: string | number | SizeTokens | ThemeValueFallback
  height?: string | number | SizeTokens | ThemeValueFallback

  /**
   * @deprecated use `source` instead to disambiguate width/height style from width/height of the actual image
   */
  src?: string | StyledImageProps['source']
  /** @deprecated use objectFit instead */
  resizeMode?: StyledImageProps['resizeMode']
  objectFit?: React.CSSProperties['objectFit']
}

export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>

type RNImageType = typeof RNImage

type ImageType = FC<ImageProps> & {
  getSize: RNImageType['getSize']
  getSizeWithHeaders: RNImageType['getSizeWithHeaders']
  prefetch: RNImageType['prefetch']
  prefetchWithMetadata: RNImageType['prefetchWithMetadata']
  abortPrefetch: RNImageType['abortPrefetch']
  queryCache: RNImageType['queryCache']
}

let hasWarned = false

export const Image = StyledImage.styleable<ImageProps>((inProps, ref) => {
  const [props, style] = usePropsAndStyle(inProps)
  const { src, source, objectFit, ...rest } = props

  if (process.env.NODE_ENV === 'development') {
    if (typeof src === 'string') {
      if (
        (typeof props.width === 'string' && props.width[0] !== '$') ||
        (typeof props.height === 'string' && props.height[0] !== '$')
      ) {
        if (!hasWarned) {
          hasWarned = true
          console.warn(
            `React Native expects a numerical width/height. If you want to use a percent you must define the "source" prop with width, height, and uri.`
          )
        }
      }
    }
  }

  let finalSource =
    typeof src === 'string'
      ? {
          uri: src,
          ...(isWeb && {
            width: props.width || style?.width,
            height: props.height || style?.height,
          }),
        }
      : (source ?? src)

  if (finalSource && typeof finalSource === 'object') {
    if (process.env.TAMAGUI_TARGET === 'native') {
      // fix: normalize import style images
      if (!Array.isArray(finalSource)) {
        if (typeof finalSource.uri === 'number') {
          finalSource = finalSource.uri
          if (source && typeof source === 'object' && !Array.isArray(source)) {
            // @ts-ignore
            style.width ??= source.width
            // @ts-ignore
            style.height ??= source.height
          }
        }
      }
    }

    if (process.env.NODE_ENV === 'development' && process.env.TAMAGUI_IMAGE_CHECK_ERROR) {
      // lets add an onload timeout and warning if it fails to load in console
      React.useEffect(() => {
        async function run() {
          if (typeof src === 'string') {
            try {
              await fetch(src).then((res) => res.text())
            } catch (err) {
              console.error(`Error loading image: ${src}`, { props })
            }
          }
        }

        run()
      }, [src])
    }

    // require compat across native/web
    if (finalSource['default']) {
      finalSource = finalSource['default']
    }
  }

  // must set defaultSource to allow SSR, default it to the same as src
  return (
    <RNImage
      resizeMode={objectFit}
      ref={ref}
      source={finalSource}
      style={style}
      {...(rest as any)}
    />
  )
}) as any as ImageType

Image.getSize = RNImage.getSize
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders
Image.prefetch = RNImage.prefetch
Image.prefetchWithMetadata = RNImage.prefetchWithMetadata
Image.abortPrefetch = RNImage.abortPrefetch
Image.queryCache = RNImage.queryCache
