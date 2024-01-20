import { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import { GetProps, SizeTokens, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
import type { LayoutRectangle } from 'react-native';
type TabsListFrameProps = GroupProps;
type TabsListProps = TabsListFrameProps & {
    /**
     * Whether to loop over after reaching the end or start of the items
     * @default true
     */
    loop?: boolean;
};
declare const TabsTriggerFrame: import("@tamagui/web").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase, {
    elevation?: number | SizeTokens | undefined;
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
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
    disabled?: boolean | undefined;
    active?: boolean | undefined;
}, {}>;
/**
 * @deprecated Use `TabLayout` instead
 */
type TabsTriggerLayout = LayoutRectangle;
type TabLayout = LayoutRectangle;
type InteractionType = 'select' | 'focus' | 'hover';
type TabsTriggerFrameProps = GetProps<typeof TabsTriggerFrame>;
/**
 * @deprecated use `TabTabsProps` instead
 */
type TabsTriggerProps = TabsTriggerFrameProps & {
    /** The value for the tabs state to be changed to after activation of the trigger */
    value: string;
    /** Used for making custom indicators when trigger interacted with */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
};
type TabsTabProps = TabsTriggerProps;
declare const TabsContentFrame: import("@tamagui/web").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase, {
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined; /**
     * @deprecated Use `TabLayout` instead
     */
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
type TabsContentFrameProps = GetProps<typeof TabsContentFrame>;
type TabsContentExtraProps = {
    /** Will show the content when the value matches the state of Tabs root */
    value: string;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with Tamagui animations.
     */
    forceMount?: true;
};
type TabsContentProps = TabsContentFrameProps & TabsContentExtraProps;
declare const TabsFrame: import("@tamagui/web").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}, {}>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type TabsFrameProps = GetProps<typeof TabsFrame>;
type TabsExtraProps = {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string;
    /** A function called when a new tab is selected */
    onValueChange?: (value: string) => void;
    /**
     * The orientation the tabs are layed out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /**
     * The direction of navigation between toolbar items.
     */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Only supported in web.
     * @defaultValue automatic
     * */
    activationMode?: 'automatic' | 'manual';
};
type TabsProps = TabsFrameProps & TabsExtraProps;
export declare const Tabs: React.ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps> & TabsExtraProps & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps> & TabsExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps, import("@tamagui/web").StackStylePropsBase, {
    size?: SizeTokens | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase & {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof TabsExtraProps> & TabsExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps, import("@tamagui/web").StackStylePropsBase, {
        size?: SizeTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
    }, {}];
} & {
    List: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/web").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
        axis?: "vertical" | "horizontal" | undefined;
        orientation?: "vertical" | "horizontal" | undefined;
        scrollable?: boolean | undefined;
        showScrollIndicator?: boolean | undefined;
        disabled?: boolean | undefined;
        disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
        forceUseItem?: boolean | undefined;
    } & {
        /**
         * Whether to loop over after reaching the end or start of the items
         * @default true
         */
        loop?: boolean | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    /**
     * @deprecated Use Tabs.Tab instead
     */
    Trigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/web").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "disabled" | "active"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: ((type: InteractionType, layout: TabLayout | null) => void) | undefined;
    } & {
        __scopeTabs?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Tab: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "unstyled" | "size" | keyof import("@tamagui/web").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "disabled" | "active"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
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
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: ((type: InteractionType, layout: TabLayout | null) => void) | undefined;
    } & {
        __scopeTabs?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined; /**
         * @deprecated Use `TabLayout` instead
         */
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TabsContentExtraProps> & TabsContentExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsContentExtraProps, import("@tamagui/web").StackStylePropsBase, {
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined; /**
         * @deprecated Use `TabLayout` instead
         */
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
};
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsTriggerLayout, TabsTabProps, TabsContentProps, TabLayout, };
//# sourceMappingURL=Tabs.d.ts.map