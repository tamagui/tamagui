import { ThemeableProps } from '@tamagui/core';
import React from 'react';
import { SizableFrameProps } from './SizableFrame';
import { SizableTextProps } from './SizableText';
declare type IconProp = JSX.Element | ((props: {
    color?: string;
    size?: number;
}) => JSX.Element) | null;
export declare type ButtonProps = SizableFrameProps & ThemeableProps & {
    scaleIcon?: number;
    color?: SizableTextProps['color'];
    fontWeight?: SizableTextProps['fontWeight'];
    letterSpacing?: SizableTextProps['letterSpacing'];
    noTextWrap?: boolean;
    icon?: IconProp;
    iconAfter?: IconProp;
};
export declare const Button: React.FC<ButtonProps>;
export declare const getSpaceSize: (size: any, sizeUpOrDownBy?: number) => import("@tamagui/core").Variable;
export {};
//# sourceMappingURL=Button.d.ts.map