import React from 'react';
import { ThemeName } from 'tamagui';
export declare const tints: ThemeName[];
export declare const logoColors: string[];
export declare const TamaguiLogo: React.ForwardRefExoticComponent<{
    onHoverLetter?: ((i: number) => void) | undefined;
    showWords?: boolean | undefined;
    color?: string | undefined;
    downscale?: number | undefined;
    pathPrefix?: string | undefined;
    animated?: boolean | undefined;
} & Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
}>> & React.RefAttributes<any>>;
export declare const LogoWords: ({ color, downscale, onHoverLetter, animated, }: {
    color?: string | undefined;
    downscale?: number | undefined;
    onHoverLetter?: any;
    animated?: boolean | undefined;
}) => JSX.Element;
export declare const LogoIcon: ({ downscale, pathPrefix }: any) => JSX.Element;
//# sourceMappingURL=TamaguiLogo.d.ts.map