import { ThemeManager, ThemeManagerState } from '../helpers/ThemeManager';
import type { ThemeParsed, ThemeProps, UseThemeResult, UseThemeWithStateProps } from '../types';
export type ChangedThemeResponse = {
    state?: ThemeManagerState;
    themeManager?: ThemeManager | null;
    isNewTheme: boolean;
    inversed?: null | boolean;
    mounted?: boolean;
};
export declare const useTheme: (props?: ThemeProps) => UseThemeResult;
export declare const useThemeWithState: (props: UseThemeWithStateProps) => [ChangedThemeResponse, ThemeParsed];
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const getThemeManager: (id: number) => ThemeManager | undefined;
export declare const useChangeThemeEffect: (props: UseThemeWithStateProps, isRoot?: boolean, keys?: {
    current: string[];
}) => ChangedThemeResponse;
//# sourceMappingURL=useTheme.d.ts.map