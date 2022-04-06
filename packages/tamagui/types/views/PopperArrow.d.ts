import { StackProps } from '@tamagui/core';
import React from 'react';
import { IPlacement } from './Popper';
export declare type PopperArrowProps = StackProps & {
    placement?: IPlacement;
};
export declare const PopperArrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    placement?: IPlacement | undefined;
} & React.RefAttributes<unknown>>>;
//# sourceMappingURL=PopperArrow.d.ts.map