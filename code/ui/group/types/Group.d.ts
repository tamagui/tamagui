import type { GetProps } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import React from 'react';
type ScopedProps<P> = P & {
    __scopeGroup?: Scope;
};
declare const createGroupScope: import("@tamagui/create-context").CreateScope;
export declare const GroupFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "size" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }, import("@tamagui/core").StaticConfigPublic];
};
export type GroupExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
};
export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps;
export type GroupItemProps = {
    children: React.ReactNode;
    /**
     * forces the item to be a starting, center or ending item and gets the respective styles
     */
    forcePlacement?: 'first' | 'center' | 'last';
};
declare function GroupItem(props: ScopedProps<GroupItemProps & Record<string, any>>): any;
export declare const useGroupItem: (childrenProps: {
    disabled?: boolean;
}, forcePlacement?: GroupItemProps['forcePlacement'], __scopeGroup?: Scope) => {
    disabled: boolean | undefined;
    borderTopLeftRadius?: number | undefined;
    borderTopRightRadius?: number | undefined;
    borderBottomLeftRadius?: number | undefined;
    borderBottomRightRadius?: number | undefined;
};
export declare const Group: React.FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const YGroup: React.FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const XGroup: React.FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }>, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export { createGroupScope };
//# sourceMappingURL=Group.d.ts.map