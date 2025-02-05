import { type MutableRefObject } from 'react';
import type { ThemeParsed, UseThemeWithStateProps } from '../types';
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
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot?: boolean, keys?: MutableRefObject<Set<string> | null>) => ThemeState;
export {};
//# sourceMappingURL=useThemeState.d.ts.map