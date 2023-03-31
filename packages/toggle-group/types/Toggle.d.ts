import { GetProps } from '@tamagui/web';
import * as React from 'react';
declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>>, import("@tamagui/web").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>;
type ToggleProps = GetProps<typeof ToggleFrame> & {
    defaultValue?: string;
    disabled?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?(pressed: boolean): void;
};
declare const Toggle: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
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
}, "size" | "unstyled" | "orientation"> & {
    readonly unstyled?: boolean | undefined;
    readonly orientation?: "horizontal" | "vertical" | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>> & {
    defaultValue?: string | undefined;
    disabled?: boolean | undefined;
    pressed?: boolean | undefined;
    defaultPressed?: boolean | undefined;
    onPressedChange?(pressed: boolean): void;
} & React.RefAttributes<HTMLButtonElement>>;
export { Toggle };
export type { ToggleProps };
//# sourceMappingURL=Toggle.d.ts.map