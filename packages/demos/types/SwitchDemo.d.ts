/// <reference types="react" />
import { View } from 'react-native';
import { SizeTokens } from 'tamagui';
export declare function SwitchDemo(): JSX.Element;
export declare function SwitchWithLabel(props: {
    size: SizeTokens;
    defaultChecked?: boolean;
}): JSX.Element;
export declare const CustomSwitch: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
    size?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, any> & {
    staticConfig: import("tamagui").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("tamagui").StaticConfig> | undefined) => X;
    styleable: import("tamagui").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, any, any, {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    };
} & {
    Thumb: import("tamagui").TamaguiComponent<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any, any, {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
};
export declare const HeadlessSwitch: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & Pick<import("react-native").PressableProps, "onPress"> & import("@tamagui/switch-headless").SwitchExtraProps & import("react").RefAttributes<View>>;
//# sourceMappingURL=SwitchDemo.d.ts.map