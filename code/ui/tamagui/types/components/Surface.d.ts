import { type GetProps } from '@tamagui/style';
export declare const SurfaceFrame: import("react").FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "elevated" | "filled" | "interactive" | "outlined" | "roundedFacet" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    elevated?: boolean | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    elevated?: boolean | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        elevated?: boolean | undefined;
        filled?: boolean | undefined;
        interactive?: boolean | undefined;
        outlined?: boolean | undefined;
        roundedFacet?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export type SurfaceProps = Omit<GetProps<typeof SurfaceFrame>, 'roundedFacet' | 'rounded'> & {
    /** shift the subtree to a relative theme level. */
    level?: 1 | 2 | 3 | 4;
    /** add the default component radius without depending on config shorthands. */
    rounded?: boolean;
};
export declare const Surface: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    elevated?: boolean | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}>, "rounded" | "roundedFacet"> & {
    /** shift the subtree to a relative theme level. */
    level?: 1 | 2 | 3 | 4;
    /** add the default component radius without depending on config shorthands. */
    rounded?: boolean;
} & import("react").RefAttributes<any>>;
//# sourceMappingURL=Surface.d.ts.map