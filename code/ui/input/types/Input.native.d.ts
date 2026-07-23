import React from 'react';
import { TextInput, type TextInputProps as RNTextInputProps } from 'react-native';
/**
 * A web-aligned input component for React Native.
 * @see — Docs https://tamagui.dev/ui/inputs#input
 */
export declare const Input: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & RNTextInputProps, import("@tamagui/core").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/core").Color | undefined;
    readonly selectionColor?: import("@tamagui/core").Color | undefined;
    readonly cursorColor?: import("@tamagui/core").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/core").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/core").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/core").Size | undefined;
}>, "about" | "accept" | "accessKey" | "allowFontScaling" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "autoFocus" | "autoFocusNative" | "autoSave" | "blurOnSubmit" | "capture" | "caretHidden" | "checked" | "clearButtonMode" | "clearTextOnFocus" | "color" | "content" | "contentEditable" | "contextMenu" | "contextMenuHidden" | "cursorColor" | "dangerouslySetInnerHTML" | "dataDetectorTypes" | "datatype" | "defaultChecked" | "defaultValue" | "dir" | "disableFullscreenUI" | "disableKeyboardShortcuts" | "disabled" | "draggable" | "enablesReturnKeyAutomatically" | "enterKeyHint" | "exportparts" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "height" | "hidden" | "id" | "importantForAutofill" | "inert" | "inlineImageLeft" | "inlineImagePadding" | "inlist" | "inputAccessoryViewButtonLabel" | "inputAccessoryViewID" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "keyboardAppearance" | "keyboardType" | "lang" | "letterSpacing" | "lineBreakModeIOS" | "lineBreakStrategyIOS" | "list" | "max" | "maxFontSizeMultiplier" | "maxLength" | "min" | "minLength" | "multiline" | "multiple" | "name" | "nonce" | "numberOfLines" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlur" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChange" | "onChangeCapture" | "onChangeText" | "onClick" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContentSizeChange" | "onContextMenu" | "onContextMenuCapture" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEndEditing" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocus" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onLoad" | "onLoadCapture" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onPaste" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerLeave" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScroll" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onSelectionChange" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSubmitEditing" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheel" | "onWheelCapture" | "part" | "passwordRules" | "pattern" | "placeholder" | "placeholderTextColor" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "property" | "radioGroup" | "readOnly" | "rejectResponderTermination" | "rel" | "required" | "resource" | "results" | "returnKeyLabel" | "returnKeyType" | "rev" | "role" | "rows" | "scrollEnabled" | "secureTextEntry" | "security" | "selectTextOnFocus" | "selection" | "selectionColor" | "selectionHandleColor" | "showSoftInputOnFocus" | "slot" | "smartInsertDelete" | "spellCheck" | "src" | "step" | "submitBehavior" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tabIndex" | "textAlign" | "textAlignVertical" | "textBreakStrategy" | "textContentType" | "textTransform" | "title" | "translate" | "type" | "typeof" | "underlineColorAndroid" | "unselectable" | "value" | "verticalAlign" | "vocab" | "width"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "style" | "textAlign" | "textTransform" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    color?: "unset" | import("@tamagui/core").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    fontFamily?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/core").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/core").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    textTransform?: "capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
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
}, TextInput, import("@tamagui/core").TamaguiComponentPropsBaseBase & RNTextInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "style" | "textAlign" | "textTransform" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    color?: "unset" | import("@tamagui/core").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    fontFamily?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/core").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/core").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/core").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    textTransform?: "capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
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
}, import("@tamagui/core").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/core").Color | undefined;
    readonly selectionColor?: import("@tamagui/core").Color | undefined;
    readonly cursorColor?: import("@tamagui/core").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/core").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/core").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/core").Size | undefined;
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
}>;
//# sourceMappingURL=Input.native.d.ts.map