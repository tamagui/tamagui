import { Popover as UiPopover } from '@tamagui/ui';
import * as React from 'react';
export declare const PopoverContent: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export declare const PopoverArrow: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export type Popover = UiPopover;
export declare const Popover: ((props: Omit<import("@tamagui/ui").PopperProps, "scope"> & {
    scope?: import("@tamagui/ui").PopoverScopes;
} & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: "hover" | "press") => void;
    keepChildrenMounted?: boolean | 'lazy';
    hoverable?: boolean | import("@tamagui/floating").UseHoverProps;
    disableFocus?: boolean;
    disableDismissable?: boolean;
    zIndex?: number;
} & import("@tamagui/ui").RefProp<UiPopover>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Anchor: React.NamedExoticComponent<Omit<import("@tamagui/ui").YStackProps, "scope"> & {
        scope?: import("@tamagui/ui").PopoverScopes;
    } & import("@tamagui/ui").RefProp<import("@tamagui/ui").TamaguiElement>>;
    Arrow: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/ui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopperArrowExtraProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
    };
    Trigger: React.NamedExoticComponent<Omit<import("@tamagui/ui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        disablePressTrigger?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/ui").PopoverScopes;
    } & import("@tamagui/ui").RefProp<import("@tamagui/ui").TamaguiElement>>;
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<import("@tamagui/ui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/ui").PopoverContentTypeProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic];
    };
    Close: import("@tamagui/ui").RefComponent<import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").PopoverCloseProps>;
    Adapt: ((props: import("@tamagui/ui").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/ui").AdaptContents;
    };
    ScrollView: import("@tamagui/ui").RefComponent<import("@tamagui/ui").ScrollViewRef, import("@tamagui/ui").PopoverScrollViewProps>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
};
//# sourceMappingURL=Popover.d.ts.map