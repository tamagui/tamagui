import React from 'react';
import { ThemeName } from 'tamagui';
export declare const tints: ThemeName[];
export declare const logoColors: string[];
export declare const TamaguiLogo: React.ForwardRefExoticComponent<{
    onHoverLetter?: ((i: number) => void) | undefined;
    showWords?: boolean | undefined;
    color?: string | undefined;
    downscale?: number | undefined;
} & Omit<import("react-native").ViewProps, "children" | "display"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("tamagui").RNWViewProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("tamagui").SizeTokens | undefined;
}>> & React.RefAttributes<unknown>>;
export declare const LogoWords: ({ color, downscale, onHoverLetter, }: {
    color?: string | undefined;
    downscale?: number | undefined;
    onHoverLetter?: any;
}) => JSX.Element;
export declare const LogoIcon: ({ downscale }: any) => JSX.Element;
//# sourceMappingURL=TamaguiLogo.d.ts.map