import { type RefComponent } from '@tamagui/compose-refs';
import React from 'react';
import type { ThemeUpdateState } from '../helpers/themeUpdateState.js';
import { type InlineValues } from '../helpers/variables.js';
import type { ReservedThemePropName, ThemeKeys, VariableValIn } from '../types.js';
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