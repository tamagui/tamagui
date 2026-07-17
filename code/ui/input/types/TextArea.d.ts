import { type GetProps } from '@tamagui/web';
/**
 * A web-aligned textarea component (multi-line input).
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export declare const TextArea: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/web").GetThemeValueForKey<"color"> | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | "on" | "off";
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
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
}, "color" | "size" | "zIndex" | "paddingHorizontal" | "numberOfLines" | "pointerEvents" | "disabled" | "selectionColor" | "display" | "position" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "borderCurve" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "outline" | "userSelect" | "backdropFilter" | "background" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "boxShadow" | "border" | "overflowX" | "overflowY" | "transformOrigin" | "filter" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "inset" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "transition" | "animateOnly" | "animatePresence" | "onTransition" | "passThrough" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textDecorationLine" | "textDecorationStyle" | "textDecorationColor" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "fontVariant" | "writingDirection" | "backfaceVisibility" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "elevation" | "isolation" | "mixBlendMode" | "experimental_backgroundImage" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "boxSizing" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "right" | "start" | "top" | "width" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "textAlignVertical" | "includeFontPadding" | "ellipsis" | "textDecorationDistance" | "textOverflow" | "whiteSpace" | "wordWrap" | "textShadow" | "cursorColor" | "selectionHandleColor" | "underlineColorAndroid" | "placeholderTextColor"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}> & {
    size?: false | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
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
    size?: false | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
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
    size?: false | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/web").GetThemeValueForKey<"color"> | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
} & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | "on" | "off";
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/web").ColorTokens;
    selectionColor?: import("@tamagui/web").ColorTokens;
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
}, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
    readonly selectionColor?: import("@tamagui/web").Color | undefined;
    readonly cursorColor?: import("@tamagui/web").Color | undefined;
    readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
    readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
}, {
    size?: false | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
}, {
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
        readonly cursorColor: "color";
        readonly selectionHandleColor: "color";
        readonly underlineColorAndroid: "color";
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
} & import("@tamagui/web").StaticConfigPublic> & Omit<{
    readonly isInput: true;
    readonly accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
        readonly cursorColor: "color";
        readonly selectionHandleColor: "color";
        readonly underlineColorAndroid: "color";
    };
    readonly validStyles: {
        [key: string]: boolean;
    } | undefined;
} & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "children" | "style" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "textAlign" | "textTransform" | "className" | ("autoCapitalize" | "autoCorrect" | "spellCheck")> & {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/web").GetThemeValueForKey<"color"> | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "unset" | "normal" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        textTransform?: "unset" | "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
    } & Omit<import("./InputNativeProps").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
        autoCorrect?: boolean | "on" | "off";
        autoCapitalize?: "none" | "sentences" | "words" | "characters" | "off" | "on";
        spellCheck?: boolean;
        rows?: number;
        placeholderTextColor?: import("@tamagui/web").ColorTokens;
        selectionColor?: import("@tamagui/web").ColorTokens;
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
    }, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
        readonly placeholderTextColor?: import("@tamagui/web").Color | undefined;
        readonly selectionColor?: import("@tamagui/web").Color | undefined;
        readonly cursorColor?: import("@tamagui/web").Color | undefined;
        readonly selectionHandleColor?: import("@tamagui/web").Color | undefined;
        readonly underlineColorAndroid?: import("@tamagui/web").Color | undefined;
    }, {
        size?: false | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
    }, {
        readonly isInput: true;
        readonly accept: {
            readonly placeholderTextColor: "color";
            readonly selectionColor: "color";
            readonly cursorColor: "color";
            readonly selectionHandleColor: "color";
            readonly underlineColorAndroid: "color";
        };
        readonly validStyles: {
            [key: string]: boolean;
        } | undefined;
    } & import("@tamagui/web").StaticConfigPublic];
};
export type TextAreaProps = GetProps<typeof TextArea>;
//# sourceMappingURL=TextArea.d.ts.map