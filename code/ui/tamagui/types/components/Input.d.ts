import { type GetProps } from '@tamagui/ui'
export declare const Input: import('@tamagui/ui').TamaguiComponent<
  import('@tamagui/web').TamaDefer,
  | import('react-native').View
  | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/web').StackStyleBase &
          import('@tamagui/web').TextStylePropsBase & {
            readonly placeholderTextColor?: import('@tamagui/web').Color | undefined
            readonly selectionColor?: import('@tamagui/web').Color | undefined
            readonly cursorColor?: import('@tamagui/web').Color | undefined
            readonly selectionHandleColor?: import('@tamagui/web').Color | undefined
            readonly underlineColorAndroid?: import('@tamagui/web').Color | undefined
          },
        {
          disabled?: boolean | undefined
          size?: false | import('@tamagui/web').Size | undefined
        }
      >,
      | 'about'
      | 'accept'
      | 'accessKey'
      | 'allowFontScaling'
      | 'alt'
      | 'aria-activedescendant'
      | 'aria-atomic'
      | 'aria-autocomplete'
      | 'aria-braillelabel'
      | 'aria-brailleroledescription'
      | 'aria-busy'
      | 'aria-checked'
      | 'aria-colcount'
      | 'aria-colindex'
      | 'aria-colindextext'
      | 'aria-colspan'
      | 'aria-controls'
      | 'aria-current'
      | 'aria-describedby'
      | 'aria-description'
      | 'aria-details'
      | 'aria-disabled'
      | 'aria-dropeffect'
      | 'aria-errormessage'
      | 'aria-expanded'
      | 'aria-flowto'
      | 'aria-grabbed'
      | 'aria-haspopup'
      | 'aria-hidden'
      | 'aria-invalid'
      | 'aria-keyshortcuts'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-level'
      | 'aria-live'
      | 'aria-modal'
      | 'aria-multiline'
      | 'aria-multiselectable'
      | 'aria-orientation'
      | 'aria-owns'
      | 'aria-placeholder'
      | 'aria-posinset'
      | 'aria-pressed'
      | 'aria-readonly'
      | 'aria-relevant'
      | 'aria-required'
      | 'aria-roledescription'
      | 'aria-rowcount'
      | 'aria-rowindex'
      | 'aria-rowindextext'
      | 'aria-rowspan'
      | 'aria-selected'
      | 'aria-setsize'
      | 'aria-sort'
      | 'aria-valuemax'
      | 'aria-valuemin'
      | 'aria-valuenow'
      | 'aria-valuetext'
      | 'autoCapitalize'
      | 'autoComplete'
      | 'autoCorrect'
      | 'autoFocus'
      | 'autoFocusNative'
      | 'autoSave'
      | 'blurOnSubmit'
      | 'capture'
      | 'caretHidden'
      | 'checked'
      | 'clearButtonMode'
      | 'clearTextOnFocus'
      | 'color'
      | 'content'
      | 'contentEditable'
      | 'contextMenu'
      | 'contextMenuHidden'
      | 'cursorColor'
      | 'dangerouslySetInnerHTML'
      | 'dataDetectorTypes'
      | 'datatype'
      | 'defaultChecked'
      | 'defaultValue'
      | 'dir'
      | 'disableFullscreenUI'
      | 'disableKeyboardShortcuts'
      | 'disabled'
      | 'draggable'
      | 'enablesReturnKeyAutomatically'
      | 'enterKeyHint'
      | 'exportparts'
      | 'fontFamily'
      | 'fontSize'
      | 'fontStyle'
      | 'fontWeight'
      | 'form'
      | 'formAction'
      | 'formEncType'
      | 'formMethod'
      | 'formNoValidate'
      | 'formTarget'
      | 'height'
      | 'hidden'
      | 'id'
      | 'importantForAutofill'
      | 'inert'
      | 'inlineImageLeft'
      | 'inlineImagePadding'
      | 'inlist'
      | 'inputAccessoryViewButtonLabel'
      | 'inputAccessoryViewID'
      | 'inputMode'
      | 'is'
      | 'itemID'
      | 'itemProp'
      | 'itemRef'
      | 'itemScope'
      | 'itemType'
      | 'keyboardAppearance'
      | 'keyboardType'
      | 'lang'
      | 'letterSpacing'
      | 'lineBreakModeIOS'
      | 'lineBreakStrategyIOS'
      | 'list'
      | 'max'
      | 'maxFontSizeMultiplier'
      | 'maxLength'
      | 'min'
      | 'minLength'
      | 'multiline'
      | 'multiple'
      | 'name'
      | 'nonce'
      | 'numberOfLines'
      | 'onAbort'
      | 'onAbortCapture'
      | 'onAnimationEnd'
      | 'onAnimationEndCapture'
      | 'onAnimationIteration'
      | 'onAnimationIterationCapture'
      | 'onAnimationStart'
      | 'onAnimationStartCapture'
      | 'onAuxClick'
      | 'onAuxClickCapture'
      | 'onBeforeInput'
      | 'onBeforeInputCapture'
      | 'onBeforeToggle'
      | 'onBlur'
      | 'onBlurCapture'
      | 'onCanPlay'
      | 'onCanPlayCapture'
      | 'onCanPlayThrough'
      | 'onCanPlayThroughCapture'
      | 'onChange'
      | 'onChangeCapture'
      | 'onChangeText'
      | 'onClick'
      | 'onClickCapture'
      | 'onCompositionEnd'
      | 'onCompositionEndCapture'
      | 'onCompositionStart'
      | 'onCompositionStartCapture'
      | 'onCompositionUpdate'
      | 'onCompositionUpdateCapture'
      | 'onContentSizeChange'
      | 'onContextMenu'
      | 'onContextMenuCapture'
      | 'onCopy'
      | 'onCopyCapture'
      | 'onCut'
      | 'onCutCapture'
      | 'onDoubleClick'
      | 'onDoubleClickCapture'
      | 'onDrag'
      | 'onDragCapture'
      | 'onDragEnd'
      | 'onDragEndCapture'
      | 'onDragEnter'
      | 'onDragEnterCapture'
      | 'onDragExit'
      | 'onDragExitCapture'
      | 'onDragLeave'
      | 'onDragLeaveCapture'
      | 'onDragOver'
      | 'onDragOverCapture'
      | 'onDragStart'
      | 'onDragStartCapture'
      | 'onDrop'
      | 'onDropCapture'
      | 'onDurationChange'
      | 'onDurationChangeCapture'
      | 'onEmptied'
      | 'onEmptiedCapture'
      | 'onEncrypted'
      | 'onEncryptedCapture'
      | 'onEndEditing'
      | 'onEnded'
      | 'onEndedCapture'
      | 'onError'
      | 'onErrorCapture'
      | 'onFocus'
      | 'onFocusCapture'
      | 'onGotPointerCapture'
      | 'onGotPointerCaptureCapture'
      | 'onInput'
      | 'onInputCapture'
      | 'onInvalid'
      | 'onInvalidCapture'
      | 'onKeyDown'
      | 'onKeyDownCapture'
      | 'onKeyPress'
      | 'onKeyPressCapture'
      | 'onKeyUp'
      | 'onKeyUpCapture'
      | 'onLoad'
      | 'onLoadCapture'
      | 'onLoadStart'
      | 'onLoadStartCapture'
      | 'onLoadedData'
      | 'onLoadedDataCapture'
      | 'onLoadedMetadata'
      | 'onLoadedMetadataCapture'
      | 'onLostPointerCapture'
      | 'onLostPointerCaptureCapture'
      | 'onMouseDown'
      | 'onMouseDownCapture'
      | 'onMouseEnter'
      | 'onMouseLeave'
      | 'onMouseMove'
      | 'onMouseMoveCapture'
      | 'onMouseOut'
      | 'onMouseOutCapture'
      | 'onMouseOver'
      | 'onMouseOverCapture'
      | 'onMouseUp'
      | 'onMouseUpCapture'
      | 'onPaste'
      | 'onPasteCapture'
      | 'onPause'
      | 'onPauseCapture'
      | 'onPlay'
      | 'onPlayCapture'
      | 'onPlaying'
      | 'onPlayingCapture'
      | 'onPointerCancel'
      | 'onPointerCancelCapture'
      | 'onPointerDown'
      | 'onPointerDownCapture'
      | 'onPointerEnter'
      | 'onPointerLeave'
      | 'onPointerMove'
      | 'onPointerMoveCapture'
      | 'onPointerOut'
      | 'onPointerOutCapture'
      | 'onPointerOver'
      | 'onPointerOverCapture'
      | 'onPointerUp'
      | 'onPointerUpCapture'
      | 'onProgress'
      | 'onProgressCapture'
      | 'onRateChange'
      | 'onRateChangeCapture'
      | 'onReset'
      | 'onResetCapture'
      | 'onScroll'
      | 'onScrollCapture'
      | 'onScrollEnd'
      | 'onScrollEndCapture'
      | 'onSeeked'
      | 'onSeekedCapture'
      | 'onSeeking'
      | 'onSeekingCapture'
      | 'onSelect'
      | 'onSelectCapture'
      | 'onSelectionChange'
      | 'onStalled'
      | 'onStalledCapture'
      | 'onSubmit'
      | 'onSubmitCapture'
      | 'onSubmitEditing'
      | 'onSuspend'
      | 'onSuspendCapture'
      | 'onTimeUpdate'
      | 'onTimeUpdateCapture'
      | 'onToggle'
      | 'onTouchCancel'
      | 'onTouchCancelCapture'
      | 'onTouchEnd'
      | 'onTouchEndCapture'
      | 'onTouchMove'
      | 'onTouchMoveCapture'
      | 'onTouchStart'
      | 'onTouchStartCapture'
      | 'onTransitionCancel'
      | 'onTransitionCancelCapture'
      | 'onTransitionEnd'
      | 'onTransitionEndCapture'
      | 'onTransitionRun'
      | 'onTransitionRunCapture'
      | 'onTransitionStart'
      | 'onTransitionStartCapture'
      | 'onVolumeChange'
      | 'onVolumeChangeCapture'
      | 'onWaiting'
      | 'onWaitingCapture'
      | 'onWheel'
      | 'onWheelCapture'
      | 'part'
      | 'passwordRules'
      | 'pattern'
      | 'placeholder'
      | 'placeholderTextColor'
      | 'popover'
      | 'popoverTarget'
      | 'popoverTargetAction'
      | 'prefix'
      | 'property'
      | 'radioGroup'
      | 'readOnly'
      | 'rejectResponderTermination'
      | 'rel'
      | 'required'
      | 'resource'
      | 'results'
      | 'returnKeyLabel'
      | 'returnKeyType'
      | 'rev'
      | 'role'
      | 'rows'
      | 'scrollEnabled'
      | 'secureTextEntry'
      | 'security'
      | 'selectTextOnFocus'
      | 'selection'
      | 'selectionColor'
      | 'selectionHandleColor'
      | 'showSoftInputOnFocus'
      | 'slot'
      | 'smartInsertDelete'
      | 'spellCheck'
      | 'src'
      | 'step'
      | 'submitBehavior'
      | 'suppressContentEditableWarning'
      | 'suppressHydrationWarning'
      | 'tabIndex'
      | 'textAlign'
      | 'textAlignVertical'
      | 'textBreakStrategy'
      | 'textContentType'
      | 'textTransform'
      | 'title'
      | 'translate'
      | 'type'
      | 'typeof'
      | 'underlineColorAndroid'
      | 'unselectable'
      | 'value'
      | 'verticalAlign'
      | 'vocab'
      | 'width'
    > &
    Omit<
      import('react').InputHTMLAttributes<HTMLInputElement>,
      | 'autoCapitalize'
      | 'autoCorrect'
      | 'children'
      | 'className'
      | 'color'
      | 'fontFamily'
      | 'fontSize'
      | 'fontStyle'
      | 'fontWeight'
      | 'letterSpacing'
      | 'size'
      | 'spellCheck'
      | 'style'
      | 'textAlign'
      | 'textTransform'
    > & {
      fontFamily?: import('@tamagui/web').FlatStyleValue<
        import('@tamagui/ui').GetThemeValueForKey<'fontFamily'> | undefined
      >
      fontSize?: import('@tamagui/web').FlatStyleValue<
        import('@tamagui/ui').GetThemeValueForKey<'fontSize'> | undefined
      >
      fontStyle?: import('@tamagui/web').FlatStyleValue<
        'italic' | 'normal' | 'unset' | undefined
      >
      fontWeight?: import('@tamagui/web').FlatStyleValue<
        | 'unset'
        | 100
        | 200
        | 300
        | 400
        | 500
        | 600
        | 700
        | 800
        | 900
        | import('@tamagui/ui').GetThemeValueForKey<'fontWeight'>
        | undefined
      >
      letterSpacing?: import('@tamagui/web').FlatStyleValue<
        'unset' | import('@tamagui/ui').GetThemeValueForKey<'letterSpacing'> | undefined
      >
      textAlign?: import('@tamagui/web').FlatStyleValue<
        'auto' | 'center' | 'justify' | 'left' | 'right' | 'unset' | undefined
      >
      textTransform?: import('@tamagui/web').FlatStyleValue<
        'capitalize' | 'lowercase' | 'none' | 'unset' | 'uppercase' | undefined
      >
      color?: import('@tamagui/web').ColorStyleProp
    } & Omit<
      import('@tamagui/ui').InputNativeProps,
      'autoCapitalize' | 'autoCorrect' | 'spellCheck'
    > & {
      autoCorrect?: boolean | 'on' | 'off'
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on'
      spellCheck?: boolean
      rows?: number
      placeholderTextColor?: import('@tamagui/ui').ColorTokens
      selectionColor?: import('@tamagui/ui').ColorTokens
      onChangeText?: (text: string) => void
      onSubmitEditing?: (e: {
        nativeEvent: {
          text: string
        }
      }) => void
      selection?: {
        start: number
        end?: number
      }
      onSelectionChange?: (e: {
        nativeEvent: {
          selection: {
            start: number
            end: number
          }
        }
      }) => void
      textContentType?: import('@tamagui/ui').InputTextContentType
    },
  import('@tamagui/web').StackStyleBase &
    import('@tamagui/web').TextStylePropsBase & {
      readonly placeholderTextColor?: import('@tamagui/web').Color | undefined
      readonly selectionColor?: import('@tamagui/web').Color | undefined
      readonly cursorColor?: import('@tamagui/web').Color | undefined
      readonly selectionHandleColor?: import('@tamagui/web').Color | undefined
      readonly underlineColorAndroid?: import('@tamagui/web').Color | undefined
    },
  {
    disabled?: boolean | undefined
    size?: false | import('@tamagui/web').Size | undefined
  },
  {
    readonly isInput: true
    readonly accept: {
      readonly placeholderTextColor: 'color'
      readonly selectionColor: 'color'
      readonly cursorColor: 'color'
      readonly selectionHandleColor: 'color'
      readonly underlineColorAndroid: 'color'
    }
    readonly validStyles:
      | {
          [key: string]: boolean
        }
      | undefined
  } & import('@tamagui/web').StaticConfigPublic
