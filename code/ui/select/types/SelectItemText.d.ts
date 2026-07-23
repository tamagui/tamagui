import type { GetProps, TamaguiTextElement } from '@tamagui/core';
import * as React from 'react';
import type { SelectScopedProps } from './types';
export declare const ITEM_TEXT_NAME = "SelectItemText";
export declare const SelectItemTextFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {}>> & {
    ref?: React.Ref<TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {}, import("@tamagui/core").StaticConfigPublic];
};
type SelectItemTextExtraProps = SelectScopedProps<{}>;
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> & SelectItemTextExtraProps;
export declare const SelectItemText: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {}>, "scope"> & {
    scope?: import("./types").SelectScopes;
}, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiTextNonStyleProps & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").TextStylePropsBase, {}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItemText.d.ts.map