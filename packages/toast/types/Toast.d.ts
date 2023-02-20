import { GetProps, TamaguiElement } from '@tamagui/core';
import { DismissableProps } from '@tamagui/dismissable';
import * as React from 'react';
declare const ToastViewportFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps) | (Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {} | {
    [x: string]: undefined;
}>;
type ToastViewportFrameProps = GetProps<typeof ToastViewportFrame>;
type ToastViewportProps = ToastViewportFrameProps & {
    /**
     * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
     * @defaultValue ['F8']
     */
    hotkey?: string[];
    /**
     * An author-localized label for the toast viewport to provide context for screen reader users
     * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
     * @defaultValue 'Notifications ({hotkey})'
     */
    label?: string;
};
declare const ToastTitleFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | (Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps, {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})>;
type PrimitiveDivProps = GetProps<typeof ToastTitleFrame>;
type ToastTitleProps = PrimitiveDivProps & {};
declare const ToastDescriptionFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>) | (Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>) | (Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps, ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & ({} | {
    [x: string]: undefined;
} | {
    [x: string]: undefined;
})>;
type ToastDescriptionFrameProps = GetProps<typeof ToastDescriptionFrame>;
type ToastDescriptionProps = ToastDescriptionFrameProps & {};
type ToastActionProps = ToastCloseProps & {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
};
declare const ToastCloseFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} | ({
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    [x: string]: undefined;
})>;
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>;
type ToastCloseProps = ToastCloseFrameProps & {};
type SwipeDirection = 'up' | 'down' | 'left' | 'right';
declare const createToastScope: import("@tamagui/create-context").CreateScope;
interface ToastProviderProps {
    children?: React.ReactNode;
    /**
     * An author-localized label for each toast. Used to help screen reader users
     * associate the interruption with a toast.
     * @defaultValue 'Notification'
     */
    label?: string;
    /**
     * Time in milliseconds that each toast should remain visible for.
     * @defaultValue 5000
     */
    duration?: number;
    /**
     * Direction of pointer swipe that should close the toast.
     * @defaultValue 'right'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels that the swipe must pass before a close is triggered.
     * @defaultValue 50
     */
    swipeThreshold?: number;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
declare const ToastImplFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
}, "backgrounded"> & {
    backgrounded?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
}, "backgrounded"> & {
    backgrounded?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
}, "backgrounded"> & {
    backgrounded?: boolean | undefined;
}>>, TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
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
    backgrounded?: boolean | undefined;
}>;
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const Toast: ((props: Omit<ToastProps & React.RefAttributes<TamaguiElement>, "theme" | "themeInverse"> & import("@tamagui/core").ThemeableProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null) & {
    Viewport: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & {
        /**
         * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
         * @defaultValue ['F8']
         */
        hotkey?: string[] | undefined;
        /**
         * An author-localized label for the toast viewport to provide context for screen reader users
         * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
         * @defaultValue 'Notifications ({hotkey})'
         */
        label?: string | undefined;
    }) | Pick<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & {
        /**
         * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
         * @defaultValue ['F8']
         */
        hotkey?: string[] | undefined;
        /**
         * An author-localized label for the toast viewport to provide context for screen reader users
         * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
         * @defaultValue 'Notifications ({hotkey})'
         */
        label?: string | undefined;
    }, string | number>) & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
    Description: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number> | Pick<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, string | number> | Pick<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendsBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNTextProps & Omit<{
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
    Action: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & {
        /**
         * A short description for an alternate way to carry out the action. For screen reader users
         * who will not be able to navigate to the button easily/quickly.
         * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
         * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
         */
        altText: string;
    }) | Pick<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
    }, string | number>) & React.RefAttributes<TamaguiElement>>;
    Close: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
};
type SwipeEvent = {
    currentTarget: EventTarget & TamaguiElement;
} & Omit<CustomEvent<{
    originalEvent: React.PointerEvent;
    delta: {
        x: number;
        y: number;
    };
}>, 'currentTarget'>;
type ToastImplPrivateProps = {
    open: boolean;
    onClose(): void;
};
type ToastImplFrameProps = GetProps<typeof ToastImplFrame>;
type ToastImplProps = ToastImplPrivateProps & ToastImplFrameProps & {
    type?: 'foreground' | 'background';
    /**
     * Time in milliseconds that toast should remain visible for. Overrides value
     * given to `ToastProvider`.
     */
    duration?: number;
    onEscapeKeyDown?: DismissableProps['onEscapeKeyDown'];
    onPause?(): void;
    onResume?(): void;
    onSwipeStart?(event: SwipeEvent): void;
    onSwipeMove?(event: SwipeEvent): void;
    onSwipeCancel?(event: SwipeEvent): void;
    onSwipeEnd?(event: SwipeEvent): void;
};
interface CreateToastOptions {
    native: boolean | ('web' | 'mobile')[];
}
declare const createToast: (options: CreateToastOptions) => {
    toastCount: number;
    toasts: any[];
    show: (showOptions: Pick<CreateNativeToastsOptions, 'title' | 'body' | 'preset' | 'duration'>) => void;
    hide: () => void;
};
export { createToastScope, ToastProvider, Toast, createToast, };
export type { ToastProviderProps, ToastViewportProps, ToastProps, ToastTitleProps, ToastDescriptionProps, ToastActionProps, ToastCloseProps, };
//# sourceMappingURL=Toast.d.ts.map