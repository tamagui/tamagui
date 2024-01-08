/// <reference types="react" />
import type { StackProps, StackPropsBase, TamaguiComponent, TamaguiElement, TamaguiTextElement, TextProps } from '@tamagui/web';
import { RNTextProps, RNViewProps } from './reactNativeTypes';
export * from '@tamagui/web';
export * from './reactNativeTypes';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackProps>;
type ViewType = TamaguiComponent<StackProps & RNExclusiveViewProps, TamaguiElement, StackPropsBase & RNExclusiveViewProps, void>;
export declare const View: ViewType;
export declare const Stack: ViewType;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export declare const Text: TamaguiComponent<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>>> & RNExclusiveTextProps, TamaguiTextElement, Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & RNExclusiveTextProps, void>;
//# sourceMappingURL=index.d.ts.map