/// <reference types="react" />
export declare const TextArea: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "size" | "value" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("react").CSSProperties & Omit<import("react-native").TextInputProps, "inputMode" | "secureTextEntry" | "onChangeText" | "editable" | "enterKeyHint" | "keyboardType" | "placeholderTextColor" | "selectionColor"> & {
    secureTextEntry?: boolean | undefined;
    onChangeText?: ((e: import("react-native").NativeSyntheticEvent<import("react-native").TextInputChangeEventData>) => void) | undefined;
    editable?: boolean | undefined;
    enterKeyHint?: "search" | "done" | "go" | "next" | "send" | "enter" | "previous" | undefined;
    keyboardType?: import("react-native").KeyboardTypeOptions | undefined;
    inputMode?: import("react-native").InputModeOptions | undefined;
    placeholderTextColor?: import("@tamagui/web").ColorTokens | undefined;
    selectionColor?: import("@tamagui/web").ColorTokens | undefined;
    tag?: "object" | "cite" | "data" | "form" | "label" | "span" | "summary" | "article" | "button" | "dialog" | "figure" | "img" | "main" | "menu" | "option" | "search" | "table" | (string & {}) | "address" | "aside" | "footer" | "header" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "nav" | "section" | "blockquote" | "dd" | "div" | "dl" | "dt" | "figcaption" | "hr" | "li" | "ol" | "ul" | "p" | "pre" | "a" | "abbr" | "b" | "bdi" | "bdo" | "br" | "code" | "dfn" | "em" | "i" | "kbd" | "mark" | "q" | "rp" | "rt" | "rtc" | "ruby" | "s" | "samp" | "small" | "strong" | "sub" | "sup" | "time" | "u" | "var" | "wbr" | "area" | "audio" | "map" | "track" | "video" | "embed" | "param" | "picture" | "source" | "canvas" | "noscript" | "script" | "del" | "ins" | "caption" | "col" | "colgroup" | "thead" | "tbody" | "td" | "th" | "tr" | "datalist" | "fieldset" | "input" | "legend" | "meter" | "optgroup" | "output" | "progress" | "select" | "textarea" | "details" | "template" | undefined;
    multiline?: boolean | undefined;
}, import("@tamagui/web").StackStyleBase & {
    readonly placeholderTextColor?: Omit<import("@tamagui/web").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
    readonly selectionColor?: Omit<import("@tamagui/web").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
} & {
    placeholderTextColor?: Omit<import("@tamagui/web").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | Omit<never, "unset"> | undefined;
    selectionColor?: Omit<import("@tamagui/web").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | Omit<never, "unset"> | undefined;
}, {
    disabled?: boolean | undefined;
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {
    isInput: true;
    accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
    };
} & {
    accept: {
        placeholderTextColor: string;
        selectionColor: string;
    };
}>;
//# sourceMappingURL=TextArea.d.ts.map