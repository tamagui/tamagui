import type { ScopedProps } from '@tamagui/core';
import { SizeTokens } from '@tamagui/core';
import { Coords, OffsetOptions, Placement, Strategy, UseFloatingReturn, flip, shift } from '@tamagui/floating';
import { SizableStackProps, YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export type PopperContextValue = UseFloatingReturn & {
    isMounted: boolean;
    anchorRef: any;
    size?: SizeTokens;
    placement?: Placement;
    arrowRef: any;
    onArrowSize?: (val: number) => void;
    arrowStyle?: Partial<Coords> & {
        centerOffset: number;
    };
};
export declare const PopperContext: import("@tamagui/core").StyledContext<PopperContextValue>;
export declare const usePopperContext: (scope?: string | undefined) => PopperContextValue, PopperProvider: React.ProviderExoticComponent<Partial<PopperContextValue> & {
    children?: React.ReactNode;
    scope?: string | undefined;
}>;
export type PopperProps = {
    size?: SizeTokens;
    children?: React.ReactNode;
    placement?: Placement;
    stayInFrame?: ShiftProps | boolean;
    allowFlip?: FlipProps | boolean;
    strategy?: Strategy;
    offset?: OffsetOptions;
};
type ScopedPopperProps<P> = ScopedProps<P, 'Popper'>;
export declare function Popper(props: ScopedPopperProps<PopperProps>): JSX.Element;
type PopperAnchorRef = HTMLElement | View;
export type PopperAnchorProps = YStackProps & {
    virtualRef?: React.RefObject<any>;
};
export declare const PopperAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    virtualRef?: React.RefObject<any> | undefined;
} & {
    __scopePopper?: string | undefined;
} & React.RefAttributes<PopperAnchorRef>>;
type PopperContentElement = HTMLElement | View;
export type PopperContentProps = SizableStackProps & {
    enableAnimationForPositionChange?: boolean;
};
export declare const PopperContentFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
    radiused?: boolean | undefined;
    transparent?: boolean | undefined;
    backgrounded?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, {}>;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>> & {
    enableAnimationForPositionChange?: boolean | undefined;
} & {
    __scopePopper?: string | undefined;
} & React.RefAttributes<PopperContentElement>>;
export type PopperArrowProps = YStackProps & {
    offset?: number;
    size?: SizeTokens;
};
export declare const PopperArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "size" | `$${string}` | `$${number}` | "__scopePopper" | "offset" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen" | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & {
    __scopePopper?: string | undefined;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & {
    __scopePopper?: string | undefined;
}, import("@tamagui/core").StackStylePropsBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {}>;
export {};
//# sourceMappingURL=Popper.d.ts.map