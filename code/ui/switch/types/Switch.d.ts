import { type ThemeProps } from '@tamagui/core';
import type { SwitchComponent as SwitchFrameComponent, SwitchSharedProps, SwitchThumbActiveStyleProps, SwitchThumbComponent as SwitchThumbFrameComponent } from './types';
export declare const SwitchThumbFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SwitchFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare function createSwitch(createProps: {
    Frame?: SwitchFrameComponent;
    Thumb?: SwitchThumbFrameComponent;
    /**
     * theme the whole control swaps onto while checked, so the track fill and the
     * thumb move together. the `activeTheme` prop overrides it per instance.
     */
    activeTheme?: ThemeProps['name'];
}): import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("./types").SwitchFrameActiveStyleProps> & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/core").NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: import("@tamagui/react-native-types").SwitchProps;
} & import("./types").SwitchFrameActiveStyleProps & SwitchSharedProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("./types").SwitchFrameActiveStyleProps>, import("@tamagui/core").StaticConfigPublic>, {
    Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "size"> & SwitchSharedProps & SwitchThumbActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, "activeStyle" | "size">, import("@tamagui/core").StaticConfigPublic>;
}>;
export declare const Switch: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("./types").SwitchFrameActiveStyleProps> & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/core").NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: import("@tamagui/react-native-types").SwitchProps;
} & import("./types").SwitchFrameActiveStyleProps & SwitchSharedProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, "native" | "nativeProps" | "size" | keyof import("@tamagui/switch-headless").SwitchExtraProps | keyof import("./types").SwitchFrameActiveStyleProps>, import("@tamagui/core").StaticConfigPublic>, {
    Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "size"> & SwitchSharedProps & SwitchThumbActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
        active?: boolean | undefined;
        frameWidth?: number | undefined;
        size?: string | number | boolean | undefined;
    }, "activeStyle" | "size">, import("@tamagui/core").StaticConfigPublic>;
}>;
export declare const SwitchThumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "size"> & SwitchSharedProps & SwitchThumbActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    frameWidth?: number | undefined;
    size?: string | number | boolean | undefined;
}, "activeStyle" | "size">, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Switch.d.ts.map