import '@tamagui/polyfill-dev';
export declare const ContextMenu: import("react").FC<import("./createNonNativeContextMenu").ContextMenuProps & {
    scope?: string;
} & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps> & {
    Trigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps>;
    Portal: import("react").FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & {
        scope?: string;
    } & import("react").FragmentProps>;
    Content: import("react").FC<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps>;
    Group: import("react").FC<Omit<any, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuGroupProps>;
    Label: import("react").FC<Omit<any, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuLabelProps>;
    Item: import("react").FC<Omit<import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & {
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }>;
    CheckboxItem: import("react").FC<Omit<import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }>;
    RadioGroup: import("react").FC<Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & import("react").RefAttributes<any>, "ref"> & {
        scope?: string;
    }, "ref"> & import("react").RefAttributes<any>>;
    RadioItem: import("react").FC<any>;
    ItemIndicator: import("react").FC<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, string | number | symbol> & Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & import("react").RefAttributes<any>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps>;
    Separator: import("react").FC<Omit<any, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & import("react").RefAttributes<any>>;
    Arrow: import("react").FC<Omit<import("@tamagui/create-menu").MenuArrowProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Sub: import("react").FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        scope?: string;
    } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps>;
    SubTrigger: React.FC<Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
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
    SubContent: import("react").FC<Omit<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps>;
    ItemTitle: import("react").FC<Omit<any, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemTitleProps>;
    ItemSubtitle: import("react").FC<Omit<any, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemSubtitleProps>;
    ItemIcon: React.FC<Omit<Omit<any, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("react").RefAttributes<any>, "ref"> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    ItemImage: import("react").FC<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }>;
    Preview: import("react").FC<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").ContextMenuPreviewProps>;
};
//# sourceMappingURL=index.d.ts.map