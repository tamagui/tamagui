import { SizeTokens } from '@tamagui/core';
import React from 'react';
import { TextParentStyles } from './types';
declare type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapStringChildrenInText(TextComponent: any, { children, textProps, size, noTextWrap, color, fontFamily, fontSize, fontWeight, letterSpacing, textAlign, }: Props): React.ReactNode;
export {};
//# sourceMappingURL=wrapStringChildrenInText.d.ts.map