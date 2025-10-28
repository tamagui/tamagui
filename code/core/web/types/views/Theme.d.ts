import type { MutableRefObject } from 'react';
import React from 'react';
import type { ThemeProps, ThemeState } from '../types';
type ThemeComponentPropsOnly = ThemeProps & {
    passThrough?: boolean;
    contain?: boolean;
};
export declare const Theme: React.ForwardRefExoticComponent<ThemeProps & {
    passThrough?: boolean;
    contain?: boolean;
} & React.RefAttributes<unknown>>;
export declare function getThemedChildren(themeState: ThemeState, children: any, props: ThemeComponentPropsOnly, isRoot: boolean | undefined, stateRef: MutableRefObject<{
    hasEverThemed?: boolean | 'wrapped';
}>, passThrough?: boolean): any;
export {};
//# sourceMappingURL=Theme.d.ts.map