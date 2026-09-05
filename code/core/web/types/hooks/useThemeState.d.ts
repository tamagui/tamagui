import { type MutableRefObject } from 'react';
import type { ThemeState, UseThemeWithStateProps } from '../types';
import type { ThemeUpdateState } from '../helpers/themeUpdateState';
type ID = string;
export declare const ThemeStateContext: import("react").Context<string>;
export declare const forceUpdateThemes: () => void;
export declare const getThemeState: (id: ID) => ThemeState | undefined;
export declare const getThemeUpdateLayer: (id: ID) => ThemeUpdateState | undefined;
export declare const getThemeProviderParent: (id: ID) => string | undefined;
export declare const getThemeProviderChainSizes: () => {
    layers: number;
    parents: number;
};
export declare const getRootThemeState: () => ThemeState | null;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot: boolean | undefined, keys: MutableRefObject<Set<string> | null>, schemeKeys?: MutableRefObject<Set<string> | null>, cascadeOnChange?: boolean, optimizeForFirstRender?: boolean) => ThemeState;
export declare function getNewThemeName(parentName: string | undefined, props: UseThemeWithStateProps, forceUpdate?: boolean): string | null;
export declare const getThemeNameCacheSize: () => number;
export declare function resolveThemeName(parentName: string, name: string | undefined, themes: Record<string, any>, forceUpdate?: boolean): string | null;
export declare const hasThemeUpdatingProps: (props: UseThemeWithStateProps) => boolean;
export {};
//# sourceMappingURL=useThemeState.d.ts.map