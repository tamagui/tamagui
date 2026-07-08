import type { GetProps, TamaguiElement, ViewStyle } from '@tamagui/web';
export declare const ToggleFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").ViewProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    unstyled?: boolean | undefined;
    size?: number | import("@tamagui/web").SizeTokens | undefined;
    defaultActiveStyle?: boolean | undefined;
}, {
    accept: {
        readonly activeStyle: "style";
    };
}>;
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