import { getTokenValue, styled } from '@tamagui/web'
import type { ComponentType } from 'react'
import type { ImageResizeMode } from 'react-native'
import type { ImageProps, ImageType } from './types'

type GetProps<T> = T extends ComponentType<infer P> ? P : never

export type CreateImageOptions<C extends ComponentType<any>> = {
  /**
   * The underlying image component to use.
   * Can be React Native Image, expo-image, react-native-fast-image, or any compatible component.
   */
  Component: C
  /**
   * Map objectFit CSS values to the component's resize mode prop.
   * Default maps to React Native's resizeMode.
   */
  mapObjectFitToResizeMode?: (objectFit: string) => string
  /**
   * The prop name used for resize mode.
   * Default: 'resizeMode' (React Native)
   * expo-image uses: 'contentFit'
   */
  resizeModePropName?: string
  /**
   * The prop name used for object position.
   * Default: undefined (React Native doesn't support it)
   * expo-image uses: 'contentPosition'
   */
  objectPositionPropName?: string
  /**
   * Custom source transformation.
   * Useful for expo-image which has a different source format.
   */
  transformSource?: (props: {
    src?: string
    source?: any
    width?: any
    height?: any
  }) => any
}

const defaultObjectFitMap = (objectFit: string): ImageResizeMode => {
  switch (objectFit) {
    case 'fill':
      return 'stretch'
    case 'none':
      return 'center'
    case 'scale-down':
      return 'contain'
    case 'contain':
      return 'contain'
    default:
      return 'cover'
  }
}

const defaultTransformSource = (props: {
  src?: string
  source?: any
  width?: any
  height?: any
}) => {
  const { src, source, width, height } = props
  if (source) return source
  if (src && typeof src !== 'string') return src
  return {
    uri: src,
    width,
    height,
  }
}

/**
 * Create a custom Image component with a pluggable underlying implementation.
 *
 * @example
 * Using with expo-image
 * import { Image as ExpoImage } from 'expo-image'
 * import { createImage } from '@tamagui/image'
 *
 * export const Image = createImage({
 *   Component: ExpoImage,
 *   resizeModePropName: 'contentFit',
 *   objectPositionPropName: 'contentPosition',
 * })
 *
 * Now you get all expo-image props (transition, placeholder, etc.)
 * plus Tamagui's unified API (src, objectFit, objectPosition)
 * <Image
 *   src="https://example.com/photo.jpg"
 *   objectFit="cover"
 *   transition={300}
 *   placeholder={blurhash}
 * />
 */
export function createImage<C extends ComponentType<any>>(
  options: CreateImageOptions<C>
) {
  const {
    Component,
    mapObjectFitToResizeMode = defaultObjectFitMap,
    resizeModePropName = 'resizeMode',
    objectPositionPropName,
    transformSource = defaultTransformSource,
  } = options

  // Props that should pass directly to the underlying component without Tamagui processing
  const inlinePropsSet = new Set([
    'source',
    'placeholder',
    'transition',
    'contentFit',
    'contentPosition',
    'cachePolicy',
    'recyclingKey',
    'allowDownscaling',
    'autoplay',
    'blurRadius',
    'priority',
    'placeholderContentFit',
    'responsivePolicy',
    'onLoadStart',
    'onProgress',
    'onLoadEnd',
  ])

  const StyledImage = styled(
    Component as ComponentType<any>,
    {
      name: 'Image',
    },
    {
      inlineProps: inlinePropsSet,
    }
  )

  // Combined props: ImageProps (Tamagui) + Component's native props
  type CombinedProps = ImageProps & Omit<GetProps<C>, keyof ImageProps>

  const ImageComponent = StyledImage.styleable<CombinedProps>((incomingProps, ref) => {
    const props = incomingProps as any
    const {
      src,
      width,
      height,
      objectFit,
      objectPosition,
      // web only props - filter out on native
      decoding,
      elementTiming,
      fetchpriority,
      isMap,
      loading,
      sizes,
      useMap,
      onLoad,
      onError,
      ...rest
    } = props

    const resolvedWidth =
      typeof width === 'string' && width[0] === '$' ? getTokenValue(width as any) : width
    const resolvedHeight =
      typeof height === 'string' && height[0] === '$'
        ? getTokenValue(height as any)
        : height

    const finalSource = transformSource({
      src,
      width: resolvedWidth,
      height: resolvedHeight,
    })

    const finalProps: any = {
      ...rest,
      source: finalSource,
      style: {
        width: resolvedWidth,
        height: resolvedHeight,
      },
    }

    // Set resize mode / content fit
    if (objectFit) {
      finalProps[resizeModePropName] = mapObjectFitToResizeMode(objectFit)
    }

    // Add object position if supported
    if (objectPositionPropName && objectPosition) {
      finalProps[objectPositionPropName] = objectPosition
    }

    // Normalize onLoad event
    if (onLoad) {
      finalProps.onLoad = (e: any) => {
        const source = e?.nativeEvent?.source || e?.source || {}
        onLoad({
          target: {
            naturalHeight: source?.height,
            naturalWidth: source?.width,
          },
          type: 'load',
        } as any)
      }
    }

    // Normalize onError event
    if (onError) {
      finalProps.onError = () => {
        onError({
          type: 'error',
        } as any)
      }
    }

    // Render the underlying Component directly to ensure all props pass through
    return <Component ref={ref} {...finalProps} />
  }) as unknown as ImageType & React.FC<CombinedProps>

  // Add static methods if the component has them
  const comp = Component as any
  ImageComponent.getSize = comp.getSize || (() => {})
  ImageComponent.getSizeWithHeaders = comp.getSizeWithHeaders || (() => {})
  ImageComponent.prefetch = comp.prefetch || (() => {})
  ImageComponent.prefetchWithMetadata = comp.prefetchWithMetadata || (() => {})
  ImageComponent.abortPrefetch = comp.abortPrefetch || (() => {})
  ImageComponent.queryCache = comp.queryCache || (() => {})

  return ImageComponent
}
