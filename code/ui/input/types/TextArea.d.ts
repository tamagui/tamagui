/**
 * @summary A text area is a multi-line input field that allows users to enter text.
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "size" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "value" | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Pick<import("@tamagui/web").TextProps, "color"> & Omit<import("react").CSSProperties | undefined, "color"> & Omit<import("react-native").TextInputProps, "numberOfLines" | "selectionColor" | "enterKeyHint" | "inputMode" | "secureTextEntry" | "onChangeText" | "editable" | "keyboardType" | "placeholderTextColor"> & {
    secureTextEntry?: import("react-native").TextInputProps["secureTextEntry"];
    onChangeText?: import("react-native").TextInputProps["onChange"];
    editable?: import("react-native").TextInputProps["editable"];
    enterKeyHint?: "done" | "go" | "next" | "search" | "send" | "enter" | "previous";
    keyboardType?: import("react-native").TextInputProps["keyboardType"];
    inputMode?: import("react-native").InputModeOptions;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
    tag?: import("@tamagui/web").TamaguiComponentPropsBase["tag"];
    multiline?: boolean;
    numberOfLines?: number;
}, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, ({
    name: string;
    tag: string;
    variants: {
        readonly unstyled: {
            readonly false: {
                readonly borderColor: "$borderColor";
                readonly backgroundColor: "$background";
                readonly minWidth: 0;
                readonly hoverStyle: {
                    readonly borderColor: "$borderColorHover";
                };
                readonly focusStyle: {
                    readonly borderColor: "$borderColorFocus";
                };
                readonly focusVisibleStyle: {
                    readonly outlineColor: "$outlineColor";
                    readonly outlineWidth: 2;
                    readonly outlineStyle: "solid";
                };
                readonly tabIndex: 0;
                readonly size: "$true";
                readonly fontFamily: "$body";
                readonly borderWidth: 1;
                readonly outlineWidth: 0;
                readonly color: "$color";
            } | {
                readonly borderColor: "$borderColor";
                readonly backgroundColor: "$background";
                readonly minWidth: 0;
                readonly hoverStyle: {
                    readonly borderColor: "$borderColorHover";
                };
                readonly focusStyle: {
                    readonly borderColor: "$borderColorFocus";
                };
                readonly focusVisibleStyle: {
                    readonly outlineColor: "$outlineColor";
                    readonly outlineWidth: 2;
                    readonly outlineStyle: "solid";
                };
                readonly focusable: boolean;
                readonly size: "$true";
                readonly fontFamily: "$body";
                readonly borderWidth: 1;
                readonly outlineWidth: 0;
                readonly color: "$color";
            };
        };
        readonly size: {
            readonly '...size': import("@tamagui/web").SizeVariantSpreadFunction<any>;
        };
        readonly disabled: {
            readonly true: {};
        };
    };
    defaultVariants: {
        unstyled: boolean;
    };
    isInput?: undefined;
    accept?: undefined;
    validStyles?: undefined;
} | {
    isInput: boolean;
    accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
    };
    validStyles: {
        [key: string]: boolean;
    } | undefined;
    name?: undefined;
    tag?: undefined;
    variants?: undefined;
    defaultVariants?: undefined;
}) & import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=TextArea.d.ts.map