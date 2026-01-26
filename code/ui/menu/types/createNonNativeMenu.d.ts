import type BaseMenuTypes from '@tamagui/create-menu';
import { createBaseMenu, type CreateBaseMenuProps } from '@tamagui/create-menu';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
export declare const DROPDOWN_MENU_CONTEXT = "MenuContext";
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
type BaseMenu = ReturnType<typeof createBaseMenu>['Menu'];
interface MenuTriggerProps extends ViewProps {
    onKeydown?(event: React.KeyboardEvent): void;
}
type MenuPortalProps = React.ComponentPropsWithoutRef<BaseMenu['Portal']>;
interface MenuContentProps extends Omit<React.ComponentPropsWithoutRef<BaseMenu['Content']>, 'onEntryFocus'> {
}
type MenuGroupProps = React.ComponentPropsWithoutRef<BaseMenu['Group']>;
type MenuLabelProps = React.ComponentPropsWithoutRef<BaseMenu['Label']>;
type MenuItemProps = React.ComponentPropsWithoutRef<BaseMenu['Item']>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<BaseMenu['CheckboxItem']>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<BaseMenu['RadioGroup']>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<BaseMenu['RadioItem']>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIndicator']>;
type MenuArrowProps = React.ComponentPropsWithoutRef<BaseMenu['Arrow']>;
type MenuSubProps = BaseMenuTypes.MenuSubProps & {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
};
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<BaseMenu['SubTrigger']>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<BaseMenu['SubContent']>;
export declare function createNonNativeMenu(params: CreateBaseMenuProps): {
    (props: ScopedProps<MenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<MenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuTriggerProps> & MenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<MenuContentProps & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<any, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, any, BaseMenuTypes.MenuGroupProps, {}, {}, {}>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<any, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, any, BaseMenuTypes.MenuLabelProps, {}, {}, {}>;
    Item: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
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
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<Omit<any, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, string | number | symbol> & Omit<Omit<any, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    }, any, BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & Omit<Omit<any, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        scope?: string;
    }, {}, {}, {}>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<any, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, any, BaseMenuTypes.MenuSeparatorProps, {}, {}, {}>;
    Arrow: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuArrowProps & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | "key" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<any, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, any, BaseMenuTypes.MenuItemTitleProps, {}, {}, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<any, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, any, BaseMenuTypes.MenuItemSubTitleProps, {}, {}, {}>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<any, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, any, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, {}, {}, {}>;
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map