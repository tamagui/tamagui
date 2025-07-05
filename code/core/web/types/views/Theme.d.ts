import type { MutableRefObject } from 'react';
import React from 'react';
import { type ThemeState } from '../hooks/useThemeState';
import type { ThemeProps } from '../types';
export declare const Theme: React.ForwardRefExoticComponent<ThemeProps & {
    passThrough?: boolean;
} & React.RefAttributes<unknown>>;
export declare function getThemedChildren(themeState: ThemeState, children: any, props: ThemeProps, isRoot: boolean | undefined, stateRef: MutableRefObject<{
    hasEverThemed?: boolean | 'wrapped';
}>, passThrough?: boolean): any;
//# sourceMappingURL=Theme.d.ts.map