import { ThemeManager } from '../helpers/ThemeManager';
import type { ThemeParsed, ThemeProps } from '../types';
export type ChangedThemeResponse = {
    isNewTheme: boolean;
    themeManager: ThemeManager | null;
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
};
export declare const useTheme: (props?: ThemeProps) => ThemeParsed;
export declare const useThemeWithState: (props: ThemeProps) => {
    theme: ThemeParsed;
    isNewTheme: boolean;
    themeManager: ThemeManager | null;
    name: string;
    className?: string | undefined;
} | null;
export declare function getThemeProxied({ theme, themeManager, }: Partial<ChangedThemeResponse> & {
    theme: ThemeParsed;
}, keys?: string[]): ThemeParsed;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean, keys?: string[], disableUpdate?: () => boolean) => ChangedThemeResponse;
//# sourceMappingURL=useTheme.d.ts.map