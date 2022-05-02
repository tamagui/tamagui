import { StackProps } from '@tamagui/core';
import type { MutableRefObject } from 'react';
import React from 'react';
import type { ColorValue, GestureResponderEvent } from 'react-native';
export declare type IPopoverArrowProps = {
    height?: number;
    width?: number;
    color?: ColorValue;
};
export declare type IPopoverArrowImplProps = {
    placement?: string;
    arrowProps: IArrowProps;
    height: number;
    width: number;
} & IPopoverArrowProps;
export declare type IArrowProps = {
    style: Object;
};
export interface IPopoverProps {
    defaultOpen?: boolean;
    open?: boolean;
    trapFocus?: boolean;
    shouldFlip?: boolean;
    initialFocusRef?: React.RefObject<any>;
    finalFocusRef?: React.RefObject<any>;
    trigger: (props: {
        ref: any;
        onPress: (e?: GestureResponderEvent) => any;
        [key: string]: any;
    }, state: {
        open: boolean;
    }) => JSX.Element;
    crossOffset?: number;
    offset?: number;
    shouldOverlapWithTrigger?: boolean;
    children: React.ReactNode | ((state: {
        open: boolean;
    }) => React.ReactNode);
    isKeyboardDismissable?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right top' | 'right bottom' | 'left top' | 'left bottom';
    onClose?: () => void;
    onOpen?: () => void;
    onChangeOpen?: (open: boolean) => void;
}
export declare type IPopoverContentImpl = {
    arrowHeight: number;
    arrowWidth: number;
    placement?: string;
    arrowProps: IArrowProps;
    children: any;
};
export declare type IPopoverImplProps = IPopoverProps & {
    triggerRef: any;
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
export declare type IPopoverContentProps = StackProps;
export declare type IPopoverComponentType = ((props: IPopoverProps & {
    ref?: MutableRefObject<any>;
}) => JSX.Element & {
    ref?: MutableRefObject<any>;
}) & {
    Body: React.MemoExoticComponent<(props: StackProps & {
        ref?: MutableRefObject<any>;
    }) => JSX.Element>;
    Content: React.MemoExoticComponent<(props: IPopoverContentProps & {
        ref?: MutableRefObject<any>;
    }) => JSX.Element>;
    Arrow: React.MemoExoticComponent<(props: StackProps & {
        ref?: MutableRefObject<any>;
    }) => JSX.Element>;
};
//# sourceMappingURL=types.d.ts.map