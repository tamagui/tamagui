export { createRefComponent, type RefProp } from '@tamagui/compose-refs';
export * from '@tamagui/web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, TamaguiComponent, TamaguiElement, TamaguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@tamagui/web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes.js';
export { LayoutMeasurementController, registerLayoutNode, type LayoutEvent, } from '@tamagui/use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNTamaguiViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNTamaguiView = TamaguiComponent<TamaDefer, TamaguiElement, RNTamaguiViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNTamaguiTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNTamaguiText = TamaguiComponent<TamaDefer, TamaguiTextElement, RNTamaguiTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes.js';
export { createTamagui, TamaguiProvider } from './runtime.js';
export declare const View: RNTamaguiView;
export declare const Text: RNTamaguiText;
//# sourceMappingURL=index.d.ts.map