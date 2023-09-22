import { GetProps, StackProps, TamaguiElement, TamaguiTextElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import { DismissableProps } from '@tamagui/dismissable';
import { FocusScopeProps } from '@tamagui/focus-scope';
import { PortalItemProps } from '@tamagui/portal';
import { RemoveScroll } from '@tamagui/remove-scroll';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
declare const createDialogScope: import("@tamagui/create-context").CreateScope;
type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;
interface DialogProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * @see https://github.com/theKashey/react-remove-scroll#usage
     */
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
}
type NonNull<A> = Exclude<A, void | null>;
type DialogContextValue = {
    disableRemoveScroll?: boolean;
    triggerRef: React.RefObject<TamaguiElement>;
    contentRef: React.RefObject<TamaguiElement>;
    contentId: string;
    titleId: string;
    descriptionId: string;
    onOpenToggle(): void;
    open: NonNull<DialogProps['open']>;
    onOpenChange: NonNull<DialogProps['onOpenChange']>;
    modal: NonNull<DialogProps['modal']>;
    allowPinchZoom: NonNull<DialogProps['allowPinchZoom']>;
    sheetBreakpoint: any;
    scopeKey: string;
};
interface DialogTriggerProps extends StackProps {
}
declare const DialogTrigger: import("@tamagui/core").ReactComponentWithRef<Object & Omit<StackProps | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), keyof Object>, TamaguiElement> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    styleable: import("@tamagui/core").Styleable<StackProps | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), TamaguiElement>;
};
type DialogPortalProps = Omit<PortalItemProps, 'asChild'> & YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
};
export declare const DialogPortalFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    };
}>;
declare const DialogPortal: React.FC<DialogPortalProps>;
/**
 * exported for internal use with extractable()
 */
