import * as React from 'react';
import type { SetRequired } from 'type-fest';
declare type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
declare type LoaderProps<GenericLoaderOpts> = {
    src: HtmlImageProps['src'];
    width: HtmlImageProps['width'];
    height: HtmlImageProps['height'];
    loaderOptions?: GenericLoaderOpts;
};
export declare type ImageProps<GenericLoaderOpts> = SetRequired<HtmlImageProps, 'src' | 'width' | 'height' | 'alt'> & {
    loader?: (params: LoaderProps<GenericLoaderOpts>) => string;
    loaderOptions?: GenericLoaderOpts;
    data?: never;
    widths?: HtmlImageProps['width'][];
};
export declare function Image<GenericLoaderOpts>({ src, width, height, alt, loader, loaderOptions, widths, loading, decoding, ...rest }: ImageProps<GenericLoaderOpts>): JSX.Element;
export {};
//# sourceMappingURL=Image.d.ts.map