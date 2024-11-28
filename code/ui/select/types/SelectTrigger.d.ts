import { type TamaguiElement } from '@tamagui/core';
import type { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
export type SelectTriggerProps = ListItemProps;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & import("@tamagui/core").ThemeableProps & {
    icon?: JSX.Element | React.FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: JSX.Element | React.FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    scaleIcon?: number;
    spaceFlex?: number | boolean;
    scaleSpace?: number;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    noTextWrap?: boolean | "all";
} & React.RefAttributes<TamaguiElement>>;
//# sourceMappingURL=SelectTrigger.d.ts.map