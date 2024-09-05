import React from 'react';
import type { GetProps, RadiusTokens, SizeTokens, StackProps, ThemeValueFallback } from '@tamagui/core';
import type { FC } from 'react';
import { Image as RNImage } from 'react-native';
declare const StyledImage: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, RNImage, import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ImageProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
    borderRadius?: RadiusTokens;
};
type BaseProps = Omit<StyledImageProps, 'width' | 'height' | 'style' | 'onLayout' | 'resizeMode'> & {
    width?: string | number | SizeTokens | ThemeValueFallback;
    height?: string | number | SizeTokens | ThemeValueFallback;
    /**
     * @deprecated use `source` instead to disambiguate width/height style from width/height of the actual image
     */
    src?: string | StyledImageProps['source'];
    /** @deprecated use objectFit instead */
    resizeMode?: StyledImageProps['resizeMode'];
    objectFit?: React.CSSProperties['objectFit'];
};
export type ImageProps = BaseProps & Omit<StackProps, keyof BaseProps>;
type RNImageType = typeof RNImage;
type ImageType = FC<ImageProps> & {
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