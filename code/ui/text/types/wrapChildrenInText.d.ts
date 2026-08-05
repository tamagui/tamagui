import type { SizeTokens } from '@tamagui/web';
import React from 'react';
import type { TextParentStyles } from './types';
type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens | true;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props & {}, extraProps?: Record<string, any>): React.ReactNode[];
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map