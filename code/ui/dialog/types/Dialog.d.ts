import type { GetProps, OnTransition, TamaguiElement, ViewProps } from '@tamagui/core';
import type { DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
export type DialogScopes = string;
type ScopedProps<P> = P & {
    scope?: DialogScopes;
};
type DialogProps = ScopedProps<{
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * Called when the dialog open/close animation completes.
     */
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
}>;
type DialogContextValue = {
    forceMount?: boolean;
    keepChildrenMounted?: boolean;
    disableRemoveScroll?: boolean;
    hasPresentParts: boolean;
    setPartPresence(id: string, present: boolean): void;
    triggerRef: React.RefObject<TamaguiElement | null>;
    contentRef: React.RefObject<TamaguiElement | null>;
    contentId: string;
    titleId: string;
    descriptionId: string;
    onOpenToggle(): void;
    open: Exclude<DialogProps['open'], void | null>;
    onOpenChange: Exclude<DialogProps['onOpenChange'], void | null>;
    modal: Exclude<DialogProps['modal'], void | null>;
    dialogScope: DialogScopes;
    adaptScope: string;
    onAnimationComplete?: DialogProps['onAnimationComplete'];
};
export declare const DialogContext: import("@tamagui/core").StyledContext<DialogContextValue, never>;
export declare const useDialogContext: (scope?: string) => DialogContextValue, DialogProvider: React.Provider<DialogContextValue> & React.ProviderExoticComponent<Partial<DialogContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
type DialogTriggerProps = ScopedProps<ViewProps>;
declare const DialogTrigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
type DialogPortalProps = ScopedProps<YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
export declare const DialogPortalFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogPortal: import("@tamagui/compose-refs").RefComponent<TamaguiElement, DialogPortalProps>;
export declare const DialogOverlayFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type DialogOverlayExtraProps = ScopedProps<{
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
type DialogOverlayProps = YStackProps & DialogOverlayExtraProps;
declare const DialogOverlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope"> & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "forceMount" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const DialogContentFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
type DialogContentExtraProps = ScopedProps<Omit<DialogContentImplExtraProps, 'context' | 'onPointerDownCapture'>>;
type DialogContentProps = DialogContentFrameProps & DialogContentExtraProps;
declare const DialogContent: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus"> & Omit<DialogContentImplExtraProps, "context" | "onPointerDownCapture"> & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus">, import("@tamagui/core").StaticConfigPublic>;
type DialogContentImplExtraProps = Omit<DismissableProps, 'onDismiss'> & {
    /**
     * When `true`, focus cannot escape the `Content` via keyboard,
     * pointer, or a programmatic focus.
     * @defaultValue false
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Event handler called when auto-focusing on open.
     * Can be canceled.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close.
     * Can be canceled.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    context: DialogContextValue;
    onTransition?: OnTransition;
};
declare const DialogTitleFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogTitleExtraProps = ScopedProps<{}>;
type DialogTitleProps = DialogTitleExtraProps & GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
    scope?: DialogScopes;
}, import("@tamagui/core").TextStylePropsBase, Omit<{
    size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    unstyled?: boolean | undefined;
}, "scope">, import("@tamagui/core").StaticConfigPublic>;
declare const DialogDescriptionFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogDescriptionExtraProps = ScopedProps<{}>;
type DialogDescriptionProps = DialogDescriptionExtraProps & GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
    scope?: DialogScopes;
}, import("@tamagui/core").TextStylePropsBase, Omit<{
    size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
}, "scope">, import("@tamagui/core").StaticConfigPublic>;
declare const DialogCloseFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type DialogCloseExtraProps = ScopedProps<{
    displayWhenAdapted?: boolean;
}>;
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps;
declare const DialogClose: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "displayWhenAdapted" | "scope"> & {
    displayWhenAdapted?: boolean;
} & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "displayWhenAdapted" | "scope">, import("@tamagui/core").StaticConfigPublic>;
declare const DialogWarningProvider: (props: {
    contentName: string;
    titleName: string;
    docsSlug: string;
} & {
    children: React.ReactNode;
}) => React.JSX.Element;
declare const Dialog: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<TamaguiElement, DialogProps>, {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Portal: import("@tamagui/compose-refs").RefComponent<TamaguiElement, DialogPortalProps>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope"> & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "forceMount" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus"> & Omit<DialogContentImplExtraProps, "context" | "onPointerDownCapture"> & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus">, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "displayWhenAdapted" | "scope"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "displayWhenAdapted" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: import("@tamagui/helpers").Combined<(props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element, {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    }>;
}>;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DialogWarningProvider, };
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps, };
//# sourceMappingURL=Dialog.d.ts.map