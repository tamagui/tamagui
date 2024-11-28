import type { GetProps } from '@tamagui/web';
import * as React from 'react';
type TamaguiButtonElement = HTMLButtonElement;
export type ToggleElement = TamaguiButtonElement;
export declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
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
export declare const Toggle: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "active" | "orientation" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & ToggleItemExtraProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Toggle.d.ts.map