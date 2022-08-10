import type { SizeTokens } from '@tamagui/core';
import React from 'react';
import { TextParentStyles } from './types';
declare type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props): string | number | boolean | any[] | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined;
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map