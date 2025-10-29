import '@tamagui/polyfill-dev';
import type { UseHoverProps } from '@floating-ui/react';
import type { SizeTokens, StackProps, TamaguiElement } from '@tamagui/core';
import type { DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import { type PopperArrowExtraProps, type PopperArrowProps, type PopperContentProps, type PopperProps } from '@tamagui/popper';
import { type ScrollViewProps } from '@tamagui/scroll-view';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
type ScopedPopoverProps<P> = Omit<P, 'scope'> & {
    scope?: PopoverScopes;
};
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
export declare const PopoverAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverTriggerProps = ScopedPopoverProps<StackProps>;
export declare const PopoverTrigger: React.ForwardRefExoticComponent<Omit<StackProps, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
    /** enable animation for content position changing */
    enableAnimationForPositionChange?: boolean;
}
export type PopoverContentProps = PopoverContentTypeProps;
export declare const PopoverContent: React.ForwardRefExoticComponent<PopoverContentTypeProps & React.RefAttributes<HTMLElement | import("react-native").View>>;
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
export declare const PopoverClose: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>, "scope"> & {
    scope?: PopoverScopes;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
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
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope"> & {
        scope?: PopoverScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Trigger: React.ForwardRefExoticComponent<Omit<StackProps, "scope"> & {
        scope?: PopoverScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<PopoverContentTypeProps & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Close: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope"> & {
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
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: string;
    } & React.RefAttributes<import("react-native").ScrollView>>;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("@tamagui/sheet").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("react").MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            transparent?: boolean | undefined;
            unstyled?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>>) => null>;
        Handle: import("@tamagui/core").TamaguiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("@tamagui/core").TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Popover.d.ts.map