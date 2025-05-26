import { View, styled } from '@tamagui/web'

import type { ImageProps, ImageType } from './types'

const StyledImage = styled(View, {
  name: 'Image',
  tag: 'img',
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
      resizeMode,
      tintColor,
      ...rest
    } = inProps

    return <StyledImage ref={ref} {...rest} />
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
