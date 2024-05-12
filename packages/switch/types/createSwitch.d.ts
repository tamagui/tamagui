import type { NativeValue, SizeTokens, StackProps } from '@tamagui/core';
import type { SwitchExtraProps as HeadlessSwitchExtraProps, SwitchState } from '@tamagui/switch-headless';
import * as React from 'react';
import type { SwitchProps as NativeSwitchProps } from 'react-native';
type SwitchSharedProps = {
    size?: SizeTokens | number;
    unstyled?: boolean;
};
type SwitchBaseProps = StackProps & SwitchSharedProps;
export type SwitchExtraProps = HeadlessSwitchExtraProps & {
    native?: NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: NativeSwitchProps;
};
export type SwitchProps = SwitchBaseProps & SwitchExtraProps;
type SwitchThumbBaseProps = StackProps;
export type SwitchThumbProps = SwitchThumbBaseProps & SwitchSharedProps;
export declare const SwitchContext: React.Context<{
    checked: SwitchState;
    frameWidth: number;
    disabled?: boolean | undefined;
}>;
type SwitchComponent = (props: SwitchSharedProps & SwitchExtraProps) => any;
type SwitchThumbComponent = (props: any) => any;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>(createProps: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Thumb?: T;
}): React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps & HeadlessSwitchExtraProps & {
    native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
    nativeProps?: NativeSwitchProps | undefined;
}, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    checked?: boolean | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }>, "theme" | "native" | "debug" | "space" | "size" | "zIndex" | `$${string}` | `$${number}` | "name" | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "shadowRadius" | "padding" | "paddingHorizontal" | "paddingVertical" | "paddingLeft" | "paddingTop" | "paddingBottom" | "paddingRight" | "paddingEnd" | "paddingStart" | "margin" | "marginHorizontal" | "marginVertical" | "marginLeft" | "marginTop" | "marginBottom" | "marginRight" | "marginEnd" | "marginStart" | "x" | "y" | "gap" | "rowGap" | "columnGap" | "scale" | "scaleX" | "scaleY" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderLeftWidth" | "borderRadius" | "borderRightWidth" | "borderEndWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "left" | "top" | "right" | "bottom" | "shadowOffset" | "backgroundColor" | "borderColor" | "borderBottomColor" | "borderTopColor" | "borderLeftColor" | "borderRightColor" | "shadowColor" | "outlineColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$theme-${string}` | `$theme-${number}` | "display" | "perspective" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "scrollbarWidth" | "pointerEvents" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "overflow" | "position" | "start" | "direction" | "shadowOpacity" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "checked" | "hitSlop" | "children" | "style" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "value" | "labeledBy" | "defaultChecked" | "required" | "onCheckedChange" | "nativeProps"> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps & HeadlessSwitchExtraProps & {
        native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: NativeSwitchProps | undefined;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps & HeadlessSwitchExtraProps & {
        native?: NativeValue<"android" | "ios" | "mobile"> | undefined;
        nativeProps?: NativeSwitchProps | undefined;
    }, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
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
    }>, `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SwitchSharedProps> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithRem<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithRem<import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>> & SwitchSharedProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        checked?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
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
export {};
//# sourceMappingURL=createSwitch.d.ts.map