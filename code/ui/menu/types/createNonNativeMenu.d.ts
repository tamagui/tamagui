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
export declare function createNonNativeMenu(): {
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
    Content: import("@tamagui/web").RefComponent<TamaguiElement, ScopedProps<MenuContentProps>>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuGroupProps> & BaseMenuGroupProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuGroupProps, import("@tamagui/web").StackStyleBase, {}, {}>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuLabelProps> & BaseMenuLabelProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuLabelProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    Item: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuItemProps> & BaseMenuItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    CheckboxItem: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuCheckboxItemProps> & BaseMenuCheckboxItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    RadioGroup: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuRadioGroupProps> & BaseMenuRadioGroupProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuRadioGroupProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    RadioItem: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuRadioItemProps> & BaseMenuRadioItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuRadioItemProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuItemIndicatorProps> & BaseMenuItemIndicatorProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuItemIndicatorProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuSeparatorProps> & BaseMenuSeparatorProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuSeparatorProps, import("@tamagui/web").StackStyleBase, {}, {}>;
    Arrow: import("@tamagui/web").RefComponent<TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/web").RefProp<TamaguiElement>, "ref">>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").RefComponent<TamaguiElement, BaseMenuSubTriggerProps & {
        scope?: string;
    }>;
    SubContent: import("@tamagui/web").RefComponent<TamaguiElement, ScopedProps<BaseMenuSubContentProps>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, {}, {}>;
    ItemImage: import("@tamagui/web").RefComponent<TamaguiElement, import("@tamagui/image").ImageProps>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, import("@tamagui/web").StackStyleBase, {}, {}>;
    ScrollView: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "contentContainerStyle" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }, {}>> & {
        ref?: React.Ref<import("@tamagui/scroll-view").ScrollViewRef> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        neverFlatten: true;
        accept: {
            readonly contentContainerStyle: 'style';
        };
    } & import("@tamagui/web").StaticConfigPublic> & Omit<{
        acceptsClassName: true;
        neverFlatten: true;
        accept: {
            readonly contentContainerStyle: 'style';
        };
    } & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                neverFlatten: true;
                accept: {
                    readonly contentContainerStyle: 'style';
                };
            }>> | undefined;
        }, {}, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        } & import("@tamagui/web").StaticConfigPublic];
    };
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuScrollViewProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map