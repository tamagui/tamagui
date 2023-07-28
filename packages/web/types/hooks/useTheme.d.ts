import { ThemeManager, ThemeManagerState } from '../helpers/ThemeManager';
import type { ThemeParsed, ThemeProps } from '../types';
export type ChangedThemeResponse = {
    state: ThemeManagerState;
    themeManager: ThemeManager;
    isNewTheme: boolean;
    mounted?: boolean;
};
type UseThemeResult = {
    [key in keyof ThemeParsed]: ThemeParsed[key] & {
        get: () => string | ThemeParsed[key]['val'];
    };
};
export declare const useTheme: (props?: ThemeProps) => UseThemeResult;
export declare const useThemeWithState: (props: ThemeProps) => [ChangedThemeResponse, ThemeParsed];
export declare function getThemeProxied({ theme, themeManager, }: {
    theme: ThemeParsed;
    themeManager?: ThemeManager;
}, keys?: string[]): UseThemeResult;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean, keys?: string[], shouldUpdate?: () => boolean | undefined) => ChangedThemeResponse;
export {};
//# sourceMappingURL=useTheme.d.ts.map