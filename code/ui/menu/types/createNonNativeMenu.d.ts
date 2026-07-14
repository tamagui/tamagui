import type * as BaseMenuTypes from '@tamagui/create-menu';
import { type MenuArrowProps as BaseMenuArrowProps, type MenuCheckboxItemProps as BaseMenuCheckboxItemProps, type MenuContentProps as BaseMenuContentProps, type MenuGroupProps as BaseMenuGroupProps, type MenuItemIndicatorProps as BaseMenuItemIndicatorProps, type MenuItemProps as BaseMenuItemProps, type MenuLabelProps as BaseMenuLabelProps, type MenuPortalProps as BaseMenuPortalProps, type MenuRadioGroupProps as BaseMenuRadioGroupProps, type MenuRadioItemProps as BaseMenuRadioItemProps, type MenuSubContentProps as BaseMenuSubContentProps, type MenuSubTriggerProps as BaseMenuSubTriggerProps } from '@tamagui/create-menu';
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
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuTriggerProps> & MenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: import("@tamagui/core").RefComponent<TamaguiElement, ScopedProps<MenuContentProps>>;
    Group: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuGroupProps, import("@tamagui/core").StackStyleBase, {}, {}>;
    Label: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").TextProps, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & BaseMenuTypes.MenuLabelProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
    Item: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemProps> & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    CheckboxItem: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuCheckboxItemProps> & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    RadioGroup: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    RadioItem: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuRadioItemProps> & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    ItemIndicator: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, {}, {}>;
    Separator: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, TamaguiElement, import("@tamagui/core").StackNonStyleProps & BaseMenuTypes.MenuSeparatorProps, import("@tamagui/core").StackStyleBase, {}, {}>;
    Arrow: import("@tamagui/core").RefComponent<TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/core").RefProp<TamaguiElement>, "ref">>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/core").RefComponent<TamaguiElement, BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    }>;
    SubContent: import("@tamagui/core").RefComponent<TamaguiElement, ScopedProps<BaseMenuTypes.MenuSubContentProps>>;
    ItemTitle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").TextProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
    ItemSubtitle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").TextProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
    ItemImage: import("@tamagui/core").RefComponent<TamaguiElement, import("@tamagui/image").ImageProps>;
    ItemIcon: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>, import("@tamagui/core").StackStyleBase, {}, {}>;
    ScrollView: React.FunctionComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        ref?: React.Ref<import("@tamagui/scroll-view").ScrollViewRef> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/core").StaticConfigPublic> & Omit<{
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        } & import("@tamagui/core").StaticConfigPublic];
    };
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuScrollViewProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map