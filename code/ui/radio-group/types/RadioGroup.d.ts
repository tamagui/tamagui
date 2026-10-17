import type { GetProps, StylePiece } from '@tamagui/core';
import type { RadioGroupContextValue, RadioGroupItemContextValue } from '@tamagui/radio-headless';
import React from 'react';
export declare const RadioGroupItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const RadioGroupIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const RadioGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type RadioGroupIndicatorExtraProps = {
    forceMount?: boolean;
};
export type RadioGroupIndicatorProps = GetProps<typeof RadioGroupIndicatorFrame> & RadioGroupIndicatorExtraProps;
export declare const RadioGroupContext: React.Context<RadioGroupContextValue>;
export declare const RadioGroupItemContext: React.Context<RadioGroupItemContextValue>;
type RadioGroupItemExtraProps = {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: StylePiece;
    activeTheme?: string | null;
};
export type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & RadioGroupItemExtraProps;
type RadioGroupExtraProps = {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
};
export type RadioGroupProps = GetProps<typeof RadioGroupFrame> & RadioGroupExtraProps;
export declare const RadioGroup: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof RadioGroupExtraProps> & RadioGroupExtraProps, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, keyof RadioGroupExtraProps>, import("@tamagui/core").StaticConfigPublic>, {
    Item: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof RadioGroupItemExtraProps> & RadioGroupItemExtraProps, import("@tamagui/core").StackStyleBase, Omit<{
        disabled?: boolean | undefined;
    }, keyof RadioGroupItemExtraProps>, import("@tamagui/core").StaticConfigPublic>;
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount"> & RadioGroupIndicatorExtraProps, import("@tamagui/core").StackStyleBase, Omit<{}, "forceMount">, import("@tamagui/core").StaticConfigPublic>;
}>;
export {};
//# sourceMappingURL=RadioGroup.d.ts.map