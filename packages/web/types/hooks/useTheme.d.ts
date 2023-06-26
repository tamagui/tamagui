import { ThemeManager } from '../helpers/ThemeManager';
import type { ThemeParsed, ThemeProps } from '../types';
export type ChangedThemeResponse = {
    isNewTheme: boolean;
    themeManager: ThemeManager | null;
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
};
type UseThemeResult = {
    [key in keyof ThemeParsed]: ThemeParsed[key] & {
        get: () => string | ThemeParsed[key]['val'];
    };
};
export declare const useTheme: (props?: ThemeProps) => UseThemeResult;
export declare const useThemeWithState: (props: ThemeProps) => {
    theme: UseThemeResult;
    isNewTheme: boolean;
    themeManager: ThemeManager | null;
    name: string;
    className?: string | undefined;
} | null;
export declare function getThemeProxied({ theme, themeManager, }: Partial<ChangedThemeResponse> & {
    theme: ThemeParsed;
}, keys?: string[]): UseThemeResult;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean, keys?: string[], disableUpdate?: () => boolean) => ChangedThemeResponse;
export {};
//# sourceMappingURL=useTheme.d.ts.map