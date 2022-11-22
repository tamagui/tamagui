import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeName, ThemeParsed, ThemeProps } from '../types';
declare type UseThemeProps = ThemeProps & {
    forceUpdate?: any;
};
export declare const useTheme: (props?: UseThemeProps) => ThemeParsed;
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare const getThemeIsNewTheme: (theme: any) => ThemeManager | undefined;
export declare function useThemeName(opts?: {
    parent?: true;
}): ThemeName;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: UseThemeProps) => {
    themes: Record<string, ThemeParsed>;
    themeManager: ThemeManager | null;
    name: string;
    isNewTheme?: boolean | undefined;
    theme?: ThemeParsed | null | undefined;
    className?: string | undefined;
};
export {};
//# sourceMappingURL=useTheme.d.ts.map