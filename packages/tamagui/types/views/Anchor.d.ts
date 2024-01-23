import { SizableTextProps } from '@tamagui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & AnchorExtraProps, Omit<import("@tamagui/core").TextStylePropsBase, keyof AnchorExtraProps>, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {}>;
//# sourceMappingURL=Anchor.d.ts.map