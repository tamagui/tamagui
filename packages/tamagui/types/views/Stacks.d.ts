import { GetProps, VariantSpreadExtras } from '@tamagui/core';
export declare const YStack: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}> & import("@tamagui/core").PseudoProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare type YStackProps = GetProps<typeof YStack>;
export declare type XStackProps = GetProps<typeof YStack>;
export declare type ZStackProps = GetProps<typeof ZStack>;
export declare const XStack: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}> & import("@tamagui/core").PseudoProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare const ZStack: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").StackProps, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}> & import("@tamagui/core").PseudoProps<{
    fullscreen?: boolean | undefined;
    elevation?: `$${string}` | `$${number}` | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare const getSizedElevation: (val: number, { theme }: VariantSpreadExtras<any>) => {
    shadowColor: string | import("@tamagui/core").Variable;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
};
//# sourceMappingURL=Stacks.d.ts.map