import { View, styled } from '@tamagui/web'
import type { ImageProps, ImageType } from './types'

const StyledImage = styled(View, {
  name: 'Image',
  render: 'img',
})

export const Image = StyledImage.styleable<ImageProps>(
  (inProps, ref) => {
    const {
      // exclude native only props
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
      // bridge RN <-> web a11y: <img> only honors `alt`, but consumers writing
      // cross-platform code reach for RN's `accessibilityLabel`. without this
      // mapping the label silently drops on web (no alt text, screen readers
      // announce nothing, and react warns about an unknown prop on <img>).
      accessibilityLabel,
      alt,
      ...rest
    } = inProps as ImageProps & { alt?: string }
    const resolvedAlt = alt ?? accessibilityLabel
    return <StyledImage ref={ref} {...(rest as any)} alt={resolvedAlt} />
  },
  {
    staticConfig: {
      memo: true,
    },
  }
) as unknown as ImageType

const func = (() => {}) as any

Image.getSize = func
Image.getSizeWithHeaders = func
Image.prefetch = func
Image.prefetchWithMetadata = func
Image.abortPrefetch = func
Image.queryCache = func
