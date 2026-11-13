import { type ComponentSize, type GetProps } from '@tamagui/core';
export type SwitchSize = ComponentSize | boolean;
export declare const SwitchFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SwitchThumbFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Switch: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("@tamagui/switch").SwitchFrameActiveStyleProps> & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/core").NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: import("@tamagui/react-native-types").SwitchProps;
} & import("@tamagui/switch").SwitchFrameActiveStyleProps & import("@tamagui/switch").SwitchSharedProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("@tamagui/switch").SwitchFrameActiveStyleProps>, import("@tamagui/core").StaticConfigPublic>, {
    Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "size"> & import("@tamagui/switch").SwitchSharedProps & import("@tamagui/switch").SwitchThumbActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, "activeStyle" | "size">, import("@tamagui/core").StaticConfigPublic>;
}>;
export declare const SwitchThumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "size"> & import("@tamagui/switch").SwitchSharedProps & import("@tamagui/switch").SwitchThumbActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, "activeStyle" | "size">, import("@tamagui/core").StaticConfigPublic>;
export type SwitchProps = GetProps<typeof Switch>;
//# sourceMappingURL=Switch.d.ts.map