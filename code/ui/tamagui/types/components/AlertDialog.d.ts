import { type TamaguiElement } from '@tamagui/ui';
import type * as React from 'react';
export declare const AlertDialogOverlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/ui").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
} & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
}>, "elevation"> & import("@tamagui/ui").StackVariants, "elevation" | "open" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    open?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: import("@tamagui/ui").AlertDialogScopes;
} & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
} & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
}>, "elevation"> & import("@tamagui/ui").StackVariants, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    } & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const AlertDialogContent: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/ui").AlertDialogScopes;
} & import("@tamagui/ui").RefProp<TamaguiElement>, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
    scope?: import("@tamagui/ui").AlertDialogScopes;
} & import("@tamagui/ui").RefProp<TamaguiElement>, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & import("@tamagui/ui").RefProp<TamaguiElement>, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export declare const AlertDialog: ((props: Omit<import("@tamagui/ui").DialogProps, "scope"> & {
    scope?: import("@tamagui/ui").AlertDialogScopes;
} & {
    native?: boolean;
} & import("@tamagui/ui").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | keyof import("@tamagui/ui").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/ui").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogTriggerProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Portal: React.FC<import("@tamagui/ui").AlertDialogPortalProps>;
    Title: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | "size" | "unstyled" | keyof import("@tamagui/ui").TextNonStyleProps | keyof import("@tamagui/web").TextStylePropsBase> & Omit<import("@tamagui/ui").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogTitleProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Description: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | "size" | keyof import("@tamagui/ui").TextNonStyleProps | keyof import("@tamagui/web").TextStylePropsBase> & Omit<import("@tamagui/ui").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogDescriptionProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Action: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Cancel: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Destructive: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/ui").DialogCloseProps, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Overlay: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    } & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants, "elevation" | "open" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    } & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "elevation"> & import("@tamagui/ui").StackVariants, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
            scope?: import("@tamagui/ui").AlertDialogScopes;
        } & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/ui").DialogScopes;
        } & Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
        }>, "elevation"> & import("@tamagui/ui").StackVariants, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            open?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & import("@tamagui/ui").RefProp<TamaguiElement>, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
        scope?: import("@tamagui/ui").AlertDialogScopes;
    } & import("@tamagui/ui").RefProp<TamaguiElement>, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<Omit<import("@tamagui/ui").DialogContentProps, "onInteractOutside" | "onPointerDownOutside">, "scope"> & {
            scope?: import("@tamagui/ui").AlertDialogScopes;
        } & import("@tamagui/ui").RefProp<TamaguiElement>, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
    };
};
//# sourceMappingURL=AlertDialog.d.ts.map