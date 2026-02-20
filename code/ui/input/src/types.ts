import type { ColorTokens, TextStyle, TamaguiElementMethods } from '@tamagui/web'
import type { TextInput } from 'react-native'
import type { InputNativeProps } from './InputNativeProps'

/**
 * Extra props that Input adds on top of the base styled component.
 * Used with .styleable<InputExtraProps>() - the Styleable merge
 * (`Omit<BaseProps, keyof CustomProps> & CustomProps`) automatically overrides
 * base event handlers (HTMLDivElement) with these (HTMLInputElement).
 * Consumer-facing InputProps is derived via GetProps<typeof Input>.
 */

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

// text style props supported by RN TextInput
// using TextStyle to get theme-enhanced token types for these props
type InputTextStyleProps = Pick<
  TextStyle,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'letterSpacing'
  | 'textAlign'
  | 'textTransform'
>

// props that have different types on web vs native and need cross-platform definitions
type OverlappingNativeProps = 'autoCorrect' | 'autoCapitalize' | 'spellCheck'

export type InputExtraProps = Omit<
    HTMLInputProps,
    | 'size'
    | 'color'
    | 'style'
    | 'children'
    | 'className'
    | keyof InputTextStyleProps
    | OverlappingNativeProps
  > &
  InputTextStyleProps &
  Omit<InputNativeProps, OverlappingNativeProps> & {
    /**
     * Controls automatic spelling correction.
     *
     * Cross-platform values:
     * - `true` or `'on'` - Enable auto-correction
     * - `false` or `'off'` - Disable auto-correction
     *
     * @example
     * ```tsx
     * <Input autoCorrect={false} />
     * <Input autoCorrect="off" />
     * ```
     */
    autoCorrect?: boolean | 'on' | 'off'

    /**
     * Controls automatic text capitalization.
     *
     * Native values (work on all platforms):
     * - `'none'` - No automatic capitalization
     * - `'sentences'` - Capitalize first letter of sentences
     * - `'words'` - Capitalize first letter of each word
     * - `'characters'` - Capitalize all characters
     *
     * Web compatibility values (mapped on native):
     * - `'off'` - Maps to `'none'` on native
     * - `'on'` - Maps to `'sentences'` on native
     *
     * @example
     * ```tsx
     * <Input autoCapitalize="none" />
     * <Input autoCapitalize="words" />
     * ```
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on'

    /**
     * Controls spell checking.
     */
    spellCheck?: boolean
    // Core HTML input props are inherited from HTMLInputProps:
    // type, value, defaultValue, placeholder, disabled, readOnly,
    // onChange, onFocus, onBlur, onInput, autoComplete, autoFocus,
    // maxLength, minLength, pattern, required, name, id, etc.

    /**
     * Rows for textarea (when render="textarea")
     */
    rows?: number

    /**
     * Placeholder text color - accepts Tamagui color tokens
     */
    placeholderTextColor?: ColorTokens

    /**
     * Text selection color - accepts Tamagui color tokens
     */
    selectionColor?: ColorTokens

    /**
     * Callback when text changes - provides just the string value
     * @deprecated Use onChange instead for web alignment
     */
    onChangeText?: (text: string) => void

    /**
     * Callback when Enter/Return is pressed
     */
    onSubmitEditing?: (e: { nativeEvent: { text: string } }) => void

    /**
     * Selection range
     */
    selection?: { start: number; end?: number }

    /**
     * Callback when selection changes
     */
    onSelectionChange?: (e: {
      nativeEvent: { selection: { start: number; end: number } }
    }) => void

    /**
     * Text content type for iOS autofill.
     * Use `autoComplete` for web compatibility.
     * @platform ios
     */
    textContentType?: InputTextContentType
  }

/**
 * Cross-platform ref type for Input.
 * On web: HTMLInputElement with Tamagui methods (measure, focus, blur).
 * On native: TextInput.
 */
export type InputRef = (HTMLInputElement & TamaguiElementMethods) | TextInput

/**
 * iOS text content types for autofill
 */
export type InputTextContentType =
  | 'none'
  | 'URL'
  | 'addressCity'
  | 'addressCityAndState'
  | 'addressState'
  | 'countryName'
  | 'creditCardNumber'
  | 'creditCardExpiration'
  | 'creditCardExpirationMonth'
  | 'creditCardExpirationYear'
  | 'creditCardSecurityCode'
  | 'creditCardType'
  | 'creditCardName'
  | 'creditCardGivenName'
  | 'creditCardMiddleName'
  | 'creditCardFamilyName'
  | 'emailAddress'
  | 'familyName'
  | 'fullStreetAddress'
  | 'givenName'
  | 'jobTitle'
  | 'location'
  | 'middleName'
  | 'name'
  | 'namePrefix'
  | 'nameSuffix'
  | 'nickname'
  | 'organizationName'
  | 'postalCode'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'sublocality'
  | 'telephoneNumber'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | 'birthdate'
  | 'birthdateDay'
  | 'birthdateMonth'
  | 'birthdateYear'
  | 'cellularEID'
  | 'cellularIMEI'
  | 'dateTime'
  | 'flightNumber'
  | 'shipmentTrackingNumber'
