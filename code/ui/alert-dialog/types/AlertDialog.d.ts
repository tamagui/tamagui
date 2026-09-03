import type { TamaguiElement } from '@tamagui/core';
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
declare const AlertDialogTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}>, "elevation" | "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: import("@tamagui/compose-refs").RefComponent<TamaguiElement, AlertDialogContentProps>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogDestructiveProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogDestructive: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }>, "elevation" | "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/compose-refs").RefComponent<TamaguiElement, AlertDialogContentProps>;
    Action: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Cancel: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Destructive: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDestructive, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogDestructiveProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map