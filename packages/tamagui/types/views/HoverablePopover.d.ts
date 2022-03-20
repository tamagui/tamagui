import React from 'react';
import { IPopoverProps } from './Popover/types';
export declare type HoverablePopoverHandle = {
    close: () => void;
};
export declare type HoverablePopoverProps = IPopoverProps & {
    delay?: number;
    fallbackToPress?: boolean;
    allowHoverOnContent?: boolean;
    disableUntilSettled?: boolean;
};
export declare const HoverablePopover: React.ForwardRefExoticComponent<IPopoverProps & {
    delay?: number | undefined;
    fallbackToPress?: boolean | undefined;
    allowHoverOnContent?: boolean | undefined;
    disableUntilSettled?: boolean | undefined;
} & React.RefAttributes<HoverablePopoverHandle>> & {
    Arrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
        animation?: string | undefined;
    } & {
        disabled?: boolean | undefined;
        className?: string | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        animated?: boolean | undefined;
        theme?: import("@tamagui/core").ThemeName | null | undefined;
        onHoverIn?: ((e: MouseEvent) => any) | undefined;
        onHoverOut?: ((e: MouseEvent) => any) | undefined;
        onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        space?: boolean | import("@tamagui/core").VariableVal | undefined;
        pointerEvents?: string | undefined;
    } & {
        children?: any;
    } & {
        placement?: import("./Popper").IPlacement | undefined;
    } & React.RefAttributes<unknown>>>;
};
//# sourceMappingURL=HoverablePopover.d.ts.map