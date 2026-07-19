import { type TamaguiElement } from '@tamagui/ui';
import type * as React from 'react';
export declare const DialogOverlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "elevation" | keyof import("@tamagui/web").StackStyleBase | "open"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const DialogContent: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
}, "onPointerDownCapture" | "context"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
}, "onPointerDownCapture" | "context"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
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
    Trigger: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Portal: import("@tamagui/ui").RefComponent<TamaguiElement, import("@tamagui/ui").DialogPortalProps>;
    Title: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Description: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Close: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | "displayWhenAdapted"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
    Overlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "elevation" | keyof import("@tamagui/web").StackStyleBase | "open"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "elevate" | "bordered"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
            elevation?: number | import("@tamagui/web").Size | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
        } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
            elevation?: number | import("@tamagui/web").Size | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
        } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
        }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
            trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
            onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
            onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
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
                open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
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
                open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
            };
        }, "onPointerDownCapture" | "context"> & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map