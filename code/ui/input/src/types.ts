import type { ColorTokens, ViewProps, TextStyle } from '@tamagui/web'
import type { InputNativeProps } from './InputNativeProps'

/**
 * Web-aligned Input props
 * Follows standard HTML input API as primary, with RN compatibility for native
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

export type InputProps = ViewProps &
  Omit<
    HTMLInputProps,
    'size' | 'color' | 'style' | 'children' | 'className' | keyof InputTextStyleProps
  > &
  InputTextStyleProps &
  InputNativeProps & {
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
