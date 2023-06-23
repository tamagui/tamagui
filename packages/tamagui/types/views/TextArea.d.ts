/// <reference types="react" />
import { InputProps } from './Input';
/**
 * Is basically Input but with rows = 4 to start
 */
export declare const TextAreaFrame: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, {
    displayName: string | undefined;
    __baseProps: import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    };
    prototype: any;
    State: import("react-native").TextInputState;
    contextType: import("react").Context<any> | undefined;
}>;
export type TextAreaProps = InputProps;
export declare const TextArea: import("@tamagui/core").ReactComponentWithRef<Omit<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, "placeholderTextColor"> & {
    placeholderTextColor?: import("@tamagui/core").ColorStyleProp | undefined;
    rows?: number | undefined;
} & Omit<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, "color" | "borderColor" | "shadowColor" | "size" | "space" | "zIndex" | "children" | "className" | "style" | "ellipse" | "separator" | "left" | "right" | "width" | "height" | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingHorizontal" | "paddingVertical" | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginHorizontal" | "marginVertical" | "flex" | "flexDirection" | "flexWrap" | "flexGrow" | "flexShrink" | "flexBasis" | "alignItems" | "alignContent" | "justifyContent" | "alignSelf" | "backgroundColor" | "borderRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderTopLeftRadius" | "textAlign" | "fontSize" | "lineHeight" | "onLayout" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "allowFontScaling" | "ellipsizeMode" | "id" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "onPress" | "onPressIn" | "onPressOut" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "minimumFontScale" | "suppressHighlighting" | "disabled" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "display" | "gap" | "columnGap" | "rowGap" | "fontFamily" | "fontStyle" | "fontWeight" | "letterSpacing" | "textDecorationLine" | "textDecorationStyle" | "textDecorationColor" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "fontVariant" | "writingDirection" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "marginEnd" | "marginStart" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "paddingEnd" | "paddingStart" | "position" | "start" | "top" | "direction" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "textAlignVertical" | "verticalAlign" | "includeFontPadding" | "unstyled" | `$${string}` | `$${number}` | "x" | "y" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "pointerEvents" | "spaceDirection" | "animation" | "animateOnly" | "userSelect" | "textDecorationDistance" | "textOverflow" | "whiteSpace" | "wordWrap" | "theme" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "themeShallow" | "tag" | "componentName" | "tabIndex" | "forceStyle" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onScroll" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "autoCapitalize" | "autoCorrect" | "autoFocus" | "blurOnSubmit" | "caretHidden" | "contextMenuHidden" | "defaultValue" | "editable" | "keyboardType" | "inputMode" | "maxLength" | "multiline" | "onBlur" | "onChange" | "onChangeText" | "onContentSizeChange" | "onEndEditing" | "onSelectionChange" | "onSubmitEditing" | "onTextInput" | "onKeyPress" | "placeholder" | "placeholderTextColor" | "returnKeyType" | "secureTextEntry" | "selectTextOnFocus" | "selection" | "inputAccessoryViewID" | "value" | "clearButtonMode" | "clearTextOnFocus" | "dataDetectorTypes" | "enablesReturnKeyAutomatically" | "keyboardAppearance" | "passwordRules" | "rejectResponderTermination" | "selectionState" | "spellCheck" | "textContentType" | "scrollEnabled" | "autoComplete" | "cursorColor" | "importantForAutofill" | "disableFullscreenUI" | "inlineImageLeft" | "inlineImagePadding" | "returnKeyLabel" | "underlineColorAndroid" | "showSoftInputOnFocus" | "rows">, import("@tamagui/core").TamaguiElement> & {
    staticConfig: import("@tamagui/core").StaticConfigParsed;
    styleable: import("@tamagui/core").Styleable<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }>>, import("@tamagui/core").TamaguiElement>;
};
//# sourceMappingURL=TextArea.d.ts.map