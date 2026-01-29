import type { ColorTokens } from '@tamagui/web';
/**
 * iOS-specific props for Input/TextArea
 * These have no web equivalent and are ignored on web.
 */
export interface InputIOSProps {
    /**
     * Determines the color of the keyboard.
     * @platform ios
     */
    keyboardAppearance?: 'default' | 'light' | 'dark';
    /**
     * When the clear button should appear on the right side of the text view.
     * @platform ios
     */
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
    /**
     * If true, clears the text field automatically when editing begins.
     * @platform ios
     */
    clearTextOnFocus?: boolean;
    /**
     * If true, the keyboard disables the return key when there is no text.
     * Automatically enables it when there is text.
     * @default false
     * @platform ios
     */
    enablesReturnKeyAutomatically?: boolean;
    /**
     * Determines the types of data converted to clickable URLs in the text input.
     * Only valid if `multiline={true}` and `editable={false}`.
     * @platform ios
     */
    dataDetectorTypes?: InputDataDetectorTypes | InputDataDetectorTypes[];
    /**
     * If false, scrolling of the text view will be disabled.
     * Only works with `multiline={true}`.
     * @default true
     * @platform ios
     */
    scrollEnabled?: boolean;
    /**
     * Password requirements for autofill.
     * Example: "required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
     * @platform ios
     */
    passwordRules?: string | null;
    /**
     * If true, allows TextInput to pass touch events to the parent component.
     * This allows components to be swipeable from the TextInput on iOS.
     * @default true
     * @platform ios
     */
    rejectResponderTermination?: boolean | null;
    /**
     * If false, disables spell-check style (red underlines).
     * The default value is inherited from autoCorrect.
     * @platform ios
     */
    spellCheck?: boolean;
    /**
     * Set line break strategy on iOS 14+.
     * @platform ios
     */
    lineBreakStrategyIOS?: 'none' | 'standard' | 'hangul-word' | 'push-out';
    /**
     * Set line break mode on iOS.
     * @platform ios
     */
    lineBreakModeIOS?: 'wordWrapping' | 'char' | 'clip' | 'head' | 'middle' | 'tail';
    /**
     * If false, the iOS system will not insert an extra space after a paste operation
     * neither delete one or two spaces after a cut or delete operation.
     * @default true
     * @platform ios
     */
    smartInsertDelete?: boolean;
    /**
     * An identifier to link to an InputAccessoryView.
     * @see https://reactnative.dev/docs/inputaccessoryview
     * @platform ios
     */
    inputAccessoryViewID?: string;
    /**
     * An optional label that overrides the default input accessory view button label.
     * @platform ios
     */
    inputAccessoryViewButtonLabel?: string;
    /**
     * If true, the keyboard shortcuts (undo/redo and copy buttons) are disabled.
     * @default false
     * @platform ios
     */
    disableKeyboardShortcuts?: boolean;
}
/**
 * Android-specific props for Input/TextArea
 * These have no web equivalent and are ignored on web.
 */
export interface InputAndroidProps {
    /**
     * The color of the cursor (caret) in the component.
     * Unlike `selectionColor`, this only affects the cursor, not the selection highlight.
     * @platform android
     */
    cursorColor?: ColorTokens | (string & {});
    /**
     * The color of the selection handles when highlighting text.
     * Unlike `selectionColor`, this only affects the handles, not the selection highlight.
     * @platform android
     */
    selectionHandleColor?: ColorTokens | (string & {});
    /**
     * The color of the TextInput underline.
     * Set to "transparent" to remove it.
     * @platform android
     */
    underlineColorAndroid?: ColorTokens | (string & {});
    /**
     * Determines whether the field should be included in autofill.
     * @default 'auto'
     * @platform android
     */
    importantForAutofill?: 'auto' | 'no' | 'noExcludeDescendants' | 'yes' | 'yesExcludeDescendants';
    /**
     * When false, if there is a small amount of space available around a text input
     * (e.g. landscape orientation on a phone), the OS may choose to have the user
     * edit the text inside of a full screen text input mode.
     * When true, this feature is disabled.
     * @default false
     * @platform android
     */
    disableFullscreenUI?: boolean;
    /**
     * If defined, the provided image resource will be rendered on the left.
     * The image resource must be inside `/android/app/src/main/res/drawable`.
     * @platform android
     */
    inlineImageLeft?: string;
    /**
     * Padding between the inline image (if any) and the text input itself.
     * @platform android
     */
    inlineImagePadding?: number;
    /**
     * Sets the return key label. Use it instead of `returnKeyType`.
     * @platform android
     */
    returnKeyLabel?: string;
    /**
     * Set text break strategy on Android API Level 23+.
     * @default 'highQuality'
     * @platform android
     */
    textBreakStrategy?: 'simple' | 'highQuality' | 'balanced';
    /**
     * Vertically align text when `multiline` is set to true.
     * @platform android
     */
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    /**
     * Alias for textAlignVertical.
     * @platform android
     */
    verticalAlign?: 'auto' | 'top' | 'bottom' | 'middle';
    /**
     * When false, the soft keyboard will not be shown when the field is focused.
     * @default true
     * @platform android
     */
    showSoftInputOnFocus?: boolean;
    /**
     * Sets the number of lines for a TextInput.
     * Use with `multiline={true}` to fill the lines.
     * @platform android
     */
    numberOfLines?: number;
}
/**
 * Cross-platform native-only props for Input/TextArea
 * These work on both iOS and Android but have no web equivalent.
 */
