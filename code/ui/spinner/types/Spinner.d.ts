import type { ColorTokens, ThemeTokens } from '@tamagui/core';
import type { YStackProps } from '@tamagui/stacks';
type SpinnerExtraProps = {
    size?: 'small' | 'large';
    color?: (ColorTokens | ThemeTokens | (string & {})) | null;
};
export type SpinnerProps = Omit<YStackProps, 'children' | keyof SpinnerExtraProps> & SpinnerExtraProps;
export declare const Spinner: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, keyof SpinnerExtraProps> & SpinnerExtraProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & SpinnerExtraProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=Spinner.d.ts.map