import type { GetProps, TamaguiElement } from '@tamagui/core';
import type { ScopedProps, SliderProps, SliderTrackProps } from './types';
export declare const SliderTrackFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const SliderTrack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export declare const SliderActiveFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type SliderActiveProps = GetProps<typeof SliderActiveFrame>;
declare const SliderActive: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "orientation">> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export declare const SliderThumbFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export interface SliderThumbExtraProps {
    index?: number;
    /** thumb px before its first layout: a number, or a font size key */
    size?: string | number | boolean;
}
export type SliderThumbProps = GetProps<typeof SliderThumbFrame> & SliderThumbExtraProps;
declare const SliderThumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "circular" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "circular" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SliderThumbExtraProps & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
}, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
declare const Slider: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<unknown, ScopedProps<SliderProps>>, {
    Track: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        __scopeSlider?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        orientation?: "horizontal" | "vertical" | undefined;
    }, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    TrackActive: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "orientation">> & import("@tamagui/core").WithFlatVariantValues<{
        orientation?: "horizontal" | "vertical" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        __scopeSlider?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        orientation?: "horizontal" | "vertical" | undefined;
    }, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "circular" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "circular" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SliderThumbExtraProps & {
        __scopeSlider?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
}>;
declare const Track: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, "__scopeSlider" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
declare const Range: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "orientation">> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, "__scopeSlider" | "orientation" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
declare const Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "circular" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "circular" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SliderThumbExtraProps & {
    __scopeSlider?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
}, "__scopeSlider" | "circular" | "elevate" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SliderThumbExtraProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export { Range, Slider, SliderThumb, SliderTrack, SliderActive, Thumb, Track, };
export type { SliderProps, SliderActiveProps, SliderTrackProps };
//# sourceMappingURL=Slider.d.ts.map