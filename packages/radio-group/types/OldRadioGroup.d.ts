import type { GetProps } from '@tamagui/core';
import * as React from 'react';
import type { View } from 'react-native';
declare const createRadioGroupScope: import("@tamagui/create-context").CreateScope;
declare const RadioGroupItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    pressTheme?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
};
type TamaguiElement = HTMLElement | View;
declare const RadioGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    pressTheme?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type RadioGroupProps = GetProps<typeof RadioGroupFrame> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
};
declare const RadioGroup: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "pressTheme" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "fullscreen" | "circular" | "inset" | "hoverTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "orientation"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    pressTheme?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    pressTheme?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    pressTheme?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & {
    value?: string | undefined;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    name?: string | undefined;
    native?: boolean | undefined;
    accentColor?: string | undefined;
} & React.RefAttributes<TamaguiElement>> & {
    Indicator: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "pressTheme" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "fullscreen" | "circular" | "inset" | "hoverTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        forceMount?: boolean | undefined;
        unstyled?: boolean | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Item: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "pressTheme" | "size" | "disabled" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "fullscreen" | "circular" | "inset" | "hoverTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        pressTheme?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        value: string;
        id?: string | undefined;
        labelledBy?: string | undefined;
        disabled?: boolean | undefined;
    } & React.RefAttributes<HTMLButtonElement>>;
};
export { createRadioGroupScope, RadioGroup };
export type { RadioGroupProps, RadioGroupItemProps };
//# sourceMappingURL=OldRadioGroup.d.ts.map