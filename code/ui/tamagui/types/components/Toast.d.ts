import { toast, useToastItem, useToasts, type ExternalToast, type ToastListProps, type ToastPosition, type ToastRootProps, type ToastT } from '@tamagui/toast';
import { type TamaguiElement } from '@tamagui/ui';
export declare const ToastItem: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    toast: ToastT;
    index: number;
    children: React.ReactNode;
}, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    toast: ToastT;
    index: number;
    children: React.ReactNode;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ToastTitle: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: import("@tamagui/web").FontSize | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ToastDescription: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: import("@tamagui/web").FontSize | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ToastClose: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ToastAction: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | false | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare function ToastList(props: ToastListProps): import("react").JSX.Element;
export declare const Toast: ((props: ToastRootProps & import("@tamagui/ui").RefProp<TamaguiElement>) => import("react").ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Viewport: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "hotkey" | "label" | "offset" | "portalToRoot" | "portalZIndex" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        offset?: number | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        hotkey?: string[];
        label?: string;
        portalToRoot?: boolean;
        portalZIndex?: number;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        offset?: number | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        hotkey?: string[];
        label?: string;
        portalToRoot?: boolean;
        portalZIndex?: number;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    List: typeof ToastList;
    Item: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: import("react").Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
            elevation?: number | false | import("@tamagui/web").Size | undefined;
        }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
            toast: ToastT;
            index: number;
            children: React.ReactNode;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | false | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Title: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
        size?: import("@tamagui/web").FontSize | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Description: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
        size?: import("@tamagui/web").FontSize | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Close: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: import("react").Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | false | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Action: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: import("react").Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | false | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | false | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: (props: {
        children?: React.ReactNode;
    }) => React.JSX.Element | null;
};
export { toast, useToastItem, useToasts };
export type { ExternalToast, ToastPosition, ToastT };
//# sourceMappingURL=Toast.d.ts.map