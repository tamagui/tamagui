import { ColorTokens, GetProps, ThemeTokens } from '@tamagui/core';
import { LinearGradientProps as ExpoLinearGradientProps } from './linear-gradient';
export type LinearGradientExtraProps = Omit<ExpoLinearGradientProps, 'colors'> & {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
};
export declare const LinearGradient: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, "colors" | keyof import("react-native").ViewProps | "locations" | "start" | "end"> & Omit<ExpoLinearGradientProps, "colors"> & {
    colors?: (ColorTokens | (string & {}))[] | undefined;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<ExpoLinearGradientProps, "colors"> & {
    colors?: (ColorTokens | (string & {}))[] | undefined;
}, import("@tamagui/core").StackStylePropsBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, {}>;
export type LinearGradientProps = GetProps<typeof LinearGradient>;
//# sourceMappingURL=LinearGradient.shared.d.ts.map