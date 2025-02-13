import type { MutableRefObject } from 'react';
import type { Variable } from '../createVariable';
import type { ThemeParsed, Tokens, UseThemeWithStateProps, VariableVal, VariableValGeneric } from '../types';
import { type ThemeState } from './useThemeState';
export type ThemeProxied = {
    [Key in keyof ThemeParsed | keyof Tokens['color']]: ThemeGettable<Key extends keyof ThemeParsed ? ThemeParsed[Key] : Variable<any>>;
} & {
    [Key in string & {}]?: ThemeGettable<Variable<any>>;
};
type ThemeGettable<Val> = Val & {
    /**
     * Tries to return an optimized value that avoids the need for re-rendering:
     * On web a CSS variable, on iOS a dynamic color, on Android it doesn't
     * optimize and returns the underyling value.
     *
     * See: https://reactnative.dev/docs/dynamiccolorios
     *
     * @param platform when "web" it will only return the dynamic value for web, avoiding the iOS dynamic value.
     * For things like SVG, gradients, or other external components that don't support it, use this option.
     */
    get: (platform?: 'web') => string | (Val extends Variable<infer X> ? X extends VariableValGeneric ? any : Exclude<X, Variable> : Val extends VariableVal ? string | number : unknown);
};
export declare function getThemeProxied(_props: UseThemeWithStateProps, _state: ThemeState | null, _keys: MutableRefObject<Set<string> | null>): ThemeProxied;
export {};
//# sourceMappingURL=getThemeProxied.d.ts.map