import { type RefComponent } from '@tamagui/compose-refs';
import React from 'react';
import type { ThemeUpdateState } from '../helpers/themeUpdateState';
import { type InlineValues } from '../helpers/variables';
import type { ReservedThemePropName, ThemeKeys, VariableValIn } from '../types';
type ThemeUpdateValues = string extends ThemeKeys ? {} : {
    [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn;
};
export type ThemeUpdateProps = ThemeUpdateValues & {
    children?: React.ReactNode;
};
export declare function createThemeUpdateState(values: InlineValues, className?: string): ThemeUpdateState;
export declare const ThemeUpdate: RefComponent<unknown, ThemeUpdateProps>;
export {};
//# sourceMappingURL=ThemeUpdate.d.ts.map