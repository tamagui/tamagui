import type { ThemeParsed, ThemeState, UseThemeWithStateProps } from '../types';
import { type ThemeProxied } from './getThemeProxied';
export declare const useTheme: () => ThemeProxied;
export type ThemeWithState = [ThemeParsed, ThemeState];
/**
 * Adds the public theme value wrapper and tracks update keys in updates mode.
 */
export declare const useThemeWithState: (props: UseThemeWithStateProps, isRoot?: boolean, forThemeView?: boolean) => ThemeWithState;
//# sourceMappingURL=useTheme.d.ts.map