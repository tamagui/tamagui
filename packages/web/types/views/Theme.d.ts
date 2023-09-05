import React from 'react';
import { ChangedThemeResponse } from '../hooks/useTheme';
import type { ThemeProps } from '../types';
export declare const Theme: React.ForwardRefExoticComponent<ThemeProps & React.RefAttributes<unknown>>;
export declare function useThemedChildren(themeState: ChangedThemeResponse, children: any, props: ThemeProps, isRoot?: boolean): any;
export declare function wrapThemeElements({ children, themeState, forceClassName, isRoot, }: {
    children?: React.ReactNode;
    themeState: ChangedThemeResponse;
    forceClassName?: boolean;
    isRoot?: boolean;
}): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
//# sourceMappingURL=Theme.d.ts.map