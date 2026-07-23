import type { SizableTextProps } from '@tamagui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}>, keyof AnchorExtraProps> & AnchorExtraProps, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TextNonStyleProps & AnchorExtraProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Anchor.d.ts.map