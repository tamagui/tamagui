import { type SizableStackProps } from '@tamagui/stacks';
import type { SizeTokens, StackNonStyleProps, StackStyleBase, StaticConfigPublic, TamaDefer, TamaguiComponent, TamaguiElement, TamaguiTextElement, TextNonStyleProps, TextStylePropsBase } from '@tamagui/web';
import { type FunctionComponent } from 'react';
type FrameExtraProps = {
    iconSize?: SizeTokens;
    scaleIcon?: number;
};
export type ButtonFrameProps = SizableStackProps & FrameExtraProps;
type FrameLike<Variants extends Record<string, any>> = TamaguiComponent<TamaDefer, TamaguiElement, StackNonStyleProps & FrameExtraProps, StackStyleBase, Variants, StaticConfigPublic>;
type TextLike<Variants extends Record<string, any>> = TamaguiComponent<TamaDefer, TamaguiTextElement, TextNonStyleProps & FrameExtraProps, TextStylePropsBase, Variants, StaticConfigPublic>;
export declare const createButton: <Variants extends Record<string, any>, FrameC extends FrameLike<Variants> = FrameLike<Variants>, TextC extends TextLike<Variants> = TextLike<Variants>, IconC extends TextLike<Variants> = TextLike<Variants>>(options: {
    Frame: FrameC;
    Text: TextC;
    Icon: IconC;
    defaultVariants?: { [Key in keyof Variants]: Variants[Key] | undefined; };
    name?: string;
}) => FrameC & {
    Frame: FrameC;
    Text: TextC;
    Icon: IconC;
    Apply: FunctionComponent<Partial<{ [Key in keyof Variants]: Variants[Key] | undefined; }> & {
        children?: React.ReactNode;
        scope?: string;
    }>;
};
export {};
//# sourceMappingURL=createButton.d.ts.map