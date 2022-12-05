import '@tamagui/polyfill-dev';
import { SizeTokens } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import { DismissableProps } from '@tamagui/dismissable';
import { FocusScopeProps } from '@tamagui/focus-scope';
import { PopperArrowProps, PopperContentProps, PopperProps } from '@tamagui/popper';
import { RemoveScrollProps } from '@tamagui/remove-scroll';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';
declare type ScopedProps<P> = P & {
    __scopePopover?: Scope;
};
export declare type PopoverProps = PopperProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
declare type PopoverContextValue = {
    triggerRef: React.RefObject<HTMLButtonElement>;
    contentId?: string;
    open: boolean;
    onOpenChange(open: boolean): void;
    onOpenToggle(): void;
    hasCustomAnchor: boolean;
    onCustomAnchorAdd(): void;
    onCustomAnchorRemove(): void;
    size?: SizeTokens;
    sheetBreakpoint: any;
    scopeKey: string;
};
export declare const usePopoverScope: (scope: Scope<any>) => {
    [__scopeProp: string]: Scope<any>;
};
export declare const createPopoverScope: import("@tamagui/create-context").CreateScope;
export declare const __PopoverProviderInternal: {
    (props: PopoverContextValue & {
        scope: Scope<PopoverContextValue>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
};
declare type PopoverAnchorElement = HTMLElement | View;
export declare type PopoverAnchorProps = YStackProps;
export declare const PopoverAnchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & React.RefAttributes<PopoverAnchorElement>>;
declare type PopoverTriggerElement = HTMLElement | View;
export declare type PopoverTriggerProps = YStackProps;
export declare const PopoverTrigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & React.RefAttributes<PopoverTriggerElement>>;
export declare type PopoverContentProps = PopoverContentTypeProps;
export interface PopoverContentTypeProps extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
    /**
     * @see https://github.com/theKashey/react-remove-scroll#usage
     */
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
}
export declare const PopoverContent: React.ForwardRefExoticComponent<PopoverContentTypeProps & React.RefAttributes<HTMLElement | View>>;
export interface PopoverContentImplProps extends PopperContentProps, Omit<DismissableProps, 'onDismiss' | 'children'> {
    /**
     * Whether focus should be trapped within the `Popover`
     * (default: false)
     */
    trapFocus?: FocusScopeProps['trapped'];
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
}
declare type PopoverCloseElement = HTMLElement | View;
export declare type PopoverCloseProps = YStackProps;
export declare const PopoverClose: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & React.RefAttributes<PopoverCloseElement>>;
declare type PopoverArrowElement = HTMLElement | View;
export declare type PopoverArrowProps = PopperArrowProps;
export declare const PopoverArrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & {
    offset?: number | undefined;
    size?: SizeTokens | undefined;
} & React.RefAttributes<PopoverArrowElement>>;
export declare const PopoverSheetContents: {
    ({ __scopePopover }: ScopedProps<{}>): JSX.Element;
    displayName: string;
};
export declare const Popover: React.FC<PopoverProps> & {
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & React.RefAttributes<PopoverAnchorElement>>;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & {
        offset?: number | undefined;
        size?: SizeTokens | undefined;
    } & React.RefAttributes<PopoverArrowElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & React.RefAttributes<PopoverTriggerElement>>;
    Content: React.ForwardRefExoticComponent<PopoverContentTypeProps & React.RefAttributes<HTMLElement | View>>;
    Close: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & React.RefAttributes<PopoverCloseElement>>;
    Adapt: (({ when, children }: import("@tamagui/adapt").AdaptProps) => any) & {
        Contents: () => React.FunctionComponentElement<any>;
    };
    ScrollView: React.ForwardRefExoticComponent<ScrollViewProps & React.RefAttributes<ScrollView>>;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet/types/types").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<View>> & {
        Handle: ({ __scopeSheet, ...props }: import("@tamagui/sheet/types/types").SheetScopedProps<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }>>>) => JSX.Element;
        Frame: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }>> & {
            __scopeSheet?: Scope<any>;
        } & React.RefAttributes<unknown>>;
        Overlay: ({ __scopeSheet, ...props }: import("@tamagui/sheet/types/types").SheetScopedProps<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }, "closed"> & {
            readonly closed?: boolean | undefined;
        } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }, "closed"> & {
            readonly closed?: boolean | undefined;
        }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: SizeTokens | undefined;
        }, "closed"> & {
            readonly closed?: boolean | undefined;
        }>>>) => JSX.Element;
        ScrollView: React.ForwardRefExoticComponent<((ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof ScrollViewProps>) | Pick<ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof ScrollViewProps> & Omit<{}, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/core").MediaProps<Partial<ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof ScrollViewProps> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/core").PseudoProps<Partial<ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof ScrollViewProps> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>>, string | number>) & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
    };
};
export {};
//# sourceMappingURL=Popover.d.ts.map