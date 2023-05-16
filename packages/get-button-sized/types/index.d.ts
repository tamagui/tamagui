import type { SizeTokens, VariantSpreadExtras } from '@tamagui/web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens }: VariantSpreadExtras<{}>) => {
    paddingHorizontal: number;
    height: number;
    borderRadius: number;
} | {
    paddingHorizontal: import("@tamagui/web").Variable<number>;
    height: `$${string}` | `$${number}`;
    borderRadius: import("@tamagui/web").VariableVal;
};
//# sourceMappingURL=index.d.ts.map