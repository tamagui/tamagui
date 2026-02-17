import { Dismissable as DismissableLayer } from '@tamagui/dismissable';
import { FocusScope } from '@tamagui/focus-scope';
import type { PopperContentProps } from '@tamagui/popper';
import * as PopperPrimitive from '@tamagui/popper';
import type { RovingFocusGroupProps } from '@tamagui/roving-focus';
import type { TextProps } from '@tamagui/web';
import { type ViewProps, View } from '@tamagui/web';
import type { TamaguiElement } from '@tamagui/web/types';
import * as React from 'react';
import type { Image, ImageProps } from 'react-native';
import { MenuPredefined } from './MenuPredefined';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuBaseProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
    native?: boolean;
}
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>;
interface MenuAnchorProps extends PopperAnchorProps {
}
interface MenuPortalProps {
    children?: React.ReactNode;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    zIndex?: number;
}
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {
}
type MenuContentImplElement = React.ElementRef<typeof PopperPrimitive.PopperContent>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type MenuContentImplPrivateProps = {
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    onDismiss?: DismissableLayerProps['onDismiss'];
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];
    /**
     * Whether scrolling outside the `MenuContent` should be prevented
     * (default: `false`)
     */
    disableOutsideScroll?: boolean;
    /**
     * Whether focus should be trapped within the `MenuContent`
     * (default: false)
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Whether to disable dismissing the menu when the user scrolls outside of it
     * (default: false, meaning scroll will dismiss on web)
     */
    disableDismissOnScroll?: boolean;
};
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    /**
     * Whether keyboard navigation should loop around
     * @defaultValue false
     */
    loop?: RovingFocusGroupProps['loop'];
    onEntryFocus?: RovingFocusGroupProps['onEntryFocus'];
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
    onFocusOutside?: DismissableLayerProps['onFocusOutside'];
    onInteractOutside?: DismissableLayerProps['onInteractOutside'];
}
interface MenuGroupProps extends ViewProps {
}
interface MenuLabelProps extends ViewProps {
}
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
    unstyled?: boolean;
}
interface MenuItemImplProps extends ViewProps {
    disabled?: boolean;
    textValue?: string;
    unstyled?: boolean;
}
interface MenuItemTitleProps extends TextProps {
}
interface MenuItemSubTitleProps extends TextProps {
}
type MenuItemIconProps = ViewProps;
type CheckedState = boolean | 'indeterminate';
interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState;
    onCheckedChange?: (checked: boolean) => void;
}
interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
interface MenuRadioItemProps extends MenuItemProps {
    value: string;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof View>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuSeparatorProps extends ViewProps {
}
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>;
interface MenuArrowProps extends PopperArrowProps {
    unstyled?: boolean;
}
export interface MenuSubProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
}
interface MenuSubTriggerProps extends MenuItemImplProps {
}
export type MenuSubContentElement = MenuContentImplElement;
export interface MenuSubContentProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
export type CreateBaseMenuProps = {
    Item?: typeof MenuPredefined.MenuItem;
    MenuGroup?: typeof MenuPredefined.MenuGroup;
    Title?: typeof MenuPredefined.Title;
    SubTitle?: typeof MenuPredefined.SubTitle;
    Image?: React.ElementType;
    Icon?: typeof MenuPredefined.MenuIcon;
    Indicator?: typeof MenuPredefined.MenuIndicator;
    Separator?: typeof MenuPredefined.MenuSeparator;
    Label?: typeof MenuPredefined.MenuLabel;
};
export declare function createBaseMenu({ Item: _Item, Title: _Title, SubTitle: _SubTitle, Image: _Image, Icon: _Icon, Indicator: _Indicator, Separator: _Separator, MenuGroup: _MenuGroup, Label: _Label, }: CreateBaseMenuProps): {
    Menu: {
        (props: ScopedProps<MenuBaseProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } & {
        Anchor: {
            (props: MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Portal: {
            (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof MenuContentProps> & MenuContentProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuContentProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Group: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, keyof MenuGroupProps> & MenuGroupProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuGroupProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>, keyof MenuLabelProps> & MenuLabelProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & MenuLabelProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuItemProps> & MenuItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuItemProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        CheckboxItem: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuCheckboxItemProps> & MenuCheckboxItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuCheckboxItemProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        RadioGroup: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuRadioGroupProps> & MenuRadioGroupProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuRadioGroupProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        RadioItem: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuRadioItemProps> & MenuRadioItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuRadioItemProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuItemIndicatorProps> & MenuItemIndicatorProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuItemIndicatorProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Separator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, keyof MenuSeparatorProps> & MenuSeparatorProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & MenuSeparatorProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Arrow: React.ForwardRefExoticComponent<MenuArrowProps & React.RefAttributes<TamaguiElement>>;
        Sub: React.FC<ScopedProps<MenuSubProps>>;
        SubTrigger: React.ForwardRefExoticComponent<MenuSubTriggerProps & {
            scope?: string;
        } & React.RefAttributes<TamaguiElement>>;
        SubContent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof MenuSubContentProps> & MenuSubContentProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuSubContentProps & {
            scope?: string;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>, keyof MenuItemTitleProps> & MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>, keyof MenuItemSubTitleProps> & MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        ItemImage: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<Image>>;
        ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, import("@tamagui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
    };
};
export type { MenuAnchorProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIconProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubTitleProps, MenuItemTitleProps, MenuLabelProps, MenuPortalProps, MenuBaseProps as MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuSeparatorProps, MenuSubTriggerProps, };
//# sourceMappingURL=createBaseMenu.d.ts.map