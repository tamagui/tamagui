import '@tamagui/polyfill-dev';
import type { UseHoverProps } from '@tamagui/floating';
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
    /**
     * Disable the dismissable layer (escape key, outside click handling).
     * Useful for popovers that stay mounted but are visually hidden.
     */
    disableDismissable?: boolean;
    /**
     * z-index for the popover portal. Use this when popovers need to appear
     * above other portaled content like dialogs or fixed headers.
     *
     * By default, Tamagui automatically stacks overlays - later-opened content
     * appears above earlier content, and nested content appears above its parent.
     * Only set this if you need to override the automatic stacking behavior.
     *
     * @see https://tamagui.dev/ui/z-index
     */
    zIndex?: number;
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
    disableDismissable?: boolean;
    hoverable?: boolean | object;
    anchorTo?: Rect;
    branches: Set<HTMLElement>;
};
type PopoverTriggerStateSetter = React.Dispatch<React.SetStateAction<boolean>>;
type PopoverTriggerContextValue = {
    triggerRef: React.RefObject<any>;
    hasCustomAnchor: boolean;
    anchorTo?: Rect;
    branches: Set<HTMLElement>;
    onOpenToggle(): void;
    setActiveTrigger(id: string | null): void;
    registerTrigger(id: string, setOpen: PopoverTriggerStateSetter): void;
    unregisterTrigger(id: string): void;
};
export declare const PopoverContext: import("@tamagui/core").StyledContext<PopoverContextValue, never>;
export declare const PopoverZIndexContext: React.Context<number | undefined>;
export declare const PopoverTriggerContext: import("@tamagui/core").StyledContext<PopoverTriggerContextValue, never>;
export declare const usePopoverContext: (scope?: string) => PopoverContextValue;
export declare const usePopoverTriggerContext: (scope?: string) => PopoverTriggerContextValue;
/**
 * Read reactive popover open state from the popover context.
 */
export declare function usePopoverOpen(scope?: string): boolean;
/**
 * Hook to set up trigger registration/isolation logic.
 * Used internally by Popover and can be used by Tooltip.
 */
export declare function usePopoverTriggerSetup(open: boolean): {
    setActiveTrigger: (id: string | null) => void;
    registerTrigger: (id: string, setOpenState: PopoverTriggerStateSetter) => void;
    unregisterTrigger: (id: string) => void;
};
export type PopoverContextProviderProps = {
    scope: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange(open: boolean, via?: 'hover' | 'press'): void;
    onOpenToggle(): void;
    triggerRef: React.RefObject<any>;
    id?: string;
    contentId?: string;
    hasCustomAnchor?: boolean;
    onCustomAnchorAdd?: () => void;
    onCustomAnchorRemove?: () => void;
    anchorTo?: Rect;
    adaptScope?: string;
    breakpointActive?: boolean;
    keepChildrenMounted?: boolean | 'lazy';
    disableDismissable?: boolean;
    hoverable?: boolean | object;
};
/**
 * Provider that sets up both PopoverContext and PopoverTriggerContext.
 * Use this in Tooltip or other components that need popover trigger behavior.
 */
export declare const PopoverContextProvider: React.MemoExoticComponent<({ scope, children, open, onOpenChange, onOpenToggle, triggerRef, id, contentId, hasCustomAnchor, onCustomAnchorAdd, onCustomAnchorRemove, anchorTo, adaptScope, breakpointActive, keepChildrenMounted, disableDismissable, hoverable, }: PopoverContextProviderProps) => import("react/jsx-runtime").JSX.Element>;
export type PopoverAnchorProps = ScopedPopoverProps<YStackProps>;
export declare const PopoverAnchor: React.NamedExoticComponent<Omit<YStackProps, "scope"> & {
    scope?: PopoverScopes;
} & import("@tamagui/compose-refs").RefProp<TamaguiElement>>;
export type PopoverTriggerProps = ScopedPopoverProps<ViewProps & {
    /**
     * When true, disables the built-in click-to-toggle behavior on the trigger.
     * Useful for hoverable popovers where you want to control open/close
     * entirely through hover or your own handlers.
     */
    disablePressTrigger?: boolean;
}>;
export declare const PopoverTrigger: React.NamedExoticComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    /**
     * When true, disables the built-in click-to-toggle behavior on the trigger.
     * Useful for hoverable popovers where you want to control open/close
     * entirely through hover or your own handlers.
     */
    disablePressTrigger?: boolean;
}, "scope"> & {
    scope?: PopoverScopes;
} & import("@tamagui/compose-refs").RefProp<TamaguiElement>>;
export interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
    /**
     * Enable smooth animation when the content position changes (e.g., when flipping sides)
     */
    animatePosition?: boolean | 'even-when-repositioning';
}
export type PopoverContentProps = PopoverContentTypeProps;
export declare const PopoverContent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof PopoverContentTypeProps> & PopoverContentTypeProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type PopoverContentImplProps = PopperContentProps & Omit<DismissableProps, 'onDismiss' | 'children' | 'onPointerDownCapture'> & {
    /**
     * Rather than mount the content immediately, mounts it in a useEffect
     * inside a startTransition to clear the main thread
     */
    lazyMount?: boolean;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries. Matches Dialog:
     * disables part presence gating so the content is always mounted.
     */
    forceMount?: boolean;
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
     * Event handler called when auto-focusing on open. Can be canceled.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close. Can be canceled.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'] | false;
    enableRemoveScroll?: boolean;
    freezeContentsWhenHidden?: boolean;
    /**
     * Performance - if never going to use feature can permanently disable
     */
    alwaysDisable?: {
        focus?: boolean;
        'remove-scroll'?: boolean;
        dismiss?: boolean;
    };
};
export type PopoverCloseProps = ScopedPopoverProps<YStackProps>;
export declare const PopoverClose: import("@tamagui/compose-refs").RefComponent<TamaguiElement, PopoverCloseProps>;
export type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
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
export declare const Popover: ((props: Omit<PopperProps, "scope"> & {
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
    /**
     * Disable the dismissable layer (escape key, outside click handling).
     * Useful for popovers that stay mounted but are visually hidden.
     */
    disableDismissable?: boolean;
    /**
     * z-index for the popover portal. Use this when popovers need to appear
     * above other portaled content like dialogs or fixed headers.
     *
     * By default, Tamagui automatically stacks overlays - later-opened content
     * appears above earlier content, and nested content appears above its parent.
     * Only set this if you need to override the automatic stacking behavior.
     *
     * @see https://tamagui.dev/ui/z-index
     */
    zIndex?: number;
} & import("@tamagui/compose-refs").RefProp<Popover>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Anchor: React.NamedExoticComponent<Omit<YStackProps, "scope"> & {
        scope?: PopoverScopes;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Trigger: React.NamedExoticComponent<Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
        /**
         * When true, disables the built-in click-to-toggle behavior on the trigger.
         * Useful for hoverable popovers where you want to control open/close
         * entirely through hover or your own handlers.
         */
        disablePressTrigger?: boolean;
    }, "scope"> & {
        scope?: PopoverScopes;
    } & import("@tamagui/compose-refs").RefProp<TamaguiElement>>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof PopoverContentTypeProps> & PopoverContentTypeProps, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopoverContentTypeProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/compose-refs").RefComponent<TamaguiElement, PopoverCloseProps>;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    ScrollView: import("@tamagui/compose-refs").RefComponent<import("@tamagui/scroll-view").ScrollViewRef, PopoverScrollViewProps>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Popover.d.ts.map