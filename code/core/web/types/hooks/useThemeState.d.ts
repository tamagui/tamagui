import { type MutableRefObject } from 'react';
import type { ThemeProps, ThemeState, UseThemeWithStateProps } from '../types';
type ID = string;
export declare const ThemeStateContext: import("react").Context<string>;
export declare const ThemeStateValueContext: import("react").Context<ThemeState | null>;
export declare const forceUpdateThemes: () => void;
export declare const getThemeState: (id: ID) => ThemeState | undefined;
export declare const getRootThemeState: () => ThemeState | null;
export declare const getThemeStateForInitialRender: (parentState: ThemeState | null, props: UseThemeWithStateProps) => ThemeState;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot: boolean | undefined, keys: MutableRefObject<Set<string> | null>, schemeKeys?: MutableRefObject<Set<string> | null>, cascadeOnChange?: boolean) => ThemeState;
export declare const hasThemeUpdatingProps: (props: ThemeProps) => boolean;
export {};
//# sourceMappingURL=useThemeState.d.ts.map