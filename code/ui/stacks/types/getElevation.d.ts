import type { SizeTokens, SizeVariantSpreadFunction, ViewProps, VariantSpreadExtras } from '@tamagui/core';
export declare const getElevation: SizeVariantSpreadFunction<ViewProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    elevationAndroid?: number | undefined;
    shadowColor: import("@tamagui/core").Variable<string> | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<undefined> | undefined;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
} | undefined;
//# sourceMappingURL=getElevation.d.ts.map