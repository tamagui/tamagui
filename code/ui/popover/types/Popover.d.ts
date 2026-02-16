import '@tamagui/polyfill-dev';
import type { UseHoverProps } from '@floating-ui/react';
import type { SizeTokens, TamaguiElement, ViewProps } from '@tamagui/core';
import { type DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import { type PopperArrowExtraProps, type PopperArrowProps, type PopperContentProps, type PopperProps } from '@tamagui/popper';
import { type ScrollViewProps } from '@tamagui/scroll-view';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
type ScopedPopoverProps<P> = Omit<P, 'scope'> & {
    scope?: PopoverScopes;
};
export declare const hasOpenPopovers: () => boolean;
export declare const closeOpenPopovers: () => boolean;
export declare const closeLastOpenedPopover: () => boolean;
type PopoverVia = 'hover' | 'press';
export type PopoverProps = ScopedPopoverProps<PopperProps> & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: PopoverVia) => void;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     * When "lazy", they mount inside a startTransition after first render.
     *
     * @default false
     */
    keepChildrenMounted?: boolean | 'lazy';
    /**
     * Enable staying open while mouseover
     */
    hoverable?: boolean | UseHoverProps;
    /**
     * Disable focusing behavior on open
     */
    disableFocus?: boolean;
};
export type PopoverScopes = string;
type PopoverContextValue = {
    popoverScope: string;
    adaptScope: string;
    id: string;
    triggerRef: React.RefObject<any>;
    contentId?: string;
    open: boolean;
    onOpenChange(open: boolean, via: 'hover' | 'press'): void;
    onOpenToggle(): void;
    hasCustomAnchor: boolean;
    onCustomAnchorAdd(): void;
    onCustomAnchorRemove(): void;
    size?: SizeTokens;
    breakpointActive?: boolean;
    keepChildrenMounted?: boolean | 'lazy';
    anchorTo?: Rect;
};
export declare const PopoverContext: import("@tamagui/core").StyledContext<PopoverContextValue>;
export declare const usePopoverContext: (scope?: string) => PopoverContextValue;
export type PopoverAnchorProps = ScopedPopoverProps<YStackProps>;
export declare const PopoverAnchor: React.ForwardRefExoticComponent<Omit<YStackProps, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverTriggerProps = ScopedPopoverProps<ViewProps>;
export declare const PopoverTrigger: React.ForwardRefExoticComponent<Omit<ViewProps, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
    /**
     * Enable smooth animation when the content position changes (e.g., when flipping sides)
     */
    animatePosition?: boolean | 'even-when-repositioning';
    /** @deprecated Use `animatePosition` instead */
    enableAnimationForPositionChange?: boolean;
}
export type PopoverContentProps = PopoverContentTypeProps;
export declare const PopoverContent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof PopoverContentTypeProps> & PopoverContentTypeProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type PopoverContentImplProps = PopperContentProps & Omit<DismissableProps, 'onDismiss' | 'children' | 'onPointerDownCapture'> & {
    /**
     * Rather than mount the content immediately, mounts it in a useEffect
     * inside a startTransition to clear the main thread
     */
    lazyMount?: boolean;
    /**
     * Whether focus should be trapped within the `Popover`
     * @default false
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Whether popover should not focus contents on open
     * @default false
     */
    disableFocusScope?: boolean;
    /**
     * Event handler called when auto-focusing on open. Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close. Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'] | false;
    enableRemoveScroll?: boolean;
    freezeContentsWhenHidden?: boolean;
};
export type PopoverCloseProps = ScopedPopoverProps<YStackProps>;
export declare const PopoverClose: React.ForwardRefExoticComponent<Omit<YStackProps, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type Popover = {
    anchorTo: (rect: Rect) => void;
    toggle: () => void;
    open: () => void;
    close: () => void;
    setOpen: (open: boolean) => void;
};
export type PopoverScrollViewProps = ScrollViewProps & {
    scope?: string;
};
export declare const Popover: React.ForwardRefExoticComponent<Omit<PopperProps, "scope"> & {
    scope?: PopoverScopes;
} & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: PopoverVia) => void;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     * When "lazy", they mount inside a startTransition after first render.
     *
     * @default false
     */
    keepChildrenMounted?: boolean | "lazy";
    /**
     * Enable staying open while mouseover
     */
    hoverable?: boolean | UseHoverProps;
    /**
     * Disable focusing behavior on open
     */
    disableFocus?: boolean;
} & React.RefAttributes<Popover>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<YStackProps, "scope"> & {
        scope?: PopoverScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Trigger: React.ForwardRefExoticComponent<Omit<ViewProps, "scope"> & {
        scope?: PopoverScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof PopoverContentTypeProps> & PopoverContentTypeProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Close: React.ForwardRefExoticComponent<Omit<YStackProps, "scope"> & {
        scope?: PopoverScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    ScrollView: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: string;
    } & React.RefAttributes<import("react-native").ScrollView>>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Popover.d.ts.map