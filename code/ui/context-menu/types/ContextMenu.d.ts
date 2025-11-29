import type { CreateBaseMenuProps } from '@tamagui/create-menu';
import React from 'react';
export declare function createContextMenu(param: CreateBaseMenuProps): React.FC<import("./createNonNativeContextMenu").ContextMenuProps & {
    scope?: string;
} & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps> & {
    Trigger: React.FC<Omit<import("@tamagui/web").StackProps, "scope" | keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps>;
    Portal: React.FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & {
        scope?: string;
    } & React.FragmentProps>;
    Content: React.FC<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps>;
    Group: React.FC<any>;
    Label: React.FC<any>;
    Item: React.FC<Omit<import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }>;
    CheckboxItem: React.FC<Omit<import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }>;
    RadioGroup: React.FC<Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    }, "ref"> & React.RefAttributes<any>>;
    RadioItem: React.FC<any>;
    ItemIndicator: React.FC<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, string | number | symbol> & Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps>;
    Separator: React.FC<any>;
    Arrow: React.FC<Omit<import("@tamagui/create-menu").MenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Sub: React.FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        scope?: string;
    } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps>;
    SubTrigger: React.FC<Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
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
    SubContent: React.FC<Omit<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps>;
    ItemTitle: React.FC<any>;
    ItemSubtitle: React.FC<any>;
    ItemIcon: React.FC<Omit<any, "ref"> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    ItemImage: React.FC<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }>;
    Preview: React.FC<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").ContextMenuPreviewProps>;
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, } from './createNonNativeContextMenu';
//# sourceMappingURL=ContextMenu.d.ts.map