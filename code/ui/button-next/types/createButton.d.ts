import { type SizableStackProps } from '@tamagui/stacks';
import { type SizableTextProps } from '@tamagui/text';
import type { SizeTokens, TamaguiComponentExpectingVariants } from '@tamagui/web';
export type ButtonFrameProps = SizableStackProps & {
    iconSize?: SizeTokens;
    scaleIcon?: number;
};
type FrameLike<Variants extends Record<string, any>> = TamaguiComponentExpectingVariants<ButtonFrameProps, Variants>;
type TextLike<Variants extends Record<string, any>> = TamaguiComponentExpectingVariants<SizableTextProps, Variants>;
export declare const createButton: <Variants extends Record<string, any>, FrameC extends FrameLike<Variants> = FrameLike<Variants>, TextC extends TextLike<Variants> = TextLike<Variants>, IconC extends TextLike<Variants> = TextLike<Variants>>(options: {
    Frame: FrameC;
    Text: TextC;
    Icon: IconC;
    defaultVariants?: { [Key in keyof Variants]: Variants[Key] | undefined; };
    name?: string;
}) => FrameC & {
    Apply: import("react").ProviderExoticComponent<Partial<{ [Key in keyof Variants]: Variants[Key] | undefined; }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=createButton.d.ts.map