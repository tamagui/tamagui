import React from 'react';
import { ThemeName } from '../types';
export declare type ThemeProps = {
    className?: string;
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    children?: any;
    debug?: boolean;
};
export declare const Theme: React.NamedExoticComponent<ThemeProps>;
//# sourceMappingURL=Theme.d.ts.map