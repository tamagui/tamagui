/// <reference types="react" />
export * from './createCheckbox';
export * from './Checkbox';
export * from './CheckboxStyledContext';
export declare const Checkbox: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
    scaleIcon?: number | undefined;
    scaleSize?: number | undefined;
    sizeAdjust?: number | undefined;
    native?: import("@tamagui/helpers").NativeValue<"web"> | undefined;
} & {
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
}, any> & {
    staticConfig: import("@tamagui/web").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/web").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/web").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
        scaleIcon?: number | undefined;
        scaleSize?: number | undefined;
        sizeAdjust?: number | undefined;
        native?: import("@tamagui/helpers").NativeValue<"web"> | undefined;
    } & {
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any, any, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    };
} & {
    Indicator: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
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
//# sourceMappingURL=index.d.ts.map