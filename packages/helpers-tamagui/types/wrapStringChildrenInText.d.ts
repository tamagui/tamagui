import type { SizeTokens } from '@tamagui/core';
import React from 'react';
import type { TextParentStyles } from './types';
declare type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapStringChildrenInText(TextComponent: any, { children, textProps, size, noTextWrap, color, fontFamily, fontSize, fontWeight, letterSpacing, textAlign, }: Props): string | number | boolean | any[] | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined;
export {};
//# sourceMappingURL=wrapStringChildrenInText.d.ts.map