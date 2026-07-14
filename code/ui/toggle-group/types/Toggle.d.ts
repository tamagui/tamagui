import type { GetProps, TamaguiElement, ViewStyle } from '@tamagui/web';
import * as React from 'react';
export declare const ToggleFrame: React.FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "active" | "size" | keyof import("@tamagui/web").StackStyleBase | "activeStyle" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    color?: string | undefined;
    active?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    color?: string | undefined;
    active?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    color?: string | undefined;
    active?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
    defaultActiveStyle?: boolean | undefined;
}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    color?: string | undefined;
    active?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
    defaultActiveStyle?: boolean | undefined;
}, {
    accept: {
        readonly activeStyle: "style";
    };
}> & Omit<{
    accept: {
        readonly activeStyle: "style";
    };
}, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        color?: string | undefined;
        active?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
        defaultActiveStyle?: boolean | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }];
};
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleItemExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    defaultValue?: string;
    disabled?: boolean;
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?(active: boolean): void;
    activeStyle?: ViewStyle | null;
    activeTheme?: string | null;
};
export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps;
export declare const Toggle: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ToggleProps>;
export {};
//# sourceMappingURL=Toggle.d.ts.map