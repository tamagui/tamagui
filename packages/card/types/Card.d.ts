import { GetProps, SizeTokens } from '@tamagui/core';
import React from 'react';
declare type CardContextValue = {
    size?: SizeTokens;
};
export declare const createCardContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>) => ContextValueType], createCardScope: import("@tamagui/create-context").CreateScope;
declare const useCardContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<CardContextValue | undefined>) => CardContextValue;
export declare type CardProps = GetProps<typeof CardFrame>;
declare const CardFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & {
    size?: SizeTokens | undefined;
}>;
declare const CardHeader: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
declare const CardFooter: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
declare const CardBackground: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export declare type CardHeaderProps = GetProps<typeof CardHeader>;
export declare type CardFooterProps = GetProps<typeof CardFooter>;
export declare const Card: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    pad?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & {
    __scopeCard?: import("@tamagui/create-context").Scope<any>;
} & React.RefAttributes<unknown>> & {
    Header: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
    Footer: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
    Background: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    }, "size" | "focusable" | "fontFamily" | "disabled" | "hoverable" | "pressable" | "circular" | "elevate" | "bordered" | "transparent" | "pad" | "chromeless"> & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        fullscreen?: boolean | undefined;
        elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        pad?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
};
export { useCardContext, CardHeader, CardFooter, CardBackground };
//# sourceMappingURL=Card.d.ts.map