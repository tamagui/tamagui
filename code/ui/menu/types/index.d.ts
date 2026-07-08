import '@tamagui/polyfill-dev';
export declare const Menu: import("react").FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & Partial<Omit<import("@tamagui/create-menu").NativeMenuProps, keyof import("./createNonNativeMenu").MenuProps>>> & {
    readonly Trigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").MenuTriggerProps, "scope" | "ref" | keyof import("./createNonNativeMenu").MenuTriggerProps>>>;
    readonly Portal: import("react").FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & Partial<Omit<import("react").FragmentProps, "scope" | keyof import("@tamagui/create-menu").MenuPortalProps>>>;
    readonly Content: import("react").FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuContentProps, "ref" | keyof import("./createNonNativeMenu").MenuContentProps>>>;
    readonly Group: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuGroupProps, "ref" | keyof import("@tamagui/create-menu").MenuGroupProps>>>;
    readonly Label: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuLabelProps, "elevation" | "fontFamily" | "fontSize" | "color" | "textShadowColor" | "lineHeight" | "fontWeight" | "letterSpacing" | "size" | "ref" | "fontStyle" | "fontVariant" | "textAlign" | "textDecorationColor" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textTransform" | "whiteSpace" | "wordWrap" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "maxFontSizeMultiplier" | "minimumFontScale" | "pressRetentionOffset" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | "textShadowOffset" | "textShadowRadius" | "writingDirection" | "textAlignVertical" | "includeFontPadding" | "ellipsis" | "textDecorationDistance" | keyof import("@tamagui/create-menu").MenuLabelProps>>>;
    readonly Item: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemProps> & import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuItemProps>>>;
    readonly CheckboxItem: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps> & import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<Omit<import("@tamagui/create-menu").NativeMenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps>>>;
    readonly RadioGroup: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuRadioGroupProps>>>;
    readonly RadioItem: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps> & import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuRadioItemProps>>>;
    readonly ItemIndicator: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemIndicatorProps, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps>>>;
    readonly Separator: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSeparatorProps, "ref" | keyof import("@tamagui/create-menu").MenuSeparatorProps>>>;
    readonly Arrow: import("react").FC<import("@tamagui/create-menu").MenuArrowProps & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuArrowProps, "ref" | keyof import("@tamagui/create-menu").MenuArrowProps>>>;
    readonly Sub: import("react").FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubProps, "defaultOpen" | keyof import("@tamagui/create-menu").MenuSubProps>>>;
    readonly SubTrigger: import("react").FC<import("@tamagui/create-menu").MenuSubTriggerProps & {
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
    } & {
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuSubTriggerProps>>>;
    readonly SubContent: import("react").FC<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubContentProps, "ref" | keyof import("@tamagui/create-menu").MenuSubContentProps>>>;
    readonly ItemTitle: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemTitleProps, "size" | "ref" | keyof import("@tamagui/create-menu").MenuItemTitleProps>>>;
    readonly ItemSubtitle: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemSubtitleProps, "size" | "ref" | keyof import("@tamagui/create-menu").MenuItemSubTitleProps>>>;
    readonly ItemIcon: import("react").FC<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | "ref" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>>>>;
    readonly ItemImage: import("react").FC<import("react-native").ImageProps & import("@tamagui/compose-refs").RefProp<import("react-native").Image> & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }, "ref" | keyof import("react-native").ImageProps>>>;
    readonly ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("react-native").ScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }, {
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/web").StaticConfigPublic> | {
        ({ children }: {
            children: React.ReactNode;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
//# sourceMappingURL=index.d.ts.map