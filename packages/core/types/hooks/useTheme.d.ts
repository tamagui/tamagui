import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeName, ThemeParsed } from '../types';
export interface ThemeProps {
    className?: string;
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    componentName?: string;
    children?: any;
    reset?: boolean;
    debug?: boolean | 'verbose';
}
export declare const useTheme: (themeName?: string | null, componentName?: string, props?: ThemeProps, forceUpdate?: any, disableTracking?: boolean) => ThemeParsed;
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare function useThemeName(opts?: {
    parent?: true;
}): ThemeName;
export declare const useDefaultThemeName: () => string | undefined;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (name?: string | null, componentName?: string, props?: ThemeProps, forceUpdateProp?: any, uuid?: Object) => {
    themes: Record<string, ThemeParsed>;
    themeManager: ThemeManager | null;
    name: string;
    theme: ThemeParsed | null;
    className?: string | undefined;
};
//# sourceMappingURL=useTheme.d.ts.map