import { FontSizeTokens, GetProps, TamaguiElement, TamaguiTextElement } from '@tamagui/core';
import { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
import { ScopedProps, SelectProps } from './types';
declare const SelectValueFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
} | ({
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    };
}>;
type SelectValueProps = GetProps<typeof SelectValueFrame> & {
    placeholder?: React.ReactNode;
};
export declare const SelectIcon: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>>) | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} | ({
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    };
}>;
export declare const SelectItemTextFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
}, "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, TamaguiTextElement, import("@tamagui/core").TextPropsBase, {
    readonly unstyled?: boolean | undefined;
    readonly size?: FontSizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    };
}>;
export declare const SelectGroupFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>>) | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} | ({
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    };
}>;
export type SelectLabelProps = ListItemProps;
export declare const SelectSeparator: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "vertical"> & {
    readonly vertical?: boolean | undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "vertical"> & {
    readonly vertical?: boolean | undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "vertical"> & {
    readonly vertical?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
    style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly vertical?: boolean | undefined;
} | ({
    readonly vertical?: boolean | undefined;
} & {
    [x: string]: undefined;
}), {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    };
    __variantProps: {
        readonly vertical?: boolean | undefined;
    };
}>;
export declare const Select: ((props: ScopedProps<SelectProps>) => JSX.Element) & {
    Adapt: (({ platform, when, children }: import("@tamagui/adapt").AdaptProps) => any) & {
        Contents: {
            (props: any): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    Content: ({ children, __scopeSelect, zIndex, ...focusScopeProps }: {
        children?: React.ReactNode;
        zIndex?: number | undefined;
    } & {
        __scopeSelect?: import("@tamagui/create-context").Scope;
    } & import("@tamagui/focus-scope").FocusScopeProps) => JSX.Element | null;
    Group: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & React.RefAttributes<TamaguiElement>>;
    Icon: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), TamaguiElement, Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } | ({
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), {
        displayName: string | undefined;
        __baseProps: Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        };
        __variantProps: {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        };
    }>;
    Item: React.ForwardRefExoticComponent<import("./SelectItem").SelectItemProps & React.RefAttributes<TamaguiElement>>;
    ItemIndicator: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & React.RefAttributes<TamaguiElement>>;
    ItemText: React.ForwardRefExoticComponent<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & React.RefAttributes<TamaguiTextElement>>;
    Label: React.ForwardRefExoticComponent<Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/core").ThemeableProps & {
        icon?: (JSX.Element | React.FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null) | undefined;
        iconAfter?: (JSX.Element | React.FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null) | undefined;
        scaleIcon?: number | undefined;
        spaceFlex?: number | boolean | undefined;
        scaleSpace?: number | undefined;
        title?: React.ReactNode;
        subTitle?: React.ReactNode;
        noTextWrap?: boolean | "all" | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    ScrollDownButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    ScrollUpButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/core").ThemeableProps & {
        icon?: (JSX.Element | React.FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null) | undefined;
        iconAfter?: (JSX.Element | React.FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null) | undefined;
        scaleIcon?: number | undefined;
        spaceFlex?: number | boolean | undefined;
        scaleSpace?: number | undefined;
        title?: React.ReactNode;
        subTitle?: React.ReactNode;
        noTextWrap?: boolean | "all" | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Value: import("@tamagui/core").ReactComponentWithRef<SelectValueProps & Omit<(Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), "style" | "ellipse" | "disabled" | "size" | "className" | "id" | "placeholder" | "tabIndex" | "role" | "color" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "children" | "dangerouslySetInnerHTML" | "onFocus" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseUp" | "onScroll" | "space" | "zIndex" | `$${string}` | `$${number}` | "x" | "y" | "display" | "hitSlop" | "pointerEvents" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "importantForAccessibility" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "gap" | "columnGap" | "rowGap" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "userSelect" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "scaleX" | "scaleY" | "translateX" | "translateY" | "perspective" | "scale" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "theme" | "fontFamily" | "fontSize" | "textShadowColor" | "lineHeight" | "fontWeight" | "letterSpacing" | `$theme-${string}` | `$theme-${number}` | "target" | "asChild" | "debug" | "themeShallow" | "tag" | "componentName" | "disableOptimization" | "forceStyle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "hoverStyle" | "pressStyle" | "focusStyle" | "exitStyle" | "enterStyle" | "fontStyle" | "textAlign" | "unstyled" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "minimumFontScale" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | "textDecorationDistance" | "textOverflow" | "whiteSpace" | "wordWrap" | "textDecorationLine" | "textDecorationStyle" | "textDecorationColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "fontVariant" | "writingDirection" | "textAlignVertical" | "verticalAlign" | "includeFontPadding">, TamaguiTextElement> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<(Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        }>>) | (Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "style" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseTextProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").TextStyle | (React.CSSProperties & import("react-native").TextStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
            readonly unstyled?: boolean | undefined;
            readonly size?: FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>>), TamaguiTextElement>;
    };
    Viewport: import("@tamagui/core").ReactComponentWithRef<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
        size?: import("@tamagui/core").SizeTokens | undefined;
        disableScroll?: boolean | undefined;
        unstyled?: boolean | undefined;
    } & Omit<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/core").SizeTokens | undefined;
    }>>, "style" | "size" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "zIndex" | `$${string}` | `$${number}` | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "importantForAccessibility" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "elevation" | keyof {
        columnGap?: import("@tamagui/core").SpaceValue | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        display?: "inherit" | "flex" | "none" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        gap?: import("@tamagui/core").SpaceValue | undefined;
        outlineColor?: import("csstype").Property.OutlineColor | undefined;
        outlineOffset?: import("@tamagui/core").SpaceValue | undefined;
        outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
        outlineWidth?: import("@tamagui/core").SpaceValue | undefined;
        pointerEvents?: "auto" | "none" | "box-none" | "box-only" | undefined;
        rowGap?: import("@tamagui/core").SpaceValue | undefined;
        space?: import("@tamagui/core").SpaceValue | undefined;
        spaceDirection?: import("@tamagui/core").SpaceDirection | undefined;
        separator?: React.ReactNode;
        animation?: import("@tamagui/core").AnimationProp | null | undefined;
        animateOnly?: string[] | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
    } | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | keyof import("@tamagui/core").TransformStyleProps | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | keyof import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
        style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
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
    }>> | "unstyled" | "disableScroll">, TamaguiElement> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/core").SizeTokens | undefined;
        }>>, TamaguiElement>;
    };
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & {
            disableHideBottomOverflow?: boolean | undefined;
        } & {
            __scopeSheet?: import("@tamagui/create-context").Scope<any>;
        } & React.RefAttributes<unknown>>;
        Overlay: React.MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
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
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "style" | "children" | "display" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").TamaguiComponentPropsBase & {
            style?: import("@tamagui/core").StyleProp<React.CSSProperties | import("react-native").ViewStyle | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
        }, "open" | "unstyled"> & {
            readonly open?: boolean | undefined;
            readonly unstyled?: boolean | undefined;
        }>>>) => JSX.Element | null;
        ScrollView: React.ForwardRefExoticComponent<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        } & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
        }>> & React.RefAttributes<import("react-native").ScrollView>>;
    };
};
export {};
//# sourceMappingURL=Select.d.ts.map