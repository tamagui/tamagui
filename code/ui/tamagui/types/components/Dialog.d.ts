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
export declare const DialogOverlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, "elevation" | "open" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const DialogContent: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
}, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
}, import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
    }, import("@tamagui/core").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
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
} & import("@tamagui/core").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: import("@tamagui/core").RefComponent<TamaguiElement, import("@tamagui/dialog").DialogPortalProps>;
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
    Overlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, "elevation" | "open" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | false | import("@tamagui/core").Size | undefined;
        }>, "elevation"> & import("@tamagui/stacks").StackVariants & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/dialog").DialogScopes;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | false | import("@tamagui/core").Size | undefined;
            open?: boolean | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
    }, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
    }, import("@tamagui/core").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
            elevation?: number | false | import("@tamagui/core").Size | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        }, import("@tamagui/core").StackStyleBase, {
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
            elevation?: number | false | import("@tamagui/core").Size | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map