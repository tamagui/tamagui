import type { FontSizeTokens, GetProps } from '@tamagui/web';
export declare const LabelFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/web").SizeTokens | FontSizeTokens | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/web").SizeTokens | FontSizeTokens | undefined;
}>, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & void, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/web").SizeTokens | FontSizeTokens | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map