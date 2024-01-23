import { NativeValue, SizeTokens, StackProps } from '@tamagui/core';
import * as React from 'react';
import { SwitchProps as NativeSwitchProps } from 'react-native';
type SwitchSharedProps = {
    size?: SizeTokens | number;
    unstyled?: boolean;
};
type SwitchBaseProps = StackProps & SwitchSharedProps;
export type SwitchExtraProps = {
    labeledBy?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    required?: boolean;
    native?: NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: NativeSwitchProps;
    onCheckedChange?(checked: boolean): void;
};
export type SwitchProps = Omit<SwitchBaseProps & SwitchExtraProps, 'children'> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
};
type SwitchComponent = (props: SwitchSharedProps & SwitchExtraProps) => any;
type SwitchThumbComponent = (props: SwitchSharedProps) => any;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>(createProps: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Thumb?: T;
}): React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & SwitchExtraProps, "space" | "zIndex" | "backgroundColor" | "borderRadius" | "display" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "pointerEvents" | "userSelect" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "transformOrigin" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY"> & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SwitchExtraProps, Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
    size?: SizeTokens | undefined;
    checked?: boolean | undefined;
    frameWidth?: number | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SwitchExtraProps, Omit<import("@tamagui/core").StackStyleBase, keyof SwitchExtraProps>, {
        size?: SizeTokens | undefined;
        checked?: boolean | undefined;
        frameWidth?: number | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, {}];
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, Omit<import("@tamagui/core").StackStyleBase, never>, {
        size?: SizeTokens | undefined;
        checked?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, {}>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map