export interface InputNativeProps extends InputIOSProps, InputAndroidProps {
    /**
     * Determines how the return key should look.
     *
     * Cross-platform values: 'done' | 'go' | 'next' | 'search' | 'send'
     * iOS only: 'default' | 'google' | 'join' | 'route' | 'yahoo' | 'emergency-call'
     * Android only: 'none' | 'previous'
     *
     * Note: `enterKeyHint` is the web-standard prop and takes precedence.
     * Use `returnKeyType` for RN-specific values not available in `enterKeyHint`.
     * @platform native
     */
    returnKeyType?: InputReturnKeyType;
    /**
     * Determines what happens when the return key is pressed.
     *
     * - `'submit'` - sends submit event only, does not blur
     * - `'blurAndSubmit'` - blurs the input and sends submit event (single-line default)
     * - `'newline'` - inserts a newline (multiline default)
     *
     * Replaces the deprecated `blurOnSubmit` prop.
     * @platform native
     */
    submitBehavior?: 'submit' | 'blurAndSubmit' | 'newline';
    /**
     * If true, the text field will blur when submitted.
     * For single-line fields, default is true. For multiline, default is false.
     *
     * @deprecated Use `submitBehavior` instead. `submitBehavior` takes precedence.
     * @platform native
     */
    blurOnSubmit?: boolean;
    /**
     * If true, the cursor (caret) is hidden.
     * @default false
     * @platform native
     */
    caretHidden?: boolean;
    /**
     * If true, the context menu is hidden.
     * @default false
     * @platform native
     */
    contextMenuHidden?: boolean;
    /**
     * If true, all text will automatically be selected on focus.
     * @default false
     * @platform native
     */
    selectTextOnFocus?: boolean;
    /**
     * If true, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. Use `type="password"` for web compatibility.
     * @default false
     * @platform native
     */
    secureTextEntry?: boolean;
    /**
     * Callback that is called when text input ends.
     * @platform native
     */
    onEndEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    /**
     * Callback that is called when the text input's content size changes.
     * Only called for multiline text inputs.
     * @platform native
     */
    onContentSizeChange?: (e: {
        nativeEvent: {
            contentSize: {
                width: number;
                height: number;
            };
        };
    }) => void;
    /**
     * Invoked on content scroll. Only works with `multiline={true}`.
     * @platform native
     */
    onScroll?: (e: {
        nativeEvent: {
            contentOffset: {
                x: number;
                y: number;
            };
        };
    }) => void;
    /**
     * Callback that is called when a key is pressed.
     * Fires before onChange callbacks.
     *
     * Note: on Android only soft keyboard inputs are handled, not hardware keyboard.
     * @platform native
     */
    onKeyPress?: (e: {
        nativeEvent: {
            key: string;
        };
    }) => void;
    /**
     * Specifies largest possible scale a font can reach when `allowFontScaling` is enabled.
     * - `null/undefined` - inherit from parent or global default (0)
     * - `0` - no max, ignore parent/global default
     * - `>= 1` - sets the maxFontSizeMultiplier to this value
     * @platform native
     */
    maxFontSizeMultiplier?: number | null;
    /**
     * Specifies whether fonts should scale to respect Text Size accessibility settings.
     * @default true
     * @platform native
     */
    allowFontScaling?: boolean;
    /**
     * If true, the text input can be multiple lines.
     * @default false
     * @platform native
     */
    multiline?: boolean;
    /**
     * Determines which keyboard to open.
     *
     * Cross-platform: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url'
     * iOS only: 'ascii-capable' | 'numbers-and-punctuation' | 'name-phone-pad' | 'twitter' | 'web-search'
     * Android only: 'visible-password'
     *
     * Note: `type` prop provides web-compatible keyboard selection. Use `keyboardType` for
     * RN-specific values not available via `type`.
     * @platform native
     */
    keyboardType?: InputKeyboardType;
    /**
     * Can tell TextInput to automatically capitalize certain characters.
     * @default 'sentences'
     * @platform native
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    /**
     * If false, disables auto-correct.
     * @default true
     * @platform native
     */
    autoCorrect?: boolean;
    /**
     * If true, focuses the input on componentDidMount / initial render.
     * Note: web uses `autoFocus` from HTML attributes.
     * @default false
     * @platform native
     */
    autoFocusNative?: boolean;
}
export type InputDataDetectorTypes = 'phoneNumber' | 'link' | 'address' | 'calendarEvent' | 'trackingNumber' | 'flightNumber' | 'lookupSuggestion' | 'none' | 'all';
export type InputReturnKeyType = 'done' | 'go' | 'next' | 'search' | 'send' | 'default' | 'google' | 'join' | 'route' | 'yahoo' | 'emergency-call' | 'none' | 'previous';
export type InputKeyboardType = 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url' | 'ascii-capable' | 'numbers-and-punctuation' | 'name-phone-pad' | 'twitter' | 'web-search' | 'visible-password';
//# sourceMappingURL=InputNativeProps.d.ts.map