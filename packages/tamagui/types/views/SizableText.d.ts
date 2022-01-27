import { GetProps } from '@tamagui/core';
export declare const sizableTextSizeVariant: (val: any, { tokens, props }: {
    tokens: any;
    props: any;
}) => {
    fontFamily?: undefined;
    fontWeight?: undefined;
    letterSpacing?: undefined;
    fontSize?: undefined;
    lineHeight?: undefined;
} | {
    fontFamily: any;
    fontWeight: any;
    letterSpacing: any;
    fontSize: any;
    lineHeight: any;
};
export declare const SizableText: import("@tamagui/core").StaticComponent<Omit<import("@tamagui/core").TextProps, "size"> & {
    size?: `$${string}` | `$${number}` | null | undefined;
} & import("@tamagui/core").MediaProps<{
    size?: `$${string}` | `$${number}` | null | undefined;
}>, void, import("@tamagui/core").StaticConfigParsed, any>;
export declare type SizableTextProps = GetProps<typeof SizableText>;
//# sourceMappingURL=SizableText.d.ts.map