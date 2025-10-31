import type { GetProps } from '@tamagui/web';
import * as React from 'react';
export declare const context: import("@tamagui/web").StyledContext<{
    color: string;
}>;
type TamaguiButtonElement = HTMLButtonElement;
export type ToggleElement = TamaguiButtonElement;
export declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: import("@tamagui/web").ColorTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
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
export declare const Toggle: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "color" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "unstyled" | "active" | "orientation"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: import("@tamagui/web").ColorTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeAndShorthands<import("@tamagui/web").StackStyleBase, {
    color?: import("@tamagui/web").ColorTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: import("@tamagui/web").ColorTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}>> & ToggleItemExtraProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Toggle.d.ts.map