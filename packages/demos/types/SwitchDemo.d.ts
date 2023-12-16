/// <reference types="react" />
import { View } from 'react-native';
import { SizeTokens } from 'tamagui';
export declare const Switch: import("@tamagui/web").ReactComponentWithRef<import("tamagui").SwitchProps, any> & {
    staticConfig: import("tamagui").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("tamagui").StaticConfig> | undefined) => X;
    styleable: import("tamagui").Styleable<import("tamagui").SwitchProps, any, any, {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("tamagui").SwitchExtraProps, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("tamagui").SwitchExtraProps;
} & {
    Thumb: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        size?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any> & {
        staticConfig: import("tamagui").StaticConfig;
        extractable: <X_1>(a: X_1, staticConfig?: Partial<import("tamagui").StaticConfig> | undefined) => X_1;
        styleable: import("tamagui").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
            size?: number | SizeTokens | undefined;
            unstyled?: boolean | undefined;
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
    };
};
export declare const HeadlessSwitch: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps & import("@tamagui/switch/types/headless").SwitchExtraProps, "children"> & {
    children?: import("react").ReactNode | ((checked: boolean) => import("react").ReactNode);
    disabled?: boolean | undefined;
    onPress?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
} & import("react").RefAttributes<View>> & {
    Thumb: import("react").ForwardRefExoticComponent<import("react").RefAttributes<View>>;
};
export declare function SwitchDemo(): JSX.Element;
export declare function SwitchWithLabel(props: {
    size: SizeTokens;
    defaultChecked?: boolean;
}): JSX.Element;
//# sourceMappingURL=SwitchDemo.d.ts.map