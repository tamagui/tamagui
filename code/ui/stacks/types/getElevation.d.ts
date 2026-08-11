import type { SizeTokens, SizeVariantSpreadFunction, ViewProps, VariantSpreadExtras } from '@tamagui/core';
export declare const getElevation: SizeVariantSpreadFunction<ViewProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    shadowColor: import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<string> | import("@tamagui/core").Variable<number> | import("@tamagui/core").Variable<import("@tamagui/core").PxValue> | import("@tamagui/core").Variable<import("@tamagui/core").VariableValGeneric>;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
    elevationAndroid?: number | undefined;
} | undefined;
//# sourceMappingURL=getElevation.d.ts.map