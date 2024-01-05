import { CheckboxBaseProps, CheckedState } from '@tamagui/checkbox-headless';
import { NativeValue, SizeTokens, StackProps, TamaguiElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox';
export type ExpectingVariantProps = {
    size?: SizeTokens;
    unstyled?: boolean;
};
export type CheckboxProps = CheckboxBaseProps & {
    scaleIcon?: number;
    scaleSize?: number;
    sizeAdjust?: number;
    native?: NativeValue<'web'>;
} & StackProps;
export type CheckboxIndicatorProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
} & StackProps;
export declare const CheckboxContext: React.Context<{
    checked: CheckedState;
    disabled?: boolean | undefined;
}>;
export declare function createCheckbox<F extends typeof CheckboxFrame, T extends typeof CheckboxIndicatorFrame>({ Frame: _Frame, Indicator: _Indicator, }: {
    Frame?: F;
    Indicator?: T;
}): React.ForwardRefExoticComponent<CheckboxBaseProps & {
    scaleIcon?: number | undefined;
    scaleSize?: number | undefined;
    sizeAdjust?: number | undefined;
    native?: NativeValue<"web"> | undefined;
} & Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & ExpectingVariantProps & {
    __scopeCheckbox?: Scope;
} & React.RefAttributes<TamaguiElement>> & {
    Indicator: React.ForwardRefExoticComponent<{
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean | undefined;
        /**
         * Used to disable passing styles down to children.
         */
        disablePassStyles?: boolean | undefined;
    } & Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & React.RefAttributes<TamaguiElement>>;
};
//# sourceMappingURL=createCheckbox.d.ts.map