/// <reference types="react" />
import { ColorTokens, ThemeTokens } from '@tamagui/core';
import { YStackProps } from '@tamagui/stacks';
import type { ViewStyle } from 'react-native';
import { LinearGradientProps as ExpoLinearGradientProps } from './linear-gradient';
export type LinearGradientProps = Omit<ExpoLinearGradientProps, 'colors'> & Omit<YStackProps, 'children' | keyof ExpoLinearGradientProps> & {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
};
export declare const LinearGradient: import("@tamagui/core").ReactComponentWithRef<Omit<ExpoLinearGradientProps, "colors"> & Omit<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>>, "colors" | keyof import("react-native").ViewProps | "locations" | "start" | "end"> & {
    colors?: (ColorTokens | (string & {}))[] | undefined;
} & Omit<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").ThemeableProps, "colors" | keyof import("react-native").ViewProps | "locations" | "start" | "end" | "display" | "elevation" | "gap" | "columnGap" | "rowGap" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "fullscreen" | keyof import("@tamagui/core").TransformStyleProps | "theme" | "group" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").WebOnlyPressEvents | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "tag" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onFocus" | "onScroll" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | keyof import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>>>, import("@tamagui/core").TamaguiElement> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    styleable: import("@tamagui/core").Styleable<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "onLayout" | "display" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>>, import("@tamagui/core").TamaguiElement>;
};
//# sourceMappingURL=LinearGradient.shared.d.ts.map