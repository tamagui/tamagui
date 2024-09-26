export * from '@tamagui/react-native-use-responder-events';
export * from '@tamagui/react-native-use-pressable';
export { View, Text } from './index';
export * from './react-native-web/Dimensions';
export declare const Platform: {
    OS: string;
    select(obj: any): any;
};
export declare const StyleSheet: {
    create(obj: any): any;
};
export declare const Pressable: () => null;
export declare const Animated: {
    View: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("react").RefAttributes<import("@tamagui/web/types/types").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web/types/types").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web/types/types").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
    };
    Text: import("@tamagui/web/types/types").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web/types/types").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export declare const ActivityIndicator: () => null;
export declare const PanResponder: () => null;
export declare const Switch: () => null;
export declare const TextInput: () => null;
export declare const ScrollView: () => null;
export declare const Keyboard: {};
export declare const Image: () => null;
export declare const Linking: {};
//# sourceMappingURL=react-native-web.d.ts.map