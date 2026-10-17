import type { CheckedState, CheckboxExtraProps as HeadlessCheckboxExtraProps } from '@tamagui/checkbox-headless';
import type { GetProps, NativeValue, StylePiece } from '@tamagui/core';
import React from 'react';
export declare const CheckboxIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const CheckboxFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
};
type CheckboxFrameActiveStyleProps = {
    activeStyle?: StylePiece;
    activeTheme?: string | null;
};
type CheckboxIndicatorActiveStyleProps = {
    activeStyle?: StylePiece;
};
export type CheckboxProps = GetProps<typeof CheckboxFrame> & CheckboxExtraProps & CheckboxFrameActiveStyleProps;
type CheckboxIndicatorExtraProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
};
export type CheckboxIndicatorProps = GetProps<typeof CheckboxIndicatorFrame> & CheckboxIndicatorExtraProps & CheckboxIndicatorActiveStyleProps;
export declare const CheckboxContext: React.Context<{
    checked: CheckedState;
    disabled?: boolean;
}>;
export declare const Checkbox: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "native" | keyof HeadlessCheckboxExtraProps | keyof CheckboxFrameActiveStyleProps> & HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
} & CheckboxFrameActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}, "native" | keyof HeadlessCheckboxExtraProps | keyof CheckboxFrameActiveStyleProps>, import("@tamagui/core").StaticConfigPublic>, {
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "activeStyle" | "forceMount"> & CheckboxIndicatorExtraProps & CheckboxIndicatorActiveStyleProps, import("@tamagui/core").StackStyleBase, Omit<{
        active?: boolean | undefined;
    }, "activeStyle" | "forceMount">, import("@tamagui/core").StaticConfigPublic>;
}>;
export {};
//# sourceMappingURL=Checkbox.d.ts.map