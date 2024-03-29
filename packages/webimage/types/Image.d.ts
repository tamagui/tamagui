/// <reference types="react" />
import type { StackProps } from '@tamagui/core';
import { Image as RNImage } from 'react-native';
import type { ImageSourcePropType, ImageProps as RNImageProps } from 'react-native';
export type ImageProps = Partial<Omit<RNImageProps, keyof StackProps | 'source'>> & StackProps & {
    /**
     * @deprecated
     */
    source?: ImageSourcePropType;
};
type RNImageType = typeof RNImage;
type ImageType = React.FC<ImageProps> & {
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