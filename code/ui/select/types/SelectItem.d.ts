import type { GetProps } from '@tamagui/core';
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
    /** @deprecated registry order is authoritative. this prop is accepted but inert. */
    index?: number;
    disabled?: boolean;
    textValue?: string;
}
export interface SelectItemProps extends Omit<GetProps<typeof SelectItemFrame>, keyof SelectItemExtraProps>, SelectItemExtraProps {
}
export declare const SelectItemFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export declare const SelectItem: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof SelectItemExtraProps> & SelectItemExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & SelectItemExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItem.d.ts.map