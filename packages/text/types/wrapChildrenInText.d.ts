import type { SizeTokens } from '@tamagui/core';
import React from 'react';
import { SizableTextProps } from './SizableText';
export declare type TextParentStyles = {
    color?: SizableTextProps['color'];
    fontWeight?: SizableTextProps['fontWeight'];
    fontSize?: SizableTextProps['fontSize'];
    fontFamily?: SizableTextProps['fontFamily'];
    letterSpacing?: SizableTextProps['letterSpacing'];
    textAlign?: SizableTextProps['textAlign'];
    textProps?: Partial<SizableTextProps>;
    noTextWrap?: boolean;
};
declare type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapChildrenInText(TextComponent: any, { children, textProps, size, noTextWrap, color, fontFamily, fontSize, fontWeight, letterSpacing, textAlign, }: Props): string | number | boolean | any[] | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined;
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map