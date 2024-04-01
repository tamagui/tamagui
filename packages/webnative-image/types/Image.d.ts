/// <reference types="react" />
import type { StackProps } from '@tamagui/core';
import { Image as RNImage } from 'react-native';
import type { ImageResizeMode, ImageSourcePropType, ImageProps as RNImageProps } from 'react-native';
type RNImageType = typeof RNImage;
type ImageProps = StackProps & Omit<RNImageProps, keyof StackProps | 'source' | 'resizeMode'> & {
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
} & Omit<HTMLImageElement['style'], 'width' | 'height'> & Omit<React.HTMLProps<HTMLImageElement>, 'width' | 'height' | 'style'> & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'style'>;
type ImageType = React.FC<Partial<ImageProps>> & {
    getSize: RNImageType['getSize'];
    getSizeWithHeaders: RNImageType['getSizeWithHeaders'];
    prefetch: RNImageType['prefetch'];
    prefetchWithMetadata: RNImageType['prefetchWithMetadata'];
    abortPrefetch: RNImageType['abortPrefetch'];
    queryCache: RNImageType['queryCache'];
};
export declare const Image: ImageType;
export {};
//# sourceMappingURL=Image.d.ts.map