import * as React from 'react'
import type { SetRequired } from 'type-fest'

type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>

type LoaderProps<GenericLoaderOpts> = {
  /** A URL string. This string can be an absolute path or a relative path depending
   * on the `loader`. The `src` prop is required if `data` isn't used, but both
   * props shouldn't be used at the same time. If both `src` and `data` are passed,
   * then `data` takes priority.
   */
  src: HtmlImageProps['src']
  /** The integer or string value for the width of the image. This is a required prop
   * when `src` is present.
   */
  width: HtmlImageProps['width']
  /** The integer or string value for the height of the image. This is a required prop
   * when `src` is present.
   */
  height: HtmlImageProps['height']
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
   * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
   * prop is used, the data shape is whatever you define it to be, and this shape
   * will be passed to `loader`.
   */
  loaderOptions?: GenericLoaderOpts
}

export type ImageProps<GenericLoaderOpts> = SetRequired<
  HtmlImageProps,
  'src' | 'width' | 'height' | 'alt'
> & {
  /** A custom function that generates the image URL. Parameters passed in
   * are either `ShopifyLoaderParams` if using the `data` prop, or the
   * `LoaderOptions` object that you pass to `loaderOptions`.
   */
  loader?: (params: LoaderProps<GenericLoaderOpts>) => string
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
   * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
   * prop is used, the data shape is whatever you define it to be, and this shape
   * will be passed to `loader`.
   */
  loaderOptions?: GenericLoaderOpts
  /**
   * 'data' shouldn't be passed when 'src' is used.
   */
  data?: never
  /**
   * An array of pixel widths to generate a srcset. For example, `[300, 600, 800]`.
   */
  widths?: HtmlImageProps['width'][]
}

/**
 * If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the image's aspect ratio,
 * provided that both `data.width` and `data.height` are available. If `data.width` and `data.height` aren't available, then the aspect ratio cannot be determined and the missing
 * value will remain as `null`
 */
export function Image<GenericLoaderOpts>({
  src,
  width,
  height,
  alt,
  loader,
  loaderOptions,
  widths,
  loading,
  decoding = 'async',
  ...rest
}: ImageProps<GenericLoaderOpts>) {
  if (!width || !height) {
    throw new Error(
      `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
    )
  }

  if (__UNAGI_DEV__ && !alt) {
    console.warn(
      `<Image/>: when 'src' is provided, 'alt' should also be provided. ${`Image: ${src}`}`
    )
  }

  if (widths && Array.isArray(widths) && widths.some((size) => isNaN(size as number)))
    throw new Error(`<Image/>: the 'widths' property must be an array of numbers`)

  let finalSrc = src

  if (loader) {
    finalSrc = loader({ src, width, height, ...loaderOptions })
    if (typeof finalSrc !== 'string' || !finalSrc) {
      throw new Error(`<Image/>: 'loader' did not return a valid string`)
    }
  }
  let finalSrcset = rest.srcSet ?? undefined

  if (!finalSrcset && loader && widths) {
    // Height is a requirement in the LoaderProps, so  to keep the aspect ratio, we must determine the height based on the default values
    const heightToWidthRatio = parseInt(height.toString()) / parseInt(width.toString())
    finalSrcset = widths
      ?.map((width) => parseInt(width as string, 10))
      ?.map(
        (width) =>
          `${loader({
            ...loaderOptions,
            src,
            width,
            height: Math.floor(width * heightToWidthRatio),
          })} ${width}w`
      )
      .join(', ')
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      {...rest}
      src={finalSrc}
      // @ts-expect-error TS doesn't understand that it could exist
      width={loaderOptions?.width ?? width}
      // @ts-expect-error TS doesn't understand that it could exist
      height={loaderOptions?.height ?? height}
      alt={alt ?? ''}
      loading={loading ?? 'lazy'}
      srcSet={finalSrcset}
      decoding={decoding}
    />
  )
  /* eslint-enable hydrogen/prefer-image-component */
}
