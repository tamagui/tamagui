import type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder';
export { adjustPalette, adjustPalettes, createThemes, createV5Theme, interpolateColor, opacify, v5Templates, } from '@tamagui/themes/v5-builder';
export type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder';
export declare const TAILWIND_SHADES: readonly ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
type RampStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type NamedRamp<Name extends string> = {
    [Key in `${Name}${RampStep}`]: string;
};
type FamilyRamp<Name extends string> = {
    light: NamedRamp<Name>;
    dark: NamedRamp<Name>;
};
/** every Tailwind color family as a light/dark ramp ready for createV5Theme */
export declare const tailwindPalettes: {
    readonly slate: FamilyRamp<"slate">;
    readonly gray: FamilyRamp<"gray">;
    readonly zinc: FamilyRamp<"zinc">;
    readonly neutral: FamilyRamp<"neutral">;
    readonly stone: FamilyRamp<"stone">;
    readonly mauve: FamilyRamp<"mauve">;
    readonly olive: FamilyRamp<"olive">;
    readonly mist: FamilyRamp<"mist">;
    readonly taupe: FamilyRamp<"taupe">;
    readonly red: FamilyRamp<"red">;
    readonly orange: FamilyRamp<"orange">;
    readonly amber: FamilyRamp<"amber">;
    readonly yellow: FamilyRamp<"yellow">;
    readonly lime: FamilyRamp<"lime">;
    readonly green: FamilyRamp<"green">;
    readonly emerald: FamilyRamp<"emerald">;
    readonly teal: FamilyRamp<"teal">;
    readonly cyan: FamilyRamp<"cyan">;
    readonly sky: FamilyRamp<"sky">;
    readonly blue: FamilyRamp<"blue">;
    readonly indigo: FamilyRamp<"indigo">;
    readonly violet: FamilyRamp<"violet">;
    readonly purple: FamilyRamp<"purple">;
    readonly fuchsia: FamilyRamp<"fuchsia">;
    readonly pink: FamilyRamp<"pink">;
    readonly rose: FamilyRamp<"rose">;
};
/** default children themes — the same names as v5 so theme="blue" etc never diverge */
export declare const tailwindChildrenThemes: {
    readonly gray: FamilyRamp<"gray">;
    readonly blue: FamilyRamp<"blue">;
    readonly red: FamilyRamp<"red">;
    readonly yellow: FamilyRamp<"yellow">;
    readonly green: FamilyRamp<"green">;
    readonly orange: FamilyRamp<"orange">;
    readonly pink: FamilyRamp<"pink">;
    readonly purple: FamilyRamp<"purple">;
    readonly teal: FamilyRamp<"teal">;
    readonly neutral: FamilyRamp<"neutral">;
};
/** base palettes: white + the Tailwind gray ramp (12 steps, background → foreground) */
export declare const tailwindLightPalette: string[];
export declare const tailwindDarkPalette: string[];
/**
 * Generates the full v6 Tailwind theme set. Identical shape to the v5 themes
 * (same templates, extras and computed values) — only the palette differs.
 * Pass any createV5Theme option to customize, e.g. add families as children:
 *
 *   createTailwindThemes({
 *     childrenThemes: { ...tailwindChildrenThemes, emerald: tailwindPalettes.emerald },
 *   })
 */
export declare function createTailwindThemes<Children extends Record<string, {
    light: Record<string, string>;
    dark: Record<string, string>;
}> = typeof tailwindChildrenThemes>(options?: CreateV5ThemeOptions<Children>): Record<"light" | "dark" | "light_accent" | "dark_accent" | ("black" | "white" | keyof Children extends string ? "light_white_accent" | "dark_black_accent" | "light_black" | "light_white" | "dark_black" | "dark_white" | "light_black_accent" | "dark_white_accent" | "light_white_surface1" | "light_white_surface2" | "dark_black_surface1" | "dark_black_surface2" | "light_black_surface1" | "light_black_surface2" | "dark_white_surface1" | "dark_white_surface2" | `light_${string & keyof Children}` | `light_${string & keyof Children}_accent` | `light_${string & keyof Children}_surface1` | `light_${string & keyof Children}_surface2` | `dark_${string & keyof Children}` | `dark_${string & keyof Children}_accent` | `dark_${string & keyof Children}_surface1` | `dark_${string & keyof Children}_surface2` : never), { [ThemeKey in "color" | "color5" | "color11" | "borderColor" | "shadowColor" | "color1" | "color2" | "color3" | "color4" | "color6" | "color7" | "color8" | "color9" | "color10" | "color12" | "background" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "colorHover" | "colorPress" | "colorFocus" | "colorTransparent" | "borderColorHover" | "borderColorFocus" | "borderColorPress" | "placeholderColor" | "accentBackground" | "accentColor" | "background0" | "color0" | "outlineColor" | "white0" | "black0" | "white1" | "white2" | "white3" | "white4" | "white5" | "white6" | "white7" | "white8" | "white9" | "white10" | "white11" | "white12" | "black1" | "black2" | "black3" | "black4" | "black5" | "black6" | "black7" | "black8" | "black9" | "black10" | "black11" | "black12" | "background02" | "background04" | "background06" | "background08" | "color02" | "color04" | "color06" | "color08" | "shadow1" | "shadow2" | "shadow3" | "shadow4" | "shadow5" | "shadow6" | "accent1" | "accent2" | "accent3" | "accent4" | "accent5" | "accent6" | "accent7" | "accent8" | "accent9" | "accent10" | "accent11" | "accent12" | "black" | "white" | "white02" | "white04" | "white06" | "white08" | "black02" | "black04" | "black06" | "black08" | "shadow7" | "shadow8" | "highlight1" | "highlight2" | "highlight3" | "highlight4" | "highlight5" | "highlight6" | "highlight7" | "highlight8" | "accent0" | keyof (({ [K in keyof Children]: Children[K]["dark"]; }[keyof Children] extends infer T ? T extends { [K in keyof Children]: Children[K]["dark"]; }[keyof Children] ? T extends any ? (k: T) => void : never : never : never) extends (k: infer I) => void ? I : never)]: string; } & Omit<{
    color01: string;
    color0075: string;
    color005: string;
    color0025: string;
    color002: string;
    color001: string;
    background01: string;
    background0075: string;
    background005: string;
    background0025: string;
    background002: string;
    background001: string;
    background02: string;
    background04: string;
    background06: string;
    background08: string;
    outlineColor: string;
}, never>>;
//# sourceMappingURL=v6-builder.d.ts.map