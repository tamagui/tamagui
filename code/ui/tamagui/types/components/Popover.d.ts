import { Popover as UiPopover } from '@tamagui/popover';
import * as React from 'react';
export declare const PopoverContent: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/popover").PopoverContentTypeProps> & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/popover").PopoverContentTypeProps>, import("@tamagui/core").StaticConfigPublic>;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/popper").PopperArrowExtraProps> & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/popper").PopperArrowExtraProps>, import("@tamagui/core").StaticConfigPublic>;
export type Popover = UiPopover;
export declare const Popover: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<UiPopover, Omit<import("@tamagui/popper").PopperProps, "scope"> & {
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
} & import("@tamagui/core").RefProp<UiPopover>>, {
    Anchor: React.NamedExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/core").RefProp<import("@tamagui/core").TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/popper").PopperArrowExtraProps> & import("@tamagui/popper").PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/popper").PopperArrowExtraProps>, import("@tamagui/core").StaticConfigPublic>;
    Trigger: React.NamedExoticComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        disablePressTrigger?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/popover").PopoverScopes;
    } & import("@tamagui/core").RefProp<import("@tamagui/core").TamaguiElement>>;
    Content: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/popover").PopoverContentTypeProps> & import("@tamagui/popover").PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, Omit<{}, keyof import("@tamagui/popover").PopoverContentTypeProps>, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").RefComponent<import("@tamagui/core").TamaguiElement, import("@tamagui/popover").PopoverCloseProps>;
    Adapt: import("@tamagui/core").Combined<(props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element, {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    }>;
    ScrollView: import("@tamagui/core").RefComponent<import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/popover").PopoverScrollViewProps>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
}>;
//# sourceMappingURL=Popover.d.ts.map