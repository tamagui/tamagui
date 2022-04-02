import { GetProps } from '@tamagui/core';
export declare const getButtonSize: (val: any, { tokens, props }: import("@tamagui/core").VariantSpreadExtras<any>) => {
    minHeight: any;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: import("@tamagui/core").VariableVal;
};
export declare const SizableStack: import("@tamagui/core").StaticComponent<Omit<Omit<import("@tamagui/core").StackProps, `$${string}` | "elevation" | "fullscreen" | keyof import("@tamagui/core").PseudoProps<any>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>>, "focusable" | `$${string}` | "disabled" | "size" | keyof import("@tamagui/core").PseudoProps<any> | "transparent" | "hoverable" | "pressable" | "bordered" | "chromeless"> & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | null | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("@tamagui/core").StackProps, `$${string}` | "elevation" | "fullscreen" | keyof import("@tamagui/core").PseudoProps<any>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | null | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("@tamagui/core").StackProps, `$${string}` | "elevation" | "fullscreen" | keyof import("@tamagui/core").PseudoProps<any>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | null | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("@tamagui/core").StackProps, `$${string}` | "elevation" | "fullscreen" | keyof import("@tamagui/core").PseudoProps<any>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | null | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("@tamagui/core").StackProps, `$${string}` | "elevation" | "fullscreen" | keyof import("@tamagui/core").PseudoProps<any>> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").MediaProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & import("@tamagui/core").PseudoProps<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
} & import("@tamagui/core").WithShorthands<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    animated?: boolean | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: boolean | import("@tamagui/core").VariableVal | undefined;
} & {
    children?: any;
} & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | null | undefined;
}>> & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | null | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>>, void, any, import("@tamagui/core").StaticConfigParsed>;
export declare type SizableFrameProps = GetProps<typeof SizableStack>;
//# sourceMappingURL=SizableStack.d.ts.map