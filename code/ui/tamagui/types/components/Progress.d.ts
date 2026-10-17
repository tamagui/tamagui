import { type GetProps } from '@tamagui/core';
import { type ProgressExtraProps } from '@tamagui/progress';
export declare const ProgressIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress"> & {
    __scopeProgress?: import("@tamagui/create-context").Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeProgress">, import("@tamagui/core").StaticConfigPublic>;
declare const ProgressFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress" | keyof ProgressExtraProps> & ProgressExtraProps & {
    __scopeProgress?: import("@tamagui/create-context").Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{
    size?: import("@tamagui/progress").ProgressSize | undefined;
}, "__scopeProgress" | keyof ProgressExtraProps>, import("@tamagui/core").StaticConfigPublic>;
export declare const Progress: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress" | keyof ProgressExtraProps> & ProgressExtraProps & {
    __scopeProgress?: import("@tamagui/create-context").Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{
    size?: import("@tamagui/progress").ProgressSize | undefined;
}, "__scopeProgress" | keyof ProgressExtraProps>, import("@tamagui/core").StaticConfigPublic>, {
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeProgress"> & {
        __scopeProgress?: import("@tamagui/create-context").Scope;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeProgress">, import("@tamagui/core").StaticConfigPublic>;
}>;
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
export {};
//# sourceMappingURL=Progress.d.ts.map