import { GetProps, RadiusTokens, SizeTokens, StackProps } from '@tamagui/core';
import React from 'react';
import { Image as RNImage } from 'react-native';
declare const StyledImage: import("@tamagui/core").TamaguiComponent<(import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>) | (import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), import("@tamagui/core").TamaguiElement, import("react-native").ImageProps & Omit<StackProps, keyof import("react-native").ImageProps>, {} | {
    [x: string]: undefined;
}>;
type StyledImageProps = Omit<GetProps<typeof StyledImage>, 'borderRadius'> & {
    borderRadius?: RadiusTokens;
};
type BaseProps = Omit<StyledImageProps, 'source' | 'width' | 'height' | 'style' | 'onLayout'> & {
    width: number | SizeTokens;
    height: number | SizeTokens;
    src: string | StyledImageProps['source'];
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