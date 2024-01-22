import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants } from '@tamagui/core';
import { SwitchExtraProps as HeadlessSwitchExtraProps, SwitchState } from '@tamagui/switch-headless';
import * as React from 'react';
import { SwitchProps as NativeSwitchProps } from 'react-native';
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
    frameWidth: number;
    disabled?: boolean | undefined;
}>;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({ disableActiveTheme, Frame, Thumb, }: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Thumb?: T;
}): React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & ExpectingVariantProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
} & React.RefAttributes<any>> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & ExpectingVariantProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
}, any, any, ExpectingVariantProps, {}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & ExpectingVariantProps & HeadlessSwitchExtraProps & {
        native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: NativeSwitchProps | undefined;
    }, any, any, ExpectingVariantProps, {}, {}];
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & ExpectingVariantProps, any, any, ExpectingVariantProps, {}, {}>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map