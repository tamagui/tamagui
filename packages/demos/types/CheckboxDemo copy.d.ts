/// <reference types="react" />
import { View } from 'react-native';
import { CheckboxProps, SizeTokens } from 'tamagui';
export declare function CheckboxDemo(): JSX.Element;
export declare function CheckboxWithLabel({ size, label, ...checkboxProps }: CheckboxProps & {
    size: SizeTokens;
    label?: string;
}): JSX.Element;
export declare const CustomCheckbox: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
    scaleIcon?: number | undefined;
    scaleSize?: number | undefined;
    sizeAdjust?: number | undefined;
    native?: import("tamagui").NativeValue<"web"> | undefined;
} & {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
}, any> & {
    staticConfig: import("tamagui").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("tamagui").StaticConfig> | undefined) => X;
    styleable: import("tamagui").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
        scaleIcon?: number | undefined;
        scaleSize?: number | undefined;
        sizeAdjust?: number | undefined;
        native?: import("tamagui").NativeValue<"web"> | undefined;
    } & {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any, any, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
    };
} & {
    Indicator: import("tamagui").TamaguiComponent<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        forceMount?: boolean | undefined;
        disablePassStyles?: boolean | undefined;
    } & {
        unstyled?: boolean | undefined;
    }, any, any, {
        unstyled?: boolean | undefined;
    }, {}>;
};
export declare const HeadlessCheckbox: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & Pick<import("react-native").PressableProps, "onPress"> & import("@tamagui/checkbox-headless").CheckboxExtraProps & import("react").RefAttributes<View>>;
//# sourceMappingURL=CheckboxDemo%20copy.d.ts.map