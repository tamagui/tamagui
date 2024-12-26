import type { ScopedProps, SizeTokens } from '@tamagui/core';
import type { Coords, OffsetOptions, Placement, Strategy, UseFloatingReturn } from '@tamagui/floating';
import { flip, shift } from '@tamagui/floating';
import type { SizableStackProps, YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import type { View } from 'react-native';
type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export type PopperContextValue = UseFloatingReturn & {
    size?: SizeTokens;
    placement?: Placement;
    arrowRef: any;
    onArrowSize?: (val: number) => void;
    hasFloating: boolean;
    arrowStyle?: Partial<Coords> & {
        centerOffset: number;
    };
};
export declare const PopperContext: import("@tamagui/core").StyledContext<PopperContextValue>;
export declare const usePopperContext: (scope?: string) => PopperContextValue, PopperProvider: React.ProviderExoticComponent<Partial<PopperContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export type PopperProps = {
    size?: SizeTokens;
    children?: React.ReactNode;
    placement?: Placement;
    stayInFrame?: ShiftProps | boolean;
    allowFlip?: FlipProps | boolean;
    strategy?: Strategy;
    offset?: OffsetOptions;
    disableRTL?: boolean;
};
type ScopedPopperProps<P> = ScopedProps<P, 'Popper'>;
export type PopperSetupOptions = {
    disableRTL?: boolean;
};
export declare function setupPopper(options?: PopperSetupOptions): void;
export declare function Popper(props: ScopedPopperProps<PopperProps>): import("react/jsx-runtime").JSX.Element;
type PopperAnchorRef = HTMLElement | View;
export type PopperAnchorProps = YStackProps & {
    virtualRef?: React.RefObject<any>;
};
export declare const PopperAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    virtualRef?: React.RefObject<any>;
} & {
    __scopePopper?: string | undefined;
} & React.RefAttributes<PopperAnchorRef>>;
type PopperContentElement = HTMLElement | View;
export type PopperContentProps = SizableStackProps & {
    enableAnimationForPositionChange?: boolean;
};
export declare const PopperContentFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>> & {
    enableAnimationForPositionChange?: boolean;
} & {
    __scopePopper?: string | undefined;
} & React.RefAttributes<PopperContentElement>>;
export type PopperArrowExtraProps = {
    offset?: number;
    size?: SizeTokens;
    __scopePopper?: string;
};
export type PopperArrowProps = YStackProps & PopperArrowExtraProps;
export declare const PopperArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=Popper.d.ts.map