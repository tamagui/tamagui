import '@tamagui/polyfill-dev';
export declare const ContextMenu: import("react").FC<import("./createNonNativeContextMenu").ContextMenuProps & {
    scope?: string;
} & Partial<Omit<import("@tamagui/create-menu").NativeMenuProps, keyof import("./createNonNativeContextMenu").ContextMenuProps>>> & {
    Trigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").MenuTriggerProps, "ref" | "scope" | keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps>>>;
    Portal: import("react").FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & {
        scope?: string;
    } & Partial<Omit<import("react").FragmentProps, keyof import("@tamagui/create-menu").MenuPortalProps | "scope">>>;
    Content: import("react").FC<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> & Partial<Omit<import("@tamagui/create-menu").NativeMenuContentProps, "ref" | keyof import("./createNonNativeContextMenu").ContextMenuContentProps>>>;
    Group: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuGroupProps, "ref" | keyof import("@tamagui/create-menu").MenuGroupProps>>>;
    Label: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuLabelProps, "elevation" | "ref" | "size" | "fontFamily" | "fontSize" | "color" | "textShadowColor" | "lineHeight" | "fontWeight" | "letterSpacing" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | "fontStyle" | "textAlign" | "textDecorationLine" | "textDecorationStyle" | "textDecorationColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "fontVariant" | "writingDirection" | "textAlignVertical" | "includeFontPadding" | "ellipsis" | "textDecorationDistance" | "textOverflow" | "whiteSpace" | "wordWrap" | "textShadow" | keyof import("@tamagui/create-menu").MenuLabelProps>>>;
    Item: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemProps> & import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuItemProps>>>;
    CheckboxItem: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps> & import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<Omit<import("@tamagui/create-menu").NativeMenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps>>>;
    RadioGroup: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> & Partial<Omit<unknown, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps>>>;
    RadioItem: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps> & import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<any, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps>>>;
    ItemIndicator: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemIndicatorProps, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps>>>;
    Separator: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSeparatorProps, "ref" | keyof import("@tamagui/create-menu").MenuSeparatorProps>>>;
    Arrow: import("react").FC<Omit<import("@tamagui/create-menu").MenuArrowProps & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuArrowProps, "ref" | keyof import("@tamagui/create-menu").MenuArrowProps>>>;
    Sub: import("react").FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        scope?: string;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubProps, keyof import("./createNonNativeContextMenu").ContextMenuSubProps>>>;
    SubTrigger: React.FC<Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement>, "ref"> & {
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    } & {
        key: string;
    }>;
    SubContent: import("react").FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuSubContentProps> & import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubContentProps, "ref" | keyof import("@tamagui/create-menu").MenuSubContentProps>>>;
    ItemTitle: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemTitleProps, "ref" | "size" | keyof import("@tamagui/create-menu").MenuItemTitleProps>>>;
    ItemSubtitle: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemSubtitleProps, "ref" | "size" | keyof import("@tamagui/create-menu").MenuItemSubTitleProps>>>;
    ItemIcon: React.FC<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }, "ref"> & import("@tamagui/create-menu").NativeMenuItemCommonProps>;
    ItemImage: import("react").FC<import("react-native").ImageProps & import("@tamagui/compose-refs").RefProp<import("react-native").Image> & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }, "ref" | keyof import("react-native").ImageProps>>>;
    Preview: import("react").FC<Partial<Omit<import("@tamagui/create-menu").ContextMenuPreviewProps, never>>>;
};
//# sourceMappingURL=index.d.ts.map