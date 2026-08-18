import { type MutableRefObject } from 'react';
import type { ThemeState, UseThemeWithStateProps } from '../types';
type ID = string;
export declare const ThemeStateContext: import("react").Context<string>;
export declare const forceUpdateThemes: () => void;
export declare const getThemeState: (id: ID) => ThemeState | undefined;
export type InlineThemeLayer = {
    inlineValues: NonNullable<UseThemeWithStateProps['inlineValues']>;
    inlineClassName: string | undefined;
};
export declare const getInlineThemeLayer: (id: ID) => InlineThemeLayer | undefined;
export declare const getThemeProviderParent: (id: ID) => string | undefined;
/** introspection for devtools and leak probes: entries retained per map */
export declare const getThemeProviderChainSizes: () => {
    layers: number;
    parents: number;
};
export declare const getRootThemeState: () => ThemeState | null;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot: boolean | undefined, keys: MutableRefObject<Set<string> | null>, schemeKeys?: MutableRefObject<Set<string> | null>, cascadeOnChange?: boolean, optimizeForFirstRender?: boolean) => ThemeState;
/**
 * Which theme a `<Theme>` node resolves to, given the theme it sits under.
 *
 * Pure: parent name, authored name, and the config's theme map are the whole
 * input. That is what lets the zero-runtime compiler resolve a nested static
 * `<Theme>` chain to the same names the runtime would, instead of guessing at
 * how the composition works. `null` means the node did not change the theme.
 */
export declare function resolveThemeName(parentName: string, name: string | undefined, reset: boolean | undefined, themes: Record<string, any>, forceUpdate?: boolean): string | null;
export declare const hasThemeUpdatingProps: (props: UseThemeWithStateProps) => boolean;
export {};
//# sourceMappingURL=useThemeState.d.ts.map