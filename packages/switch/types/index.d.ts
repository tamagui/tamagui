/// <reference types="react" />
export * from './createSwitch';
export * from './StyledContext';
export * from './Switch';
export declare const Switch: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
} & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/switch-headless").SwitchExtraProps & {
    native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: import("react-native").SwitchProps | undefined;
}, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/switch-headless").SwitchExtraProps & {
        native?: import("@tamagui/helpers").NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: import("react-native").SwitchProps | undefined;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Thumb: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
    }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | keyof {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithRem<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithRem<import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>> & {
        size?: number | import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
    }, import("@tamagui/web").StaticConfigPublic>;
};
//# sourceMappingURL=index.d.ts.map