import { ThemeName } from '../types';
export declare type ThemeProps = {
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    children?: any;
};
export declare const Theme: (props: ThemeProps) => any;
//# sourceMappingURL=Theme.d.ts.map