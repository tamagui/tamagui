import type { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
type SelectItemContextValue = {
    value: string;
    textId: string;
    isSelected: boolean;
};
export declare const SelectItemContextProvider: React.Provider<SelectItemContextValue> & React.ProviderExoticComponent<Partial<SelectItemContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSelectItemContext: (scope?: string) => SelectItemContextValue;
export interface SelectItemExtraProps {
    value: string;
    index: number;
    disabled?: boolean;
    textValue?: string;
}
export interface SelectItemProps extends Omit<ListItemProps, keyof SelectItemExtraProps>, SelectItemExtraProps {
}
export declare const SelectItem: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof SelectItemExtraProps> & SelectItemExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & SelectItemExtraProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItem.d.ts.map