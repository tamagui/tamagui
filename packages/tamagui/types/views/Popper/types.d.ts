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
//# sourceMappingURL=types.d.ts.map