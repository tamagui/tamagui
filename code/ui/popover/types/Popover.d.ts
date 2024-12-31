import '@tamagui/polyfill-dev';
import type { UseHoverProps } from '@floating-ui/react';
import type { SizeTokens, StackProps, TamaguiElement } from '@tamagui/core';
import type { DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import type { PopperArrowExtraProps, PopperArrowProps, PopperContentProps, PopperProps } from '@tamagui/popper';
import type { RemoveScrollProps } from '@tamagui/remove-scroll';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { ScrollView } from 'react-native';
export type PopoverProps = PopperProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: 'hover' | 'press') => void;
    keepChildrenMounted?: boolean;
    /**
     * Enable staying open while mouseover
     */
    hoverable?: boolean | UseHoverProps;
    /**
     * Disable focusing behavior on open
     */
    disableFocus?: boolean;
};
type PopoverContextValue = {
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
    keepChildrenMounted?: boolean;
    anchorTo?: Rect;
};
export declare const PopoverContext: import("@tamagui/core").StyledContext<PopoverContextValue>;
export declare const usePopoverContext: (scope?: string) => PopoverContextValue;
export type PopoverAnchorProps = YStackProps;
export declare const PopoverAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverTriggerProps = StackProps;
export declare const PopoverTrigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverContentProps = PopoverContentTypeProps;
export interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
    /**
     * @see https://github.com/theKashey/react-remove-scroll#usage
     */
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
    /** enable animation for content position changing */
    enableAnimationForPositionChange?: boolean;
}
export declare const PopoverContent: React.ForwardRefExoticComponent<PopoverContentTypeProps & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<HTMLElement | import("react-native").View>>;
export interface PopoverContentImplProps extends PopperContentProps, Omit<DismissableProps, 'onDismiss' | 'children' | 'onPointerDownCapture'> {
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
     * Event handler called when auto-focusing on open.
     * Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    disableRemoveScroll?: boolean;
    freezeContentsWhenHidden?: boolean;
    setIsFullyHidden?: React.Dispatch<React.SetStateAction<boolean>>;
}
export type PopoverCloseProps = YStackProps;
export declare const PopoverClose: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
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
export declare const Popover: React.ForwardRefExoticComponent<PopperProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, via?: "hover" | "press") => void;
    keepChildrenMounted?: boolean;
    /**
     * Enable staying open while mouseover
     */
    hoverable?: boolean | UseHoverProps;
    /**
     * Disable focusing behavior on open
     */
    disableFocus?: boolean;
} & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<Popover>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof PopperArrowExtraProps> & PopperArrowExtraProps, keyof PopperArrowExtraProps> & PopperArrowExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & PopperArrowExtraProps, import("@tamagui/core").StackStyleBase, {
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
    Trigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<PopoverContentTypeProps & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Close: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    ScrollView: typeof ScrollView;
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
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
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
};
export {};
//# sourceMappingURL=Popover.d.ts.map