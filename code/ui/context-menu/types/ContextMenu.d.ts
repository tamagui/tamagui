import type { CreateBaseMenuProps } from '@tamagui/create-menu';
import React from 'react';
export declare function createContextMenu(param: CreateBaseMenuProps): ({
    (props: import("./createNonNativeContextMenu").ContextMenuProps & {
        scope?: string;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} | {
    (props: import("./createNonNativeContextMenu").ContextMenuProps & {
        scope?: string;
    } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuProps & {
        native?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}) & {
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, "scope" | keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Portal: {
        (props: import("./createNonNativeContextMenu").ContextMenuPortalProps & {
            scope?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } | {
        (props: import("./createNonNativeContextMenu").ContextMenuPortalProps & {
            scope?: string;
        } & React.FragmentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Group: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Label: import("@tamagui/web").TamaguiComponent | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Item: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    CheckboxItem: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioGroup: React.ForwardRefExoticComponent<Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    }, "ref"> & React.RefAttributes<any>> | {
        (props: Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
            scope?: string;
        } & React.RefAttributes<any>, "ref"> & {
            scope?: string;
        }, "ref"> & React.RefAttributes<any> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioItem: React.ForwardRefExoticComponent<Omit<import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}>, keyof import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps> & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
        scope?: string;
    }, any, import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}, import("@tamagui/web").StaticConfigPublic> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Separator: import("@tamagui/web").TamaguiComponent<Omit<any, string | number | symbol> & Omit<any, "ref"> & {
        scope?: string;
    }, any, Omit<any, "ref"> & {
        scope?: string;
    }, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Arrow: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Sub: React.FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        scope?: string;
    }> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: React.FC<Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>, "ref"> & {
        scope?: string;
    } & {
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
    SubContent: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemTitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemIcon: React.FC<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Preview: {
        (): null;
        displayName: string;
    } | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, } from './createNonNativeContextMenu';
//# sourceMappingURL=ContextMenu.d.ts.map