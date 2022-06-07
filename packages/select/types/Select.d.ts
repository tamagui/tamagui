import { GetProps, SizeTokens } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import { ListItemProps } from '@tamagui/list-item';
import { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
import { View } from 'react-native';
declare type TamaguiElement = HTMLElement | View;
declare type ScopedProps<P> = P & {
    __scopeSelect?: Scope;
};
declare const createSelectScope: import("@tamagui/create-context").CreateScope;
declare type GenericElement = HTMLElement | View;
declare type Direction = 'ltr' | 'rtl';
export declare type SelectTriggerProps = ListItemProps;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/helpers-tamagui").TextParentStyles, "TextComponent"> & Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    size?: SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    size?: SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    size?: SizeTokens | undefined;
    active?: boolean | undefined;
    disabled?: boolean | undefined;
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
} & React.RefAttributes<GenericElement>>;
export declare const SelectIcon: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}>>) | (Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export declare const SelectViewportFrame: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export declare type SelectViewportProps = GetProps<typeof SelectViewportFrame>;
interface SelectItemProps extends YStackProps {
    value: string;
    index: number;
    disabled?: boolean;
    textValue?: string;
}
export declare type SelectLabelProps = ListItemProps;
interface SelectScrollButtonProps extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {
}
interface SelectScrollButtonImplProps extends YStackProps {
    dir: 'up' | 'down';
    componentName: string;
}
export declare const SelectSeparator: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "vertical"> & {
    vertical?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "vertical"> & {
    vertical?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "vertical"> & {
    vertical?: boolean | undefined;
}>>) | (Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    vertical?: boolean | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), any, import("@tamagui/core").StackPropsBase, {
    vertical?: boolean | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
export interface SelectProps {
    children?: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?(value: string): void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    name?: string;
    autoComplete?: string;
}
export declare const Select: ((props: ScopedProps<SelectProps>) => JSX.Element) & {
    Content: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<any>>;
    Group: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
    Icon: import("@tamagui/core").TamaguiComponent<(Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>>) | (Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), any, import("@tamagui/core").StackPropsBase, {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    })>;
    Item: React.ForwardRefExoticComponent<SelectItemProps & React.RefAttributes<TamaguiElement>>;
    ItemIndicator: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
    ItemText: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>>) | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number> | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, string | number> | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
    Label: React.ForwardRefExoticComponent<Omit<import("@tamagui/helpers-tamagui").TextParentStyles, "TextComponent"> & Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
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
    } & React.RefAttributes<TamaguiElement>>;
    ScrollDownButton: React.ForwardRefExoticComponent<SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    ScrollUpButton: React.ForwardRefExoticComponent<SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/helpers-tamagui").TextParentStyles, "TextComponent"> & Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, "disabled" | "size" | "active"> & {
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
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
    } & React.RefAttributes<GenericElement>>;
    Value: React.ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }>> & {
        placeholder?: React.ReactNode;
    }) | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: React.ReactNode;
    }, string | number> | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: React.ReactNode;
    }, string | number> | Pick<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    } & ({} | {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: React.ReactNode;
    }, string | number>) & React.RefAttributes<TamaguiElement>>;
    Viewport: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "fontFamily" | "focusable" | "backgrounded" | "radiused" | "hoverable" | "pressable" | "circular" | "padded" | "elevate" | "bordered" | "transparent" | "chromeless"> & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }>>) | Pick<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        fontFamily?: unknown;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverable?: boolean | undefined;
        pressable?: boolean | undefined;
        focusable?: boolean | undefined;
        circular?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        transparent?: boolean | undefined;
        chromeless?: boolean | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, string | number>) & React.RefAttributes<TamaguiElement>>;
};
export { createSelectScope };
//# sourceMappingURL=Select.d.ts.map