import { ThemeManager } from '../helpers/ThemeManager';
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
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare const useThemeName: (opts?: {
    parent?: true;
}) => string;
export declare const useDefaultThemeName: () => ThemeName | undefined;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (name?: string | null, componentName?: string, props?: ThemeProps, forceUpdateProp?: any) => {
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
} | {
    themes: {
        [key: string]: Partial<import("../types").TamaguiBaseTheme> & {
            [key: string]: import("../types").VariableVal;
        };
    };
    themeManager: ThemeManager | null;
    name: string;
    theme: any;
    className: string;
};
//# sourceMappingURL=useTheme.d.ts.map