import type { MutableRefObject } from 'react';
import type { ThemeParsed, ThemeProps, UseThemeWithStateProps } from '../types';
type ID = string;
export type ThemeState = {
    id: ID;
    name: string;
    theme: ThemeParsed;
    inverses: number;
    parentName?: string;
    isInverse?: boolean;
    isNew?: boolean;
    parentId?: ID;
    scheme?: 'light' | 'dark';
};
export declare const ThemeStateContext: import("react").Context<string>;
export declare const forceUpdateThemes: () => void;
export declare const getThemeState: (id: ID) => ThemeState | undefined;
export declare const getRootThemeState: () => ThemeState | null;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot: boolean | undefined, keys: MutableRefObject<Set<string> | null>) => ThemeState;
export declare const hasThemeUpdatingProps: (props: ThemeProps) => boolean;
//# sourceMappingURL=useThemeState.d.ts.map