/// <reference types="react" />
import { ScaleVariantExtras, SizeTokens } from '@tamagui/core';
export declare function getCircleSize(size: SizeTokens, extras: ScaleVariantExtras): number;
export declare const elevate: {
    true: (_: any, extras: any) => {
        [x: `$${string}`]: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>) | import("@tamagui/core").Variable | undefined;
        hitSlop?: import("@tamagui/core").Variable | import("react-native").Insets | undefined;
        onLayout?: import("@tamagui/core").Variable | ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
        pointerEvents?: "box-none" | "none" | "box-only" | "auto" | import("@tamagui/core").Variable | undefined;
        removeClippedSubviews?: boolean | import("@tamagui/core").Variable | undefined;
        style?: import("@tamagui/core").Variable | import("react-native").StyleProp<import("react-native").ViewStyle>;
        testID?: string | import("@tamagui/core").Variable | undefined;
        nativeID?: string | import("@tamagui/core").Variable | undefined;
        collapsable?: boolean | import("@tamagui/core").Variable | undefined;
        needsOffscreenAlphaCompositing?: boolean | import("@tamagui/core").Variable | undefined;
        renderToHardwareTextureAndroid?: boolean | import("@tamagui/core").Variable | undefined;
        focusable?: boolean | import("@tamagui/core").Variable | undefined;
        shouldRasterizeIOS?: boolean | import("@tamagui/core").Variable | undefined;
        isTVSelectable?: boolean | import("@tamagui/core").Variable | undefined;
        hasTVPreferredFocus?: boolean | import("@tamagui/core").Variable | undefined;
        tvParallaxProperties?: import("@tamagui/core").Variable | import("react-native").TVParallaxProperties | undefined;
        tvParallaxShiftDistanceX?: number | import("@tamagui/core").Variable | undefined;
        tvParallaxShiftDistanceY?: number | import("@tamagui/core").Variable | undefined;
        tvParallaxTiltAngle?: number | import("@tamagui/core").Variable | undefined;
        tvParallaxMagnification?: number | import("@tamagui/core").Variable | undefined;
        onStartShouldSetResponder?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponder?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onTouchStart?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchMove?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEnd?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchCancel?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEndCapture?: import("@tamagui/core").Variable | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        accessible?: boolean | import("@tamagui/core").Variable | undefined;
        accessibilityActions?: import("@tamagui/core").Variable | readonly Readonly<{
            name: string;
            label?: string | undefined;
        }>[] | undefined;
        accessibilityLabel?: string | import("@tamagui/core").Variable | undefined;
        accessibilityRole?: "none" | "button" | "link" | "search" | "image" | "keyboardkey" | "text" | "adjustable" | "imagebutton" | "header" | "summary" | import("@tamagui/core").Variable | undefined;
        accessibilityState?: import("react-native").AccessibilityState | import("@tamagui/core").Variable | undefined;
        accessibilityHint?: string | import("@tamagui/core").Variable | undefined;
        accessibilityValue?: import("@tamagui/core").Variable | import("react-native").AccessibilityValue | undefined;
        onAccessibilityAction?: import("@tamagui/core").Variable | ((event: import("react-native").AccessibilityActionEvent) => void) | undefined;
        accessibilityLiveRegion?: "none" | import("@tamagui/core").Variable | "polite" | "assertive" | undefined;
        importantForAccessibility?: "auto" | import("@tamagui/core").Variable | "yes" | "no" | "no-hide-descendants" | undefined;
        accessibilityElementsHidden?: boolean | import("@tamagui/core").Variable | undefined;
        accessibilityViewIsModal?: boolean | import("@tamagui/core").Variable | undefined;
        onAccessibilityEscape?: import("@tamagui/core").Variable | (() => void) | undefined;
        onAccessibilityTap?: import("@tamagui/core").Variable | (() => void) | undefined;
        onMagicTap?: import("@tamagui/core").Variable | (() => void) | undefined;
        accessibilityIgnoresInvertColors?: boolean | import("@tamagui/core").Variable | undefined;
        dataSet?: any;
        target?: any;
        rel?: any;
        download?: any;
        href?: string | import("@tamagui/core").Variable | undefined;
        hrefAttrs?: import("@tamagui/core").Variable | {
            target?: "top" | "_blank" | "_self" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
        onMouseDown?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & ((e: MouseEvent) => any)) | import("@tamagui/core").Variable | undefined;
        onMouseUp?: import("@tamagui/core").Variable | ((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
        onMouseEnter?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & ((e: MouseEvent) => any)) | import("@tamagui/core").Variable | undefined;
        onMouseLeave?: (((event: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void) & ((e: MouseEvent) => any)) | import("@tamagui/core").Variable | undefined;
        onFocus?: import("@tamagui/core").Variable | ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
        onScroll?: import("@tamagui/core").Variable | ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        asChild?: boolean | import("@tamagui/core").Variable | undefined;
        space?: import("@tamagui/core").Variable | import("@tamagui/core").SpaceTokens | undefined;
        spaceDirection?: import("@tamagui/core").Variable | import("@tamagui/core").SpaceDirection;
        dangerouslySetInnerHTML?: import("@tamagui/core").Variable | {
            __html: string;
        } | undefined;
        animation?: import("@tamagui/core").Variable | import("@tamagui/core").AnimationProp | undefined;
        animateOnly?: import("@tamagui/core").Variable | string[] | undefined;
        children?: any;
        debug?: boolean | import("@tamagui/core").Variable | "break" | "verbose" | undefined;
        disabled?: boolean | import("@tamagui/core").Variable | undefined;
        className?: string | import("@tamagui/core").Variable | undefined;
        id?: string | import("@tamagui/core").Variable | undefined;
        tag?: string | import("@tamagui/core").Variable | undefined;
        theme?: import("@tamagui/core").Variable | import("@tamagui/core").ThemeName | null | undefined;
        componentName?: string | import("@tamagui/core").Variable | undefined;
        onHoverIn?: import("@tamagui/core").Variable | ((e: MouseEvent) => any) | undefined;
        onHoverOut?: import("@tamagui/core").Variable | ((e: MouseEvent) => any) | undefined;
        onPress?: ((e: import("react-native").GestureResponderEvent) => any) | import("@tamagui/core").Variable | undefined;
        onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | import("@tamagui/core").Variable | undefined;
        onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | import("@tamagui/core").Variable | undefined;
        backgroundColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderBottomColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderBottomEndRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomLeftRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomRightRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomStartRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderBottomWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderEndColor?: import("@tamagui/core").Variable | import("react-native").ColorValue | undefined;
        borderLeftColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderLeftWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderRightColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderRightWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderStartColor?: import("@tamagui/core").Variable | import("react-native").ColorValue | undefined;
        borderStyle?: import("@tamagui/core").Variable | "solid" | "dotted" | "dashed" | undefined;
        borderTopColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        borderTopEndRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopLeftRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopRightRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopStartRadius?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderTopWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        opacity?: number | import("@tamagui/core").Variable | undefined;
        alignContent?: import("@tamagui/core").Variable | "flex-start" | "flex-end" | "center" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: import("@tamagui/core").Variable | import("react-native").FlexAlignType | undefined;
        alignSelf?: "auto" | import("@tamagui/core").Variable | import("react-native").FlexAlignType | undefined;
        aspectRatio?: number | import("@tamagui/core").Variable | undefined;
        borderEndWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        borderStartWidth?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        bottom?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        end?: string | number | import("@tamagui/core").Variable | undefined;
        flex?: number | import("@tamagui/core").Variable | undefined;
        flexBasis?: string | number | import("@tamagui/core").Variable | undefined;
        flexDirection?: "column" | import("@tamagui/core").Variable | "row" | "row-reverse" | "column-reverse" | undefined;
        flexGrow?: number | import("@tamagui/core").Variable | undefined;
        flexShrink?: number | import("@tamagui/core").Variable | undefined;
        flexWrap?: import("@tamagui/core").Variable | "wrap" | "nowrap" | "wrap-reverse" | undefined;
        height?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        justifyContent?: import("@tamagui/core").Variable | "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        margin?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginBottom?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginEnd?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginHorizontal?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginLeft?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginRight?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginStart?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginTop?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        marginVertical?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        maxHeight?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        maxWidth?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        minHeight?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        minWidth?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        overflow?: import("@tamagui/core").Variable | "visible" | "hidden" | "scroll" | undefined;
        padding?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingBottom?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingEnd?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingHorizontal?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingLeft?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingRight?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingStart?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingTop?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        paddingVertical?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        position?: "absolute" | import("@tamagui/core").Variable | "relative" | undefined;
        right?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        start?: string | number | import("@tamagui/core").Variable | undefined;
        top?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        width?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        zIndex?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ZIndexTokens | undefined;
        direction?: "inherit" | import("@tamagui/core").Variable | "ltr" | "rtl" | undefined;
        shadowColor?: import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ColorTokens | import("react-native").OpaqueColorValue | undefined;
        shadowOffset?: import("@tamagui/core").ThemeValueFallback | {
            width: import("@tamagui/core").SpaceTokens;
            height: import("@tamagui/core").SpaceTokens;
        } | {
            width: number;
            height: number;
        } | undefined;
        shadowOpacity?: number | import("@tamagui/core").Variable | undefined;
        shadowRadius?: SizeTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        transform?: import("@tamagui/core").Variable | (import("react-native").PerpectiveTransform | import("react-native").RotateTransform | import("react-native").RotateXTransform | import("react-native").RotateYTransform | import("react-native").RotateZTransform | import("react-native").ScaleTransform | import("react-native").ScaleXTransform | import("react-native").ScaleYTransform | import("react-native").TranslateXTransform | import("react-native").TranslateYTransform | import("react-native").SkewXTransform | import("react-native").SkewYTransform | import("react-native").MatrixTransform)[] | undefined;
        transformMatrix?: import("@tamagui/core").Variable | number[] | undefined;
        rotation?: number | import("@tamagui/core").Variable | undefined;
        scaleX?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        scaleY?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        translateX?: number | import("@tamagui/core").Variable | undefined;
        translateY?: number | import("@tamagui/core").Variable | undefined;
        x?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        y?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        perspective?: number | import("@tamagui/core").Variable | undefined;
        scale?: import("@tamagui/core").SpaceTokens | import("@tamagui/core").ThemeValueFallback | undefined;
        skewX?: string | import("@tamagui/core").Variable | undefined;
        skewY?: string | import("@tamagui/core").Variable | undefined;
        matrix?: import("@tamagui/core").Variable | number[] | undefined;
        rotate?: string | import("@tamagui/core").Variable | undefined;
        rotateY?: string | import("@tamagui/core").Variable | undefined;
        rotateX?: string | import("@tamagui/core").Variable | undefined;
        rotateZ?: string | import("@tamagui/core").Variable | undefined;
        cursor?: string | import("@tamagui/core").Variable | undefined;
        contain?: string | import("@tamagui/core").Variable | undefined;
        display?: "flex" | "none" | "inherit" | import("@tamagui/core").Variable | "inline" | "block" | "contents" | "inline-flex" | undefined;
        hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable | null | undefined;
        pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable | null | undefined;
        focusStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable | null | undefined;
        exitStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable | null | undefined;
        enterStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable | null | undefined;
    } | null | undefined;
};
export declare const bordered: (val: boolean | number, { props }: {
    props: any;
}) => any;
export declare const padded: {
    true: (_: any, extras: any) => {
        padding: any;
    };
};
export declare const radiused: {
    true: (_: any, extras: any) => {
        borderRadius: any;
    };
};
export declare const circular: {
    true: (_: any, extras: any) => {
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
        borderRadius: number;
        paddingVertical: number;
        paddingHorizontal: number;
    };
};
export declare const hoverable: {
    true: {
        hoverStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {
        hoverStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
};
export declare const pressable: {
    true: {
        pressStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {
        pressStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
};
export declare const focusable: {
    true: {
        focusStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
    false: {
        focusStyle: {
            backgroundColor: string;
            borderColor: string;
        };
    };
};
//# sourceMappingURL=variants.d.ts.map