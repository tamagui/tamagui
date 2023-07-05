/// <reference types="react" />
import { GetProps } from '@tamagui/core';
export declare const themeableVariants: {
    readonly backgrounded: {
        readonly true: {
            readonly backgroundColor: "$background";
        };
    };
    readonly radiused: {
        true: (_: any, extras: any) => {
            borderRadius: any;
        };
    };
    readonly hoverTheme: {
        true: {
            hoverStyle: {
                backgroundColor: string;
                borderColor: string;
            };
        };
        false: {};
    };
    readonly pressTheme: {
        true: {
            cursor: string;
            pressStyle: {
                backgroundColor: string;
                borderColor: string;
            };
        };
        false: {};
    };
    readonly focusTheme: {
        true: {
            focusStyle: {
                backgroundColor: string;
                borderColor: string;
            };
        };
        false: {};
    };
    readonly circular: {
        true: (_: any, { props, tokens }: {
            props: any;
            tokens: any;
        }) => {
            width: any;
            height: any;
            maxWidth: any;
            maxHeight: any;
            minWidth: any;
            minHeight: any;
            borderRadius: number;
            padding: number;
        };
    };
    readonly padded: {
        true: (_: any, extras: any) => {
            padding: any;
        };
    };
    readonly elevate: {
        true: (_: boolean, extras: any) => {
            [x: `$${string}`]: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>) | import("@tamagui/core").Variable<any> | undefined;
            [x: `$${number}`]: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>) | import("@tamagui/core").Variable<any> | undefined;
            hitSlop?: import("react-native").Insets | (import("react-native").Insets & number) | import("@tamagui/core").Variable<any> | undefined;
            id?: string | import("@tamagui/core").Variable<any> | undefined;
            pointerEvents?: "box-none" | "none" | "box-only" | "auto" | import("@tamagui/core").Variable<any> | undefined;
            removeClippedSubviews?: boolean | import("@tamagui/core").Variable<any> | undefined;
            testID?: string | import("@tamagui/core").Variable<any> | undefined;
            nativeID?: string | import("@tamagui/core").Variable<any> | undefined;
            collapsable?: boolean | import("@tamagui/core").Variable<any> | undefined;
            needsOffscreenAlphaCompositing?: boolean | import("@tamagui/core").Variable<any> | undefined;
            renderToHardwareTextureAndroid?: boolean | import("@tamagui/core").Variable<any> | undefined;
            focusable?: boolean | import("@tamagui/core").Variable<any> | undefined;
            shouldRasterizeIOS?: boolean | import("@tamagui/core").Variable<any> | undefined;
            isTVSelectable?: boolean | import("@tamagui/core").Variable<any> | undefined;
            hasTVPreferredFocus?: boolean | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxProperties?: import("@tamagui/core").Variable<any> | import("react-native").TVParallaxProperties | undefined;
            tvParallaxShiftDistanceX?: number | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxShiftDistanceY?: number | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxTiltAngle?: number | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxMagnification?: number | import("@tamagui/core").Variable<any> | undefined;
            onTouchStart?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchMove?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchEnd?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchCancel?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchEndCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onPointerEnter?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerEnterCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerLeave?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerLeaveCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerMove?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerMoveCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerCancel?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerCancelCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerDown?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerDownCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerUp?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerUpCapture?: import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            accessible?: boolean | import("@tamagui/core").Variable<any> | undefined;
            accessibilityActions?: import("@tamagui/core").Variable<any> | readonly Readonly<{
                name: string;
                label?: string | undefined;
            }>[] | undefined;
            accessibilityLabel?: string | import("@tamagui/core").Variable<any> | undefined;
            'aria-label'?: string | import("@tamagui/core").Variable<any> | undefined;
            accessibilityRole?: import("@tamagui/core").Variable<any> | import("react-native").AccessibilityRole | undefined;
            accessibilityState?: import("@tamagui/core").Variable<any> | import("react-native").AccessibilityState | undefined;
            'aria-busy'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            'aria-checked'?: boolean | import("@tamagui/core").Variable<any> | "mixed" | undefined;
            'aria-disabled'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            'aria-expanded'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            'aria-selected'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            'aria-labelledby'?: string | import("@tamagui/core").Variable<any> | undefined;
            accessibilityHint?: string | import("@tamagui/core").Variable<any> | undefined;
            accessibilityValue?: import("@tamagui/core").Variable<any> | import("react-native").AccessibilityValue | undefined;
            'aria-valuemax'?: number | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuemin'?: number | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuenow'?: number | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuetext'?: string | import("@tamagui/core").Variable<any> | undefined;
            onAccessibilityAction?: import("@tamagui/core").Variable<any> | ((event: import("react-native").AccessibilityActionEvent) => void) | undefined;
            importantForAccessibility?: "auto" | import("@tamagui/core").Variable<any> | "yes" | "no" | "no-hide-descendants" | undefined;
            'aria-hidden'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            'aria-live'?: import("@tamagui/core").Variable<any> | "polite" | "assertive" | "off" | undefined;
            'aria-modal'?: boolean | import("@tamagui/core").Variable<any> | undefined;
            role?: "separator" | "none" | "alert" | "alertdialog" | "application" | "article" | "banner" | "button" | "cell" | "checkbox" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "dialog" | "directory" | "document" | "feed" | "figure" | "form" | "grid" | "group" | "heading" | "img" | "link" | "list" | "listitem" | "log" | "main" | "marquee" | "math" | "menu" | "menubar" | "menuitem" | "meter" | "navigation" | "note" | "option" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "searchbox" | "slider" | "spinbutton" | "status" | "summary" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem" | import("@tamagui/core").Variable<any> | undefined;
            accessibilityLiveRegion?: "none" | import("@tamagui/core").Variable<any> | "polite" | "assertive" | undefined;
            accessibilityLabelledBy?: string | import("@tamagui/core").Variable<any> | string[] | undefined;
            accessibilityElementsHidden?: boolean | import("@tamagui/core").Variable<any> | undefined;
            accessibilityViewIsModal?: boolean | import("@tamagui/core").Variable<any> | undefined;
            onAccessibilityEscape?: import("@tamagui/core").Variable<any> | (() => void) | undefined;
            onAccessibilityTap?: import("@tamagui/core").Variable<any> | (() => void) | undefined;
            onMagicTap?: import("@tamagui/core").Variable<any> | (() => void) | undefined;
            accessibilityIgnoresInvertColors?: boolean | import("@tamagui/core").Variable<any> | undefined;
            accessibilityLanguage?: string | import("@tamagui/core").Variable<any> | undefined;
            target?: string | import("@tamagui/core").Variable<any> | undefined;
            asChild?: boolean | import("@tamagui/core").Variable<any> | "except-style" | undefined;
            dangerouslySetInnerHTML?: import("@tamagui/core").Variable<any> | {
                __html: string;
            } | undefined;
            children?: any;
            debug?: import("@tamagui/core").Variable<any> | import("@tamagui/core").DebugProp | undefined;
            disabled?: boolean | import("@tamagui/core").Variable<any> | undefined;
            className?: string | import("@tamagui/core").Variable<any> | undefined;
            themeShallow?: boolean | import("@tamagui/core").Variable<any> | undefined;
            tag?: string | import("@tamagui/core").Variable<any> | undefined;
            theme?: string | import("@tamagui/core").Variable<any> | null | undefined;
            componentName?: string | import("@tamagui/core").Variable<any> | undefined;
            tabIndex?: string | number | import("@tamagui/core").Variable<any> | undefined;
            forceStyle?: import("@tamagui/core").Variable<any> | "hover" | "press" | "focus" | undefined;
            onPress?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onLongPress?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onPressIn?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onPressOut?: import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onHoverIn?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onHoverOut?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseEnter?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseLeave?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseDown?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseUp?: import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onFocus?: import("@tamagui/core").Variable<any> | ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
            onScroll?: import("@tamagui/core").Variable<any> | ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
            style?: import("@tamagui/core").Variable<any> | import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
            backgroundColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderBlockColor?: import("@tamagui/core").Variable<any> | import("react-native").ColorValue | undefined;
            borderBlockEndColor?: import("@tamagui/core").Variable<any> | import("react-native").ColorValue | undefined;
            borderBlockStartColor?: import("@tamagui/core").Variable<any> | import("react-native").ColorValue | undefined;
            borderBottomColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderBottomEndRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderBottomLeftRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderBottomRightRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderBottomStartRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderCurve?: import("@tamagui/core").Variable<any> | "circular" | "continuous" | undefined;
            borderEndColor?: import("@tamagui/core").Variable<any> | import("react-native").ColorValue | undefined;
            borderEndEndRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderEndStartRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderLeftColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderRightColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderStartColor?: import("@tamagui/core").Variable<any> | import("react-native").ColorValue | undefined;
            borderStartEndRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderStartStartRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderStyle?: import("@tamagui/core").Variable<any> | "dashed" | "dotted" | "solid" | undefined;
            borderTopColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            borderTopEndRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderTopLeftRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderTopRightRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            borderTopStartRadius?: number | `$${string}` | `$${number}` | import("react-native").Animated.AnimatedNode | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            opacity?: import("react-native").AnimatableNumericValue | import("@tamagui/core").Variable<any> | undefined;
            alignContent?: import("@tamagui/core").Variable<any> | "space-around" | "space-between" | "stretch" | "center" | "flex-end" | "flex-start" | undefined;
            alignItems?: import("@tamagui/core").Variable<any> | import("react-native").FlexAlignType | undefined;
            alignSelf?: "auto" | import("@tamagui/core").Variable<any> | import("react-native").FlexAlignType | undefined;
            aspectRatio?: string | number | import("@tamagui/core").Variable<any> | undefined;
            borderBottomWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderEndWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderLeftWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderRightWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderStartWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderTopWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            borderWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            bottom?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            end?: import("@tamagui/core").Variable<any> | import("react-native").DimensionValue | undefined;
            flex?: number | import("@tamagui/core").Variable<any> | undefined;
            flexBasis?: import("@tamagui/core").Variable<any> | import("react-native").DimensionValue | undefined;
            flexDirection?: "row" | import("@tamagui/core").Variable<any> | "column" | "column-reverse" | "row-reverse" | undefined;
            flexGrow?: number | import("@tamagui/core").Variable<any> | undefined;
            flexShrink?: number | import("@tamagui/core").Variable<any> | undefined;
            flexWrap?: import("@tamagui/core").Variable<any> | "nowrap" | "wrap" | "wrap-reverse" | undefined;
            height?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            justifyContent?: import("@tamagui/core").Variable<any> | "space-around" | "space-between" | "space-evenly" | "center" | "flex-end" | "flex-start" | undefined;
            left?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            margin?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginBottom?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginEnd?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginHorizontal?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginLeft?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginRight?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginStart?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginTop?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            marginVertical?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            maxHeight?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            maxWidth?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            minHeight?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            minWidth?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            overflow?: import("@tamagui/core").Variable<any> | "hidden" | "visible" | "scroll" | undefined;
            padding?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingBottom?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingEnd?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingHorizontal?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingLeft?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingRight?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingStart?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingTop?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            paddingVertical?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            position?: import("@tamagui/core").Variable<any> | "absolute" | "relative" | undefined;
            right?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            start?: import("@tamagui/core").Variable<any> | import("react-native").DimensionValue | undefined;
            top?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | null | undefined;
            width?: import("react-native").Animated.AnimatedNode | import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | null | undefined;
            zIndex?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").ZIndexTokens | undefined;
            direction?: import("@tamagui/core").Variable<any> | "inherit" | "ltr" | "rtl" | undefined;
            shadowColor?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallback | import("react-native").OpaqueColorValue | undefined;
            shadowOffset?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | {
                width: import("@tamagui/core").SpaceTokens;
                height: import("@tamagui/core").SpaceTokens;
            } | Readonly<{
                width: number;
                height: number;
            }> | undefined;
            shadowOpacity?: import("react-native").AnimatableNumericValue | import("@tamagui/core").Variable<any> | undefined;
            shadowRadius?: import("@tamagui/core").SizeTokens | import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | undefined;
            transform?: import("@tamagui/core").Variable<any> | (import("react-native").PerpectiveTransform | import("react-native").RotateTransform | import("react-native").RotateXTransform | import("react-native").RotateYTransform | import("react-native").RotateZTransform | import("react-native").ScaleTransform | import("react-native").ScaleXTransform | import("react-native").ScaleYTransform | import("react-native").TranslateXTransform | import("react-native").TranslateYTransform | import("react-native").SkewXTransform | import("react-native").SkewYTransform | import("react-native").MatrixTransform)[] | undefined;
            transformMatrix?: import("@tamagui/core").Variable<any> | number[] | undefined;
            rotation?: import("react-native").AnimatableNumericValue | import("@tamagui/core").Variable<any> | undefined;
            scaleX?: number | boolean | `$${string}` | `$${number}` | (import("react-native").Animated.AnimatedNode & number) | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            scaleY?: number | boolean | `$${string}` | `$${number}` | (import("react-native").Animated.AnimatedNode & number) | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
            translateX?: import("react-native").AnimatableNumericValue | import("@tamagui/core").Variable<any> | undefined;
            translateY?: import("react-native").AnimatableNumericValue | import("@tamagui/core").Variable<any> | undefined;
            x?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            y?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            perspective?: number | import("@tamagui/core").Variable<any> | undefined;
            scale?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            skewX?: string | import("@tamagui/core").Variable<any> | undefined;
            skewY?: string | import("@tamagui/core").Variable<any> | undefined;
            matrix?: import("@tamagui/core").Variable<any> | number[] | undefined;
            rotate?: string | import("@tamagui/core").Variable<any> | undefined;
            rotateY?: string | import("@tamagui/core").Variable<any> | undefined;
            rotateX?: string | import("@tamagui/core").Variable<any> | undefined;
            rotateZ?: string | import("@tamagui/core").Variable<any> | undefined;
            columnGap?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceValue | undefined;
            contain?: import("@tamagui/core").Variable<any> | import("csstype").Property.Contain | undefined;
            cursor?: import("@tamagui/core").Variable<any> | import("csstype").Property.Cursor | undefined;
            display?: "flex" | "none" | import("@tamagui/core").Variable<any> | "inherit" | "block" | "inline" | "inline-flex" | "contents" | undefined;
            gap?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceValue | undefined;
            outlineColor?: import("@tamagui/core").Variable<any> | import("csstype").Property.OutlineColor | undefined;
            outlineOffset?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceValue | undefined;
            outlineStyle?: import("@tamagui/core").Variable<any> | import("csstype").Property.OutlineStyle | undefined;
            outlineWidth?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceValue | undefined;
            rowGap?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceValue | undefined;
            space?: import("@tamagui/core").Variable<any> | import("@tamagui/core").ThemeValueFallback | import("@tamagui/core").SpaceTokens | undefined;
            spaceDirection?: import("@tamagui/core").Variable<any> | import("@tamagui/core").SpaceDirection | undefined;
            separator?: import("@tamagui/core").Variable<any> | import("react").ReactNode;
            animation?: import("@tamagui/core").Variable<any> | import("@tamagui/core").AnimationProp | null | undefined;
            animateOnly?: import("@tamagui/core").Variable<any> | string[] | undefined;
            userSelect?: import("@tamagui/core").Variable<any> | import("csstype").Property.UserSelect | undefined;
            hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            focusStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            exitStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            enterStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
        } | null | undefined;
    };
    readonly bordered: (val: number | boolean, { props }: {
        props: any;
    }) => any;
    readonly transparent: {
        readonly true: {
            readonly backgroundColor: "transparent";
        };
    };
    readonly chromeless: {
        readonly true: {
            backgroundColor: string;
            borderColor: string;
            shadowColor: string;
        };
        readonly all: {
            readonly hoverStyle: {
                backgroundColor: string;
                borderColor: string;
                shadowColor: string;
            };
            readonly pressStyle: {
                backgroundColor: string;
                borderColor: string;
                shadowColor: string;
            };
            readonly focusStyle: {
                backgroundColor: string;
                borderColor: string;
                shadowColor: string;
            };
            readonly backgroundColor: string;
            readonly borderColor: string;
            readonly shadowColor: string;
        };
    };
};
export declare const ThemeableStack: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
}>>, import("@tamagui/core").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps;
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    };
}>;
export type ThemeableStackProps = GetProps<typeof ThemeableStack>;
//# sourceMappingURL=ThemeableStack.d.ts.map