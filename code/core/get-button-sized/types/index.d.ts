import type { SizeTokens, VariantSpreadExtras } from '@tamagui/web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens, props }: VariantSpreadExtras<any>) => {
    paddingHorizontal: number;
    height: number | import("@tamagui/web").UnionableNumber;
    borderRadius: number;
} | {
    paddingHorizontal: import("@tamagui/web").Variable<number>;
    height: `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableString;
    borderRadius: any;
} | undefined;
//# sourceMappingURL=index.d.ts.map