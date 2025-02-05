import { type MutableRefObject } from 'react';
import type { ThemeParsed, UseThemeWithStateProps } from '../types';
type ID = string;
export type ThemeState = {
    id: ID;
    name: string;
    theme: ThemeParsed;
    isNew?: boolean;
    parentId?: ID;
    scheme?: 'light' | 'dark';
    inversed?: boolean;
};
export declare const ThemeStateContext: import("react").Context<string>;
export declare const forceUpdateThemes: () => void;
export declare const getThemeState: (id: ID) => ThemeState | undefined;
export declare const useThemeState: (props: UseThemeWithStateProps, isRoot?: boolean, keys?: MutableRefObject<string[] | null>) => ThemeState;
export {};
//# sourceMappingURL=useThemeState.d.ts.map