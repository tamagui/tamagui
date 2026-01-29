import type { SizableTextProps } from '@tamagui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}>, keyof AnchorExtraProps> & AnchorExtraProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & AnchorExtraProps, import("@tamagui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Anchor.d.ts.map