import { GetProps, TamaguiComponent, TamaguiElement, ThemeableProps } from '@tamagui/core';
import { TextParentStyles } from '@tamagui/text';
import React, { FunctionComponent } from 'react';
declare type ListItemIconProps = {
    color?: string;
    size?: number;
};
declare type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;
export declare type ListItemProps = Omit<TextParentStyles, 'TextComponent'> & GetProps<typeof ListItemFrame> & ThemeableProps & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    spaceFlex?: number | boolean;
    scaleSpace?: number;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
};
export declare const ListItemFrame: TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "active"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "active"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "active"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
    size?: import("@tamagui/core").SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}>;
export declare const ListItemText: TamaguiComponent<unknown, any, unknown, {}>;
export declare const ListItemSubtitle: TamaguiComponent<unknown, any, unknown, {}>;
export declare const ListItem: import("@tamagui/core").ReactComponentWithRef<ListItemProps, TamaguiElement> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    extractable: <X>(a: X, opts?: Partial<import("@tamagui/core").StaticConfig> | undefined) => X;
} & {
    Text: TamaguiComponent<unknown, any, unknown, {}>;
    Subtitle: TamaguiComponent<unknown, any, unknown, {}>;
};
export {};
//# sourceMappingURL=ListItem.d.ts.map