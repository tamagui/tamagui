import type { GetProps } from '@tamagui/style';
import type { Scope } from '@tamagui/create-context';
declare const createProgressScope: import("@tamagui/create-context").CreateScope;
export declare const ProgressIndicatorFrame: import("react").FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>;
declare const ProgressIndicator: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "__scopeProgress" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    __scopeProgress?: Scope;
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    __scopeProgress?: Scope;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
export declare const ProgressFrame: import("react").FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    size?: any;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    size?: any;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        size?: any;
    }, import("@tamagui/style").StaticConfigPublic];
};
export interface ProgressExtraProps {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
}
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
declare const Progress: import("react").FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    size?: any;
}>, "size" | keyof ProgressExtraProps | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    size?: any;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & ProgressExtraProps & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    size?: any;
}>, "size" | keyof ProgressExtraProps | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    size?: any;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & ProgressExtraProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    size?: any;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & ProgressExtraProps, import("@tamagui/style").StackStyleBase, {
    size?: any;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        size?: any;
    }>, "size" | keyof ProgressExtraProps | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: any;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & ProgressExtraProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: any;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & ProgressExtraProps, import("@tamagui/style").StackStyleBase, {
        size?: any;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Indicator: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "__scopeProgress" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        __scopeProgress?: Scope;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        __scopeProgress?: Scope;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
};
export { createProgressScope, Progress, ProgressIndicator };
//# sourceMappingURL=Progress.d.ts.map