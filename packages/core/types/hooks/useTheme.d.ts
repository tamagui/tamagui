import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeName, ThemeParsed, ThemeProps } from '../types';
export declare const useTheme: (props?: ThemeProps) => ThemeParsed;
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare const getThemeIsNewTheme: (theme: any) => ThemeManager | undefined;
export declare function useThemeName(opts?: {
    parent?: true;
}): ThemeName;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare type ChangedTheme = {
    themes: Record<string, ThemeParsed>;
    themeManager: ThemeManager | null;
    name: string;
    isNewTheme?: boolean;
    theme?: ThemeParsed | null;
    className?: string;
};
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean) => ChangedTheme;
//# sourceMappingURL=useTheme.d.ts.map