import type { GetProps, TamaguiElement } from '@tamagui/style';
import type { Scope } from '@tamagui/create-context';
import type { ImageProps } from '@tamagui/image';
import * as React from 'react';
declare const createAvatarScope: import("@tamagui/create-context").CreateScope;
type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
type AvatarImageProps = Partial<ImageProps> & {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};
declare const AvatarImage: import("@tamagui/style").RefComponent<TamaguiElement, AvatarImageProps>;
export declare const AvatarFallbackFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
type AvatarFallbackExtraProps = {
    /** The delay in milliseconds before the fallback renders. */
    delay?: number;
};
type AvatarFallbackProps = GetProps<typeof AvatarFallbackFrame> & AvatarFallbackExtraProps;
declare const AvatarFallback: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "__scopeAvatar" | "delay"> & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
export declare const AvatarFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "circular" | "size" | "transparent" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    circular?: boolean | undefined;
    size?: number | import("@tamagui/style").Size | undefined;
    transparent?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    size?: number | import("@tamagui/style").Size | undefined;
    transparent?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic & {
    memo: true;
}> & Omit<import("@tamagui/style").StaticConfigPublic & {
    memo: true;
}, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        circular?: boolean | undefined;
        size?: number | import("@tamagui/style").Size | undefined;
        transparent?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic & {
        memo: true;
    }];
};
type AvatarProps = GetProps<typeof AvatarFrame>;
/**
 * @summary A component that displays an image or a fallback icon.
 * @see — Docs https://tamagui.dev/ui/avatar
 *
 * @example
 * ```tsx
 * <Avatar circular size="10">
 *  <Avatar.Image
 *    aria-label="Cam"
 *    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
 *  />
 *  <Avatar.Fallback backgroundColor="blue-10" />
 * </Avatar>
 * ```
 */
declare const Avatar: ((props: Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "circular" | "size" | "transparent" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    circular?: boolean | undefined;
    size?: number | import("@tamagui/style").Size | undefined;
    transparent?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & import("@tamagui/style").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Image: import("@tamagui/style").RefComponent<TamaguiElement, AvatarImageProps>;
    Fallback: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "__scopeAvatar" | "delay"> & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
};
export { createAvatarScope, Avatar, AvatarImage, AvatarFallback };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
//# sourceMappingURL=Avatar.d.ts.map