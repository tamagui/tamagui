import { SizeTokens } from '@tamagui/core';
import React from 'react';
import { TextParentStyles } from './types';
declare type Props = TextParentStyles & {
    TextComponent: any;
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapStringChildrenInText({ children, textProps, size, noTextWrap, TextComponent, ...directTextProps }: Props): React.ReactNode;
export {};
//# sourceMappingURL=wrapStringChildrenInText.d.ts.map