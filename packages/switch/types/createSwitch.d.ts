import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants } from '@tamagui/core';
import { SwitchExtraProps as HeadlessSwitchExtraProps, SwitchState } from '@tamagui/switch-headless';
import * as React from 'react';
import { SwitchProps as NativeSwitchProps, ViewProps } from 'react-native';
type ExpectingVariantProps = {
    size?: SizeTokens | number;
    unstyled?: boolean;
};
type SwitchBaseProps = StackProps & ExpectingVariantProps;
export type SwitchExtraProps = HeadlessSwitchExtraProps & {
    native?: NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: NativeSwitchProps;
};
export type SwitchProps = SwitchBaseProps & SwitchExtraProps;
type SwitchComponent = TamaguiComponentExpectingVariants<SwitchProps & ExpectingVariantProps, ExpectingVariantProps>;
type SwitchThumbBaseProps = StackProps;
type SwitchThumbExtraProps = {};
export type SwitchThumbProps = SwitchThumbBaseProps & SwitchThumbExtraProps;
type SwitchThumbComponent = TamaguiComponentExpectingVariants<SwitchThumbProps & ExpectingVariantProps, ExpectingVariantProps>;
export declare const SwitchContext: React.Context<{
    checked: SwitchState;
    disabled?: boolean | undefined;
}>;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({ disableActiveTheme, Frame, Thumb, }: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Thumb?: T;
}): import("@tamagui/core").ReactComponentWithRef<Omit<ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & ExpectingVariantProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
}, any> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/core").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/core").Styleable<Omit<ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & ExpectingVariantProps & HeadlessSwitchExtraProps & {
        native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: NativeSwitchProps | undefined;
    }, any, any, ExpectingVariantProps, {}>;
} & {
    __baseProps: any;
    __variantProps: ExpectingVariantProps;
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & ExpectingVariantProps, any, any, ExpectingVariantProps, {}>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map