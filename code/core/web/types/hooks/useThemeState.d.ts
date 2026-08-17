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
export declare const getRootThemeState: () => ThemeState | null;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot: boolean | undefined, keys: MutableRefObject<Set<string> | null>, schemeKeys?: MutableRefObject<Set<string> | null>, cascadeOnChange?: boolean, optimizeForFirstRender?: boolean) => ThemeState;
export declare const hasThemeUpdatingProps: (props: UseThemeWithStateProps) => boolean;
export {};
//# sourceMappingURL=useThemeState.d.ts.map