import type { GetProps } from '@tamagui/web';
import * as React from 'react';
type TamaguiButtonElement = HTMLButtonElement;
export type ToggleElement = TamaguiButtonElement;
export declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    pressTheme?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleItemExtraProps = {
    defaultValue?: string;
    disabled?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?(pressed: boolean): void;
};
export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps;
export declare const Toggle: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "pressTheme" | "active" | "orientation" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "fullscreen" | "circular" | "inset" | "hoverTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    pressTheme?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    pressTheme?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    pressTheme?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & ToggleItemExtraProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Toggle.d.ts.map