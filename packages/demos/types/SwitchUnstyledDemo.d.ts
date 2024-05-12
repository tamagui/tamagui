/// <reference types="react" />
export declare const Switch: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: import("tamagui").SizeTokens | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "space" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "zIndex" | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "value" | "size" | "unstyled" | "name" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "checked" | "defaultChecked" | "required" | "onCheckedChange" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | "labeledBy" | "nativeProps"> & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
    size?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
} & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: import("tamagui").SizeTokens | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "space" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "zIndex" | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "value" | "size" | "unstyled" | "name" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "checked" | "defaultChecked" | "required" | "onCheckedChange" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | "labeledBy" | "nativeProps"> & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
    size?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
    size?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, import("@tamagui/core").StackStyleBase, {
    size?: import("tamagui").SizeTokens | undefined;
    elevation?: number | import("tamagui").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("tamagui").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }>, "theme" | "native" | "debug" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "space" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "zIndex" | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "value" | "size" | "unstyled" | "name" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "checked" | "defaultChecked" | "required" | "onCheckedChange" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | "labeledBy" | "nativeProps"> & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
        size?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
        size?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("tamagui").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, import("@tamagui/core").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Thumb: import("tamagui").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "theme" | "debug" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "space" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "zIndex" | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "size" | "unstyled" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}`> & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
        size?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & {
        size?: number | import("tamagui").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
};
export declare function SwitchUnstyledDemo(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SwitchUnstyledDemo.d.ts.map