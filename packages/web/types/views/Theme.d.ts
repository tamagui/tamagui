import type { MutableRefObject } from 'react';
import React from 'react';
import type { ChangedThemeResponse } from '../hooks/useTheme';
import type { ThemeProps } from '../types';
export declare const Theme: React.ForwardRefExoticComponent<ThemeProps & React.RefAttributes<unknown>>;
export declare function getThemedChildren(themeState: ChangedThemeResponse, children: any, props: ThemeProps, isRoot: boolean | undefined, stateRef: MutableRefObject<{
    hasEverThemed?: boolean;
}>): any;
//# sourceMappingURL=Theme.d.ts.map