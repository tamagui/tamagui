import { GetProps, TamaguiElement, ThemeableProps } from '@tamagui/core';
import { TextParentStyles } from '@tamagui/text';
import { FunctionComponent } from 'react';
declare type ButtonIconProps = {
    color?: string;
    size?: number;
};
declare type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;
export declare type ButtonProps = Omit<TextParentStyles, 'TextComponent'> & GetProps<typeof ButtonFrame> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
};
export declare const ButtonFrame: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>;
export declare const ButtonText: import("@tamagui/core").TamaguiComponent<(Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined; /**
     * default: -1
     */
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | (Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, import("@tamagui/core").TextPropsBase, {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})>;
export declare function useButton(props: ButtonProps, { Text }?: {
    Text: any;
}): {
    spaceSize: number;
    isNested: boolean;
    props: {
        children: string | number | boolean | any[] | JSX.Element | import("react").ReactFragment | null | undefined;
        hitSlop?: import("@tamagui/types-react-native").Insets | (import("@tamagui/types-react-native").Insets & number) | undefined;
        onLayout?: ((event: import("@tamagui/types-react-native").LayoutChangeEvent) => void) | undefined;
        pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
        removeClippedSubviews?: boolean | undefined;
        style?: import("@tamagui/types-react-native").StyleProp<import("@tamagui/types-react-native").ViewStyle>;
        testID?: string | undefined;
        nativeID?: string | undefined;
        collapsable?: boolean | undefined;
        needsOffscreenAlphaCompositing?: boolean | undefined;
        renderToHardwareTextureAndroid?: boolean | undefined;
        focusable?: boolean | undefined;
        shouldRasterizeIOS?: boolean | undefined;
        isTVSelectable?: boolean | undefined;
        hasTVPreferredFocus?: boolean | undefined;
        tvParallaxProperties?: import("@tamagui/types-react-native").TVParallaxProperties | undefined;
        tvParallaxShiftDistanceX?: number | undefined;
        tvParallaxShiftDistanceY?: number | undefined;
        tvParallaxTiltAngle?: number | undefined;
        tvParallaxMagnification?: number | undefined;
        onStartShouldSetResponder?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponder?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => boolean) | undefined;
        onTouchStart?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onTouchMove?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onTouchEnd?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onTouchCancel?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onTouchEndCapture?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | undefined;
        onPointerEnter?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerEnterCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerLeave?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerLeaveCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerMove?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerMoveCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerCancel?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerCancelCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerDown?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerDownCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerUp?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        onPointerUpCapture?: ((event: import("@tamagui/types-react-native").PointerEvent) => void) | undefined;
        accessible?: boolean | undefined;
        accessibilityActions?: readonly Readonly<{
            name: string;
            label?: string | undefined;
        }>[] | undefined;
        accessibilityLabel?: string | undefined;
        accessibilityRole?: "none" | "button" | "link" | "search" | "image" | "keyboardkey" | "text" | "adjustable" | "imagebutton" | "header" | "summary" | "list" | undefined;
        accessibilityState?: import("@tamagui/types-react-native").AccessibilityState | undefined;
        accessibilityHint?: string | undefined;
        accessibilityValue?: import("@tamagui/types-react-native").AccessibilityValue | undefined;
        onAccessibilityAction?: ((event: import("@tamagui/types-react-native").AccessibilityActionEvent) => void) | undefined;
        accessibilityLabelledBy?: string | string[] | undefined;
        accessibilityLiveRegion?: "none" | "polite" | "assertive" | undefined;
        importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants" | undefined;
        accessibilityElementsHidden?: boolean | undefined;
        accessibilityLanguage?: string | undefined;
        accessibilityViewIsModal?: boolean | undefined;
        onAccessibilityEscape?: (() => void) | undefined;
        onAccessibilityTap?: (() => void) | undefined;
        onMagicTap?: (() => void) | undefined;
        accessibilityIgnoresInvertColors?: boolean | undefined;
        dataSet?: any;
        target?: any;
        rel?: any;
        download?: any;
        href?: string | undefined;
        hrefAttrs?: {
            target?: "top" | "_blank" | "_self" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
        onMouseDown?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & import("react").MouseEventHandler<HTMLDivElement>) | undefined;
        onMouseUp?: ((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
        onMouseEnter?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & import("react").MouseEventHandler<HTMLDivElement>) | undefined;
        onMouseLeave?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & import("react").MouseEventHandler<HTMLDivElement>) | undefined;
        onFocus?: ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        asChild?: boolean | undefined;
        spaceDirection?: import("@tamagui/core").SpaceDirection | undefined;
        dangerouslySetInnerHTML?: {
            __html: string; /**
             * adjust internal space relative to icon size
             */
        } | undefined;
        animation?: import("@tamagui/core").AnimationProp | undefined;
        animateOnly?: string[] | undefined;
        debug?: boolean | "verbose" | undefined;
        disabled?: boolean | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        id?: string | undefined;
        tag?: string | undefined;
        componentName?: string | undefined;
        forceStyle?: "hover" | "press" | "focus" | undefined;
        onHoverIn?: import("react").MouseEventHandler<HTMLDivElement> | undefined;
        onHoverOut?: import("react").MouseEventHandler<HTMLDivElement> | undefined;
        onPress?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | null | undefined;
        onPressIn?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | null | undefined;
        onPressOut?: ((event: import("@tamagui/types-react-native").GestureResponderEvent) => void) | null | undefined;
        backgroundColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderBottomColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderBottomEndRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomLeftRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomRightRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomStartRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        borderColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderEndColor?: import("@tamagui/types-react-native").ColorValue | undefined;
        borderLeftColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderLeftWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        borderRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderRightColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderRightWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        borderStartColor?: import("@tamagui/types-react-native").ColorValue | undefined;
        borderStyle?: "solid" | "dotted" | "dashed" | undefined;
        borderTopColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        borderTopEndRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopLeftRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopRightRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopStartRadius?: import("@tamagui/core").RadiusTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        borderWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        opacity?: number | undefined;
        alignContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "stretch" | undefined;
        alignItems?: import("@tamagui/types-react-native").FlexAlignType | undefined;
        alignSelf?: "auto" | import("@tamagui/types-react-native").FlexAlignType | undefined;
        aspectRatio?: number | undefined;
        borderEndWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        borderStartWidth?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        bottom?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        end?: string | number | undefined;
        flex?: number | undefined;
        flexBasis?: string | number | undefined;
        flexDirection?: "row" | "column" | "row-reverse" | "column-reverse" | undefined;
        flexGrow?: number | undefined;
        flexShrink?: number | undefined;
        flexWrap?: "nowrap" | "wrap" | "wrap-reverse" | undefined;
        height?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        margin?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginBottom?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginEnd?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginHorizontal?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginLeft?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginRight?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginStart?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginTop?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        marginVertical?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        maxHeight?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        maxWidth?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        minHeight?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        minWidth?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        overflow?: "visible" | "hidden" | "scroll" | undefined;
        padding?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingBottom?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingEnd?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingHorizontal?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingLeft?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingRight?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingStart?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingTop?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        paddingVertical?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        position?: "absolute" | "relative" | undefined;
        right?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        start?: string | number | undefined;
        top?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        width?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        zIndex?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ZIndexTokens | undefined;
        direction?: "inherit" | "ltr" | "rtl" | undefined;
        shadowColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("@tamagui/types-react-native").OpaqueColorValue | undefined;
        shadowOffset?: import("@tamagui/core").ThemeValueFallback | {
            width: import("@tamagui/core").SpaceTokens;
            height: import("@tamagui/core").SpaceTokens;
        } | {
            width: number;
            height: number;
        } | undefined;
        shadowOpacity?: number | undefined;
        shadowRadius?: import("@tamagui/core").SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        transform?: (import("@tamagui/types-react-native").PerpectiveTransform | import("@tamagui/types-react-native").RotateTransform | import("@tamagui/types-react-native").RotateXTransform | import("@tamagui/types-react-native").RotateYTransform | import("@tamagui/types-react-native").RotateZTransform | import("@tamagui/types-react-native").ScaleTransform | import("@tamagui/types-react-native").ScaleXTransform | import("@tamagui/types-react-native").ScaleYTransform | import("@tamagui/types-react-native").TranslateXTransform | import("@tamagui/types-react-native").TranslateYTransform | import("@tamagui/types-react-native").SkewXTransform | import("@tamagui/types-react-native").SkewYTransform | import("@tamagui/types-react-native").MatrixTransform)[] | undefined;
        transformMatrix?: number[] | undefined;
        rotation?: number | undefined;
        scaleX?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        scaleY?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        translateX?: number | undefined;
        translateY?: number | undefined;
        x?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        y?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        perspective?: number | undefined;
        scale?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
        skewX?: string | undefined;
        skewY?: string | undefined;
        matrix?: number[] | undefined;
        rotate?: string | undefined;
        rotateY?: string | undefined;
        rotateX?: string | undefined;
        rotateZ?: string | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
        elevation?: import("@tamagui/core").SizeTokens | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        active?: boolean | undefined;
        hoverStyle?: Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly fontFamily?: unknown;
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
        }, "disabled" | "size" | "active"> & {
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        pressStyle?: Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly fontFamily?: unknown;
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
        }, "disabled" | "size" | "active"> & {
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        focusStyle?: Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly fontFamily?: unknown;
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
        }, "disabled" | "size" | "active"> & {
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        exitStyle?: Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly fontFamily?: unknown;
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
        }, "disabled" | "size" | "active"> & {
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        enterStyle?: Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly fontFamily?: unknown;
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
        }, "disabled" | "size" | "active"> & {
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        themeInverse?: boolean | undefined;
        reset?: boolean | undefined;
    };
};
export declare const buttonStaticConfig: {
    inlineProps: Set<string>;
};
export declare const Button: (props: Omit<Omit<TextParentStyles, "TextComponent"> & Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly fontFamily?: unknown;
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
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp | undefined;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp | undefined;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number | undefined;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean | undefined;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number | undefined;
} & import("react").RefAttributes<TamaguiElement>, "theme" | "themeInverse"> & ThemeableProps) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | null;
export {};
//# sourceMappingURL=Button.d.ts.map