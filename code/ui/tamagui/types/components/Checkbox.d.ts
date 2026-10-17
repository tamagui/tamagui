import { type ComponentSize, type GetProps } from '@tamagui/core';
export type CheckboxSize = ComponentSize | boolean;
export declare const CheckboxFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | keyof import("@tamagui/checkbox-headless").CheckboxExtraProps | keyof {
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
    native?: import("@tamagui/core").NativeValue<'web'>;
} & {
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: CheckboxSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const CheckboxIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "forceMount"> & {
    forceMount?: boolean;
} & {
    activeStyle?: import("@tamagui/core").StylePiece;
}, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
}, "activeStyle" | "forceMount">, import("@tamagui/core").StaticConfigPublic>;
export declare const Checkbox: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | keyof import("@tamagui/checkbox-headless").CheckboxExtraProps | keyof {
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
    native?: import("@tamagui/core").NativeValue<'web'>;
} & {
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: CheckboxSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>, {
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "forceMount"> & {
        forceMount?: boolean;
    } & {
        activeStyle?: import("@tamagui/core").StylePiece;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        active?: boolean | undefined;
    }, "activeStyle" | "forceMount">, import("@tamagui/core").StaticConfigPublic>;
}>;
export type CheckboxProps = GetProps<typeof Checkbox>;
//# sourceMappingURL=Checkbox.d.ts.map