import type { ThemeManagerState } from '../helpers/ThemeManager';
import { ThemeManager } from '../helpers/ThemeManager';
import type { DebugProp, ThemeParsed, ThemeProps, UseThemeWithStateProps, VariableVal } from '../types';
export type ChangedThemeResponse = {
    state?: ThemeManagerState;
    prevState?: ThemeManagerState;
    themeManager?: ThemeManager | null;
    isNewTheme: boolean;
    inversed?: null | boolean;
    mounted?: boolean;
};
export type ThemeGettable<Val> = Val & {
    /**
     * Returns an optimized value that avoids the need for re-rendering:
     * On web a CSS variable, on iOS a dynamic color, on Android it doesn't
     * optimize and returns the underlying value.
     *
     * @param platform when "web" it will only return the dynamic value for web, avoiding the iOS dynamic value.
     * For things like SVG, gradients, or other external components that don't support it, use this option.
     */
    get: (platform?: 'web') => string | (Val extends VariableVal ? string | number : unknown);
};
export type UseThemeResult = {
    [Key in keyof ThemeParsed]: ThemeGettable<ThemeParsed[Key]>;
};
export declare const useTheme: (props?: ThemeProps) => UseThemeResult;
export declare const useThemeWithState: (props: UseThemeWithStateProps) => [ChangedThemeResponse, ThemeParsed];
export declare function getThemeProxied({ theme, name, scheme, }: {
    theme: ThemeParsed;
    name: string;
    scheme: string;
}, deopt?: boolean, themeManager?: ThemeManager, keys?: string[], debug?: DebugProp): UseThemeResult;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const getThemeManager: (id: number) => ThemeManager | undefined;
export declare const useChangeThemeEffect: (props: UseThemeWithStateProps, isRoot?: boolean, keys?: string[], shouldUpdate?: () => boolean | undefined) => ChangedThemeResponse;
//# sourceMappingURL=useTheme.d.ts.map