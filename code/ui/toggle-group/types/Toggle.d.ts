import type { GetProps, TamaguiElement, ViewStyle } from '@tamagui/web';
import * as React from 'react';
export declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
}, {
    accept: {
        readonly activeStyle: "style";
    };
}>;
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleItemExtraProps = {
    defaultValue?: string;
    disabled?: boolean;
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?(active: boolean): void;
    activeStyle?: ViewStyle | null;
    activeTheme?: string | null;
};
export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps;
export declare const Toggle: React.ForwardRefExoticComponent<Omit<import("@tamagui/web").StackNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase | "activeStyle" | "unstyled" | "defaultActiveStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").StackProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
}>> & ToggleItemExtraProps & React.RefAttributes<TamaguiElement>>;
export {};
//# sourceMappingURL=Toggle.d.ts.map