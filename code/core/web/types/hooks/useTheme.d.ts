import type { ThemeParsed, ThemeProps, UseThemeWithStateProps } from '../types';
import { type ThemeProxied } from './getThemeProxied';
import type { ThemeState } from './useThemeState';
export declare const useTheme: (props?: ThemeProps) => ThemeProxied;
export type ThemeWithState = [ThemeParsed, ThemeState];
export declare const useThemeWithState: (props: UseThemeWithStateProps) => ThemeWithState;
//# sourceMappingURL=useTheme.d.ts.map