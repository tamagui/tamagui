import React from 'react';
/**
 * A web-aligned input component.
 * @see — Docs https://tamagui.dev/ui/inputs#input
 */
export declare const Input: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase & {
    readonly placeholderTextColor?: Omit<import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallbackColor, "unset"> | undefined;
    readonly selectionColor?: Omit<import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallbackColor, "unset"> | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "color" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "rel" | "dir" | "allowFontScaling" | "numberOfLines" | "maxFontSizeMultiplier" | "lineBreakStrategyIOS" | "selectionColor" | "textBreakStrategy" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "textAlignVertical" | "list" | "max" | "min" | "form" | "slot" | "title" | "hidden" | "value" | "name" | "returnKeyType" | "submitBehavior" | "blurOnSubmit" | "caretHidden" | "contextMenuHidden" | "selectTextOnFocus" | "secureTextEntry" | "onEndEditing" | "onContentSizeChange" | "onKeyPress" | "multiline" | "keyboardType" | "autoCapitalize" | "autoCorrect" | "autoFocusNative" | "keyboardAppearance" | "clearButtonMode" | "clearTextOnFocus" | "enablesReturnKeyAutomatically" | "dataDetectorTypes" | "scrollEnabled" | "passwordRules" | "rejectResponderTermination" | "spellCheck" | "lineBreakModeIOS" | "smartInsertDelete" | "inputAccessoryViewID" | "inputAccessoryViewButtonLabel" | "disableKeyboardShortcuts" | "accept" | "alt" | "autoComplete" | "capture" | "checked" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "maxLength" | "minLength" | "multiple" | "pattern" | "placeholder" | "readOnly" | "required" | "src" | "step" | "type" | "defaultChecked" | "defaultValue" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "autoFocus" | "contentEditable" | "contextMenu" | "draggable" | "enterKeyHint" | "lang" | "nonce" | "translate" | "radioGroup" | "about" | "datatype" | "inlist" | "prefix" | "property" | "resource" | "rev" | "typeof" | "vocab" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "popover" | "popoverTargetAction" | "popoverTarget" | "inert" | "inputMode" | "is" | "exportparts" | "part" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "onCopyCapture" | "onCutCapture" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocusCapture" | "onBlurCapture" | "onChangeCapture" | "onBeforeInputCapture" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoad" | "onLoadCapture" | "onError" | "onErrorCapture" | "onKeyDownCapture" | "onKeyPressCapture" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStart" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClickCapture" | "onContextMenuCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancelCapture" | "onTouchMoveCapture" | "onTouchStartCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onToggle" | "onBeforeToggle" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "cursorColor" | "selectionHandleColor" | "underlineColorAndroid" | "importantForAutofill" | "disableFullscreenUI" | "inlineImageLeft" | "inlineImagePadding" | "returnKeyLabel" | "showSoftInputOnFocus" | "placeholderTextColor" | "onChangeText" | "onSelectionChange" | "onSubmitEditing" | "selection" | "textContentType" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | "rows"> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className"> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"color"> | undefined;
    fontFamily?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/core").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | "on" | "off";
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/core").ColorTokens;
    selectionColor?: import("@tamagui/core").ColorTokens;
    onChangeText?: (text: string) => void;
    onSubmitEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    selection?: {
        start: number;
        end?: number;
    };
    onSelectionChange?: (e: {
        nativeEvent: {
            selection: {
                start: number;
                end: number;
            };
        };
    }) => void;
    textContentType?: import("./types").InputTextContentType;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className"> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"color"> | undefined;
    fontFamily?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/core").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | "on" | "off";
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/core").ColorTokens;
    selectionColor?: import("@tamagui/core").ColorTokens;
    onChangeText?: (text: string) => void;
    onSubmitEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    selection?: {
        start: number;
        end?: number;
    };
    onSelectionChange?: (e: {
        nativeEvent: {
            selection: {
                start: number;
                end: number;
            };
        };
    }) => void;
    textContentType?: import("./types").InputTextContentType;
}, import("@tamagui/core").StackStyleBase & {
    readonly placeholderTextColor?: Omit<import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallbackColor, "unset"> | undefined;
    readonly selectionColor?: Omit<import("@tamagui/core").ColorTokens | import("@tamagui/core").ThemeValueFallbackColor, "unset"> | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
}>;
//# sourceMappingURL=Input.d.ts.map