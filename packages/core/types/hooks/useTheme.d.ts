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
export declare const useTheme: (themeName?: string | null | undefined, componentName?: string | undefined, props?: ThemeProps | undefined, forceUpdate?: any) => ThemeObject;
export declare const getThemeManagerIfChanged: (theme: any) => any;
export declare const useThemeName: (opts?: {
    parent?: true | undefined;
} | undefined) => string;
export declare const useDefaultThemeName: () => ThemeName | undefined;
export declare const useChangeThemeEffect: (name?: string | null | undefined, componentName?: string | undefined, props?: ThemeProps | undefined, forceUpdateProp?: any) => {
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