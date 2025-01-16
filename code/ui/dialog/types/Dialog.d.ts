import type { GetProps, StackProps, TamaguiElement } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import type { DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import { RemoveScroll } from '@tamagui/remove-scroll';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
declare const createDialogScope: import("@tamagui/create-context").CreateScope;
type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;
interface DialogProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * @see https://github.com/theKashey/react-remove-scroll#usage
     */
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
}
type NonNull<A> = Exclude<A, void | null>;
type DialogContextValue = {
    disableRemoveScroll?: boolean;
    triggerRef: React.RefObject<TamaguiElement>;
    contentRef: React.RefObject<TamaguiElement>;
    contentId: string;
    titleId: string;
    descriptionId: string;
    onOpenToggle(): void;
    open: NonNull<DialogProps['open']>;
    onOpenChange: NonNull<DialogProps['onOpenChange']>;
    modal: NonNull<DialogProps['modal']>;
    allowPinchZoom: NonNull<DialogProps['allowPinchZoom']>;
    scopeKey: string;
};
interface DialogTriggerProps extends StackProps {
}
declare const DialogTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeDialog"> & {
    __scopeDialog?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeDialog?: Scope;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type DialogPortalProps = YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
};
export declare const DialogPortalFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogPortal: React.FC<DialogPortalProps>;
/**
 * exported for internal use with extractable()
 */
export declare const DialogOverlayFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type DialogOverlayExtraProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
};
type DialogOverlayProps = YStackProps & DialogOverlayExtraProps;
declare const DialogOverlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "__scopeDialog" | "forceMount"> & DialogOverlayExtraProps & {
    __scopeDialog?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogOverlayExtraProps & {
    __scopeDialog?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogContentFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
interface DialogContentProps extends DialogContentFrameProps, Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const DialogContent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "__scopeDialog" | keyof DialogContentProps> & DialogContentProps & {
    __scopeDialog?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogContentProps & {
    __scopeDialog?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogContentTypeExtraProps = Omit<DialogContentImplExtraProps, 'trapFocus' | 'disableOutsidePointerEvents'> & {
    context: DialogContextValue;
};
type DialogContentTypeProps = DialogContentImplProps & DialogContentTypeExtraProps;
type DialogContentImplExtraProps = Omit<DismissableProps, 'onDismiss'> & {
    /**
     * When `true`, focus cannot escape the `Content` via keyboard,
     * pointer, or a programmatic focus.
     * @defaultValue false
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Event handler called when auto-focusing on open.
     * Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    context: DialogContextValue;
};
type DialogContentImplProps = DialogContentFrameProps & DialogContentImplExtraProps;
declare const DialogTitleFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogTitleProps = GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogDescriptionFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogDescriptionProps = GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogCloseFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export interface DialogCloseExtraProps {
    displayWhenAdapted?: boolean;
}
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps;
declare const DialogClose: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeDialog" | "displayWhenAdapted"> & DialogCloseExtraProps & {
    __scopeDialog?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogCloseExtraProps & {
    __scopeDialog?: Scope;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogWarningProvider: {
    (props: {
        contentName: string;
        titleName: string;
        docsSlug: string;
    } & {
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export type DialogHandle = {
    open: (val: boolean) => void;
};
declare const Dialog: React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<{
    open: (val: boolean) => void;
}>> & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeDialog"> & {
        __scopeDialog?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeDialog?: Scope;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: React.FC<DialogPortalProps>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, "__scopeDialog" | "forceMount"> & DialogOverlayExtraProps & {
        __scopeDialog?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogOverlayExtraProps & {
        __scopeDialog?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        open?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeDialog" | keyof DialogContentProps> & DialogContentProps & {
        __scopeDialog?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogContentProps & {
        __scopeDialog?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeDialog" | "displayWhenAdapted"> & DialogCloseExtraProps & {
        __scopeDialog?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & DialogCloseExtraProps & {
        __scopeDialog?: Scope;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("@tamagui/sheet").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@tamagui/create-context").Scope<any>;
        }, any, any, any, {
            open?: boolean;
        }, {}> | import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@tamagui/create-context").Scope<any>;
        }, any, {
            __scopeSheet?: import("@tamagui/create-context").Scope<any>;
        }, {}, {}, {}>;
        Handle: import("@tamagui/core").TamaguiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("@tamagui/core").TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
};
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DialogWarningProvider, createDialogScope, };
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps, };
//# sourceMappingURL=Dialog.d.ts.map