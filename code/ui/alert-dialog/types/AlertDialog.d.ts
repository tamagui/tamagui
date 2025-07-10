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
declare const AlertDialogTrigger: React.ForwardRefExoticComponent<Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: React.ForwardRefExoticComponent<Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: true;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>> & React.RefAttributes<TamaguiElement>>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: React.ForwardRefExoticComponent<Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: React.ForwardRefExoticComponent<Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: React.ForwardRefExoticComponent<Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: React.ForwardRefExoticComponent<Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: React.ForwardRefExoticComponent<Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: React.ForwardRefExoticComponent<Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: true;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Action: React.ForwardRefExoticComponent<Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Cancel: React.ForwardRefExoticComponent<Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Title: React.ForwardRefExoticComponent<Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Description: React.ForwardRefExoticComponent<Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map