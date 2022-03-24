import { ThemeName } from '../types';
export declare type ThemeProps = {
    className?: string;
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    children?: any;
};
export declare const Theme: (props: ThemeProps) => any;
//# sourceMappingURL=Theme.d.ts.map