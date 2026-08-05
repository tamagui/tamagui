import type { SizeTokens, SizeVariantSpreadFunction, ViewProps, VariantSpreadExtras } from '@tamagui/core';
export declare const getElevation: SizeVariantSpreadFunction<ViewProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    shadowColor: import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<undefined> | import("@tamagui/core").Variable<string> | undefined;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
    elevationAndroid?: number | undefined;
} | undefined;
//# sourceMappingURL=getElevation.d.ts.map