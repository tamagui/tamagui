import { type TamaguiElement } from '@tamagui/core';
import type * as React from 'react';
export declare const AlertDialogOverlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants, "elevation" | "open" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
}>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
    elevation?: number | false | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const AlertDialogContent: React.FunctionComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & import("@tamagui/core").RefProp<TamaguiElement>, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & import("@tamagui/core").RefProp<TamaguiElement>, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & import("@tamagui/core").RefProp<TamaguiElement>, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export declare const AlertDialog: ((props: Omit<import("@tamagui/dialog").DialogProps, "scope"> & {
    scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
} & {
    native?: boolean;
} & import("@tamagui/core").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/dialog").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: React.FC<import("@tamagui/alert-dialog").AlertDialogPortalProps>;
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<import("@tamagui/dialog").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/core").TextNonStyleProps | keyof import("@tamagui/core").TextStylePropsBase> & Omit<import("@tamagui/dialog").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Action: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Cancel: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Destructive: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/dialog").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Overlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants, "elevation" | "open" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
            scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
        } & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/dialog").DialogScopes;
        } & Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | false | import("@tamagui/core").Size | undefined;
        }>, "elevation"> & import("@tamagui/stacks").StackVariants, import("@tamagui/core").StackStyleBase, {
            elevation?: number | false | import("@tamagui/core").Size | undefined;
            open?: boolean | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & import("@tamagui/core").RefProp<TamaguiElement>, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
    } & import("@tamagui/core").RefProp<TamaguiElement>, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/dialog").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
            scope?: import("@tamagui/alert-dialog").AlertDialogScopes;
        } & import("@tamagui/core").RefProp<TamaguiElement>, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
    };
};
//# sourceMappingURL=AlertDialog.d.ts.map