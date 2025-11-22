import type BaseMenuTypes from '@tamagui/create-menu';
import { createBaseMenu, type CreateBaseMenuProps, type MenuItemIconProps, type MenuItemImageProps } from '@tamagui/create-menu';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
type BaseMenu = ReturnType<typeof createBaseMenu>['Menu'];
interface ContextMenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
interface ContextMenuTriggerProps extends ViewProps {
    disabled?: boolean;
}
type MenuPortalProps = React.ComponentPropsWithoutRef<BaseMenu['Portal']>;
interface ContextMenuPortalProps extends MenuPortalProps {
}
type MenuContentProps = React.ComponentPropsWithoutRef<BaseMenu['Content']>;
interface ContextMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {
}
type MenuGroupProps = React.ComponentPropsWithoutRef<BaseMenu['Group']>;
type ContextMenuGroupProps = MenuGroupProps & {};
type MenuItemProps = React.ComponentPropsWithoutRef<BaseMenu['Item']>;
interface ContextMenuItemProps extends MenuItemProps {
}
type ContextMenuItemImageProps = MenuItemImageProps;
type ContextMenuItemIconProps = MenuItemIconProps;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<BaseMenu['CheckboxItem']>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<BaseMenu['RadioGroup']>;
type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<BaseMenu['RadioItem']>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIndicator']>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
type MenuSeparatorProps = React.ComponentPropsWithoutRef<BaseMenu['Separator']>;
type ContextMenuSeparatorProps = MenuSeparatorProps & {};
type MenuArrowProps = React.ComponentPropsWithoutRef<BaseMenu['Arrow']>;
interface ContextMenuArrowProps extends MenuArrowProps {
}
interface ContextMenuSubProps extends BaseMenuTypes.MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<BaseMenu['SubTrigger']>;
type ContextMenuSubTriggerProps = ScopedProps<MenuSubTriggerProps>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<BaseMenu['SubContent']>;
interface ContextMenuSubContentProps extends MenuSubContentProps {
}
export declare const CONTEXTMENU_CONTEXT = "ContextMenuContext";
export declare function createNonNativeContextMenu(param: CreateBaseMenuProps): {
    (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<ContextMenuContentProps & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Group: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    Label: import("@tamagui/web").TamaguiComponent;
    Item: React.ForwardRefExoticComponent<ContextMenuItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    RadioGroup: React.ForwardRefExoticComponent<Omit<ScopedProps<Omit<Omit<any, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref">>, "ref"> & React.RefAttributes<any>>;
    RadioItem: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}>, keyof ContextMenuItemIndicatorProps> & ContextMenuItemIndicatorProps & {
        scope?: string;
    }, any, BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & ContextMenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}, import("@tamagui/web").StaticConfigPublic>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<any, string | number | symbol> & Omit<any, "ref"> & {
        scope?: string;
    }, any, Omit<any, "ref"> & {
        scope?: string;
    }, {}, {}, {}>;
    Arrow: React.ForwardRefExoticComponent<ContextMenuArrowProps & React.RefAttributes<TamaguiElement>>;
    Sub: React.FC<ScopedProps<ContextMenuSubProps>>;
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, "scope" | "key" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemIcon: import("@tamagui/web").TamaguiComponent;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    Preview: {
        (): null;
        displayName: string;
    };
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map