import React from 'react';
import type { GetProps, RadiusTokens, SizeTokens, ViewProps, ThemeValueFallback } from '@tamagui/web';
import type { FC } from 'react';
import { Image as RNImage } from 'react-native';
declare const StyledImage: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ImageProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
    ref?: React.Ref<RNImage> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, RNImage, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ImageProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, RNImage, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ImageProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
};
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
export type ImageProps = BaseProps & Omit<ViewProps, keyof BaseProps>;
type RNImageType = typeof RNImage;
type ImageType = FC<ImageProps> & {
    getSize: RNImageType['getSize'];
    getSizeWithHeaders: RNImageType['getSizeWithHeaders'];
    prefetch: RNImageType['prefetch'];
    prefetchWithMetadata: RNImageType['prefetchWithMetadata'];
    abortPrefetch: RNImageType['abortPrefetch'];
    queryCache: RNImageType['queryCache'];
};
/**
 * @summary An image is a component that displays an image.
 * @see — Docs https://tamagui.dev/ui/image
 */
export declare const Image: ImageType;
export {};
//# sourceMappingURL=Image.d.ts.map