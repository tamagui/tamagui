import type { GetProps, TamaguiTextElement } from '@tamagui/core';
import type { SelectScopedProps } from './types';
export declare const ITEM_TEXT_NAME = "SelectItemText";
export declare const SelectItemTextFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type SelectItemTextExtraProps = SelectScopedProps<{}>;
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> & SelectItemTextExtraProps;
export declare const SelectItemText: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>, "scope"> & {
    scope?: import("./types").SelectScopes;
}, TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItemText.d.ts.map