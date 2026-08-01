import { type GetProps } from '@tamagui/ui';
export declare const Input: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
    color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
} & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/ui").ColorTokens;
    selectionColor?: import("@tamagui/ui").ColorTokens;
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
    textContentType?: import("@tamagui/ui").InputTextContentType;
}, "alignContent" | "alignItems" | "alignSelf" | "animateOnly" | "animatePresence" | "aspectRatio" | "backdropFilter" | "backfaceVisibility" | "background" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "blockSize" | "border" | "borderBlock" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockEndStyle" | "borderBlockEndWidth" | "borderBlockStartColor" | "borderBlockStartStyle" | "borderBlockStartWidth" | "borderBlockStyle" | "borderBlockWidth" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderEndWidth" | "borderImage" | "borderInline" | "borderInlineColor" | "borderInlineEndColor" | "borderInlineEndStyle" | "borderInlineEndWidth" | "borderInlineStartColor" | "borderInlineStartStyle" | "borderInlineStartWidth" | "borderInlineStyle" | "borderInlineWidth" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStartWidth" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "bottom" | "boxShadow" | "boxSizing" | "caretColor" | "clipPath" | "color" | "columnGap" | "contain" | "containerName" | "containerType" | "cursor" | "cursorColor" | "direction" | "disabled" | "display" | "elevation" | "ellipsis" | "end" | "experimental_backgroundImage" | "filter" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "float" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "gap" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridTemplateAreas" | "gridTemplateColumns" | "height" | "includeFontPadding" | "inlineSize" | "inset" | "insetBlock" | "insetBlockEnd" | "insetBlockStart" | "insetInline" | "insetInlineEnd" | "insetInlineStart" | "isolation" | "justifyContent" | "left" | "letterSpacing" | "lineHeight" | "margin" | "marginBlock" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginInline" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "mask" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskImage" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "matrix" | "maxBlockSize" | "maxHeight" | "maxInlineSize" | "maxWidth" | "minBlockSize" | "minHeight" | "minInlineSize" | "minWidth" | "mixBlendMode" | "numberOfLines" | "objectFit" | "onTransition" | "opacity" | "outline" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflow" | "overflowBlock" | "overflowInline" | "overflowWrap" | "overflowX" | "overflowY" | "padding" | "paddingBlock" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingInline" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "passThrough" | "perspective" | "placeholderTextColor" | "pointerEvents" | "position" | "resize" | "right" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "rotation" | "rowGap" | "scale" | "scaleX" | "scaleY" | "selectionColor" | "selectionHandleColor" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "size" | "skewX" | "skewY" | "start" | "textAlign" | "textAlignVertical" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textEmphasis" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "textWrap" | "top" | "transform" | "transformMatrix" | "transformOrigin" | "transformStyle" | "transition" | "translateX" | "translateY" | "underlineColorAndroid" | "userSelect" | "verticalAlign" | "whiteSpace" | "width" | "wordWrap" | "writingDirection" | "x" | "y" | "zIndex"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
}> & {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
    color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
} & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/ui").ColorTokens;
    selectionColor?: import("@tamagui/ui").ColorTokens;
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
    textContentType?: import("@tamagui/ui").InputTextContentType;
}, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
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
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
        color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
        fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
        fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
        fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
        fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
        letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
        textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
        textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
    } & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
        autoCorrect?: boolean | 'on' | 'off';
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
        spellCheck?: boolean;
        rows?: number;
        placeholderTextColor?: import("@tamagui/ui").ColorTokens;
        selectionColor?: import("@tamagui/ui").ColorTokens;
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
        textContentType?: import("@tamagui/ui").InputTextContentType;
    }, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
        readonly placeholderTextColor?: string | undefined;
        readonly selectionColor?: string | undefined;
        readonly cursorColor?: string | undefined;
        readonly selectionHandleColor?: string | undefined;
        readonly underlineColorAndroid?: string | undefined;
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
export declare const TextArea: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
    color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
} & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/ui").ColorTokens;
    selectionColor?: import("@tamagui/ui").ColorTokens;
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
    textContentType?: import("@tamagui/ui").InputTextContentType;
}, "alignContent" | "alignItems" | "alignSelf" | "animateOnly" | "animatePresence" | "aspectRatio" | "backdropFilter" | "backfaceVisibility" | "background" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "blockSize" | "border" | "borderBlock" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockEndStyle" | "borderBlockEndWidth" | "borderBlockStartColor" | "borderBlockStartStyle" | "borderBlockStartWidth" | "borderBlockStyle" | "borderBlockWidth" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderEndWidth" | "borderImage" | "borderInline" | "borderInlineColor" | "borderInlineEndColor" | "borderInlineEndStyle" | "borderInlineEndWidth" | "borderInlineStartColor" | "borderInlineStartStyle" | "borderInlineStartWidth" | "borderInlineStyle" | "borderInlineWidth" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStartWidth" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "bottom" | "boxShadow" | "boxSizing" | "caretColor" | "clipPath" | "color" | "columnGap" | "contain" | "containerName" | "containerType" | "cursor" | "cursorColor" | "direction" | "disabled" | "display" | "elevation" | "ellipsis" | "end" | "experimental_backgroundImage" | "filter" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "float" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "gap" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridTemplateAreas" | "gridTemplateColumns" | "height" | "includeFontPadding" | "inlineSize" | "inset" | "insetBlock" | "insetBlockEnd" | "insetBlockStart" | "insetInline" | "insetInlineEnd" | "insetInlineStart" | "isolation" | "justifyContent" | "left" | "letterSpacing" | "lineHeight" | "margin" | "marginBlock" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginInline" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "mask" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskImage" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "matrix" | "maxBlockSize" | "maxHeight" | "maxInlineSize" | "maxWidth" | "minBlockSize" | "minHeight" | "minInlineSize" | "minWidth" | "mixBlendMode" | "numberOfLines" | "objectFit" | "onTransition" | "opacity" | "outline" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflow" | "overflowBlock" | "overflowInline" | "overflowWrap" | "overflowX" | "overflowY" | "padding" | "paddingBlock" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingInline" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "passThrough" | "perspective" | "placeholderTextColor" | "pointerEvents" | "position" | "resize" | "right" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "rotation" | "rowGap" | "scale" | "scaleX" | "scaleY" | "selectionColor" | "selectionHandleColor" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "size" | "skewX" | "skewY" | "start" | "textAlign" | "textAlignVertical" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textEmphasis" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "textWrap" | "top" | "transform" | "transformMatrix" | "transformOrigin" | "transformStyle" | "transition" | "translateX" | "translateY" | "underlineColorAndroid" | "userSelect" | "verticalAlign" | "whiteSpace" | "width" | "wordWrap" | "writingDirection" | "x" | "y" | "zIndex"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
}> & {
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
    color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
    fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
    fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
    fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
    fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
    letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
    textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
    textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
} & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
    autoCorrect?: boolean | 'on' | 'off';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
    spellCheck?: boolean;
    rows?: number;
    placeholderTextColor?: import("@tamagui/ui").ColorTokens;
    selectionColor?: import("@tamagui/ui").ColorTokens;
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
    textContentType?: import("@tamagui/ui").InputTextContentType;
}, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: string | undefined;
    readonly selectionColor?: string | undefined;
    readonly cursorColor?: string | undefined;
    readonly selectionHandleColor?: string | undefined;
    readonly underlineColorAndroid?: string | undefined;
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
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "autoCapitalize" | "autoCorrect" | "children" | "className" | "color" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "size" | "spellCheck" | "style" | "textAlign" | "textTransform"> & {
        color?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined>;
        fontFamily?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined>;
        fontSize?: import("@tamagui/web").FlatStyleValue<import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined>;
        fontStyle?: import("@tamagui/web").FlatStyleValue<"italic" | "normal" | "unset" | undefined>;
        fontWeight?: import("@tamagui/web").FlatStyleValue<"unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined>;
        letterSpacing?: import("@tamagui/web").FlatStyleValue<"unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined>;
        textAlign?: import("@tamagui/web").FlatStyleValue<"auto" | "center" | "justify" | "left" | "right" | "unset" | undefined>;
        textTransform?: import("@tamagui/web").FlatStyleValue<"capitalize" | "lowercase" | "none" | "unset" | "uppercase" | undefined>;
    } & Omit<import("@tamagui/ui").InputNativeProps, "autoCapitalize" | "autoCorrect" | "spellCheck"> & {
        autoCorrect?: boolean | 'on' | 'off';
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on';
        spellCheck?: boolean;
        rows?: number;
        placeholderTextColor?: import("@tamagui/ui").ColorTokens;
        selectionColor?: import("@tamagui/ui").ColorTokens;
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
        textContentType?: import("@tamagui/ui").InputTextContentType;
    }, import("@tamagui/web").StackStyleBase & import("@tamagui/web").TextStylePropsBase & {
        readonly placeholderTextColor?: string | undefined;
        readonly selectionColor?: string | undefined;
        readonly cursorColor?: string | undefined;
        readonly selectionHandleColor?: string | undefined;
        readonly underlineColorAndroid?: string | undefined;
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
export type InputProps = GetProps<typeof Input>;
export type TextAreaProps = GetProps<typeof TextArea>;
//# sourceMappingURL=Input.d.ts.map