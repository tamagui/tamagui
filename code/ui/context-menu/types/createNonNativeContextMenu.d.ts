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
    defaultOpen?: boolean;
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
    (props: ScopedProps<ContextMenuProps>): React.JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<ContextMenuProps>): React.JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof ContextMenuTriggerProps>, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): React.JSX.Element;
        displayName: string;
    };
    Content: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof BaseMenuTypes.MenuContentProps> & BaseMenuTypes.MenuContentProps & {
        scope?: string;
    }, keyof ContextMenuContentProps> & ContextMenuContentProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, keyof BaseMenuTypes.MenuContentProps>, keyof ContextMenuContentProps>, import("@tamagui/web").StaticConfigPublic>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof BaseMenuTypes.MenuGroupProps>, {}>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuTypes.MenuLabelProps>, {}>;
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
    RadioGroup: import("@tamagui/compose-refs").RefComponent<import("@tamagui/react-native-types/src").ReactNativeElement | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), ScopedProps<Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
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
    }, TamaguiElement, Omit<Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & Omit<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps>, {}>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, import("@tamagui/web").StackStyleBase, Omit<{}, keyof BaseMenuTypes.MenuSeparatorProps>, {}>;
    Arrow: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<Omit<Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref">>>;
    Sub: {
        (props: ScopedProps<ContextMenuSubProps>): React.JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "scope" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope" | keyof BaseMenuTypes.MenuSubTriggerProps>, {}>;
    SubContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof BaseMenuTypes.MenuSubContentProps> & BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    }, "download" | "onLayout" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "rel" | keyof BaseMenuTypes.MenuSubContentProps> & Omit<Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof BaseMenuTypes.MenuSubContentProps> & BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    }, never> & Omit<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<Omit<{}, keyof BaseMenuTypes.MenuSubContentProps>> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, "download" | "onLayout" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "rel" | keyof BaseMenuTypes.MenuSubContentProps> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, keyof BaseMenuTypes.MenuSubContentProps>, "download" | "onLayout" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "rel" | keyof BaseMenuTypes.MenuSubContentProps>, import("@tamagui/web").StaticConfigPublic>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuTypes.MenuItemTitleProps>, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").TextProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, Omit<import("@tamagui/web").TextNonStyleProps, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, Omit<{}, keyof BaseMenuTypes.MenuItemSubTitleProps>, {}>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, never>> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>, import("@tamagui/web").StackStyleBase, Omit<{}, keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase>, {}>;
    ItemImage: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("@tamagui/image").ImageProps>;
    Preview: () => null;
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuOpenChangeEvent, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map