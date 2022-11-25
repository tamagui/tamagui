import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeParsed, ThemeProps } from '../types';
export declare type ChangedThemeResponse = {
    themes: Record<string, ThemeParsed>;
    themeManager: ThemeManager | null;
    name: string;
    isNewTheme?: boolean;
    theme?: ThemeParsed | null;
    className?: string;
};
export declare const useTheme: (props?: ThemeProps) => ThemeParsed;
export declare const getThemeManager: (theme: any) => ThemeManager | undefined;
export declare const getThemeIsNewTheme: (theme: any) => ThemeManager | undefined;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean) => ChangedThemeResponse;
//# sourceMappingURL=useTheme.d.ts.map