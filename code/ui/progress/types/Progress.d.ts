import type { ComponentSize, GetProps, SizeTokens } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
declare const createProgressScope: import("@tamagui/create-context").CreateScope;
export declare const ProgressIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>;
declare const ProgressIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    __scopeProgress?: Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeProgress" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export type ProgressSize = ComponentSize | SizeTokens | number | boolean;
export declare const ProgressFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: ProgressSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export interface ProgressExtraProps {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
}
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
declare const Progress: import("@tamagui/helpers").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof ProgressExtraProps | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "size">> & import("@tamagui/core").WithFlatVariantValues<{
    size?: ProgressSize | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & ProgressExtraProps, import("@tamagui/core").StackStyleBase, Omit<{
    size?: ProgressSize | undefined;
}, "size" | keyof ProgressExtraProps | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>, {
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        __scopeProgress?: Scope;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeProgress" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
}>;
export { createProgressScope, Progress, ProgressIndicator };
//# sourceMappingURL=Progress.d.ts.map