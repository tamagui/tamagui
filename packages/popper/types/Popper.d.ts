import { SizeTokens } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import { SizableStackProps, YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
import { Coords, Placement, flip, shift } from './floating';
import { UseFloatingResult } from './useFloating';
declare type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
declare type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export declare const createPopperScope: import("@tamagui/create-context").CreateScope;
declare type PopperContextValue = UseFloatingResult & {
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
declare const usePopperContext: (consumerName: string, scope: Scope<PopperContextValue | undefined>) => PopperContextValue;
export declare type PopperProps = {
    size?: SizeTokens;
    children?: React.ReactNode;
    placement?: Placement;
    stayInFrame?: ShiftProps;
    allowFlip?: FlipProps;
};
export declare const Popper: React.FC<PopperProps>;
declare type PopperAnchorRef = HTMLElement | View;
export declare type PopperAnchorProps = YStackProps & {
    virtualRef?: React.RefObject<any>;
};
export declare const PopperAnchor: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & {
    virtualRef?: React.RefObject<any> | undefined;
} & React.RefAttributes<PopperAnchorRef>>;
declare type PopperContentElement = HTMLElement | View;
export declare type PopperContentProps = SizableStackProps;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "size" | "fontFamily" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "elevate" | "bordered"> & {
    fontFamily?: unknown;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "size" | "fontFamily" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "elevate" | "bordered"> & {
    fontFamily?: unknown;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "size" | "fontFamily" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "elevate" | "bordered"> & {
    fontFamily?: unknown;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
}>> & React.RefAttributes<PopperContentElement>>;
declare type PopperArrowElement = HTMLElement | View;
export declare type PopperArrowProps = YStackProps & {
    offset?: number;
    size?: SizeTokens;
};
export declare const PopperArrow: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & React.RefAttributes<PopperArrowElement>>;
export { usePopperContext };
//# sourceMappingURL=Popper.d.ts.map