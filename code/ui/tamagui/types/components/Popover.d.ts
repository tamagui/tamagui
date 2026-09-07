import { Popover as UiPopover } from '@tamagui/popover';
import * as React from 'react';
export declare const PopoverContent: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export declare const PopoverArrow: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
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
} & import("@tamagui/core").RefProp<UiPopover>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Anchor: React.NamedExoticComponent<Omit<import("@tamagui/stacks").YStackProps, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/core").RefProp<import("@tamagui/core").TamaguiElement>>;
    Arrow: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
    };
    Trigger: React.NamedExoticComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        disablePressTrigger?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/core").RefProp<import("@tamagui/core").TamaguiElement>>;
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
    };
    Close: import("@tamagui/core").RefComponent<import("@tamagui/core").TamaguiElement, import("@tamagui/popover").PopoverCloseProps>;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
    ScrollView: import("@tamagui/core").RefComponent<import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/popover").PopoverScrollViewProps>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
};
//# sourceMappingURL=Popover.d.ts.map