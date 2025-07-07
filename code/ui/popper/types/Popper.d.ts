import type { ScopedProps, SizeTokens, TamaguiElement } from '@tamagui/core';
import { createStyledContext } from '@tamagui/core';
import type { Coords, OffsetOptions, Placement, SizeOptions, Strategy, UseFloatingReturn } from '@tamagui/floating';
import { flip, shift } from '@tamagui/floating';
import type { SizableStackProps, YStackProps } from '@tamagui/stacks';
import * as React from 'react';
type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export type PopperContextValue = UseFloatingReturn & {
    size?: SizeTokens;
    hasFloating: boolean;
    arrowStyle?: Partial<Coords> & {
        centerOffset: number;
    };
    placement?: Placement;
    arrowRef: any;
    onArrowSize?: (val: number) => void;
};
export declare const PopperContext: import("@tamagui/core").StyledContext<PopperContextValue>;
export declare const PopperPositionContext: typeof createStyledContext;
export declare const usePopperContext: (scope?: string) => PopperContextValue, PopperProvider: React.Provider<PopperContextValue> & React.ProviderExoticComponent<Partial<PopperContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export declare const PopperInfrequentContext: import("@tamagui/core").StyledContext<{
    size?: SizeTokens;
}>;
export declare const usePopperInfrequentContext: (scope?: string) => {
    size?: SizeTokens;
};
export type PopperProps = {
    /**
     * Optional, will disable measuring updates when open is false for better performance
     * */
    open?: boolean;
    size?: SizeTokens;
    children?: React.ReactNode;
    /**
     * Determine the preferred placement of the content in relation to the trigger
     */
    placement?: Placement;
    /**
     * Attempts to shift the content to stay within the windiw
     * @see https://floating-ui.com/docs/shift
     */
    stayInFrame?: ShiftProps | boolean;
    /**
     * Allows content to switch sides when space is limited.
     * @see https://floating-ui.com/docs/flip
     */
    allowFlip?: FlipProps | boolean;
    /**
     * Resizes the content to fix inside the screen when space is limited
     * @see https://floating-ui.com/docs/size
     */
    resize?: boolean | Omit<SizeOptions, 'apply'>;
    /**
     * Choose between absolute or fixed positioning
     */
    strategy?: Strategy;
    /**
     * Move the content away from the trigger
     * @see https://floating-ui.com/docs/offset
     */
    offset?: OffsetOptions;
    disableRTL?: boolean;
    passThrough?: boolean;
};
type ScopedPopperProps<P> = ScopedProps<P, 'Popper'>;
export type PopperSetupOptions = {
    disableRTL?: boolean;
};
export declare function setupPopper(options?: PopperSetupOptions): void;
export declare function Popper(props: ScopedPopperProps<PopperProps>): import("react/jsx-runtime").JSX.Element;
export type PopperAnchorExtraProps = {
    virtualRef?: React.RefObject<any>;
};
export type PopperAnchorProps = YStackProps;
export declare const PopperAnchor: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "__scopePopper" | "virtualRef"> & PopperAnchorExtraProps & {
    __scopePopper?: string | undefined;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperAnchorExtraProps & {
    __scopePopper?: string | undefined;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type PopperContentExtraProps = {
    enableAnimationForPositionChange?: boolean;
    passThrough?: boolean;
};
export type PopperContentProps = SizableStackProps & PopperContentExtraProps;
export declare const PopperContentFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "transparent" | "circular" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "padded" | "elevate" | "bordered" | "chromeless" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
}>> & PopperContentExtraProps & {
    __scopePopper?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopperArrowExtraProps = {
    offset?: number;
    size?: SizeTokens;
    __scopePopper?: string;
};
export type PopperArrowProps = YStackProps & PopperArrowExtraProps;
export declare const PopperArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=Popper.d.ts.map