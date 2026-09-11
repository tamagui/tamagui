import { type TamaguiElement } from '@tamagui/style';
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
export declare const DialogOverlay: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, "open" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    open?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const DialogContent: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
    onTransition?: import("@tamagui/style").OnTransition;
} & {
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
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
    onTransition?: import("@tamagui/style").OnTransition;
} & {
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
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/style").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        onTransition?: import("@tamagui/style").OnTransition;
    } & {
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
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const Dialog: ((props: {
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
} & import("@tamagui/style").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Portal: import("@tamagui/style").RefComponent<TamaguiElement, import("@tamagui/dialog").DialogPortalProps>;
    Title: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Description: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Close: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
    Overlay: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, "open" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        open?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/dialog").DialogScopes;
        }, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        onTransition?: import("@tamagui/style").OnTransition;
    } & {
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
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        onTransition?: import("@tamagui/style").OnTransition;
    } & {
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
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
        }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
            onTransition?: import("@tamagui/style").OnTransition;
        } & {
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
        }, "context" | "onPointerDownCapture"> & {
            scope?: import("@tamagui/dialog").DialogScopes;
        }, import("@tamagui/style").StackStyleBase, {
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map