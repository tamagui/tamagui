import { Popover as UiPopover } from '@tamagui/popover';
import * as React from 'react';
export declare const PopoverContent: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export declare const PopoverArrow: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export type Popover = UiPopover;
export declare const Popover: ((props: Omit<import("@tamagui/popper").PopperProps, "scope"> & {
    scope?: import("@tamagui/popover").PopoverScopes;
} & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: "hover" | "press") => void;
    keepChildrenMounted?: boolean | 'lazy';
    hoverable?: boolean | import("@tamagui/floating").UseHoverProps;
    disableFocus?: boolean;
    disableDismissable?: boolean;
    zIndex?: number;
} & import("@tamagui/style").RefProp<UiPopover>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Anchor: React.NamedExoticComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/style").RefProp<import("@tamagui/style").TamaguiElement>>;
    Arrow: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
    };
    Trigger: React.NamedExoticComponent<Omit<import("@tamagui/style").StackNonStyleProps & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        disablePressTrigger?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/style").RefProp<import("@tamagui/style").TamaguiElement>>;
    Content: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
    };
    Close: import("@tamagui/style").RefComponent<import("@tamagui/style").TamaguiElement, import("@tamagui/popover").PopoverCloseProps>;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
    ScrollView: import("@tamagui/style").RefComponent<import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/popover").PopoverScrollViewProps>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
};
//# sourceMappingURL=Popover.d.ts.map