import '@tamagui/polyfill-dev';
export declare const Menu: import("react").FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps> & {
    readonly Trigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps>;
    readonly Portal: import("react").FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & {
        scope?: string;
    } & import("react").FragmentProps>;
    readonly Content: import("react").FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps>;
    readonly Group: import("react").FC<any>;
    readonly Label: import("react").FC<any>;
    readonly Item: import("react").FC<Omit<import("@tamagui/create-menu").MenuItemProps & {
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
    readonly CheckboxItem: import("react").FC<Omit<import("@tamagui/create-menu").MenuCheckboxItemProps & {
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
    readonly RadioGroup: import("react").FC<any>;
    readonly RadioItem: import("react").FC<any>;
    readonly ItemIndicator: import("react").FC<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, string | number | symbol> & Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & import("react").RefAttributes<any>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps>;
    readonly Separator: import("react").FC<any>;
    readonly Arrow: import("react").FC<Omit<import("@tamagui/create-menu").MenuArrowProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
    readonly Sub: import("react").FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps>;
    readonly SubTrigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | "key" | keyof import("@tamagui/create-menu").MenuSubTriggerProps> & Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
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
    } & {
        key: string;
    }>;
    readonly SubContent: import("react").FC<Omit<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>, "ref"> & {
        scope?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps>;
    readonly ItemTitle: import("react").FC<any>;
    readonly ItemSubtitle: import("react").FC<any>;
    readonly ItemIcon: import("react").FC<any>;
    readonly ItemImage: import("react").FC<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }>;
};
//# sourceMappingURL=index.d.ts.map