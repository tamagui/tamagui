import type { SizeTokens } from '@tamagui/web';
import React from 'react';
import type { TextParentStyles } from './types';
type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props & {
    unstyled?: boolean;
}, extraProps?: Record<string, any>): React.ReactNode[] | (number | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element)[];
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map