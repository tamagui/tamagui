import { SizeTokens, SizeVariantSpreadFunction, StackProps, VariantSpreadExtras } from '@tamagui/core';
export declare const getElevation: SizeVariantSpreadFunction<StackProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    elevationAndroid?: number | undefined;
    shadowColor: import("@tamagui/core").Variable<import("@tamagui/core").VariableColorVal | undefined> | undefined;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
} | undefined;
//# sourceMappingURL=getElevation.d.ts.map