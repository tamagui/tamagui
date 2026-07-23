import type { ColorTokens, GetProps, ThemeTokens } from '@tamagui/core';
import type { LinearGradientPoint } from './linear-gradient';
export type LinearGradientExtraProps = {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};
export declare const LinearGradient: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, keyof LinearGradientExtraProps> & LinearGradientExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & LinearGradientExtraProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type LinearGradientProps = GetProps<typeof LinearGradient>;
//# sourceMappingURL=LinearGradient.d.ts.map