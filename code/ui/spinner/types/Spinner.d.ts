import type { ColorTokens, ThemeTokens } from '@tamagui/core';
import type { YStackProps } from '@tamagui/stacks';
export type SpinnerProps = Omit<YStackProps, 'children'> & {
    size?: 'small' | 'large';
    color?: (ColorTokens | ThemeTokens | (string & {})) | null;
};
export declare const Spinner: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Spinner.d.ts.map