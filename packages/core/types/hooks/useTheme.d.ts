import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeName, ThemeObject } from '../types';
export interface ThemeProps {
    className?: string;
    disableThemeClass?: boolean;
    name: Exclude<ThemeName, number> | null;
    componentName?: string;
    children?: any;
    reset?: boolean;
    debug?: boolean | 'verbose';
}
export declare const useTheme: (themeName?: string | null, componentName?: string, props?: ThemeProps, forceUpdate?: any) => ThemeObject;
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare const useThemeName: (opts?: {
    parent?: true;
}) => string;
export declare const useDefaultThemeName: () => ThemeName | undefined;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (name?: string | null, componentName?: string, props?: ThemeProps, forceUpdateProp?: any) => {
    themes: Record<string, ThemeObject>;
    themeManager: ThemeManager | null;
    name: string;
    theme: ThemeObject | null;
    className?: string | undefined;
};
//# sourceMappingURL=useTheme.d.ts.map