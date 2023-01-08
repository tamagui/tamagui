/// <reference types="react" />
import { ThemeManager } from '../helpers/ThemeManager';
import { ThemeParsed, ThemeProps } from '../types';
export type ChangedThemeResponse = {
    themeManager: ThemeManager | null;
    name: string;
    isNewTheme?: boolean;
    theme?: ThemeParsed | null;
    className?: string;
};
interface UseThemeState {
    keys: Set<string>;
}
export declare const useTheme: (props?: ThemeProps) => ThemeParsed;
export declare const useThemeWithState: (props: ThemeProps) => {
    theme: ThemeParsed;
    themeManager: ThemeManager | null;
    name: string;
    isNewTheme?: boolean | undefined;
    className?: string | undefined;
} | null;
export declare function getThemeProxied({ theme, themeManager, state, }: Partial<ChangedThemeResponse> & {
    theme: ThemeParsed;
    state?: React.RefObject<UseThemeState>;
}): ThemeParsed;
export declare const activeThemeManagers: Set<ThemeManager>;
export declare const useChangeThemeEffect: (props: ThemeProps, root?: boolean, disableUpdate?: () => boolean) => ChangedThemeResponse;
export {};
//# sourceMappingURL=useTheme.d.ts.map