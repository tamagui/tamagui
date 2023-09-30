/// <reference types="react" />
import { SizeTokens } from '@tamagui/core';
export declare const SwitchThumb: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "checked" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "checked" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "checked" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/core").DebugProp | undefined;
        disabled?: boolean | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        theme?: string | null | undefined;
        group?: undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | undefined;
        disableClassName?: boolean | undefined;
        onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/core").DebugProp | undefined;
        disabled?: boolean | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        theme?: string | null | undefined;
        group?: undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | undefined;
        disableClassName?: boolean | undefined;
        onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | SizeTokens | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    };
}>;
export declare const SwitchFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
}, "size" | "checked" | "frameWidth" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly frameWidth?: number | undefined;
    readonly size?: SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
}, "size" | "checked" | "frameWidth" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly frameWidth?: number | undefined;
    readonly size?: SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
}, "size" | "checked" | "frameWidth" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly frameWidth?: number | undefined;
    readonly size?: SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | SizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
    readonly checked?: boolean | undefined;
    readonly frameWidth?: number | undefined;
    readonly size?: SizeTokens | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/core").DebugProp | undefined;
        disabled?: boolean | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        theme?: string | null | undefined;
        group?: undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | undefined;
        disableClassName?: boolean | undefined;
        onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/core").DebugProp | undefined;
        disabled?: boolean | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        theme?: string | null | undefined;
        group?: undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | undefined;
        disableClassName?: boolean | undefined;
        onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | SizeTokens | undefined;
    };
}>;
//# sourceMappingURL=Switch.d.ts.map