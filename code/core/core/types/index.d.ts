export { createRefComponent, type RefProp } from '@tamagui/compose-refs';
export type * from '@tamagui/size';
export { createSizeContext, createSizeTable, defaultTokenSizePolicy, resolveSizeToken, resolveTokenSize, SizeContext, } from '@tamagui/size';
export * from '@tamagui/web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, TamaguiComponent, TamaguiElement, TamaguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@tamagui/web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes';
export { LayoutMeasurementController, registerLayoutNode, type LayoutEvent, } from '@tamagui/use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNTamaguiViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNTamaguiView = TamaguiComponent<TamaDefer, TamaguiElement, RNTamaguiViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNTamaguiTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNTamaguiText = TamaguiComponent<TamaDefer, TamaguiTextElement, RNTamaguiTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes';
export { createTamagui, TamaguiProvider } from './runtime';
export declare const View: RNTamaguiView;
export declare const Text: RNTamaguiText;
//# sourceMappingURL=index.d.ts.map