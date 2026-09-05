import { type GetProps } from '@tamagui/ui';
export declare const SurfaceFrame: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevated" | "elevation" | "filled" | "interactive" | "outlined" | "roundedFacet" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevated?: boolean | undefined;
    elevation?: number | false | import("@tamagui/web").Size | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevated?: boolean | undefined;
    elevation?: number | false | import("@tamagui/web").Size | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevated?: boolean | undefined;
        elevation?: number | false | import("@tamagui/web").Size | undefined;
        filled?: boolean | undefined;
        interactive?: boolean | undefined;
        outlined?: boolean | undefined;
        roundedFacet?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export type SurfaceProps = Omit<GetProps<typeof SurfaceFrame>, 'roundedFacet' | 'rounded'> & {
    /** shift the subtree to a relative theme level. */
    level?: 1 | 2 | 3 | 4;
    /** add the default component radius without depending on config shorthands. */
    rounded?: boolean;
};
export declare const Surface: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevated?: boolean | undefined;
    elevation?: number | false | import("@tamagui/web").Size | undefined;
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