import { CheckedState, CheckboxExtraProps as HeadlessCheckboxExtraProps } from '@tamagui/checkbox-headless';
import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants } from '@tamagui/core';
import React from 'react';
type CheckboxExpectingVariantProps = {
    size?: SizeTokens;
    unstyled?: boolean;
};
type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
    scaleIcon?: number;
    scaleSize?: number;
    sizeAdjust?: number;
    native?: NativeValue<'web'>;
};
type CheckboxBaseProps = StackProps;
export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps;
type CheckboxComponent = TamaguiComponentExpectingVariants<CheckboxProps & CheckboxExpectingVariantProps, CheckboxExpectingVariantProps>;
type CheckboxIndicatorExpectingVariantProps = {
    unstyled?: boolean;
};
type CheckboxIndicatorComponent = TamaguiComponentExpectingVariants<CheckboxIndicatorProps & CheckboxIndicatorExpectingVariantProps, CheckboxIndicatorExpectingVariantProps>;
type CheckboxIndicatorBaseProps = StackProps;
type CheckboxIndicatorExtraProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
};
export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & CheckboxIndicatorExtraProps;
export declare const CheckboxContext: React.Context<{
    checked: CheckedState;
    disabled?: boolean | undefined;
}>;
export declare function createCheckbox<F extends CheckboxComponent, T extends CheckboxIndicatorComponent>({ Frame, Indicator, }: {
    Frame?: F;
    Indicator?: T;
}): import("@tamagui/core").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & HeadlessCheckboxExtraProps & {
    scaleIcon?: number | undefined;
    scaleSize?: number | undefined;
    sizeAdjust?: number | undefined;
    native?: NativeValue<"web"> | undefined;
} & CheckboxExpectingVariantProps, any> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/core").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/core").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & HeadlessCheckboxExtraProps & {
        scaleIcon?: number | undefined;
        scaleSize?: number | undefined;
        sizeAdjust?: number | undefined;
        native?: NativeValue<"web"> | undefined;
    } & CheckboxExpectingVariantProps, any, any, CheckboxExpectingVariantProps, {}>;
} & {
    __baseProps: any;
    __variantProps: CheckboxExpectingVariantProps;
} & {
    Indicator: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & CheckboxIndicatorExtraProps & CheckboxIndicatorExpectingVariantProps, any, any, CheckboxIndicatorExpectingVariantProps, {}>;
};
export {};
//# sourceMappingURL=createCheckbox.d.ts.map