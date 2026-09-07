import type { FontSizeTokens, SizeTokens } from '@tamagui/web';
/**
 * A control's size token is accepted too, so a Label sized like the control
 * next to it shares the same value: `true` and a named size read the size
 * recipe's font key, anything else is a font.size key already. Exported by
 * name so the built types keep the alias and resolve it against the user's
 * config, instead of baking the config-less `string` into the .d.ts.
 */
export type GetFontSizedInput = FontSizeTokens | SizeTokens | number | true;
export declare const getFontSized: import("@tamagui/web/types/types").StyledDynamicFn<GetFontSizedInput, Record<string, any>>;
export declare const SizableText: import("react").FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
    size?: GetFontSizedInput | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: GetFontSizedInput | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: GetFontSizedInput | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
//# sourceMappingURL=index.d.ts.map