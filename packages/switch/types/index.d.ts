/// <reference types="react" />
export * from './createSwitch';
<<<<<<< HEAD
export * from './StyledContext';
export * from './Switch';
export declare const Switch: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, any> & {
    staticConfig: import("@tamagui/web").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/web").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/web").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, any, any, {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    };
} & {
    Thumb: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
=======
export declare const Switch: import("react").ForwardRefExoticComponent<Omit<import("./createSwitch").SwitchProps, keyof import("./createSwitch").SwitchExtraProps> & import("./createSwitch").SwitchExtraProps & import("react").RefAttributes<any>> & import("@tamagui/web").StaticComponentObject<Omit<import("./createSwitch").SwitchProps, keyof import("./createSwitch").SwitchExtraProps> & import("./createSwitch").SwitchExtraProps, any, any, {
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("./createSwitch").SwitchExtraProps, {}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("./createSwitch").SwitchProps, keyof import("./createSwitch").SwitchExtraProps> & import("./createSwitch").SwitchExtraProps, any, any, {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("./createSwitch").SwitchExtraProps, {}, {}];
} & {
    Thumb: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStylePropsBase>> & {
>>>>>>> master
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any, any, {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}, {}>;
};
//# sourceMappingURL=index.d.ts.map