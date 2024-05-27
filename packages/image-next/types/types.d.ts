/// <reference types="react" />
import type { StackProps } from '@tamagui/core';
import type { Image as RNImage } from 'react-native';
import type { ImageResizeMode, ImageSourcePropType, ImageProps as RNImageProps } from 'react-native';
type RNImageType = typeof RNImage;
type KeyofStackProps = keyof StackProps;
export type ImageProps = StackProps & Omit<RNImageProps, KeyofStackProps | 'source' | 'resizeMode' | 'style'> & {
    /**
     * @deprecated
     * use src instead
     */
    source?: ImageSourcePropType;
    /**
     * @deprecated
     * use objectFit instead
     */
    resizeMode?: ImageResizeMode;
    objectFit?: React.CSSProperties['objectFit'];
    objectPosition?: React.CSSProperties['objectPosition'];
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | KeyofStackProps> & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'style'>;
export type ImageType = React.FC<Partial<ImageProps>> & {
    getSize: RNImageType['getSize'];
    getSizeWithHeaders: RNImageType['getSizeWithHeaders'];
    prefetch: RNImageType['prefetch'];
    prefetchWithMetadata: RNImageType['prefetchWithMetadata'];
    abortPrefetch: RNImageType['abortPrefetch'];
    queryCache: RNImageType['queryCache'];
};
export {};
//# sourceMappingURL=types.d.ts.map