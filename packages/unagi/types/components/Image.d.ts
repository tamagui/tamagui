import * as React from 'react';
import type { SetRequired } from 'type-fest';
declare type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
declare type LoaderProps<GenericLoaderOpts> = {
    /** A URL string. This string can be an absolute path or a relative path depending
     * on the `loader`. The `src` prop is required if `data` isn't used, but both
     * props shouldn't be used at the same time. If both `src` and `data` are passed,
     * then `data` takes priority.
     */
    src: HtmlImageProps['src'];
    /** The integer or string value for the width of the image. This is a required prop
     * when `src` is present.
     */
    width: HtmlImageProps['width'];
    /** The integer or string value for the height of the image. This is a required prop
     * when `src` is present.
     */
    height: HtmlImageProps['height'];
    /** An object of `loader` function options. For example, if the `loader` function
     * requires a `scale` option, then the value can be a property of the
     * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
     * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
     * prop is used, the data shape is whatever you define it to be, and this shape
     * will be passed to `loader`.
     */
    loaderOptions?: GenericLoaderOpts;
};
export declare type ImageProps<GenericLoaderOpts> = SetRequired<HtmlImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    /** A custom function that generates the image URL. Parameters passed in
     * are either `ShopifyLoaderParams` if using the `data` prop, or the
     * `LoaderOptions` object that you pass to `loaderOptions`.
     */
    loader?: (params: LoaderProps<GenericLoaderOpts>) => string;
    /** An object of `loader` function options. For example, if the `loader` function
     * requires a `scale` option, then the value can be a property of the
     * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
     * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
     * prop is used, the data shape is whatever you define it to be, and this shape
     * will be passed to `loader`.
     */
    loaderOptions?: GenericLoaderOpts;
    /**
     * 'data' shouldn't be passed when 'src' is used.
     */
    data?: never;
    /**
     * An array of pixel widths to generate a srcset. For example, `[300, 600, 800]`.
     */
    widths?: HtmlImageProps['width'][];
};
/**
 * If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the image's aspect ratio,
 * provided that both `data.width` and `data.height` are available. If `data.width` and `data.height` aren't available, then the aspect ratio cannot be determined and the missing
 * value will remain as `null`
 */
export declare function Image<GenericLoaderOpts>({ src, width, height, alt, loader, loaderOptions, widths, loading, decoding, ...rest }: ImageProps<GenericLoaderOpts>): JSX.Element;
export {};
//# sourceMappingURL=Image.d.ts.map