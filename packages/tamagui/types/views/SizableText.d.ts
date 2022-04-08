import { GetProps } from '@tamagui/core';
export declare const SizableText: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").TextProps, `$${string}` | "...fontSize" | "...size" | keyof import("@tamagui/core").PseudoProps<any>> & {
    size?: number | `$${string}` | `$${number}` | undefined;
} & import("@tamagui/core").MediaProps<{
    size?: number | `$${string}` | `$${number}` | undefined;
} & Omit<import("@tamagui/core").TextProps, "...fontSize" | "...size">> & import("@tamagui/core").PseudoProps<{
    size?: number | `$${string}` | `$${number}` | undefined;
} & Omit<import("@tamagui/core").TextProps, "...fontSize" | "...size">>, {
    size?: number | `$${string}` | `$${number}` | undefined;
}, any, import("@tamagui/core").StaticConfigParsed>;
export declare type SizableTextProps = GetProps<typeof SizableText>;
//# sourceMappingURL=SizableText.d.ts.map