import { GetProps, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import { ScopedProps } from './ToastProvider';
declare const VIEWPORT_DEFAULT_HOTKEY: string[];
declare const VIEWPORT_PAUSE = "toast.viewportPause";
declare const VIEWPORT_RESUME = "toast.viewportResume";
declare const ToastViewportFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "style" | "pointerEvents" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
    onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    elevationAndroid?: string | number | undefined;
    rel?: any;
    download?: any;
    dataSet?: Record<string, string | number | null | undefined> | undefined;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    href?: string | undefined;
    hrefAttrs?: {
        target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
        rel?: string | undefined;
        download?: boolean | undefined;
    } | undefined;
} & React.RefAttributes<TamaguiElement> & Omit<import("@tamagui/core").StackProps, "top" | "bottom" | "children" | "ref" | "style" | "id" | "left" | "right" | "tag" | "pointerEvents" | "display" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "hitSlop" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "gap" | "columnGap" | "rowGap" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "transformOrigin" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "start" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "group" | "onFocus" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onBlur" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "themeInverse" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | "key"> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "pointerEvents" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
    onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    elevationAndroid?: string | number | undefined;
    rel?: any;
    download?: any;
    dataSet?: Record<string, string | number | null | undefined> | undefined;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    href?: string | undefined;
    hrefAttrs?: {
        target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
        rel?: string | undefined;
        download?: boolean | undefined;
    } | undefined;
} & React.RefAttributes<TamaguiElement> & Omit<import("@tamagui/core").StackProps, "top" | "bottom" | "children" | "ref" | "style" | "id" | "left" | "right" | "tag" | "pointerEvents" | "display" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "hitSlop" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "gap" | "columnGap" | "rowGap" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "transformOrigin" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "start" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "group" | "onFocus" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onBlur" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "themeInverse" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | "key"> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "pointerEvents" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
    onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    elevationAndroid?: string | number | undefined;
    rel?: any;
    download?: any;
    dataSet?: Record<string, string | number | null | undefined> | undefined;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    href?: string | undefined;
    hrefAttrs?: {
        target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
        rel?: string | undefined;
        download?: boolean | undefined;
    } | undefined;
} & React.RefAttributes<TamaguiElement> & Omit<import("@tamagui/core").StackProps, "top" | "bottom" | "children" | "ref" | "style" | "id" | "left" | "right" | "tag" | "pointerEvents" | "display" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "hitSlop" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "gap" | "columnGap" | "rowGap" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "transformOrigin" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "start" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "group" | "onFocus" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onBlur" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "themeInverse" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | "key"> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>>, TamaguiElement, Omit<import("react-native").ViewProps, "children" | "style" | "pointerEvents" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
    onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
    onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
    elevationAndroid?: string | number | undefined;
    rel?: any;
    download?: any;
    dataSet?: Record<string, string | number | null | undefined> | undefined;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    href?: string | undefined;
    hrefAttrs?: {
        target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
        rel?: string | undefined;
        download?: boolean | undefined;
    } | undefined;
} & React.RefAttributes<TamaguiElement> & Omit<import("@tamagui/core").StackProps, "top" | "bottom" | "children" | "ref" | "style" | "id" | "left" | "right" | "tag" | "pointerEvents" | "display" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "hitSlop" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "gap" | "columnGap" | "rowGap" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "transformOrigin" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "start" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "group" | "onFocus" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onBlur" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "themeInverse" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | "key">, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "children" | "style" | "pointerEvents" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & {
        onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
        onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        elevationAndroid?: string | number | undefined;
        rel?: any;
        download?: any;
        dataSet?: Record<string, string | number | null | undefined> | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        href?: string | undefined;
        hrefAttrs?: {
            target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
        onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
        onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        elevationAndroid?: string | number | undefined;
        rel?: any;
        download?: any;
        dataSet?: Record<string, string | number | null | undefined> | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        href?: string | undefined;
        hrefAttrs?: {
            target?: "top" | "_self" | "_blank" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
    } & React.RefAttributes<TamaguiElement> & Omit<import("@tamagui/core").StackProps, "top" | "bottom" | "children" | "ref" | "style" | "id" | "left" | "right" | "tag" | "pointerEvents" | "display" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "hitSlop" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "gap" | "columnGap" | "rowGap" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "transformOrigin" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "start" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "group" | "onFocus" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onBlur" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "disabled" | "className" | "themeShallow" | "themeInverse" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "rel" | "download" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "href" | "hrefAttrs" | "elevationAndroid" | "key">;
    __variantProps: void & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    };
}>;
type ToastViewportFrameProps = GetProps<typeof ToastViewportFrame>;
type ToastViewportProps = ToastViewportFrameProps & {
    /**
     * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
     * @defaultValue ['F8']
     */
    hotkey?: string[];
    /**
     * An author-localized label for the toast viewport to provide context for screen reader users
     * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
     * @defaultValue 'Notifications ({hotkey})'
     */
    label?: string;
    /**
     * Used to reference the viewport if you want to have multiple viewports in the same provider.
     */
    name?: string;
    /**
     * Pass this when you want to have multiple/duplicated toasts.
     */
    multipleToasts?: boolean;
    /**
     * When true, uses a portal to render at the very top of the root TamaguiProvider.
     */
    portalToRoot?: boolean;
};
declare const ToastViewport: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<ScopedProps<ToastViewportProps>, "ref"> & React.RefAttributes<HTMLDivElement>>>;
export { ToastViewport, ToastViewportProps, VIEWPORT_DEFAULT_HOTKEY, VIEWPORT_PAUSE, VIEWPORT_RESUME, };
//# sourceMappingURL=ToastViewport.d.ts.map