import type { createMenu } from '@tamagui/create-menu';
import React from 'react';
export declare function createContextMenu(param: Parameters<typeof createMenu>[0]): ({
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
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps | "scope"> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}> | {
        (props: Omit<import("@tamagui/web").StackProps, keyof import("./createNonNativeContextMenu").ContextMenuTriggerProps | "scope"> & import("./createNonNativeContextMenu").ContextMenuTriggerProps & {
            scope?: string;
        } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
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
    Content: React.ForwardRefExoticComponent<Omit<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        scope?: string;
    }, "ref"> & React.RefAttributes<any>> | {
        (props: Omit<import("./createNonNativeContextMenu").ContextMenuContentProps & {
            scope?: string;
        }, "ref"> & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Group: any;
    Label: any;
    Item: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuItemProps & {
            scope?: string;
        } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
            children: React.ReactNode;
            textValue?: string;
        } & {
            disabled?: boolean;
            hidden?: boolean;
            destructive?: boolean;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    CheckboxItem: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuCheckboxItemProps & {
            scope?: string;
        } & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
            value: "mixed" | "on" | "off" | boolean;
            onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioGroup: React.ForwardRefExoticComponent<any> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioItem: React.ForwardRefExoticComponent<any> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<any, "scope"> & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
        scope?: string;
    }, any, any, any, any, any> | {
        (props: Omit<any, "scope"> & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
            scope?: string;
        } & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Separator: any;
    Arrow: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuArrowProps & React.RefAttributes<import("@tamagui/web").TamaguiElement> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Sub: React.FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        scope?: string;
    }> | {
        (props: import("./createNonNativeContextMenu").ContextMenuSubProps & {
            scope?: string;
        } & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: React.FC<any>;
    SubContent: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        scope?: string;
    } & React.RefAttributes<any>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuSubContentProps & {
            children?: React.ReactNode | undefined;
        } & {
            scope?: string;
        } & React.RefAttributes<any> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemTitle: any;
    ItemSubtitle: any;
    ItemIcon: React.FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeAndShorthands<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    ItemImage: any;
    Preview: {
        (): null;
        displayName: string;
    } | {
        (props: import("@tamagui/create-menu/types/createNativeMenu/createNativeMenuTypes").ContextMenuPreviewProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, } from './createNonNativeContextMenu';
//# sourceMappingURL=ContextMenu.d.ts.map