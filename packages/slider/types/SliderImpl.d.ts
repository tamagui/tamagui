import * as React from 'react';
import { View } from 'react-native';
import { SliderImplProps } from './types';
export declare const DirectionalYStack: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "orientation"> & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "orientation"> & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "orientation"> & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}>>, import("@tamagui/core").TamaguiElement, Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
        onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
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
        onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    };
}>;
export declare const SliderFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}, "size"> & {
    readonly size?: any;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}, "size"> & {
    readonly size?: any;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
}, "size"> & {
    readonly size?: any;
}>>, import("@tamagui/core").TamaguiElement, Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly orientation?: "vertical" | "horizontal" | undefined;
} & {
    readonly size?: any;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "children" | "onLayout" | "style" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
        onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
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
        onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly orientation?: "vertical" | "horizontal" | undefined;
    };
}>;
export declare const SliderImpl: React.ForwardRefExoticComponent<SliderImplProps & React.RefAttributes<View>>;
//# sourceMappingURL=SliderImpl.d.ts.map