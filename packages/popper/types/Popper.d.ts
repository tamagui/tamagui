import { Placement, shift } from '@floating-ui/react-dom';
import { flip } from '@floating-ui/react-native';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
declare type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
declare type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export declare const createPopperScope: import("@tamagui/create-context").CreateScope;
export declare type PopperProps = {
    children?: React.ReactNode;
};
export declare const Popper: React.FC<PopperProps>;
declare type PopperAnchorRef = React.Ref<HTMLDivElement | View>;
export declare type PopperAnchorProps = YStackProps & {
    virtualRef?: React.RefObject<any>;
};
export declare const PopperAnchor: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
} & import("@tamagui/core/types").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & import("@tamagui/core/types").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & {
    virtualRef?: React.RefObject<any> | undefined;
} & React.RefAttributes<PopperAnchorRef>>;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
} & import("@tamagui/core/types").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & import("@tamagui/core/types").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & {
    placement?: Placement | undefined;
    stayInFrame?: ShiftProps;
    allowFlip?: FlipProps;
} & React.RefAttributes<any>>;
export declare type PopperArrowProps = YStackProps & {
    offset?: number;
};
export declare const PopperArrow: React.ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
} & import("@tamagui/core/types").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & import("@tamagui/core/types").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & {
    offset?: number | undefined;
} & React.RefAttributes<import("@tamagui/core/types").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
} & import("@tamagui/core/types").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>> & import("@tamagui/core/types").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core/types").RNWViewProps & import("@tamagui/core/types").TamaguiComponentPropsBase & import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase> & import("@tamagui/core/types").WithShorthands<import("@tamagui/core/types").WithThemeValues<import("@tamagui/core/types").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>>, any, import("@tamagui/core/types").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core/types").SizeTokens | undefined;
}>>>;
export {};
//# sourceMappingURL=Popper.d.ts.map