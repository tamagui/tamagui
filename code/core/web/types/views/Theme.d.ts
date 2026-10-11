import type { MutableRefObject } from 'react';
import type { ThemeState, UseThemeWithStateProps } from '../types';
type ThemeComponentPropsOnly = UseThemeWithStateProps & {
    contain?: boolean;
};
export declare const Theme: import("@tamagui/compose-refs").RefComponent<unknown, ThemeComponentPropsOnly>;
export declare function getThemedChildren(themeState: ThemeState, children: any, props: ThemeComponentPropsOnly, isRoot: boolean | undefined, stateRef: MutableRefObject<{
    hasEverThemed?: boolean | 'wrapped';
}>, passThrough?: boolean): any;
export {};
//# sourceMappingURL=Theme.d.ts.map