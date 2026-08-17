import type { MutableRefObject } from 'react';
import type { ReservedThemePropName, ThemeKeys, ThemeState, UseThemeWithStateProps, VariableValIn } from '../types';
/**
 * Theme values set inline for a subtree: `<Theme background-hover="blue4">`.
 * Values use the same flat grammar as style props, narrowed to the modifiers a
 * whole subtree can honor: theme (`dark:`) and platform (`ios:`).
 *
 * Without a config augmentation `ThemeKeys` is `string`, which would make this
 * a catch-all index signature that every one of Theme's own props collides
 * with. There are no known theme keys to offer in that case, so it contributes
 * nothing instead.
 */
type InlineThemeValueProps = string extends ThemeKeys ? {} : {
    [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn;
};
type ThemeComponentPropsOnly = UseThemeWithStateProps & InlineThemeValueProps & {
    contain?: boolean;
};
export declare const Theme: import("@tamagui/compose-refs").RefComponent<unknown, ThemeComponentPropsOnly>;
export declare function getThemedChildren(themeState: ThemeState, children: any, props: ThemeComponentPropsOnly, isRoot: boolean | undefined, stateRef: MutableRefObject<{
    hasEverThemed?: boolean | 'wrapped';
}>, passThrough?: boolean): any;
export {};
//# sourceMappingURL=Theme.d.ts.map