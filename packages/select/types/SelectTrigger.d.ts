import { TamaguiElement } from '@tamagui/core';
import { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
export type SelectTriggerProps = ListItemProps;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
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
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/core").ThemeableProps & {
    icon?: (JSX.Element | React.FunctionComponent<{
        color?: string | undefined;
        size?: number | undefined;
    }> | null) | undefined;
    iconAfter?: (JSX.Element | React.FunctionComponent<{
        color?: string | undefined;
        size?: number | undefined;
    }> | null) | undefined;
    scaleIcon?: number | undefined;
    spaceFlex?: number | boolean | undefined;
    scaleSpace?: number | undefined;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    noTextWrap?: boolean | "all" | undefined;
} & React.RefAttributes<TamaguiElement>>;
//# sourceMappingURL=SelectTrigger.d.ts.map