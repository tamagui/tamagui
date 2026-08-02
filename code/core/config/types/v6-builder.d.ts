import { createV5Theme } from '@tamagui/themes/v5-builder';
import type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder';
import type { V6Themes } from './v6-themes';
export { adjustPalette, adjustPalettes, createThemes, createV5Theme, interpolateColor, opacify, v5Templates, } from '@tamagui/themes/v5-builder';
export type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder';
export declare const TAILWIND_SHADES: readonly ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
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
}> = typeof tailwindChildrenThemes>(options?: CreateV5ThemeOptions<Children>): V6Themes<ReturnType<typeof createV5Theme<Children>>>;
//# sourceMappingURL=v6-builder.d.ts.map