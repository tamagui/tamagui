import { type GetProps } from '@tamagui/web';
/**
 * A web-aligned textarea component (multi-line input).
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
}>, "about" | "accept" | "accessKey" | "allowFontScaling" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "autoFocus" | "autoFocusNative" | "autoSave" | "blurOnSubmit" | "capture" | "caretHidden" | "checked" | "clearButtonMode" | "clearTextOnFocus" | "color" | "content" | "contentEditable" | "contextMenu" | "contextMenuHidden" | "cursorColor" | "dangerouslySetInnerHTML" | "dataDetectorTypes" | "datatype" | "defaultChecked" | "defaultValue" | "dir" | "disableFullscreenUI" | "disableKeyboardShortcuts" | "disabled" | "draggable" | "enablesReturnKeyAutomatically" | "enterKeyHint" | "exportparts" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "height" | "hidden" | "id" | "importantForAutofill" | "inert" | "inlineImageLeft" | "inlineImagePadding" | "inlist" | "inputAccessoryViewButtonLabel" | "inputAccessoryViewID" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "keyboardAppearance" | "keyboardType" | "lang" | "letterSpacing" | "lineBreakModeIOS" | "lineBreakStrategyIOS" | "list" | "max" | "maxFontSizeMultiplier" | "maxLength" | "min" | "minLength" | "multiline" | "multiple" | "name" | "nonce" | "numberOfLines" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlur" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChange" | "onChangeCapture" | "onChangeText" | "onClick" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContentSizeChange" | "onContextMenu" | "onContextMenuCapture" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEndEditing" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocus" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onLoad" | "onLoadCapture" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onPaste" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerLeave" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScroll" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onSelectionChange" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSubmitEditing" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheel" | "onWheelCapture" | "part" | "passwordRules" | "pattern" | "placeholder" | "placeholderTextColor" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "property" | "radioGroup" | "readOnly" | "rejectResponderTermination" | "rel" | "required" | "resource" | "results" | "returnKeyLabel" | "returnKeyType" | "rev" | "role" | "rows" | "scrollEnabled" | "secureTextEntry" | "security" | "selectTextOnFocus" | "selection" | "selectionColor" | "selectionHandleColor" | "showSoftInputOnFocus" | "slot" | "smartInsertDelete" | "spellCheck" | "src" | "step" | "submitBehavior" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tabIndex" | "textAlign" | "textAlignVertical" | "textBreakStrategy" | "textContentType" | "textTransform" | "title" | "translate" | "type" | "typeof" | "underlineColorAndroid" | "unselectable" | "value" | "verticalAlign" | "vocab" | "width"> & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "style" | "textAlign" | "textTransform" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
    color?: import("@tamagui/web").ColorStyleProp;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
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
}, "alignContent" | "alignItems" | "alignSelf" | "animateOnly" | "animatePresence" | "aspectRatio" | "backdropFilter" | "backfaceVisibility" | "background" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "blockSize" | "border" | "borderBlock" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockEndStyle" | "borderBlockEndWidth" | "borderBlockStartColor" | "borderBlockStartStyle" | "borderBlockStartWidth" | "borderBlockStyle" | "borderBlockWidth" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderEndWidth" | "borderImage" | "borderInline" | "borderInlineColor" | "borderInlineEndColor" | "borderInlineEndStyle" | "borderInlineEndWidth" | "borderInlineStartColor" | "borderInlineStartStyle" | "borderInlineStartWidth" | "borderInlineStyle" | "borderInlineWidth" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStartWidth" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "bottom" | "boxShadow" | "boxSizing" | "caretColor" | "clipPath" | "color" | "columnGap" | "contain" | "containerName" | "containerType" | "cursor" | "cursorColor" | "direction" | "disabled" | "display" | "elevation" | "ellipsis" | "end" | "experimental_backgroundImage" | "experimental_backgroundPosition" | "experimental_backgroundRepeat" | "experimental_backgroundSize" | "filter" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "float" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "gap" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridTemplateAreas" | "gridTemplateColumns" | "height" | "includeFontPadding" | "inlineSize" | "inset" | "insetBlock" | "insetBlockEnd" | "insetBlockStart" | "insetInline" | "insetInlineEnd" | "insetInlineStart" | "isolation" | "justifyContent" | "left" | "letterSpacing" | "lineHeight" | "margin" | "marginBlock" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginInline" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "mask" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskImage" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "matrix" | "maxBlockSize" | "maxHeight" | "maxInlineSize" | "maxWidth" | "minBlockSize" | "minHeight" | "minInlineSize" | "minWidth" | "mixBlendMode" | "numberOfLines" | "objectFit" | "onTransition" | "opacity" | "outline" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflow" | "overflowBlock" | "overflowInline" | "overflowWrap" | "overflowX" | "overflowY" | "padding" | "paddingBlock" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingInline" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "passThrough" | "perspective" | "placeholderTextColor" | "pointerEvents" | "position" | "resize" | "right" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "rotation" | "rowGap" | "scale" | "scaleX" | "scaleY" | "selectionColor" | "selectionHandleColor" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "size" | "skewX" | "skewY" | "start" | "textAlign" | "textAlignVertical" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textEmphasis" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "textWrap" | "top" | "transform" | "transformMatrix" | "transformOrigin" | "transformStyle" | "transition" | "translateX" | "translateY" | "underlineColorAndroid" | "userSelect" | "verticalAlign" | "visibility" | "whiteSpace" | "width" | "wordWrap" | "writingDirection" | "x" | "y" | "zIndex"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}> & {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
}>, "about" | "accept" | "accessKey" | "allowFontScaling" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "autoFocus" | "autoFocusNative" | "autoSave" | "blurOnSubmit" | "capture" | "caretHidden" | "checked" | "clearButtonMode" | "clearTextOnFocus" | "color" | "content" | "contentEditable" | "contextMenu" | "contextMenuHidden" | "cursorColor" | "dangerouslySetInnerHTML" | "dataDetectorTypes" | "datatype" | "defaultChecked" | "defaultValue" | "dir" | "disableFullscreenUI" | "disableKeyboardShortcuts" | "disabled" | "draggable" | "enablesReturnKeyAutomatically" | "enterKeyHint" | "exportparts" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "height" | "hidden" | "id" | "importantForAutofill" | "inert" | "inlineImageLeft" | "inlineImagePadding" | "inlist" | "inputAccessoryViewButtonLabel" | "inputAccessoryViewID" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "keyboardAppearance" | "keyboardType" | "lang" | "letterSpacing" | "lineBreakModeIOS" | "lineBreakStrategyIOS" | "list" | "max" | "maxFontSizeMultiplier" | "maxLength" | "min" | "minLength" | "multiline" | "multiple" | "name" | "nonce" | "numberOfLines" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlur" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChange" | "onChangeCapture" | "onChangeText" | "onClick" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContentSizeChange" | "onContextMenu" | "onContextMenuCapture" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEndEditing" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocus" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onLoad" | "onLoadCapture" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onPaste" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerLeave" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScroll" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onSelectionChange" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSubmitEditing" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheel" | "onWheelCapture" | "part" | "passwordRules" | "pattern" | "placeholder" | "placeholderTextColor" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "property" | "radioGroup" | "readOnly" | "rejectResponderTermination" | "rel" | "required" | "resource" | "results" | "returnKeyLabel" | "returnKeyType" | "rev" | "role" | "rows" | "scrollEnabled" | "secureTextEntry" | "security" | "selectTextOnFocus" | "selection" | "selectionColor" | "selectionHandleColor" | "showSoftInputOnFocus" | "slot" | "smartInsertDelete" | "spellCheck" | "src" | "step" | "submitBehavior" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tabIndex" | "textAlign" | "textAlignVertical" | "textBreakStrategy" | "textContentType" | "textTransform" | "title" | "translate" | "type" | "typeof" | "underlineColorAndroid" | "unselectable" | "value" | "verticalAlign" | "vocab" | "width"> & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "style" | "textAlign" | "textTransform" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
    color?: import("@tamagui/web").ColorStyleProp;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
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
}, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: 'color';
        readonly selectionColor: 'color';
        readonly cursorColor: 'color';
        readonly selectionHandleColor: 'color';
        readonly underlineColorAndroid: 'color';
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
} & import("@tamagui/web").StaticConfigPublic> & Omit<{
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: 'color';
        readonly selectionColor: 'color';
        readonly cursorColor: 'color';
        readonly selectionHandleColor: 'color';
        readonly underlineColorAndroid: 'color';
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
} & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
        readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
        readonly selectionColor?: import("@tamagui/web").Color | undefined;
        readonly cursorColor?: import("@tamagui/web").Color | undefined;
        readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
        readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
    }>, "about" | "accept" | "accessKey" | "allowFontScaling" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "autoFocus" | "autoFocusNative" | "autoSave" | "blurOnSubmit" | "capture" | "caretHidden" | "checked" | "clearButtonMode" | "clearTextOnFocus" | "color" | "content" | "contentEditable" | "contextMenu" | "contextMenuHidden" | "cursorColor" | "dangerouslySetInnerHTML" | "dataDetectorTypes" | "datatype" | "defaultChecked" | "defaultValue" | "dir" | "disableFullscreenUI" | "disableKeyboardShortcuts" | "disabled" | "draggable" | "enablesReturnKeyAutomatically" | "enterKeyHint" | "exportparts" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "height" | "hidden" | "id" | "importantForAutofill" | "inert" | "inlineImageLeft" | "inlineImagePadding" | "inlist" | "inputAccessoryViewButtonLabel" | "inputAccessoryViewID" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "keyboardAppearance" | "keyboardType" | "lang" | "letterSpacing" | "lineBreakModeIOS" | "lineBreakStrategyIOS" | "list" | "max" | "maxFontSizeMultiplier" | "maxLength" | "min" | "minLength" | "multiline" | "multiple" | "name" | "nonce" | "numberOfLines" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlur" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChange" | "onChangeCapture" | "onChangeText" | "onClick" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContentSizeChange" | "onContextMenu" | "onContextMenuCapture" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEndEditing" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocus" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onLoad" | "onLoadCapture" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onPaste" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerLeave" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScroll" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onSelectionChange" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSubmitEditing" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheel" | "onWheelCapture" | "part" | "passwordRules" | "pattern" | "placeholder" | "placeholderTextColor" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "property" | "radioGroup" | "readOnly" | "rejectResponderTermination" | "rel" | "required" | "resource" | "results" | "returnKeyLabel" | "returnKeyType" | "rev" | "role" | "rows" | "scrollEnabled" | "secureTextEntry" | "security" | "selectTextOnFocus" | "selection" | "selectionColor" | "selectionHandleColor" | "showSoftInputOnFocus" | "slot" | "smartInsertDelete" | "spellCheck" | "src" | "step" | "submitBehavior" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tabIndex" | "textAlign" | "textAlignVertical" | "textBreakStrategy" | "textContentType" | "textTransform" | "title" | "translate" | "type" | "typeof" | "underlineColorAndroid" | "unselectable" | "value" | "verticalAlign" | "vocab" | "width"> & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "style" | "textAlign" | "textTransform" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
        fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined>;
        fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined>;
        fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
        fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined>;
        letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined>;
        textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
        textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
        color?: import("@tamagui/web").ColorStyleProp;
    } & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
        autoCorrect?: boolean | 'on' | 'off';
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
        spellCheck?: boolean;
        rows?: number;
        placeholderTextColor?: import("@tamagui/web").ColorTokens;
        selectionColor?: import("@tamagui/web").ColorTokens;
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
    }, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
        readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
        readonly selectionColor?: import("@tamagui/web").Color | undefined;
        readonly cursorColor?: import("@tamagui/web").Color | undefined;
        readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
        readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
    }, {
        readonly isInput: true;
        readonly accept: {
            readonly placeholderTextColor: 'color';
            readonly selectionColor: 'color';
            readonly cursorColor: 'color';
            readonly selectionHandleColor: 'color';
            readonly underlineColorAndroid: 'color';
        };
        readonly validStyles: {
            [key: string]: boolean;
        } | undefined;
    } & import("@tamagui/web").StaticConfigPublic];
};
export type TextAreaProps = GetProps<typeof TextArea>;
//# sourceMappingURL=TextArea.d.ts.map