import { InputProps } from './Input';
/**
 * Is basically Input but with rows = 4 to start
 */
export declare const TextAreaFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, import("react-native").TextInput, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
export type TextAreaProps = InputProps;
export declare const TextArea: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "size" | "children" | "className" | "style" | "group" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "onStartShouldSetResponder" | "onLayout" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "allowFontScaling" | "ellipsizeMode" | "id" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "minimumFontScale" | "suppressHighlighting" | "lineBreakStrategyIOS" | "disabled" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "asChild" | "dangerouslySetInnerHTML" | "debug" | "themeShallow" | "themeInverse" | "tag" | "theme" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onScroll" | keyof import("@tamagui/core").TextStylePropsBase | "unstyled" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "placeholderTextColor" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "autoFocus" | "blurOnSubmit" | "caretHidden" | "contextMenuHidden" | "defaultValue" | "editable" | "keyboardType" | "inputMode" | "maxLength" | "multiline" | "onChange" | "onChangeText" | "onContentSizeChange" | "onEndEditing" | "onSelectionChange" | "onSubmitEditing" | "onTextInput" | "onKeyPress" | "placeholder" | "returnKeyType" | "enterKeyHint" | "secureTextEntry" | "selectTextOnFocus" | "selection" | "inputAccessoryViewID" | "value" | "clearButtonMode" | "clearTextOnFocus" | "dataDetectorTypes" | "enablesReturnKeyAutomatically" | "keyboardAppearance" | "passwordRules" | "rejectResponderTermination" | "selectionState" | "spellCheck" | "textContentType" | "scrollEnabled" | "cursorColor" | "importantForAutofill" | "disableFullscreenUI" | "inlineImageLeft" | "inlineImagePadding" | "returnKeyLabel" | "underlineColorAndroid" | "showSoftInputOnFocus" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>>> | "rows"> & Omit<import("@tamagui/core").GetFinalProps<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "placeholderTextColor"> & {
    placeholderTextColor?: import("@tamagui/core").ColorStyleProp | undefined;
    rows?: number | undefined;
}, import("react-native").TextInput, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<import("@tamagui/core").GetFinalProps<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "placeholderTextColor"> & {
    placeholderTextColor?: import("@tamagui/core").ColorStyleProp | undefined;
    rows?: number | undefined;
}, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
//# sourceMappingURL=TextArea.d.ts.map