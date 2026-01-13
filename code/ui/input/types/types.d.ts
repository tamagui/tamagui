import type { ColorTokens, StackProps, TextStylePropsBase } from '@tamagui/web';
/**
 * Web-aligned Input props
 * Follows standard HTML input API as primary, with RN compatibility for native
 */
type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type InputTextStyleProps = Pick<TextStylePropsBase, 'color' | 'fontFamily' | 'fontSize' | 'fontStyle' | 'fontWeight' | 'letterSpacing' | 'textAlign' | 'textTransform'>;
export type InputProps = StackProps & Omit<HTMLInputProps, 'size' | 'color' | 'style' | 'children' | 'className' | keyof InputTextStyleProps> & InputTextStyleProps & {
    /**
     * Rows for textarea (when tag="textarea")
     */
    rows?: number;
    /**
     * Placeholder text color - accepts Tamagui color tokens
     */
    placeholderTextColor?: ColorTokens;
    /**
     * Text selection color - accepts Tamagui color tokens
     */
    selectionColor?: ColorTokens;
    /**
     * Callback when text changes - provides just the string value
     * @deprecated Use onChange instead for web alignment
     */
    onChangeText?: (text: string) => void;
    /**
     * Callback when Enter/Return is pressed
     */
    onSubmitEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    /**
     * Selection range
     */
    selection?: {
        start: number;
        end?: number;
    };
    /**
     * Callback when selection changes
     */
    onSelectionChange?: (e: {
        nativeEvent: {
            selection: {
                start: number;
                end: number;
            };
        };
    }) => void;
    /**
     * Keyboard appearance for iOS (native only, no web equivalent)
     */
    keyboardAppearance?: 'default' | 'light' | 'dark';
    /**
     * Text content type for iOS autofill (native only, use `autoComplete` on web)
     */
    textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
};
export {};
//# sourceMappingURL=types.d.ts.map