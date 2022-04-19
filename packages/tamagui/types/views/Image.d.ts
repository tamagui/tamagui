import { GetProps, StackProps } from '@tamagui/core';
import React from 'react';
declare const StyledImage: import("@tamagui/core").StaticComponent<(Omit<import("react-native").ImageProps, "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "zIndex" | "left" | "right" | "onLayout" | `$${string}` | "testID" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof {
    cursor?: string | undefined;
    contain?: string | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    pointerEvents?: "auto" | "box-none" | "none" | "box-only" | undefined;
} | "theme" | "space" | "children" | "hitSlop" | "removeClippedSubviews" | "style" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | keyof import("@tamagui/core/types/types-rnw").RNWViewProps | keyof import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> | "animation" | "debug" | "disabled" | "className" | "id" | "tag" | "onHoverIn" | "onHoverOut" | "onPress" | "onPressIn" | "onPressOut"> & Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    debug?: boolean | "break" | "verbose" | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: import("@tamagui/core").SpaceTokens | undefined;
} & {
    children?: any;
}) | (Omit<Omit<import("react-native").ImageProps, "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "zIndex" | "left" | "right" | "onLayout" | `$${string}` | "testID" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof {
    cursor?: string | undefined;
    contain?: string | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    pointerEvents?: "auto" | "box-none" | "none" | "box-only" | undefined;
} | "theme" | "space" | "children" | "hitSlop" | "removeClippedSubviews" | "style" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | keyof import("@tamagui/core/types/types-rnw").RNWViewProps | keyof import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> | "animation" | "debug" | "disabled" | "className" | "id" | "tag" | "onHoverIn" | "onHoverOut" | "onPress" | "onPressIn" | "onPressOut"> & Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    debug?: boolean | "break" | "verbose" | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: import("@tamagui/core").SpaceTokens | undefined;
} & {
    children?: any;
}, `$${string}` | keyof import("@tamagui/core").PseudoProps<any> | 1234556123312321> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<{
    [x: string]: undefined;
} & Omit<import("react-native").ImageProps, "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "zIndex" | "left" | "right" | "onLayout" | `$${string}` | "testID" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof {
    cursor?: string | undefined;
    contain?: string | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    pointerEvents?: "auto" | "box-none" | "none" | "box-only" | undefined;
} | "theme" | "space" | "children" | "hitSlop" | "removeClippedSubviews" | "style" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | keyof import("@tamagui/core/types/types-rnw").RNWViewProps | keyof import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> | "animation" | "debug" | "disabled" | "className" | "id" | "tag" | "onHoverIn" | "onHoverOut" | "onPress" | "onPressIn" | "onPressOut"> & Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    debug?: boolean | "break" | "verbose" | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: import("@tamagui/core").SpaceTokens | undefined;
} & {
    children?: any;
}> & import("@tamagui/core").PseudoProps<{
    [x: string]: undefined;
} & Omit<import("react-native").ImageProps, "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "zIndex" | "left" | "right" | "onLayout" | `$${string}` | "testID" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof {
    cursor?: string | undefined;
    contain?: string | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    pointerEvents?: "auto" | "box-none" | "none" | "box-only" | undefined;
} | "theme" | "space" | "children" | "hitSlop" | "removeClippedSubviews" | "style" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | keyof import("@tamagui/core/types/types-rnw").RNWViewProps | keyof import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> | "animation" | "debug" | "disabled" | "className" | "id" | "tag" | "onHoverIn" | "onHoverOut" | "onPress" | "onPressIn" | "onPressOut"> & Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core/types/types-rnw").RNWViewProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & {
    animation?: import("@tamagui/core").AnimationKeys | undefined;
} & {
    debug?: boolean | "break" | "verbose" | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: import("@tamagui/core").ThemeName | null | undefined;
    onHoverIn?: ((e: MouseEvent) => any) | undefined;
    onHoverOut?: ((e: MouseEvent) => any) | undefined;
    onPress?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressIn?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onPressOut?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseEnter?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    onMouseLeave?: ((e: import("react-native").GestureResponderEvent) => any) | undefined;
    space?: import("@tamagui/core").SpaceTokens | undefined;
} & {
    children?: any;
}>), {} | {
    [x: string]: undefined;
}, any, import("@tamagui/core").StaticConfigParsed>;
declare type StyledImageProps = GetProps<typeof StyledImage>;
export declare type ImageProps = Omit<StackProps, 'width' | 'height'> & Omit<StyledImageProps, 'source' | 'width' | 'height'> & {
    width: number;
    height: number;
    src: string | StyledImageProps['source'];
};
export declare const Image: React.FC<ImageProps>;
export {};
//# sourceMappingURL=Image.d.ts.map