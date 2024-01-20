import { GetProps, TamaguiElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import React from 'react';
type DisablePassBorderRadius = boolean | 'bottom' | 'top' | 'start' | 'end';
type ScopedProps<P> = P & {
    __scopeGroup?: Scope;
};
export declare const GroupFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, {}>;
export type GroupProps = GetProps<typeof GroupFrame> & {
    /**
     * @deprecated use `orientation` instead
     */
    axis?: 'horizontal' | 'vertical';
    orientation?: 'horizontal' | 'vertical';
    scrollable?: boolean;
    /**
     * @default false
     */
    showScrollIndicator?: boolean;
    disabled?: boolean;
    disablePassBorderRadius?: DisablePassBorderRadius;
    /**
     * forces the group to use the Group.Item API
     */
    forceUseItem?: boolean;
};
export type GroupItemProps = {
    children: React.ReactNode;
    /**
     * forces the item to be a starting, center or ending item and gets the respective styles
     */
    forcePlacement?: 'first' | 'center' | 'last';
};
export declare const useGroupItem: (childrenProps: {
    disabled: boolean;
}, forcePlacement?: GroupItemProps['forcePlacement'], __scopeGroup?: Scope) => Record<string, any>;
export declare const Group: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/core").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    /**
     * @deprecated use `orientation` instead
     */
    axis?: "horizontal" | "vertical" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    /**
     * @default false
     */
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: DisablePassBorderRadius | undefined;
    /**
     * forces the group to use the Group.Item API
     */
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<TamaguiElement>> & {
    Item: (props: ScopedProps<GroupItemProps>) => any;
};
export declare const YGroup: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/core").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    /**
     * @deprecated use `orientation` instead
     */
    axis?: "horizontal" | "vertical" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    /**
     * @default false
     */
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: DisablePassBorderRadius | undefined;
    /**
     * forces the group to use the Group.Item API
     */
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<TamaguiElement>> & {
    Item: (props: ScopedProps<GroupItemProps>) => any;
};
export declare const XGroup: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/core").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    /**
     * @deprecated use `orientation` instead
     */
    axis?: "horizontal" | "vertical" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    /**
     * @default false
     */
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: DisablePassBorderRadius | undefined;
    /**
     * forces the group to use the Group.Item API
     */
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<TamaguiElement>> & {
    Item: (props: ScopedProps<GroupItemProps>) => any;
};
export {};
//# sourceMappingURL=Group.d.ts.map