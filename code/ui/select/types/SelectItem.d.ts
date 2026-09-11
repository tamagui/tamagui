import type { GetProps } from '@tamagui/style';
import * as React from 'react';
type SelectItemContextValue = {
    value: string;
    textId: string;
    textValue?: string;
    isSelected: boolean;
};
export declare const SelectItemContextProvider: React.Provider<SelectItemContextValue> & React.ProviderExoticComponent<Partial<SelectItemContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSelectItemContext: (scope?: string) => SelectItemContextValue;
export interface SelectItemExtraProps {
    value: string;
    disabled?: boolean;
    textValue?: string;
}
export interface SelectItemProps extends Omit<GetProps<typeof SelectItemFrame>, keyof SelectItemExtraProps>, SelectItemExtraProps {
}
export declare const SelectItemFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export declare const SelectItem: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | keyof SelectItemProps> & SelectItemProps & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & SelectItemProps & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItem.d.ts.map