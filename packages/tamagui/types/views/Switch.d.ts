import { GetProps, ReactComponentWithRef, SizeTokens } from '@tamagui/core';
import * as React from 'react';
import { View } from 'react-native';
export declare const createSwitchScope: import("@tamagui/create-context").CreateScope;
declare const SwitchFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    size?: SizeTokens | undefined;
}>;
declare type SwitchButtonProps = GetProps<typeof SwitchFrame>;
export declare type SwitchProps = SwitchButtonProps & {
    labeledBy?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    required?: boolean;
    onCheckedChange?(checked: boolean): void;
};
export declare const Switch: ReactComponentWithRef<SwitchProps, HTMLButtonElement | View> & {
    Thumb: typeof SwitchThumb;
};
declare const SwitchThumbFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
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
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & {
    size?: SizeTokens | undefined;
}>;
export declare type SwitchThumbProps = GetProps<typeof SwitchThumbFrame>;
export declare const SwitchThumb: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "size"> & {
    size?: SizeTokens | undefined;
}>> & React.RefAttributes<HTMLSpanElement>>;
export {};
//# sourceMappingURL=Switch.d.ts.map