>
export declare const TextArea: import('@tamagui/ui').TamaguiComponent<
  import('@tamagui/web').TamaDefer,
  | import('react-native').View
  | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/web').StackStyleBase &
          import('@tamagui/web').TextStylePropsBase & {
            readonly placeholderTextColor?: import('@tamagui/web').Color | undefined
            readonly selectionColor?: import('@tamagui/web').Color | undefined
            readonly cursorColor?: import('@tamagui/web').Color | undefined
            readonly selectionHandleColor?: import('@tamagui/web').Color | undefined
            readonly underlineColorAndroid?: import('@tamagui/web').Color | undefined
          },
        {
          disabled?: boolean | undefined
          size?: false | import('@tamagui/web').Size | undefined
        }
      >,
      | 'about'
      | 'accept'
      | 'accessKey'
      | 'allowFontScaling'
      | 'alt'
      | 'aria-activedescendant'
      | 'aria-atomic'
      | 'aria-autocomplete'
      | 'aria-braillelabel'
      | 'aria-brailleroledescription'
      | 'aria-busy'
      | 'aria-checked'
      | 'aria-colcount'
      | 'aria-colindex'
      | 'aria-colindextext'
      | 'aria-colspan'
      | 'aria-controls'
      | 'aria-current'
      | 'aria-describedby'
      | 'aria-description'
      | 'aria-details'
      | 'aria-disabled'
      | 'aria-dropeffect'
      | 'aria-errormessage'
      | 'aria-expanded'
      | 'aria-flowto'
      | 'aria-grabbed'
      | 'aria-haspopup'
      | 'aria-hidden'
      | 'aria-invalid'
      | 'aria-keyshortcuts'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-level'
      | 'aria-live'
      | 'aria-modal'
      | 'aria-multiline'
      | 'aria-multiselectable'
      | 'aria-orientation'
      | 'aria-owns'
      | 'aria-placeholder'
      | 'aria-posinset'
      | 'aria-pressed'
      | 'aria-readonly'
      | 'aria-relevant'
      | 'aria-required'
      | 'aria-roledescription'
      | 'aria-rowcount'
      | 'aria-rowindex'
      | 'aria-rowindextext'
      | 'aria-rowspan'
      | 'aria-selected'
      | 'aria-setsize'
      | 'aria-sort'
      | 'aria-valuemax'
      | 'aria-valuemin'
      | 'aria-valuenow'
      | 'aria-valuetext'
      | 'autoCapitalize'
      | 'autoComplete'
      | 'autoCorrect'
      | 'autoFocus'
      | 'autoFocusNative'
      | 'autoSave'
      | 'blurOnSubmit'
      | 'capture'
      | 'caretHidden'
      | 'checked'
      | 'clearButtonMode'
      | 'clearTextOnFocus'
      | 'color'
      | 'content'
      | 'contentEditable'
      | 'contextMenu'
      | 'contextMenuHidden'
      | 'cursorColor'
      | 'dangerouslySetInnerHTML'
      | 'dataDetectorTypes'
      | 'datatype'
      | 'defaultChecked'
      | 'defaultValue'
      | 'dir'
      | 'disableFullscreenUI'
      | 'disableKeyboardShortcuts'
      | 'disabled'
      | 'draggable'
      | 'enablesReturnKeyAutomatically'
      | 'enterKeyHint'
      | 'exportparts'
      | 'fontFamily'
      | 'fontSize'
      | 'fontStyle'
      | 'fontWeight'
      | 'form'
      | 'formAction'
      | 'formEncType'
      | 'formMethod'
      | 'formNoValidate'
      | 'formTarget'
      | 'height'
      | 'hidden'
      | 'id'
      | 'importantForAutofill'
      | 'inert'
      | 'inlineImageLeft'
      | 'inlineImagePadding'
      | 'inlist'
      | 'inputAccessoryViewButtonLabel'
      | 'inputAccessoryViewID'
      | 'inputMode'
      | 'is'
      | 'itemID'
      | 'itemProp'
      | 'itemRef'
      | 'itemScope'
      | 'itemType'
      | 'keyboardAppearance'
      | 'keyboardType'
      | 'lang'
      | 'letterSpacing'
      | 'lineBreakModeIOS'
      | 'lineBreakStrategyIOS'
      | 'list'
      | 'max'
      | 'maxFontSizeMultiplier'
      | 'maxLength'
      | 'min'
      | 'minLength'
      | 'multiline'
      | 'multiple'
      | 'name'
      | 'nonce'
      | 'numberOfLines'
      | 'onAbort'
      | 'onAbortCapture'
      | 'onAnimationEnd'
      | 'onAnimationEndCapture'
      | 'onAnimationIteration'
      | 'onAnimationIterationCapture'
      | 'onAnimationStart'
      | 'onAnimationStartCapture'
      | 'onAuxClick'
      | 'onAuxClickCapture'
      | 'onBeforeInput'
      | 'onBeforeInputCapture'
      | 'onBeforeToggle'
      | 'onBlur'
      | 'onBlurCapture'
      | 'onCanPlay'
      | 'onCanPlayCapture'
      | 'onCanPlayThrough'
      | 'onCanPlayThroughCapture'
      | 'onChange'
      | 'onChangeCapture'
      | 'onChangeText'
      | 'onClick'
      | 'onClickCapture'
      | 'onCompositionEnd'
      | 'onCompositionEndCapture'
      | 'onCompositionStart'
      | 'onCompositionStartCapture'
      | 'onCompositionUpdate'
      | 'onCompositionUpdateCapture'
      | 'onContentSizeChange'
      | 'onContextMenu'
      | 'onContextMenuCapture'
      | 'onCopy'
      | 'onCopyCapture'
      | 'onCut'
      | 'onCutCapture'
      | 'onDoubleClick'
      | 'onDoubleClickCapture'
      | 'onDrag'
      | 'onDragCapture'
      | 'onDragEnd'
      | 'onDragEndCapture'
      | 'onDragEnter'
      | 'onDragEnterCapture'
      | 'onDragExit'
      | 'onDragExitCapture'
      | 'onDragLeave'
      | 'onDragLeaveCapture'
      | 'onDragOver'
      | 'onDragOverCapture'
      | 'onDragStart'
      | 'onDragStartCapture'
      | 'onDrop'
      | 'onDropCapture'
      | 'onDurationChange'
      | 'onDurationChangeCapture'
      | 'onEmptied'
      | 'onEmptiedCapture'
      | 'onEncrypted'
      | 'onEncryptedCapture'
      | 'onEndEditing'
      | 'onEnded'
      | 'onEndedCapture'
      | 'onError'
      | 'onErrorCapture'
      | 'onFocus'
      | 'onFocusCapture'
      | 'onGotPointerCapture'
      | 'onGotPointerCaptureCapture'
      | 'onInput'
      | 'onInputCapture'
      | 'onInvalid'
      | 'onInvalidCapture'
      | 'onKeyDown'
      | 'onKeyDownCapture'
      | 'onKeyPress'
      | 'onKeyPressCapture'
      | 'onKeyUp'
      | 'onKeyUpCapture'
      | 'onLoad'
      | 'onLoadCapture'
      | 'onLoadStart'
      | 'onLoadStartCapture'
      | 'onLoadedData'
      | 'onLoadedDataCapture'
      | 'onLoadedMetadata'
      | 'onLoadedMetadataCapture'
      | 'onLostPointerCapture'
      | 'onLostPointerCaptureCapture'
      | 'onMouseDown'
      | 'onMouseDownCapture'
      | 'onMouseEnter'
      | 'onMouseLeave'
      | 'onMouseMove'
      | 'onMouseMoveCapture'
      | 'onMouseOut'
      | 'onMouseOutCapture'
      | 'onMouseOver'
      | 'onMouseOverCapture'
      | 'onMouseUp'
      | 'onMouseUpCapture'
      | 'onPaste'
      | 'onPasteCapture'
      | 'onPause'
      | 'onPauseCapture'
      | 'onPlay'
      | 'onPlayCapture'
      | 'onPlaying'
      | 'onPlayingCapture'
      | 'onPointerCancel'
      | 'onPointerCancelCapture'
      | 'onPointerDown'
      | 'onPointerDownCapture'
      | 'onPointerEnter'
      | 'onPointerLeave'
      | 'onPointerMove'
      | 'onPointerMoveCapture'
      | 'onPointerOut'
      | 'onPointerOutCapture'
      | 'onPointerOver'
      | 'onPointerOverCapture'
      | 'onPointerUp'
      | 'onPointerUpCapture'
      | 'onProgress'
      | 'onProgressCapture'
      | 'onRateChange'
      | 'onRateChangeCapture'
      | 'onReset'
      | 'onResetCapture'
      | 'onScroll'
      | 'onScrollCapture'
      | 'onScrollEnd'
      | 'onScrollEndCapture'
      | 'onSeeked'
      | 'onSeekedCapture'
      | 'onSeeking'
      | 'onSeekingCapture'
      | 'onSelect'
      | 'onSelectCapture'
      | 'onSelectionChange'
      | 'onStalled'
      | 'onStalledCapture'
      | 'onSubmit'
      | 'onSubmitCapture'
      | 'onSubmitEditing'
      | 'onSuspend'
      | 'onSuspendCapture'
      | 'onTimeUpdate'
      | 'onTimeUpdateCapture'
      | 'onToggle'
      | 'onTouchCancel'
      | 'onTouchCancelCapture'
      | 'onTouchEnd'
      | 'onTouchEndCapture'
      | 'onTouchMove'
      | 'onTouchMoveCapture'
      | 'onTouchStart'
      | 'onTouchStartCapture'
      | 'onTransitionCancel'
      | 'onTransitionCancelCapture'
      | 'onTransitionEnd'
      | 'onTransitionEndCapture'
      | 'onTransitionRun'
      | 'onTransitionRunCapture'
      | 'onTransitionStart'
      | 'onTransitionStartCapture'
      | 'onVolumeChange'
      | 'onVolumeChangeCapture'
      | 'onWaiting'
      | 'onWaitingCapture'
      | 'onWheel'
      | 'onWheelCapture'
      | 'part'
      | 'passwordRules'
      | 'pattern'
      | 'placeholder'
      | 'placeholderTextColor'
      | 'popover'
      | 'popoverTarget'
      | 'popoverTargetAction'
      | 'prefix'
      | 'property'
      | 'radioGroup'
      | 'readOnly'
      | 'rejectResponderTermination'
      | 'rel'
      | 'required'
      | 'resource'
      | 'results'
      | 'returnKeyLabel'
      | 'returnKeyType'
      | 'rev'
      | 'role'
      | 'rows'
      | 'scrollEnabled'
      | 'secureTextEntry'
      | 'security'
      | 'selectTextOnFocus'
      | 'selection'
      | 'selectionColor'
      | 'selectionHandleColor'
      | 'showSoftInputOnFocus'
      | 'slot'
      | 'smartInsertDelete'
      | 'spellCheck'
      | 'src'
      | 'step'
      | 'submitBehavior'
      | 'suppressContentEditableWarning'
      | 'suppressHydrationWarning'
      | 'tabIndex'
      | 'textAlign'
      | 'textAlignVertical'
      | 'textBreakStrategy'
      | 'textContentType'
      | 'textTransform'
      | 'title'
      | 'translate'
      | 'type'
      | 'typeof'
      | 'underlineColorAndroid'
      | 'unselectable'
      | 'value'
      | 'verticalAlign'
      | 'vocab'
      | 'width'
    > &
    Omit<
      import('react').InputHTMLAttributes<HTMLInputElement>,
      | 'autoCapitalize'
      | 'autoCorrect'
      | 'children'
      | 'className'
      | 'color'
      | 'fontFamily'
      | 'fontSize'
      | 'fontStyle'
      | 'fontWeight'
      | 'letterSpacing'
      | 'size'
      | 'spellCheck'
      | 'style'
      | 'textAlign'
      | 'textTransform'
    > & {
      fontFamily?: import('@tamagui/web').FlatStyleValue<
        import('@tamagui/ui').GetThemeValueForKey<'fontFamily'> | undefined
      >
      fontSize?: import('@tamagui/web').FlatStyleValue<
        import('@tamagui/ui').GetThemeValueForKey<'fontSize'> | undefined
      >
      fontStyle?: import('@tamagui/web').FlatStyleValue<
        'italic' | 'normal' | 'unset' | undefined
      >
      fontWeight?: import('@tamagui/web').FlatStyleValue<
        | 'unset'
        | 100
        | 200
        | 300
        | 400
        | 500
        | 600
        | 700
        | 800
        | 900
        | import('@tamagui/ui').GetThemeValueForKey<'fontWeight'>
        | undefined
      >
      letterSpacing?: import('@tamagui/web').FlatStyleValue<
        'unset' | import('@tamagui/ui').GetThemeValueForKey<'letterSpacing'> | undefined
      >
      textAlign?: import('@tamagui/web').FlatStyleValue<
        'auto' | 'center' | 'justify' | 'left' | 'right' | 'unset' | undefined
      >
      textTransform?: import('@tamagui/web').FlatStyleValue<
        'capitalize' | 'lowercase' | 'none' | 'unset' | 'uppercase' | undefined
      >
      color?: import('@tamagui/web').ColorStyleProp
    } & Omit<
      import('@tamagui/ui').InputNativeProps,
      'autoCapitalize' | 'autoCorrect' | 'spellCheck'
    > & {
      autoCorrect?: boolean | 'on' | 'off'
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on'
      spellCheck?: boolean
      rows?: number
      placeholderTextColor?: import('@tamagui/ui').ColorTokens
      selectionColor?: import('@tamagui/ui').ColorTokens
      onChangeText?: (text: string) => void
      onSubmitEditing?: (e: {
        nativeEvent: {
          text: string
        }
      }) => void
      selection?: {
        start: number
        end?: number
      }
      onSelectionChange?: (e: {
        nativeEvent: {
          selection: {
            start: number
            end: number
          }
        }
      }) => void
      textContentType?: import('@tamagui/ui').InputTextContentType
    },
  import('@tamagui/web').StackStyleBase &
    import('@tamagui/web').TextStylePropsBase & {
      readonly placeholderTextColor?: import('@tamagui/web').Color | undefined
      readonly selectionColor?: import('@tamagui/web').Color | undefined
      readonly cursorColor?: import('@tamagui/web').Color | undefined
      readonly selectionHandleColor?: import('@tamagui/web').Color | undefined
      readonly underlineColorAndroid?: import('@tamagui/web').Color | undefined
    },
  {
    disabled?: boolean | undefined
    size?: false | import('@tamagui/web').Size | undefined
  },
  {
    readonly isInput: true
    readonly accept: {
      readonly placeholderTextColor: 'color'
      readonly selectionColor: 'color'
      readonly cursorColor: 'color'
      readonly selectionHandleColor: 'color'
      readonly underlineColorAndroid: 'color'
    }
    readonly validStyles:
      | {
          [key: string]: boolean
        }
      | undefined
  } & import('@tamagui/web').StaticConfigPublic
>
export type InputProps = GetProps<typeof Input>
export type TextAreaProps = GetProps<typeof TextArea>
//# sourceMappingURL=Input.d.ts.map