export declare const DialogOverlayFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "open" | "unstyled"> & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "open" | "unstyled"> & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "open" | "unstyled"> & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>; /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>; /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>; /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>; /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly open?: boolean | undefined;
    readonly unstyled?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>; /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    } & {
        readonly open?: boolean | undefined;
        readonly unstyled?: boolean | undefined;
    };
}>;
interface DialogOverlayProps extends YStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const DialogOverlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<TamaguiElement>>;
declare const DialogContentFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly unstyled?: boolean | undefined;
}>>, TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    };
}>;
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
interface DialogContentProps extends DialogContentFrameProps, Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const DialogContent: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<TamaguiElement>>;
interface DialogContentTypeProps extends Omit<DialogContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
    context: DialogContextValue;
}
type DialogContentImplProps = DialogContentFrameProps & Omit<DismissableProps, 'onDismiss'> & {
    /**
     * When `true`, focus cannot escape the `Content` via keyboard,
     * pointer, or a programmatic focus.
     * @defaultValue false
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
    context: DialogContextValue;
};
declare const DialogTitleFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>), TamaguiTextElement, import("@tamagui/core").TextPropsBase, ((({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    };
    __variantProps: (({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & (({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }))) & ((({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }));
}>;
type DialogTitleProps = GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref">) & React.RefAttributes<TamaguiTextElement>>;
declare const DialogDescriptionFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>), TamaguiTextElement, import("@tamagui/core").TextPropsBase, ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    };
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }));
}>;
type DialogDescriptionProps = GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>, "ref">) & React.RefAttributes<TamaguiTextElement>>;
declare const DialogCloseFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/core").StackPropsBase, {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: import("@tamagui/core").StackPropsBase;
    __variantProps: {};
}>;
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & {
    displayWhenAdapted?: boolean;
};
declare const DialogClose: import("@tamagui/core").ReactComponentWithRef<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & {
    displayWhenAdapted?: boolean | undefined;
} & Omit<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, "style" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof {
    columnGap?: import("@tamagui/core").SpaceValue | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/core").SpaceValue | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineOffset?: import("@tamagui/core").SpaceValue | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineWidth?: import("@tamagui/core").SpaceValue | undefined;
    pointerEvents?: "none" | "box-none" | "box-only" | "auto" | undefined;
    rowGap?: import("@tamagui/core").SpaceValue | undefined;
    space?: import("@tamagui/core").SpaceValue | undefined;
    spaceDirection?: import("@tamagui/core").SpaceDirection | undefined;
    separator?: React.ReactNode;
    animation?: import("@tamagui/core").AnimationProp | null | undefined;
    animateOnly?: string[] | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
} | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof import("@tamagui/core").TamaguiComponentPropsBase | "unstyled" | keyof import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> | "displayWhenAdapted">, TamaguiElement> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    styleable: import("@tamagui/core").Styleable<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, TamaguiElement>;
};
declare const DialogWarningProvider: {
    (props: {
        contentName: string;
        titleName: string;
        docsSlug: string;
    } & {
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
};
declare const Dialog: React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<{
    open: (val: boolean) => void;
}>> & {
    Trigger: import("@tamagui/core").ReactComponentWithRef<Object & Omit<StackProps | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), keyof Object>, TamaguiElement> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<StackProps | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>>), TamaguiElement>;
    };
    Portal: React.FC<DialogPortalProps>;
    Overlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<TamaguiElement>>;
    Title: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<(({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    })) & ({} | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    } | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & React.RefAttributes<TamaguiTextElement>>;
    Description: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref"> | Omit<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & React.RefAttributes<TamaguiTextElement>>;
    Close: import("@tamagui/core").ReactComponentWithRef<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & {
        displayWhenAdapted?: boolean | undefined;
    } & Omit<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, "style" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | `$theme-${string}` | `$theme-${number}` | keyof {
        columnGap?: import("@tamagui/core").SpaceValue | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        gap?: import("@tamagui/core").SpaceValue | undefined;
        outlineColor?: import("csstype").Property.OutlineColor | undefined;
        outlineOffset?: import("@tamagui/core").SpaceValue | undefined;
        outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
        outlineWidth?: import("@tamagui/core").SpaceValue | undefined;
        pointerEvents?: "none" | "box-none" | "box-only" | "auto" | undefined;
        rowGap?: import("@tamagui/core").SpaceValue | undefined;
        space?: import("@tamagui/core").SpaceValue | undefined;
        spaceDirection?: import("@tamagui/core").SpaceDirection | undefined;
        separator?: React.ReactNode;
        animation?: import("@tamagui/core").AnimationProp | null | undefined;
        animateOnly?: string[] | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
    } | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("@tamagui/core").TransformStyleProps | keyof import("@tamagui/core").TamaguiComponentPropsBase | "unstyled" | keyof import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> | "displayWhenAdapted">, TamaguiElement> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>>, TamaguiElement>;
    };
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & {
            disableHideBottomOverflow?: boolean | undefined;
            adjustPaddingForOffscreenContent?: boolean | undefined;
        } & {
            __scopeSheet?: Scope<any>;
        } & React.RefAttributes<unknown>>;
        Overlay: React.MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>>>) => null>;
        Handle: ({ __scopeSheet, ...props }: import("@tamagui/sheet").SheetScopedProps<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>>>) => JSX.Element | null;
        ScrollView: React.ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & React.RefAttributes<import("react-native").ScrollView>>;
    };
    Adapt: (({ platform, when, children }: import("@tamagui/adapt").AdaptProps) => any) & {
        Contents: {
            (props: any): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
};
export declare const DialogSheetContents: {
    ({ name, ...props }: {
        name: string;
        context: Omit<DialogContextValue, 'sheetBreakpoint'>;
    }): JSX.Element;
    displayName: string;
};
export { createDialogScope, Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogWarningProvider, };
export type { DialogProps, DialogTriggerProps, DialogPortalProps, DialogOverlayProps, DialogContentProps, DialogTitleProps, DialogDescriptionProps, DialogCloseProps, };
//# sourceMappingURL=Dialog.d.ts.map