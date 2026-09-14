import type { RefComponent } from '@tamagui/compose-refs';
import type { ReservedThemePropName, VariableValIn } from '@tamagui/core';
import type { ReactNode } from 'react';
import type { ThemeKeys } from '.';
type ThemeUpdateValues = string extends ThemeKeys ? {} : {
    [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn;
};
export type ThemeUpdateProps = ThemeUpdateValues & {
    children?: ReactNode;
};
export declare const ThemeUpdate: RefComponent<unknown, ThemeUpdateProps>;
export {};
//# sourceMappingURL=theme-update.d.ts.map