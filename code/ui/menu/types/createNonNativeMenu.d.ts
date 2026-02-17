import type * as BaseMenuTypes from '@tamagui/create-menu';
import { type MenuArrowProps as BaseMenuArrowProps, type MenuCheckboxItemProps as BaseMenuCheckboxItemProps, type MenuContentProps as BaseMenuContentProps, type MenuGroupProps as BaseMenuGroupProps, type MenuItemIndicatorProps as BaseMenuItemIndicatorProps, type MenuItemProps as BaseMenuItemProps, type MenuLabelProps as BaseMenuLabelProps, type MenuPortalProps as BaseMenuPortalProps, type MenuRadioGroupProps as BaseMenuRadioGroupProps, type MenuRadioItemProps as BaseMenuRadioItemProps, type MenuSubContentProps as BaseMenuSubContentProps, type MenuSubTriggerProps as BaseMenuSubTriggerProps, type CreateBaseMenuProps } from '@tamagui/create-menu';
import { type ScrollViewProps } from '@tamagui/scroll-view';
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
interface MenuTriggerProps extends ViewProps {
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
    } & React.RefAttributes<TamaguiElement>>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuGroupProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemProps> & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    CheckboxItem: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuCheckboxItemProps> & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    RadioGroup: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    RadioItem: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioItemProps> & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuSeparatorProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Arrow: React.ForwardRefExoticComponent<BaseMenuTypes.MenuArrowProps & React.RefAttributes<TamaguiElement>>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: React.ForwardRefExoticComponent<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    SubContent: React.ForwardRefExoticComponent<BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("react-native").ScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }, {
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/web").StaticConfigPublic>;
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuScrollViewProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map