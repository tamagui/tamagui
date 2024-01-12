import type { StackProps, StackPropsBase, TamaguiComponent, TamaguiElement, TamaguiTextElement, TextProps, TextPropsBase } from '@tamagui/web';
import { RNTextProps, RNViewProps } from './reactNativeTypes';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackProps>;
type RNTamaguiView = TamaguiComponent<StackProps & RNExclusiveViewProps, TamaguiElement, StackPropsBase & RNExclusiveViewProps, void>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
type RNTamaguiText = TamaguiComponent<TextProps & RNExclusiveTextProps, TamaguiTextElement, TextPropsBase & RNExclusiveTextProps, void>;
export * from '@tamagui/web';
export * from './reactNativeTypes';
export declare const View: RNTamaguiView;
export declare const Stack: RNTamaguiView;
export declare const Text: RNTamaguiText;
//# sourceMappingURL=index.d.ts.map