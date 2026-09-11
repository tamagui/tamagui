import type { GetProps, TamaguiTextElement } from '@tamagui/style';
import * as React from 'react';
import type { SelectScopedProps } from './types';
export declare const ITEM_TEXT_NAME = "SelectItemText";
export declare const SelectItemTextFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    ref?: React.Ref<TamaguiTextElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {}, import("@tamagui/style").StaticConfigPublic];
};
type SelectItemTextExtraProps = SelectScopedProps<{}>;
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> & SelectItemTextExtraProps;
export declare const SelectItemText: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {}>, "scope" | keyof import("@tamagui/style").RNTamaguiTextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    scope?: import("./types").SelectScopes;
}, TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/style").TextStylePropsBase, {}, import("@tamagui/style").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItemText.d.ts.map