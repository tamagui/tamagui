import { type MenuProps, type MenuSubProps, createMenu } from '@tamagui/menu';
import type { Menu as MenuTypes } from '@tamagui/menu';
import * as React from 'react';
import { Button, type TamaguiElement } from 'tamagui';
type Direction = 'ltr' | 'rtl';
export declare const DROPDOWN_MENU_CONTEXT = "DropdownMenuContext";
type ScopedProps<P> = P & {
    __scopeDropdownMenu?: string;
};
interface DropdownMenuProps extends MenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {
    onKeydown?(event: React.KeyboardEvent): void;
}
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Portal>;
interface DropdownMenuPortalProps extends MenuPortalProps {
}
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Content>;
interface DropdownMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {
}
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Group>;
type DropdownMenuGroupProps = MenuGroupProps & {};
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Label>;
type DropdownMenuLabelProps = MenuLabelProps & {};
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Item>;
interface DropdownMenuItemProps extends MenuItemProps {
}
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.CheckboxItem>;
interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioGroup>;
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {
}
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioItem>;
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {
}
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuTypes.ItemIndicator>;
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Arrow>;
type DropdownMenuArrowProps = MenuArrowProps & {};
interface DropdownMenuSubProps extends MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubTrigger>;
interface DropdownMenuSubTriggerProps extends MenuSubTriggerProps {
}
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubContent>;
interface DropdownMenuSubContentProps extends MenuSubContentProps {
}
export declare function createNonNativeDropdownMenu(params: Parameters<typeof createMenu>[0]): {
    (props: ScopedProps<DropdownMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<DropdownMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof DropdownMenuTriggerProps | "__scopeDropdownMenu"> & DropdownMenuTriggerProps & {
        __scopeDropdownMenu?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DropdownMenuTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Portal: {
        (props: ScopedProps<DropdownMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<DropdownMenuContentProps & {
        __scopeDropdownMenu?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Group: import("tamagui").TamaguiComponent;
    Label: import("tamagui").TamaguiComponent;
    Item: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemProps> & import("@tamagui/menu").MenuItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof DropdownMenuItemProps> & DropdownMenuItemProps & {
        __scopeDropdownMenu?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuItemProps & {
        __scopeMenu?: string;
    } & DropdownMenuItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    CheckboxItem: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuCheckboxItemProps> & import("@tamagui/menu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof DropdownMenuCheckboxItemProps> & DropdownMenuCheckboxItemProps & {
        __scopeDropdownMenu?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    } & DropdownMenuCheckboxItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    RadioGroup: React.ForwardRefExoticComponent<Omit<ScopedProps<DropdownMenuRadioGroupProps>, "ref"> & React.RefAttributes<any>>;
    RadioItem: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuRadioItemProps> & import("@tamagui/menu").MenuRadioItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof DropdownMenuRadioItemProps> & DropdownMenuRadioItemProps & {
        __scopeDropdownMenu?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuRadioItemProps & {
        __scopeMenu?: string;
    } & DropdownMenuRadioItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ItemIndicator: import("tamagui").TamaguiComponent<Omit<Omit<any, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemIndicatorProps> & import("@tamagui/menu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    }, keyof DropdownMenuItemIndicatorProps> & DropdownMenuItemIndicatorProps & {
        __scopeDropdownMenu?: string;
    }, any, import("@tamagui/menu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    } & DropdownMenuItemIndicatorProps & {
        __scopeDropdownMenu?: string;
    }, {}, {}, {}>;
    Separator: import("tamagui").TamaguiComponent;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/menu").MenuArrowProps & {
        __scopeMenu?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        __scopeDropdownMenu?: string;
    } & React.RefAttributes<TamaguiElement>>;
    Sub: {
        (props: ScopedProps<DropdownMenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, "__scopeDropdownMenu" | keyof DropdownMenuSubTriggerProps> & DropdownMenuSubTriggerProps & {
        __scopeDropdownMenu?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DropdownMenuSubTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    SubContent: React.ForwardRefExoticComponent<DropdownMenuSubContentProps & {
        __scopeDropdownMenu?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    ItemIcon: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
};
export type { DropdownMenuProps, DropdownMenuTriggerProps, DropdownMenuPortalProps, DropdownMenuContentProps, DropdownMenuGroupProps, DropdownMenuLabelProps, DropdownMenuItemProps, DropdownMenuCheckboxItemProps, DropdownMenuRadioGroupProps, DropdownMenuRadioItemProps, DropdownMenuItemIndicatorProps, DropdownMenuArrowProps, DropdownMenuSubProps, DropdownMenuSubTriggerProps, DropdownMenuSubContentProps, };
//# sourceMappingURL=createNonNativeDropdownMenu.d.ts.map