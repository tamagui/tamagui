import { GetProps, TamaguiElement } from '@tamagui/core';
import { XStackProps } from '@tamagui/stacks';
import React from 'react';
import { View } from 'react-native';
import { SheetProps, SheetScopedProps } from './types';
export { createSheetScope } from './SheetContext';
export declare const SheetHandleFrame: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "open"> & {
    readonly open?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "open"> & {
    readonly open?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "open"> & {
    readonly open?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly open?: boolean | undefined;
}>;
export declare const SheetHandle: ({ __scopeSheet, ...props }: SheetScopedProps<XStackProps>) => JSX.Element;
export declare const SheetOverlayFrame: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "closed"> & {
    readonly closed?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "closed"> & {
    readonly closed?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, "closed"> & {
    readonly closed?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    readonly closed?: boolean | undefined;
}>;
export declare type SheetOverlayProps = GetProps<typeof SheetOverlayFrame>;
export declare const SheetOverlay: ({ __scopeSheet, ...props }: SheetScopedProps<SheetOverlayProps>) => JSX.Element;
export declare const SheetFrameFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>>) | (Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), TamaguiElement, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} | ({
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    [x: string]: undefined;
})>;
export declare const SheetFrame: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
}>> & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & React.RefAttributes<unknown>>;
export declare const Sheet: React.ForwardRefExoticComponent<{
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    onOpenChange?: (((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>) | undefined;
    position?: number | undefined;
    defaultPosition?: number | undefined;
    snapPoints?: number[] | undefined;
    onPositionChange?: import("./types").PositionChangeHandler | undefined;
    children?: React.ReactNode;
    dismissOnOverlayPress?: boolean | undefined;
    dismissOnSnapToBottom?: boolean | undefined;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy | undefined;
    handleDisableScroll?: boolean | undefined;
    disableDrag?: boolean | undefined;
    modal?: boolean | undefined;
    zIndex?: number | undefined;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & React.RefAttributes<View>> & {
    Handle: ({ __scopeSheet, ...props }: SheetScopedProps<XStackProps>) => JSX.Element;
    Frame: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & {
        __scopeSheet?: import("@tamagui/create-context").Scope<any>;
    } & React.RefAttributes<unknown>>;
    Overlay: ({ __scopeSheet, ...props }: SheetScopedProps<SheetOverlayProps>) => JSX.Element;
    ScrollView: React.ForwardRefExoticComponent<((import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps>) | Pick<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
};
export declare const ControlledSheet: React.FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & React.RefAttributes<View>> & {
    Handle: ({ __scopeSheet, ...props }: SheetScopedProps<XStackProps>) => JSX.Element;
    Frame: React.ForwardRefExoticComponent<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("@tamagui/types-react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
    }>> & {
        __scopeSheet?: import("@tamagui/create-context").Scope<any>;
    } & React.RefAttributes<unknown>>;
    Overlay: ({ __scopeSheet, ...props }: SheetScopedProps<SheetOverlayProps>) => JSX.Element;
    ScrollView: React.ForwardRefExoticComponent<((import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps>) | Pick<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").ScrollViewProps & Omit<import("@tamagui/core").StackProps, keyof import("react-native").ScrollViewProps> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
};
declare type SheetControllerContextValue = {
    disableDrag?: boolean;
    open?: boolean;
    hidden?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
};
export declare const SheetController: ({ children, onOpenChange, ...value }: Partial<SheetControllerContextValue> & {
    children?: React.ReactNode;
}) => JSX.Element;
//# sourceMappingURL=Sheet.d.ts.map