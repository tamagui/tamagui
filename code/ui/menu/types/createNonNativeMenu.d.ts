import type * as BaseMenuTypes from '@tamagui/create-menu';
import { type MenuArrowProps as BaseMenuArrowProps, type MenuCheckboxItemProps as BaseMenuCheckboxItemProps, type MenuContentProps as BaseMenuContentProps, type MenuGroupProps as BaseMenuGroupProps, type MenuItemIndicatorProps as BaseMenuItemIndicatorProps, type MenuItemProps as BaseMenuItemProps, type MenuLabelProps as BaseMenuLabelProps, type MenuPortalProps as BaseMenuPortalProps, type MenuRadioGroupProps as BaseMenuRadioGroupProps, type MenuRadioItemProps as BaseMenuRadioItemProps, type MenuSeparatorProps as BaseMenuSeparatorProps, type MenuSubContentProps as BaseMenuSubContentProps, type MenuSubTriggerProps as BaseMenuSubTriggerProps } from '@tamagui/create-menu';
import { type ScrollViewProps } from '@tamagui/scroll-view';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
export declare const DROPDOWN_MENU_CONTEXT = "MenuContext";
type ScopedProps<P> = P & {
    scope?: string;
};
type MenuTriggerGroupProps = ViewProps & {
    dir?: Direction;
};
interface MenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
interface MenuTriggerProps extends ViewProps {
    /** @deprecated misspelled, use `onKeyDown` (this alias is honored when `onKeyDown` is absent) */
    onKeydown?(event: React.KeyboardEvent): void;
}
type MenuPortalProps = BaseMenuPortalProps;
interface MenuContentProps extends Omit<BaseMenuContentProps, 'onEntryFocus'> {
}
type MenuGroupProps = BaseMenuGroupProps;
type MenuLabelProps = BaseMenuLabelProps;
type MenuItemProps = BaseMenuItemProps;
type MenuCheckboxItemProps = BaseMenuCheckboxItemProps;
type MenuRadioGroupProps = BaseMenuRadioGroupProps;
type MenuRadioItemProps = BaseMenuRadioItemProps;
type MenuItemIndicatorProps = BaseMenuItemIndicatorProps;
type MenuArrowProps = BaseMenuArrowProps;
type MenuSubProps = BaseMenuTypes.MenuSubProps & {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
};
type MenuSubTriggerProps = BaseMenuSubTriggerProps;
type MenuSubContentProps = BaseMenuSubContentProps;
type MenuScrollViewProps = ScrollViewProps;
export declare function createNonNativeMenu(): {
    (props: ScopedProps<MenuProps>): React.JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<MenuProps>): React.JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuTriggerProps> & MenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof MenuTriggerProps> & MenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof MenuTriggerProps>, {}>;
    TriggerGroup: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "dir" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        dir?: Direction;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "dir" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        dir?: Direction;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "dir" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>, {}>;
    Portal: {
        (props: ScopedProps<MenuPortalProps>): React.JSX.Element;
        displayName: string;
    };
    Content: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof BaseMenuContentProps> & BaseMenuContentProps & {
        scope?: string;
    }, keyof MenuContentProps> & MenuContentProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, keyof BaseMenuContentProps>, keyof MenuContentProps>, import("@tamagui/web").StaticConfigPublic>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuGroupProps> & BaseMenuGroupProps, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof BaseMenuGroupProps> & BaseMenuGroupProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof BaseMenuGroupProps>, {}>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuLabelProps> & BaseMenuLabelProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuLabelProps> & BaseMenuLabelProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuLabelProps>, {}>;
    Item: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuItemProps> & BaseMenuItemProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuItemProps> & BaseMenuItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuItemProps>, {}>;
    CheckboxItem: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuCheckboxItemProps> & BaseMenuCheckboxItemProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuCheckboxItemProps> & BaseMenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuCheckboxItemProps>, {}>;
    RadioGroup: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuRadioGroupProps> & BaseMenuRadioGroupProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuRadioGroupProps> & BaseMenuRadioGroupProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuRadioGroupProps>, {}>;
    RadioItem: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuRadioItemProps> & BaseMenuRadioItemProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuRadioItemProps> & BaseMenuRadioItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuRadioItemProps>, {}>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuItemIndicatorProps> & BaseMenuItemIndicatorProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuItemIndicatorProps> & BaseMenuItemIndicatorProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuItemIndicatorProps>, {}>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuSeparatorProps> & BaseMenuSeparatorProps, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof BaseMenuSeparatorProps> & BaseMenuSeparatorProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof BaseMenuSeparatorProps>, {}>;
    Arrow: import("@tamagui/web").RefComponent<TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/web").RefProp<TamaguiElement>, "ref">>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): React.JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").RefComponent<TamaguiElement, BaseMenuSubTriggerProps & {
        scope?: string;
    }>;
    SubContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof BaseMenuSubContentProps> & BaseMenuSubContentProps & {
        scope?: string;
    }, keyof BaseMenuSubContentProps> & BaseMenuSubContentProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, keyof BaseMenuSubContentProps>, keyof BaseMenuSubContentProps>, import("@tamagui/web").StaticConfigPublic>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuTypes.MenuItemTitleProps>, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuTypes.MenuItemSubTitleProps>, {}>;
    ItemImage: import("@tamagui/web").RefComponent<TamaguiElement, import("@tamagui/image").ImageProps>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, import("@tamagui/web").StackStyleBase, Omit<{}, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>, {}>;
    ScrollView: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, string | number> & {
        ref?: React.Ref<import("@tamagui/scroll-view").ScrollViewRef> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/web").StaticConfigPublic> & Omit<{
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
            acceptsClassName: true;
            neverFlatten: true;
        } & import("@tamagui/web").StaticConfigPublic];
    };
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuScrollViewProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, MenuTriggerGroupProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map