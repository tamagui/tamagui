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
    disabled?: boolean;
    textValue?: string;
}
export interface SelectItemProps extends Omit<GetProps<typeof SelectItemFrame>, keyof SelectItemExtraProps>, SelectItemExtraProps {
}
export declare const SelectItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectItem: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof SelectItemExtraProps> & SelectItemExtraProps & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope" | keyof SelectItemExtraProps>, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItem.d.ts.map