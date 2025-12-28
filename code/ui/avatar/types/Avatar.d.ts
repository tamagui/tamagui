import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import type { ImageProps } from '@tamagui/image';
import * as React from 'react';
declare const createAvatarScope: import("@tamagui/create-context").CreateScope;
type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
type AvatarImageProps = Partial<ImageProps> & {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};
declare const AvatarImage: React.ForwardRefExoticComponent<Partial<ImageProps> & {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
} & React.RefAttributes<TamaguiElement>>;
export declare const AvatarFallbackFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type AvatarFallbackExtraProps = {
    delayMs?: number;
};
type AvatarFallbackProps = GetProps<typeof AvatarFallbackFrame> & AvatarFallbackExtraProps;
declare const AvatarFallback: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "delayMs" | "__scopeAvatar"> & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & AvatarFallbackExtraProps & {
    __scopeAvatar?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const AvatarFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic & {
    memo: true;
}>;
type AvatarProps = GetProps<typeof AvatarFrame>;
/**
 * @summary A component that displays an image or a fallback icon.
 * @see — Docs https://tamagui.dev/ui/avatar
 *
 * @example
 * ```tsx
 * <Avatar circular size="$10">
 *  <Avatar.Image
 *    aria-label="Cam"
 *    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
 *  />
 *  <Avatar.Fallback backgroundColor="$blue10" />
 * </Avatar>
 * ```
 */
declare const Avatar: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "transparent" | "circular" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "padded" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & React.RefAttributes<TamaguiElement>> & {
    Image: React.ForwardRefExoticComponent<Partial<ImageProps> & {
        onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
    } & React.RefAttributes<TamaguiElement>>;
    Fallback: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "delayMs" | "__scopeAvatar"> & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & AvatarFallbackExtraProps & {
        __scopeAvatar?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
};
export { createAvatarScope, Avatar, AvatarImage, AvatarFallback };
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
//# sourceMappingURL=Avatar.d.ts.map