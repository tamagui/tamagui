import { GetProps, SizeTokens } from '@tamagui/core';
import React from 'react';
import { View } from 'react-native';
declare type CardContextValue = {
    size?: SizeTokens;
};
declare const createCardScope: import("@tamagui/create-context").CreateScope;
declare const useCardContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<CardContextValue | undefined>) => CardContextValue;
export declare const CardFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
}>;
export declare const CardHeader: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
}>;
export declare const CardFooter: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & {
    size?: SizeTokens | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export declare const CardBackground: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export declare type CardHeaderProps = GetProps<typeof CardHeader>;
export declare type CardFooterProps = GetProps<typeof CardFooter>;
export declare type CardProps = GetProps<typeof CardFrame>;
export declare const Card: ((props: Omit<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & {
    __scopeCard?: import("@tamagui/create-context").Scope<any>;
} & React.RefAttributes<View | HTMLElement>, "theme" | "themeInverse"> & {
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    themeInverse?: boolean | undefined;
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
    Header: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    }>>, any, import("@tamagui/core").StackPropsBase, {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & {
        size?: SizeTokens | undefined;
    }>;
    Footer: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, "size"> & {
        size?: SizeTokens | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & {
        size?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & {
        size?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & {
        size?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & {
        size?: SizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
    Background: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "fontFamily" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "circular" | "padded" | "elevate" | "bordered" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
};
export { createCardScope, useCardContext };
//# sourceMappingURL=Card.d.ts.map