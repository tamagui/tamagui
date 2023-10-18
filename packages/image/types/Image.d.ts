import { GetProps, RadiusTokens, SizeTokens, StackProps, ThemeValueFallback } from '@tamagui/core';
import React from 'react';
import { Image as RNImage } from 'react-native';
declare const StyledImage: import("@tamagui/core").TamaguiComponent<(import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>) | (import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>>> & import("@tamagui/core").MediaProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>>>), RNImage, import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>, {}, {
    prototype: RNImage;
    getSize: typeof RNImage.getSize;
    getSizeWithHeaders: typeof RNImage.getSizeWithHeaders;
    prefetch: typeof RNImage.prefetch;
    prefetchWithMetadata: typeof RNImage.prefetchWithMetadata;
    abortPrefetch: typeof RNImage.abortPrefetch | undefined;
    queryCache: typeof RNImage.queryCache | undefined;
    resolveAssetSource: typeof RNImage.resolveAssetSource;
    contextType: React.Context<any> | undefined;
}>;
type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
    borderRadius?: RadiusTokens;
};
type BaseProps = Omit<StyledImageProps, 'width' | 'height' | 'style' | 'onLayout'> & {
    width?: string | number | SizeTokens | ThemeValueFallback;
    height?: string | number | SizeTokens | ThemeValueFallback;
    /**
     * @deprecated use `source` instead to disambiguate width/height style from width/height of the actual image
     */
    src?: string | StyledImageProps['source'];
};
export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>;
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