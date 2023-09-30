import { GetProps } from '@tamagui/web';
import * as React from 'react';
declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
} & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
}>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
}>>, import("@tamagui/web").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/web").DebugProp | undefined;
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
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        target?: string | undefined;
        hitSlop?: number | import("react-native").Insets | null | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        children?: any;
        debug?: import("@tamagui/web").DebugProp | undefined;
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
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleProps = ToggleFrameProps & {
    defaultValue?: string;
    disabled?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?(pressed: boolean): void;
};
declare const Toggle: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
} & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
}>> & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/web").DebugProp | undefined;
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
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/web").SizeTokens | undefined;
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
}, "unstyled" | "active" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly active?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
}>> & {
    defaultValue?: string | undefined;
    disabled?: boolean | undefined;
    pressed?: boolean | undefined;
    defaultPressed?: boolean | undefined;
    onPressedChange?(pressed: boolean): void;
} & React.RefAttributes<HTMLButtonElement>>;
export { Toggle, ToggleFrame };
export type { ToggleProps };
//# sourceMappingURL=Toggle.d.ts.map