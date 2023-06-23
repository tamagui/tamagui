import type { SizeTokens, VariantSpreadExtras } from '@tamagui/web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens, props }: VariantSpreadExtras<any>) => {
    paddingHorizontal: number;
    height: number;
    borderRadius: number;
} | {
<<<<<<< HEAD
    paddingHorizontal: any;
    height: `$${string}` | `$${number}`;
=======
    paddingHorizontal: import("@tamagui/web").Variable<number>;
    height: `$${string}.${string}` | `$${string}.${number}` | `$${string}` | `$${number}`;
>>>>>>> tamagui/master
    borderRadius: import("@tamagui/web").VariableVal;
};
//# sourceMappingURL=index.d.ts.map