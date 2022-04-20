import { ReactElement, RefObject } from 'react';
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
    ({ children, triggerRef, onClose, setOverlayRef, }: IPopperProps & {
        triggerRef: any;
        onClose: any;
        setOverlayRef?: ((overlayRef: any) => void) | undefined;
    }): JSX.Element;
    Content: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
    Arrow: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>> & import("@tamagui/core/types").MediaProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & import("@tamagui/core/types").PseudoProps<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>>>> & {
        placement?: IPlacement | undefined;
    } & React.RefAttributes<unknown>>>;
};
export declare const PopperContent: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
//# sourceMappingURL=Popper.d.ts.map