/**
 * @deprecated Use the new TextArea from '@tamagui/input' instead
 * @summary A text area is a multi-line input field that allows users to enter text.
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "size" | "value" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Pick<import("@tamagui/web").TextProps, "color"> & Omit<import("react").CSSProperties | undefined, "color"> & Omit<import("react-native").TextInputProps, "editable" | "enterKeyHint" | "inputMode" | "keyboardType" | "numberOfLines" | "onChangeText" | "placeholderTextColor" | "secureTextEntry" | "selectionColor"> & {
    secureTextEntry?: import("react-native").TextInputProps['secureTextEntry'];
    onChangeText?: import("react-native").TextInputProps['onChangeText'];
    editable?: import("react-native").TextInputProps['editable'];
    enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous';
    keyboardType?: import("react-native").TextInputProps['keyboardType'];
    inputMode?: import("react-native").InputModeOptions;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
    render?: import("@tamagui/web").TamaguiComponentPropsBase['render'];
    multiline?: boolean;
    numberOfLines?: number;
}, "alignContent" | "alignItems" | "alignSelf" | "animateOnly" | "animatePresence" | "aspectRatio" | "backdropFilter" | "backfaceVisibility" | "background" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "blockSize" | "border" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockEndStyle" | "borderBlockEndWidth" | "borderBlockStartColor" | "borderBlockStartStyle" | "borderBlockStartWidth" | "borderBlockStyle" | "borderBlockWidth" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderEndWidth" | "borderImage" | "borderInlineColor" | "borderInlineEndColor" | "borderInlineEndStyle" | "borderInlineEndWidth" | "borderInlineStartColor" | "borderInlineStartStyle" | "borderInlineStartWidth" | "borderInlineStyle" | "borderInlineWidth" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStartWidth" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "bottom" | "boxShadow" | "boxSizing" | "caretColor" | "clipPath" | "color" | "columnGap" | "contain" | "containerType" | "content" | "cursor" | "cursorColor" | "direction" | "disabled" | "display" | "elevation" | "ellipsis" | "end" | "experimental_backgroundImage" | "filter" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "float" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "gap" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridTemplateAreas" | "gridTemplateColumns" | "height" | "includeFontPadding" | "inlineSize" | "inset" | "insetBlock" | "insetBlockEnd" | "insetBlockStart" | "insetInline" | "insetInlineEnd" | "insetInlineStart" | "isolation" | "justifyContent" | "left" | "letterSpacing" | "lineHeight" | "margin" | "marginBlock" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginInline" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "mask" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskImage" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "matrix" | "maxBlockSize" | "maxHeight" | "maxInlineSize" | "maxWidth" | "minBlockSize" | "minHeight" | "minInlineSize" | "minWidth" | "mixBlendMode" | "numberOfLines" | "objectFit" | "onTransition" | "opacity" | "outline" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflow" | "overflowBlock" | "overflowInline" | "overflowX" | "overflowY" | "padding" | "paddingBlock" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingInline" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "passThrough" | "perspective" | "placeholderTextColor" | "pointerEvents" | "position" | "right" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "rotation" | "rowGap" | "scale" | "scaleX" | "scaleY" | "selectionColor" | "selectionHandleColor" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "size" | "skewX" | "skewY" | "start" | "textAlign" | "textAlignVertical" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textEmphasis" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "top" | "transform" | "transformMatrix" | "transformOrigin" | "transformStyle" | "transition" | "translateX" | "translateY" | "underlineColorAndroid" | "userSelect" | "verticalAlign" | "whiteSpace" | "width" | "wordWrap" | "writingDirection" | "x" | "y" | "zIndex"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
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
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
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
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}, {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "size" | "value" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Pick<import("@tamagui/web").TextProps, "color"> & Omit<import("react").CSSProperties | undefined, "color"> & Omit<import("react-native").TextInputProps, "editable" | "enterKeyHint" | "inputMode" | "keyboardType" | "numberOfLines" | "onChangeText" | "placeholderTextColor" | "secureTextEntry" | "selectionColor"> & {
    secureTextEntry?: import("react-native").TextInputProps['secureTextEntry'];
    onChangeText?: import("react-native").TextInputProps['onChangeText'];
    editable?: import("react-native").TextInputProps['editable'];
    enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous';
    keyboardType?: import("react-native").TextInputProps['keyboardType'];
    inputMode?: import("react-native").InputModeOptions;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
    render?: import("@tamagui/web").TamaguiComponentPropsBase['render'];
    multiline?: boolean;
    numberOfLines?: number;
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
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react").ClassAttributes<HTMLInputElement> & import("react").HTMLProps<HTMLInputElement>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "size" | "value" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Pick<import("@tamagui/web").TextProps, "color"> & Omit<import("react").CSSProperties | undefined, "color"> & Omit<import("react-native").TextInputProps, "editable" | "enterKeyHint" | "inputMode" | "keyboardType" | "numberOfLines" | "onChangeText" | "placeholderTextColor" | "secureTextEntry" | "selectionColor"> & {
        secureTextEntry?: import("react-native").TextInputProps['secureTextEntry'];
        onChangeText?: import("react-native").TextInputProps['onChangeText'];
        editable?: import("react-native").TextInputProps['editable'];
        enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous';
        keyboardType?: import("react-native").TextInputProps['keyboardType'];
        inputMode?: import("react-native").InputModeOptions;
        placeholderTextColor?: import("@tamagui/web").ColorTokens;
        selectionColor?: import("@tamagui/web").ColorTokens;
        render?: import("@tamagui/web").TamaguiComponentPropsBase['render'];
        multiline?: boolean;
        numberOfLines?: number;
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
//# sourceMappingURL=TextArea.d.ts.map