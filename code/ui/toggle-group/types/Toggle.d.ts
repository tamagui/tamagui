import type { GetProps, StylePiece, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
export declare const ToggleFrame: React.FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "active" | "defaultActiveStyle" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    active?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
    size?: number | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleItemExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    defaultValue?: string;
    disabled?: boolean;
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?(active: boolean): void;
    activeStyle?: StylePiece | null;
    activeTheme?: string | null;
};
export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps;
export declare const Toggle: import("@tamagui/compose-refs").RefComponent<TamaguiElement, ToggleProps>;
export {};
//# sourceMappingURL=Toggle.d.ts.map