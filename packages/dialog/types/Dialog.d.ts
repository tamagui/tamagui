import { GetProps, StackProps, TamaguiElement, TamaguiTextElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import { DismissableProps } from '@tamagui/dismissable';
import { FocusScopeProps } from '@tamagui/focus-scope';
import { PortalItemProps } from '@tamagui/portal';
import { RemoveScroll } from '@tamagui/remove-scroll';
import { YStackProps } from '@tamagui/stacks';
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
    sheetBreakpoint: any;
    scopeKey: string;
};
interface DialogTriggerProps extends StackProps {
}
declare const DialogTrigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, Omit<import("@tamagui/core").StackStyleBase, never>, {}, {}>;
type DialogPortalProps = Omit<PortalItemProps, 'asChild'> & YStackProps & {
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
}, {}>;
declare const DialogPortal: React.FC<DialogPortalProps>;
/**
 * exported for internal use with extractable()
 */
export declare const DialogOverlayFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    unstyled?: boolean | undefined;
    backgrounded?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, {}>;
interface DialogOverlayProps extends YStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const DialogOverlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<TamaguiElement>>;
declare const DialogContentFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    backgrounded?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, {}>;
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
interface DialogContentProps extends DialogContentFrameProps, Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const DialogContent: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<TamaguiElement>>;
interface DialogContentTypeProps extends Omit<DialogContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
    context: DialogContextValue;
}
type DialogContentImplProps = DialogContentFrameProps & Omit<DismissableProps, 'onDismiss'> & {
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
declare const DialogTitleFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {}>;
type DialogTitleProps = GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, Omit<import("@tamagui/core").TextStylePropsBase, never>, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {}>;
declare const DialogDescriptionFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {}>;
type DialogDescriptionProps = GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, Omit<import("@tamagui/core").TextStylePropsBase, never>, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, {}>;
declare const DialogCloseFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, {}>;
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & {
    displayWhenAdapted?: boolean;
};
declare const DialogClose: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    displayWhenAdapted?: boolean | undefined;
}, Omit<import("@tamagui/core").StackStyleBase, `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>>> | "displayWhenAdapted">, {}, {}>;
declare const DialogWarningProvider: {
    (props: {
        contentName: string;
        titleName: string;
        docsSlug: string;
    } & {
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
};
export type DialogHandle = {
    open: (val: boolean) => void;
};
declare const Dialog: React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<{
    open: (val: boolean) => void;
}>> & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, Omit<import("@tamagui/core").StackStyleBase, never>, {}, {}>;
    Portal: React.FC<DialogPortalProps>;
    Overlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<TamaguiElement>>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, Omit<import("@tamagui/core").TextStylePropsBase, never>, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & void, Omit<import("@tamagui/core").TextStylePropsBase, never>, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
        displayWhenAdapted?: boolean | undefined;
    }, Omit<import("@tamagui/core").StackStyleBase, `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {}>>> | "displayWhenAdapted">, {}, {}>;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>> & {
            disableHideBottomOverflow?: boolean | undefined;
            adjustPaddingForOffscreenContent?: boolean | undefined;
        } & {
            __scopeSheet?: Scope<any>;
        } & React.RefAttributes<unknown>>;
        Overlay: React.MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined; /**
             * Used to force mounting when more control is needed. Useful when
             * controlling animation with React animation libraries.
             */
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>>>) => null>;
        Handle: ({ __scopeSheet, ...props }: import("@tamagui/sheet").SheetScopedProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>>>) => JSX.Element | null;
        ScrollView: React.ForwardRefExoticComponent<Omit<import("@tamagui/web/types/interfaces/TamaguiComponentPropsBaseBase").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            fullscreen?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            fullscreen?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase, {
            fullscreen?: boolean | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
            fullscreen?: boolean | undefined;
        }>> & React.RefAttributes<import("react-native").ScrollView>>;
    };
    Adapt: (({ platform, when, children }: import("@tamagui/adapt").AdaptProps) => any) & {
        Contents: {
            (props: any): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
};
export declare const DialogSheetContents: {
    ({ name, ...props }: {
        name: string;
        context: Omit<DialogContextValue, 'sheetBreakpoint'>;
    }): JSX.Element;
    displayName: string;
};
export { createDialogScope, Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogWarningProvider, };
export type { DialogProps, DialogTriggerProps, DialogPortalProps, DialogOverlayProps, DialogContentProps, DialogTitleProps, DialogDescriptionProps, DialogCloseProps, };
//# sourceMappingURL=Dialog.d.ts.map