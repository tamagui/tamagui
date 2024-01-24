import { ColorTokens, GetProps, ThemeTokens } from '@tamagui/core';
import { LinearGradientPoint } from './linear-gradient';
export type LinearGradientExtraProps = {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};
export declare const LinearGradient: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & LinearGradientExtraProps, Omit<import("@tamagui/core").StackStyleBase, keyof LinearGradientExtraProps>, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, {}>;
export type LinearGradientProps = GetProps<typeof LinearGradient>;
//# sourceMappingURL=LinearGradient.shared.d.ts.map