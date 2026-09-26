import React from 'react';
import type { TextParentStyles } from './types';
type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: unknown;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props & {}, extraProps?: Record<string, any>): React.ReactNode[];
export {};
//# sourceMappingURL=wrapChildrenInText.d.ts.map