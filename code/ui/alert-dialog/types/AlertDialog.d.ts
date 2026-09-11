import type { TamaguiElement } from '@tamagui/style';
import type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayExtraProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@tamagui/dialog';
import * as React from 'react';
export type AlertDialogScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: AlertDialogScopes;
};
type AlertDialogProps = ScopedProps<DialogProps> & {
    native?: boolean;
};
type AlertDialogTriggerProps = ScopedProps<DialogTriggerProps>;
declare const AlertDialogTrigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}>, "forceMount" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}>, "bordered" | "branches" | "disableOutsidePointerEvents" | "elevate" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onOpenAutoFocus" | "scope" | "trapFocus" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<Omit<DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
type AlertDialogDestructiveProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogDestructive: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }>, "forceMount" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Content: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }>, "bordered" | "branches" | "disableOutsidePointerEvents" | "elevate" | "forceUnmount" | "onBlurCapture" | "onCloseAutoFocus" | "onEscapeKeyDown" | "onFocusCapture" | "onFocusOutside" | "onOpenAutoFocus" | "scope" | "trapFocus" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<Omit<DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Action: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Cancel: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Destructive: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Title: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Description: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDestructive, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogDestructiveProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map