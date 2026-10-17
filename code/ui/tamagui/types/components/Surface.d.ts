import { type GetProps } from '@tamagui/core';
export declare const SurfaceFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevated?: boolean | undefined;
    filled?: boolean | undefined;
    interactive?: boolean | undefined;
    outlined?: boolean | undefined;
    roundedFacet?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SurfaceProps = Omit<GetProps<typeof SurfaceFrame>, 'roundedFacet' | 'rounded'> & {
    /** shift the subtree to a relative theme level. */
    level?: 1 | 2 | 3 | 4;
    /** add the default component radius without depending on config shorthands. */
    rounded?: boolean;
};
export declare const Surface: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
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