import '@tamagui/polyfill-dev';
import { UseHoverProps } from '@floating-ui/react';
import { SizeTokens, StackProps, TamaguiElement } from '@tamagui/core';
import { DismissableProps } from '@tamagui/dismissable';
import { FocusScopeProps } from '@tamagui/focus-scope';
import { PopperArrowProps, PopperContentProps, PopperProps } from '@tamagui/popper';
import { RemoveScrollProps } from '@tamagui/remove-scroll';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { ScrollView } from 'react-native';
export type PopoverProps = PopperProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
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
    onOpenChange(open: boolean): void;
    onOpenToggle(): void;
    hasCustomAnchor: boolean;
    onCustomAnchorAdd(): void;
    onCustomAnchorRemove(): void;
    size?: SizeTokens;
    sheetBreakpoint: any;
    breakpointActive?: boolean;
    keepChildrenMounted?: boolean;
    anchorTo?: Rect;
};
export declare const PopoverContext: import("@tamagui/core").StyledContext<PopoverContextValue>;
export declare const usePopoverContext: (scope?: string | undefined) => PopoverContextValue;
export type PopoverAnchorProps = YStackProps;
export declare const PopoverAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverTriggerProps = StackProps;
export declare const PopoverTrigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & {
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
}
export type PopoverCloseProps = YStackProps;
export declare const PopoverClose: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "size" | `$${string}` | `$${number}` | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen" | `$theme-${string}` | `$theme-${number}` | "__scopePopper" | "offset" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & {
    __scopePopper?: string | undefined;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined; /**
     * Whether focus should be trapped within the `Popover`
     * @default false
     */
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & {
    __scopePopper?: string | undefined;
} & void, import("@tamagui/core").StackStylePropsBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {}>;
type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type PopoverRef = {
    anchorTo: (rect: Rect) => void;
};
export declare const Popover: React.ForwardRefExoticComponent<PopperProps & {
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    keepChildrenMounted?: boolean | undefined;
    /**
     * Enable staying open while mouseover
     */
    hoverable?: boolean | UseHoverProps<import("@floating-ui/react").ReferenceType> | undefined;
    /**
     * Disable focusing behavior on open
     */
    disableFocus?: boolean | undefined;
} & {
    __scopePopover?: string | undefined;
} & React.RefAttributes<PopoverRef>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Arrow: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, "size" | `$${string}` | `$${number}` | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen" | `$theme-${string}` | `$theme-${number}` | "__scopePopper" | "offset" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        offset?: number | undefined;
        size?: SizeTokens | undefined;
    } & {
        __scopePopper?: string | undefined;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined; /**
         * Whether focus should be trapped within the `Popover`
         * @default false
         */
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        offset?: number | undefined;
        size?: SizeTokens | undefined;
    } & {
        __scopePopper?: string | undefined;
    } & void, import("@tamagui/core").StackStylePropsBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, {}>;
    Trigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<PopoverContentTypeProps & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Close: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        __scopePopover?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Adapt: (({ platform, when, children }: import("@tamagui/adapt").AdaptProps) => any) & {
        Contents: {
            (props: any): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    ScrollView: typeof ScrollView;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>> & {
            disableHideBottomOverflow?: boolean | undefined;
            adjustPaddingForOffscreenContent?: boolean | undefined;
        } & {
            __scopeSheet?: import("@tamagui/create-context").Scope<any>;
        } & React.RefAttributes<unknown>>;
        Overlay: React.MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            unstyled?: boolean | undefined;
            backgrounded?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>>) => null>;
        Handle: ({ __scopeSheet, ...props }: import("@tamagui/sheet").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
            elevation?: number | SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>>) => JSX.Element | null;
        ScrollView: React.ForwardRefExoticComponent<Omit<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps>, keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            fullscreen?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            fullscreen?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
            fullscreen?: boolean | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
            fullscreen?: boolean | undefined;
        }>> & React.RefAttributes<ScrollView>>;
    };
};
export {};
//# sourceMappingURL=Popover.d.ts.map