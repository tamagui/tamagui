import type { FontSizeTokens } from '@tamagui/web';
/**
 * `size` is the font scale only: a font.size key, a raw px number, or `true`
 * for the default. `true` reads the type-scale key when the active font
 * carries it, else the numeric default, so every shipped config keeps its
 * current default (`sm` on v6, `4` on v5 and the default config).
 */
export type GetFontSizedInput = FontSizeTokens | number | true;
export declare const getFontSized: import("@tamagui/web/types/types").StyledDynamicFn<GetFontSizedInput, Record<string, any>>;
//# sourceMappingURL=index.d.ts.map