import type { ReactElement, RefObject } from 'react';
import React from 'react';
export declare type IPopoverArrowProps = {
    height?: any;
    width?: any;
    children?: any;
    color?: any;
    style?: any;
};
export declare type IPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right top' | 'right bottom' | 'left top' | 'left bottom';
export declare type IPopperProps = {
    shouldFlip?: boolean;
    crossOffset?: number;
    offset?: number;
    children: React.ReactNode;
    shouldOverlapWithTrigger?: boolean;
    trigger?: ReactElement | RefObject<any>;
    placement?: IPlacement;
};
export declare type IArrowStyles = {
    placement?: string;
    height?: number;
    width?: number;
};
export declare type IScrollContentStyle = {
    placement?: string;
    arrowHeight: number;
    arrowWidth: number;
};
export declare const defaultArrowHeight = 11;
export declare const defaultArrowWidth = 11;
export declare const getDiagonalLength: (height: number, width: number) => number;
export declare const Popper: {
    (props: IPopperProps & {
        triggerRef: any;
        onClose: any;
        setOverlayRef?: ((overlayRef: any) => void) | undefined;
    }): JSX.Element;
    Content: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
    Arrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>> & import("@tamagui/core/types").MediaProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>>> & {
        animation?: import("@tamagui/core/types").AnimationKeys | undefined;
    } & {
        disabled?: boolean | undefined;
        className?: string | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        animated?: boolean | undefined;
        theme?: import("@tamagui/core/types").ThemeName | null | undefined;
        onHoverIn?: ((e: MouseEvent) => any) | undefined;
        onHoverOut?: ((e: MouseEvent) => any) | undefined;
        onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
        space?: boolean | import("@tamagui/core/types").VariableVal | undefined;
    } & {
        children?: any;
    } & {
        placement?: IPlacement | undefined;
    } & React.RefAttributes<unknown>>>;
};
export declare const PopperContent: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
//# sourceMappingURL=Popper.d.ts.map