import type { TamaguiElement } from '@tamagui/core';
import type { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
import type { SelectScopedProps } from './types';
export type SelectTriggerProps = SelectScopedProps<ListItemProps>;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").StackNonStyleProps, "disabled" | "size" | "unstyled" | keyof import("@tamagui/core").StackStyleBase | "active" | "variant"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>> & import("@tamagui/list-item").ListItemExtraProps & {
    scope?: import("./types").SelectScopes;
} & React.RefAttributes<TamaguiElement>>;
//# sourceMappingURL=SelectTrigger.d.ts.map