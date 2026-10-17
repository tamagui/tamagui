import { type TamaguiElement } from '@tamagui/core';
import type * as React from 'react';
export declare const dialogOverlayStyles: {
    readonly backgroundColor: 'background';
};
export declare const dialogContentStyles: {
    readonly backgroundColor: 'background';
    readonly borderWidth: 1;
    readonly borderColor: 'border-color';
    readonly padding: '4';
    readonly borderRadius: '4';
    readonly elevate: true;
};
export declare const DialogOverlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope"> & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "forceMount" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const DialogContent: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus"> & Omit<Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
    context: {
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
        open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/dialog").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
    };
    onTransition?: import("@tamagui/core").OnTransition;
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus">, import("@tamagui/core").StaticConfigPublic>;
export declare const Dialog: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<TamaguiElement, {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    disableRemoveScroll?: boolean;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & import("@tamagui/core").RefProp<TamaguiElement>>, {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Portal: import("@tamagui/core").RefComponent<TamaguiElement, import("@tamagui/dialog").DialogPortalProps>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "displayWhenAdapted" | "scope"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "displayWhenAdapted" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: import("@tamagui/core").Combined<(props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element, {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    }>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope"> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "forceMount" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus"> & Omit<Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/core").OnTransition;
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "branches" | "children" | "disableOutsidePointerEvents" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onInteractOutside" | "onOpenAutoFocus" | "onPointerDownOutside" | "onTransition" | "scope" | "trapFocus">, import("@tamagui/core").StaticConfigPublic>;
}>;
//# sourceMappingURL=Dialog.d.ts.map