import type { ColorTokens, StackProps, TextStylePropsBase } from '@tamagui/web'

/**
 * Web-aligned Input props
 * Follows standard HTML input API as primary, with RN compatibility for native
 */

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

// Text style props supported by RN TextInput
// Using TextStylePropsBase (not TextProps) to avoid Pick issues with mapped types
type InputTextStyleProps = Pick<
  TextStylePropsBase,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'letterSpacing'
  | 'textAlign'
  | 'textTransform'
>

export type InputProps = StackProps &
  Omit<
    HTMLInputProps,
    'size' | 'color' | 'style' | 'children' | 'className' | keyof InputTextStyleProps
  > &
  InputTextStyleProps & {
    // Core HTML input props are inherited from HTMLInputProps:
    // type, value, defaultValue, placeholder, disabled, readOnly,
    // onChange, onFocus, onBlur, onInput, autoComplete, autoFocus,
    // maxLength, minLength, pattern, required, name, id, etc.

    /**
     * Rows for textarea (when tag="textarea")
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

    // Native-only props (no web equivalent)

    /**
     * Keyboard appearance for iOS (native only, no web equivalent)
     */
    keyboardAppearance?: 'default' | 'light' | 'dark'

    /**
     * Text content type for iOS autofill (native only, use `autoComplete` on web)
     */
    textContentType?:
      | 'none'
      | 'URL'
      | 'addressCity'
      | 'addressCityAndState'
      | 'addressState'
      | 'countryName'
      | 'creditCardNumber'
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
  }
