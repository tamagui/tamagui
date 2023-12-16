/// <reference types="react" />
import { SwitchContext, createSwitch as createHeadlessSwitch } from './headless';
export * from './Switch';
export * from './SwitchContext';
export * from './createSwitch';
export declare const Switch: import("@tamagui/web").ReactComponentWithRef<import("./createSwitch").SwitchProps, any> & {
    staticConfig: import("@tamagui/web").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/web").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/web").Styleable<import("./createSwitch").SwitchProps, any, any, {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("./createSwitch").SwitchExtraProps, {}>;
} & {
    __baseProps: any;
    __variantProps: {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("./createSwitch").SwitchExtraProps;
} & {
    Thumb: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, any> & {
        staticConfig: import("@tamagui/web").StaticConfig;
        extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/web").StaticConfig> | undefined) => X;
        styleable: import("@tamagui/web").Styleable<Omit<import("react-native").ViewProps, "pointerEvents" | "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & import("@tamagui/web").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & {
            size?: number | import("@tamagui/web").SizeTokens | undefined;
            unstyled?: boolean | undefined;
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
    };
};
export { createHeadlessSwitch, SwitchContext };
//# sourceMappingURL=index.d.ts.map