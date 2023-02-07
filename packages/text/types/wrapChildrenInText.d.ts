import type { SizeTokens } from '@tamagui/core';
import React from 'react';
import { TextParentStyles } from './types';
type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props & {
    unstyled?: boolean;
}, extraProps?: Record<string, any>): any[];
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map