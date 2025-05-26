import type { GetProps } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import React from 'react';
import { type SpaceProps } from '@tamagui/spacer';
type DisablePassBorderRadius = boolean | 'bottom' | 'top' | 'start' | 'end';
export declare const GroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type GroupExtraProps = SpaceProps & {
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
export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps;
export type GroupItemProps = {
    children: React.ReactNode;
    /**
     * forces the item to be a starting, center or ending item and gets the respective styles
     */
    forcePlacement?: 'first' | 'center' | 'last';
};
export declare const useGroupItem: (childrenProps: {
    disabled: boolean;
    ref?: any;
}, forcePlacement?: GroupItemProps["forcePlacement"], __scopeGroup?: Scope) => Record<string, any>;
export declare const Group: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: React.ForwardRefExoticComponent<GroupItemProps & {
        __scopeGroup?: Scope;
    } & React.RefAttributes<unknown>>;
};
export declare const YGroup: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: React.ForwardRefExoticComponent<GroupItemProps & {
        __scopeGroup?: Scope;
    } & React.RefAttributes<unknown>>;
};
export declare const XGroup: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
    orientation?: "horizontal" | "vertical";
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
} & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }>, "disabled" | keyof SpaceProps | "orientation" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup"> & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & SpaceProps & {
        orientation?: "horizontal" | "vertical";
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
    } & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: React.ForwardRefExoticComponent<GroupItemProps & {
        __scopeGroup?: Scope;
    } & React.RefAttributes<unknown>>;
};
export {};
//# sourceMappingURL=Group.d.ts.map