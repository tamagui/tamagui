import type { ThemeParsed, ThemeProps, ThemeState, UseThemeWithStateProps } from '../types';
import { type ThemeProxied } from './getThemeProxied';
export declare const useTheme: (props?: ThemeProps) => ThemeProxied;
export type ThemeWithState = [ThemeParsed, ThemeState];
/**
 * Adds a proxy around themeState that tracks update keys
 */
export declare const useThemeWithState: (props: UseThemeWithStateProps, isRoot?: boolean) => ThemeWithState;
//# sourceMappingURL=useTheme.d.ts.map