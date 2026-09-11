import { type TamaguiElement } from '@tamagui/style';
import type * as React from 'react';
export declare const AlertDialogOverlay: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, "open" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    open?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
    open?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const AlertDialogContent: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
}, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
}, import("@tamagui/style").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const AlertDialog: ((props: Omit<import("@tamagui/dialog").DialogProps, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    native?: boolean;
} & import("@tamagui/style").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | keyof import("@tamagui/style").StackNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/dialog").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Portal: React.FC<import("@tamagui/alert-dialog").AlertDialogPortalProps>;
    Title: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/dialog").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Description: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/style").TextNonStyleProps | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/dialog").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Action: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Cancel: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Destructive: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Overlay: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, "open" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        open?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
        open?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
            scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
        } & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/dialog").DialogScopes;
        } & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>>, import("@tamagui/style").StackStyleBase, {
            open?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, "bordered" | "elevate" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/style").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
            scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
        }, import("@tamagui/style").StackStyleBase, {
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
};
//# sourceMappingURL=AlertDialog.d.ts.map