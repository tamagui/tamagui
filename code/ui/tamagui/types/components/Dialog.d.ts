import { type TamaguiElement } from '@tamagui/ui';
import type * as React from 'react';
export declare const dialogOverlayStyles: {
    readonly backgroundColor: 'background';
};
export declare const dialogContentStyles: {
    readonly backgroundColor: 'background';
    readonly borderWidth: 1;
    readonly borderColor: 'border-color';
    readonly padding: number | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {});
    readonly borderRadius: number | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {});
    readonly elevate: true;
};
export declare const DialogOverlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
}>, "elevation"> & import("@tamagui/ui").StackVariants & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "elevation" | "open" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    open?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
}>, "elevation"> & import("@tamagui/ui").StackVariants & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const DialogContent: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
    };
    onTransition?: import("@tamagui/web").OnTransition;
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
        open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
    };
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
        open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
    };
    onTransition?: import("@tamagui/web").OnTransition;
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
        open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
    };
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/web").OnTransition;
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
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
    scope?: import("@tamagui/ui").DialogScopes;
} & import("@tamagui/ui").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | keyof import("@tamagui/ui").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/ui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Portal: import("@tamagui/ui").RefComponent<TamaguiElement, import("@tamagui/ui").DialogPortalProps>;
    Title: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").Text | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Description: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").Text | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Close: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: ((props: import("@tamagui/ui").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/ui").AdaptContents;
    };
    Overlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "elevation" | "open" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
        }>, "elevation"> & import("@tamagui/ui").StackVariants & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            open?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/web").OnTransition;
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/web").OnTransition;
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
            open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
            elevation?: number | import("@tamagui/web").Size | undefined;
        } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
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
                open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
            };
            onTransition?: import("@tamagui/web").OnTransition;
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
                open: Exclude<import("@tamagui/ui").DialogProps['open'], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps['onOpenChange'], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps['modal'], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps['onAnimationComplete'];
            };
        }, "context" | "onPointerDownCapture"> & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
            elevation?: number | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map