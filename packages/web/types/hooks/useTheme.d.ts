import { Variable } from '../createVariable';
import { ThemeManager, ThemeManagerState } from '../helpers/ThemeManager';
import type { DebugProp, ThemeParsed, ThemeProps, Tokens, VariableVal } from '../types';
export type ChangedThemeResponse = {
    state: ThemeManagerState;
    themeManager: ThemeManager;
    isNewTheme: boolean;
    mounted?: boolean;
};
type ThemeGettable<Val> = Val & {
    get: () => string | (Val extends Variable<infer X> ? X : Val extends VariableVal ? string | number : unknown);
};
type UseThemeResult = {
    [Key in keyof ThemeParsed]: ThemeGettable<ThemeParsed[Key]>;
} & {
    [Key in keyof Tokens['color']]: ThemeGettable<string>;
};
export declare const useTheme: (props?: ThemeProps) => UseThemeResult;
export declare const useThemeWithState: (props: ThemeProps) => [ChangedThemeResponse, ThemeParsed];
export declare function getThemeProxied({ theme, themeManager, }: {
    theme: ThemeParsed;
    themeManager?: ThemeManager;
}, keys?: string[], debug?: DebugProp): UseThemeResult;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean, keys?: string[], shouldUpdate?: () => boolean | undefined) => ChangedThemeResponse;
export {};
//# sourceMappingURL=useTheme.d.ts.map