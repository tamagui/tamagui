import { ThemeManager } from '../ThemeManager';
import { ThemeName, ThemeObject } from '../types';
export declare type ThemeProps = {
    className?: string;
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    componentName?: string;
    children?: any;
    reset?: boolean;
    debug?: boolean | 'verbose';
};
export declare const useTheme: (themeName?: string | null, componentName?: string, props?: ThemeProps, forceUpdate?: any) => ThemeObject;
export declare const getThemeManagerIfChanged: (theme: any) => any;
export declare const useThemeName: (opts?: {
    parent?: true;
}) => string;
export declare const useDefaultThemeName: () => ThemeName | undefined;
export declare const useChangeThemeEffect: (name?: string | null, componentName?: string, props?: ThemeProps, forceUpdateProp?: any) => {
    didChangeTheme: boolean;
    themes: {
        [key: string]: Partial<import("../types").TamaguiBaseTheme> & {
            [key: string]: import("../types").VariableVal;
        };
    };
    themeManager: ThemeManager | null;
    name: string;
    theme: Partial<import("../types").TamaguiBaseTheme> & {
        [key: string]: import("../types").VariableVal;
    };
    className: string;
} | {
    didChangeTheme: boolean;
    themes: {
        [key: string]: Partial<import("../types").TamaguiBaseTheme> & {
            [key: string]: import("../types").VariableVal;
        };
    };
    themeManager: ThemeManager | null;
    name: string;
    theme: (Partial<import("../types").TamaguiBaseTheme> & {
        [key: string]: import("../types").VariableVal;
    }) | null;
    className?: undefined;
};
//# sourceMappingURL=useTheme.d.ts.map