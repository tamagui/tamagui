import type * as BaseMenuTypes from '@tamagui/create-menu';
import { createBaseMenu } from '@tamagui/create-menu';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import React from 'react';
type Direction = 'ltr' | 'rtl';
export declare const CONTEXTMENU_CONTEXT = "ContextMenuContext";
type ScopedProps<P> = P & {
    scope?: string;
};
type BaseMenu = ReturnType<typeof createBaseMenu>['Menu'];
type ContextMenuOpenChangeEvent = {
    preventDefault(): void;
    defaultPrevented: boolean;
};
interface ContextMenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean, event?: ContextMenuOpenChangeEvent): void;
    dir?: Direction;
    modal?: boolean;
}
interface ContextMenuTriggerProps extends ViewProps {
    disabled?: boolean;
}
type ContextMenuPortalProps = React.ComponentPropsWithoutRef<BaseMenu['Portal']>;
interface ContextMenuContentProps extends Omit<React.ComponentPropsWithoutRef<BaseMenu['Content']>, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {
}
type ContextMenuGroupProps = React.ComponentPropsWithoutRef<BaseMenu['Group']>;
type ContextMenuItemProps = React.ComponentPropsWithoutRef<BaseMenu['Item']>;
type ContextMenuItemImageProps = React.ComponentPropsWithoutRef<BaseMenu['ItemImage']>;
type ContextMenuItemIconProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIcon']>;
type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<BaseMenu['CheckboxItem']>;
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<BaseMenu['RadioGroup']>;
type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<BaseMenu['RadioItem']>;
type ContextMenuItemIndicatorProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIndicator']>;
type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<BaseMenu['Separator']>;
type ContextMenuArrowProps = React.ComponentPropsWithoutRef<BaseMenu['Arrow']>;
interface ContextMenuSubProps extends BaseMenuTypes.MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<BaseMenu['SubTrigger']>;
type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<BaseMenu['SubContent']>;
export declare function createNonNativeContextMenu(): {
    (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: import("@tamagui/compose-refs").RefComponent<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, ScopedProps<ContextMenuContentProps>>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuGroupProps, import("@tamagui/web").StackStyleBase, {}, {}>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    Item: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemProps> & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref">>>;
    CheckboxItem: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuCheckboxItemProps> & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref">>>;
    RadioGroup: import("@tamagui/compose-refs").RefComponent<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, ScopedProps<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref">>>;
    RadioItem: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuRadioItemProps> & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref">>>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuSeparatorProps, import("@tamagui/web").StackStyleBase, {}, {}>;
    Arrow: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<Omit<Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref">>>;
    Sub: {
        (props: ScopedProps<ContextMenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: import("@tamagui/compose-refs").RefComponent<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, ScopedProps<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, keyof BaseMenuTypes.MenuSubContentProps> & BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    } & {
        ref?: React.Ref<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> | undefined;
    }, "ref">>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, import("@tamagui/web").StackStyleBase, {}, {}>;
    ItemImage: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("@tamagui/image").ImageProps>;
    Preview: () => null;
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuOpenChangeEvent, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map