import { ThemeManager } from '../ThemeManager';
import { ThemeObject } from '../types';
export declare const useTheme: (themeName?: string | null | undefined, componentName?: string | undefined, props?: any, forceUpdate?: any) => ThemeObject;
export declare const getThemeManager: (theme: any) => any;
export declare const useThemeName: (opts?: {
    parent?: true | undefined;
} | undefined) => string;
export declare const useDefaultThemeName: () => import("../types").ThemeName | undefined;
export declare const useChangeThemeEffect: (name?: string | null | undefined, componentName?: string | undefined, props?: any, forceUpdateProp?: any) => {
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
    name: string | null;
    theme: (Partial<import("../types").TamaguiBaseTheme> & {
        [key: string]: import("../types").VariableVal;
    }) | null;
    className?: undefined;
};
//# sourceMappingURL=useTheme.d.ts.map