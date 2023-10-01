import { GetProps, NativePlatform, NativeValue, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import { CustomData, useToast, useToastController, useToastState } from './ToastImperative';
import { ToastProps } from './ToastImpl';
import { ToastProvider, ToastProviderProps } from './ToastProvider';
import { ToastViewport, ToastViewportProps } from './ToastViewport';
declare const ToastTitle: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    };
}>;
type ToastTitleProps = GetProps<typeof ToastTitle>;
declare const ToastDescription: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    };
}>;
type ToastDescriptionProps = GetProps<typeof ToastDescription>;
type ToastActionProps = ToastCloseProps & {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
};
declare const ToastCloseFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
}>>) | (Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
} & ({} | {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>;
type ToastCloseProps = ToastCloseFrameProps & {};
declare const Toast: ((props: Omit<ToastProps & {
    __scopeToast?: string | undefined;
} & React.RefAttributes<TamaguiElement>, "theme" | "themeInverse"> & import("@tamagui/core").ThemeableProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        readonly unstyled?: boolean | undefined;
    }, {
        displayName: string | undefined;
        __baseProps: Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
        __variantProps: {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
        };
    }>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        readonly unstyled?: boolean | undefined;
    }, {
        displayName: string | undefined;
        __baseProps: Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
            style?: import("@tamagui/core").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
        __variantProps: {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
        };
    }>;
    Action: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    }>> & {
        /**
         * A short description for an alternate way to carry out the action. For screen reader users
         * who will not be able to navigate to the button easily/quickly.
         * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
         * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
         */
        altText: string;
    } & {
        __scopeToast?: string | undefined;
    }) | Omit<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    }>> & {
        /**
         * A short description for an alternate way to carry out the action. For screen reader users
         * who will not be able to navigate to the button easily/quickly.
         * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
         * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
         */
        altText: string;
    } & {
        __scopeToast?: string | undefined;
    }, "ref">) & React.RefAttributes<TamaguiElement>>;
    Close: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
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
    }>>) | Omit<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "style" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & import("@tamagui/core").TamaguiComponentPropsBaseBase & {
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: number | import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & React.RefAttributes<TamaguiElement>>;
};
export { Toast, ToastProvider, ToastViewport, useToast, useToastController, useToastState, };
export type { CustomData, ToastActionProps, ToastCloseProps, ToastDescriptionProps, NativePlatform as ToastNativePlatform, NativeValue as ToastNativeValue, ToastProps, ToastProviderProps, ToastTitleProps, ToastViewportProps, };
//# sourceMappingURL=Toast.d.ts.map