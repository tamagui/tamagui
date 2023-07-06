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
            [x: `$${string}`]: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>) | import("@tamagui/core").Variable<any> | undefined;
            [x: `$${number}`]: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>) | import("@tamagui/core").Variable<any> | undefined;
            hitSlop?: import("@tamagui/core").VariableVal | import("react-native").Insets | (import("react-native").Insets & number) | import("@tamagui/core").Variable<any> | undefined;
            id?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            pointerEvents?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            removeClippedSubviews?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            testID?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            nativeID?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            collapsable?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            needsOffscreenAlphaCompositing?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            renderToHardwareTextureAndroid?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            focusable?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            shouldRasterizeIOS?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            isTVSelectable?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            hasTVPreferredFocus?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxProperties?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react-native").TVParallaxProperties | undefined;
            tvParallaxShiftDistanceX?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxShiftDistanceY?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxTiltAngle?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tvParallaxMagnification?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            onTouchStart?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchMove?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchEnd?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchCancel?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onTouchEndCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | undefined;
            onPointerEnter?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerEnterCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerLeave?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerLeaveCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerMove?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerMoveCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerCancel?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerCancelCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerDown?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerDownCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerUp?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            onPointerUpCapture?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").PointerEvent) => void) | undefined;
            accessible?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityActions?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | readonly Readonly<{
                name: string;
                label?: string | undefined;
            }>[] | undefined;
            accessibilityLabel?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-label'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityRole?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            accessibilityState?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react-native").AccessibilityState | undefined;
            'aria-busy'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-checked'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-disabled'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-expanded'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-selected'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-labelledby'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityHint?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityValue?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react-native").AccessibilityValue | undefined;
            'aria-valuemax'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuemin'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuenow'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-valuetext'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            onAccessibilityAction?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").AccessibilityActionEvent) => void) | undefined;
            importantForAccessibility?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-hidden'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-live'?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            'aria-modal'?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            role?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityLiveRegion?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityLabelledBy?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | string[] | undefined;
            accessibilityElementsHidden?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityViewIsModal?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            onAccessibilityEscape?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | (() => void) | undefined;
            onAccessibilityTap?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | (() => void) | undefined;
            onMagicTap?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | (() => void) | undefined;
            accessibilityIgnoresInvertColors?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            accessibilityLanguage?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            target?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            asChild?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            dangerouslySetInnerHTML?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | {
                __html: string;
            } | undefined;
            children?: any;
            debug?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            disabled?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            className?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            themeShallow?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tag?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            theme?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | null | undefined;
            componentName?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            tabIndex?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            forceStyle?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            onPress?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onLongPress?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onPressIn?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onPressOut?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
            onHoverIn?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onHoverOut?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseEnter?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseLeave?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseDown?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onMouseUp?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("react").MouseEventHandler<HTMLDivElement> | undefined;
            onFocus?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react").FocusEvent<HTMLDivElement, Element>) => void) | undefined;
            onScroll?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | ((event: import("react").UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
            style?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("@tamagui/core").StyleProp<import("react-native").ViewStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").ViewStyle)>;
            backgroundColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderBlockColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderBlockEndColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderBlockStartColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderBottomColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderBottomEndRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderBottomLeftRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderBottomRightRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderBottomStartRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderCurve?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            borderEndColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderEndEndRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderEndStartRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderLeftColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderRightColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderStartColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderStartEndRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderStartStartRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderStyle?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            borderTopColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            borderTopEndRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderTopLeftRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderTopRightRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderTopStartRadius?: import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            opacity?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | undefined;
            alignContent?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            alignItems?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            alignSelf?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            aspectRatio?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            borderBottomWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderEndWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderLeftWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderRightWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderStartWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderTopWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            borderWidth?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            bottom?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            end?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | null | undefined;
            flex?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            flexBasis?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | null | undefined;
            flexDirection?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            flexGrow?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            flexShrink?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            flexWrap?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            height?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            justifyContent?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            left?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            margin?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginBottom?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginEnd?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginHorizontal?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginLeft?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginRight?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginStart?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginTop?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            marginVertical?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            maxHeight?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            maxWidth?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            minHeight?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            minWidth?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            overflow?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            padding?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingBottom?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingEnd?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingHorizontal?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingLeft?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingRight?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingStart?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingTop?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            paddingVertical?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            position?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            right?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            start?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | null | undefined;
            top?: boolean | import("@tamagui/core").VariableVal | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            width?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | null | undefined;
            zIndex?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            direction?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            shadowColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react-native").OpaqueColorValue | undefined;
            shadowOffset?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | {
                width: import("@tamagui/core").SpaceTokens;
                height: import("@tamagui/core").SpaceTokens;
            } | Readonly<{
                width: number;
                height: number;
            }> | undefined;
            shadowOpacity?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | undefined;
            shadowRadius?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            transform?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | (import("react-native").PerpectiveTransform | import("react-native").RotateTransform | import("react-native").RotateXTransform | import("react-native").RotateYTransform | import("react-native").RotateZTransform | import("react-native").ScaleTransform | import("react-native").ScaleXTransform | import("react-native").ScaleYTransform | import("react-native").TranslateXTransform | import("react-native").TranslateYTransform | import("react-native").SkewXTransform | import("react-native").SkewYTransform | import("react-native").MatrixTransform)[] | undefined;
            transformMatrix?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | number[] | undefined;
            rotation?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | undefined;
            scaleX?: string | number | boolean | import("@tamagui/core").Variable<any> | (import("react-native").Animated.AnimatedNode & number) | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            scaleY?: string | number | boolean | import("@tamagui/core").Variable<any> | (import("react-native").Animated.AnimatedNode & number) | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            translateX?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | undefined;
            translateY?: string | number | import("@tamagui/core").Variable<any> | import("react-native").Animated.AnimatedNode | import("@tamagui/core").Variable<any> | undefined;
            x?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            y?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            perspective?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            scale?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            skewX?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            skewY?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            matrix?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | number[] | undefined;
            rotate?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            rotateY?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            rotateX?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            rotateZ?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            columnGap?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            contain?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | (string & {}) | undefined;
            cursor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | (string & {}) | undefined;
            display?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | undefined;
            gap?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            outlineColor?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | (string & {}) | undefined;
            outlineOffset?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            outlineStyle?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | (string & {}) | undefined;
            outlineWidth?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            rowGap?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            space?: boolean | import("@tamagui/core").VariableVal | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            spaceDirection?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            separator?: string | number | boolean | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactFragment | import("react").ReactPortal | null | undefined;
            animation?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | {
                [key: string]: string | number | {
                    [key: string]: any;
                    type: string | number;
                };
            } | [string | number, {
                [key: string]: string | number | {
                    [key: string]: any;
                    type?: string | number | undefined;
                };
            }] | null | undefined;
            animateOnly?: import("@tamagui/core").VariableVal | import("@tamagui/core").Variable<any> | string[] | undefined;
            userSelect?: string | number | import("@tamagui/core").Variable<any> | import("@tamagui/core").Variable<any> | undefined;
            hoverStyle?: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            pressStyle?: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            focusStyle?: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            exitStyle?: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
            enterStyle?: import("@tamagui/core").VariableVal | (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>) | import("@tamagui/core").Variable<any> | null | undefined;
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