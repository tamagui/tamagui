import { SizeTokens, SizeVariantSpreadFunction, StackProps, VariantSpreadExtras } from '@tamagui/core';
export declare const getElevation: SizeVariantSpreadFunction<StackProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    elevationAndroid?: number | undefined;
    shadowColor: import("@tamagui/core").Variable<any> | undefined;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
};
//# sourceMappingURL=getElevation.d.ts.map