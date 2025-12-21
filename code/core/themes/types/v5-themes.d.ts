import { opacify } from './opacify';
/**
 * Apply alpha transparency to a color.
 * Works with hex colors (#fff, #ffffff) and hsl/hsla colors.
 *
 * @example
 * alpha('#ff0000', 0.5) // '#ff000080'
 * alpha('hsl(0, 100%, 50%)', 0.5) // 'hsla(0, 100%, 50%, 0.5)'
 */
export declare const alpha: typeof opacify;
declare const darkPalette: string[];
declare const lightPalette: string[];
export { darkPalette, lightPalette };
export declare const defaultColors: {
    light: {
        blue: Record<string, string>;
        gray: Record<string, string>;
        green: Record<string, string>;
        neutral: {
            neutral1: string;
            neutral2: string;
            neutral3: string;
            neutral4: string;
            neutral5: string;
            neutral6: string;
            neutral7: string;
            neutral8: string;
            neutral9: string;
            neutral10: string;
            neutral11: string;
            neutral12: string;
        };
        orange: Record<string, string>;
        pink: Record<string, string>;
        purple: Record<string, string>;
        red: Record<string, string>;
        teal: Record<string, string>;
        yellow: Record<string, string>;
    };
    dark: {
        blue: Record<string, string>;
        gray: Record<string, string>;
        green: Record<string, string>;
        neutral: {
            neutral1: string;
            neutral2: string;
            neutral3: string;
            neutral4: string;
            neutral5: string;
            neutral6: string;
            neutral7: string;
            neutral8: string;
            neutral9: string;
            neutral10: string;
            neutral11: string;
            neutral12: string;
        };
        orange: Record<string, string>;
        pink: Record<string, string>;
        purple: Record<string, string>;
        red: Record<string, string>;
        teal: Record<string, string>;
        yellow: Record<string, string>;
    };
};
export type ColorPalette = string[];
export type ColorTheme = {
    palette: {
        dark: ColorPalette;
        light: ColorPalette;
    };
};
export type CreateV5ThemeOptions = {
    /** Override the dark base palette (12 colors from darkest to lightest) */
    darkPalette?: ColorPalette;
    /** Override the light base palette (12 colors from lightest to darkest) */
    lightPalette?: ColorPalette;
    /** Add or override color themes (e.g., { brand: { dark: [...], light: [...] } }) */
    colors?: Record<string, {
        dark: ColorPalette;
        light: ColorPalette;
    }>;
    /** Whether to include default color themes (blue, red, green, etc.). Defaults to true */
    includeDefaultColors?: boolean;
};
/**
 * Creates v5 themes with optional customizations.
 *
 * @example
 * Use default themes
 * const themes = createV5Theme()
 *
 * @example
 * Add a custom brand color
 * const themes = createV5Theme({
 *   colors: {
 *     brand: {
 *       light: ['#fff', '#fef', '#fdf', '#fcf', '#fbf', '#faf', '#f9f', '#f8f', '#f7f', '#f6f', '#f5f', '#f0f'],
 *       dark: ['#101', '#202', '#303', '#404', '#505', '#606', '#707', '#808', '#909', '#a0a', '#b0b', '#c0c'],
 *     },
 *   },
 * })
 *
 * @example
 * Override base palettes
 * const themes = createV5Theme({
 *   lightPalette: ['#fff', '#fafafa', ...],
 *   darkPalette: ['#000', '#111', ...],
 * })
 */
export declare function createV5Theme(options?: CreateV5ThemeOptions): Record<"light" | "dark" | `light_${string}` | `dark_${string}`, {
    color: string;
    shadowColor: string;
    borderColor: string;
    borderColorHover: string;
    colorHover: string;
    colorFocus: string;
    colorPress: string;
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    color5: string;
    color6: string;
    color7: string;
    color8: string;
    color9: string;
    color10: string;
    color11: string;
    color12: string;
    background: string;
    backgroundHover: string;
    backgroundPress: string;
    backgroundFocus: string;
    colorTransparent: string;
    borderColorFocus: string;
    borderColorPress: string;
    placeholderColor: string;
    outlineColor: string;
    accentBackground: string;
    accentColor: string;
    background0: string;
    color0: string;
    white0: string;
    black0: string;
    white1: string;
    white2: string;
    white3: string;
    white4: string;
    white5: string;
    white6: string;
    white7: string;
    white8: string;
    white9: string;
    white10: string;
    white11: string;
    white12: string;
    black1: string;
    black2: string;
    black3: string;
    black4: string;
    black5: string;
    black6: string;
    black7: string;
    black8: string;
    black9: string;
    black10: string;
    black11: string;
    black12: string;
    black: string;
    white: string;
    shadow1: string;
    shadow2: string;
    shadow3: string;
    shadow4: string;
    shadow5: string;
    shadow6: string;
    background02: string;
    background04: string;
    background06: string;
    background08: string;
    color02: string;
    color04: string;
    color06: string;
    color08: string;
    accent0: string;
    accent2: string;
    accent1: string;
    accent3: string;
    accent4: string;
    accent5: string;
    accent6: string;
    accent7: string;
    accent8: string;
    accent9: string;
    accent10: string;
    accent11: string;
    accent12: string;
    color1pt5: string;
    color2pt5: string;
    color01: string;
    color0075: string;
    color005: string;
    color0025: string;
    background01: string;
    background0075: string;
    background005: string;
    background0025: string;
    white02: string;
    white04: string;
    white06: string;
    white08: string;
    black02: string;
    black04: string;
    black06: string;
    black08: string;
    neutral1: string;
    neutral2: string;
    neutral3: string;
    neutral4: string;
    neutral5: string;
    neutral6: string;
    neutral7: string;
    neutral8: string;
    neutral9: string;
    neutral10: string;
    neutral11: string;
    neutral12: string;
}>;
export declare const themes: Record<"light" | "dark" | `light_${string}` | `dark_${string}`, {
    color: string;
    shadowColor: string;
    borderColor: string;
    borderColorHover: string;
    colorHover: string;
    colorFocus: string;
    colorPress: string;
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    color5: string;
    color6: string;
    color7: string;
    color8: string;
    color9: string;
    color10: string;
    color11: string;
    color12: string;
    background: string;
    backgroundHover: string;
    backgroundPress: string;
    backgroundFocus: string;
    colorTransparent: string;
    borderColorFocus: string;
    borderColorPress: string;
    placeholderColor: string;
    outlineColor: string;
    accentBackground: string;
    accentColor: string;
    background0: string;
    color0: string;
    white0: string;
    black0: string;
    white1: string;
    white2: string;
    white3: string;
    white4: string;
    white5: string;
    white6: string;
    white7: string;
    white8: string;
    white9: string;
    white10: string;
    white11: string;
    white12: string;
    black1: string;
    black2: string;
    black3: string;
    black4: string;
    black5: string;
    black6: string;
    black7: string;
    black8: string;
    black9: string;
    black10: string;
    black11: string;
    black12: string;
    black: string;
    white: string;
    shadow1: string;
    shadow2: string;
    shadow3: string;
    shadow4: string;
    shadow5: string;
    shadow6: string;
    background02: string;
    background04: string;
    background06: string;
    background08: string;
    color02: string;
    color04: string;
    color06: string;
    color08: string;
    accent0: string;
    accent2: string;
    accent1: string;
    accent3: string;
    accent4: string;
    accent5: string;
    accent6: string;
    accent7: string;
    accent8: string;
    accent9: string;
    accent10: string;
    accent11: string;
    accent12: string;
    color1pt5: string;
    color2pt5: string;
    color01: string;
    color0075: string;
    color005: string;
    color0025: string;
    background01: string;
    background0075: string;
    background005: string;
    background0025: string;
    white02: string;
    white04: string;
    white06: string;
    white08: string;
    black02: string;
    black04: string;
    black06: string;
    black08: string;
    neutral1: string;
    neutral2: string;
    neutral3: string;
    neutral4: string;
    neutral5: string;
    neutral6: string;
    neutral7: string;
    neutral8: string;
    neutral9: string;
    neutral10: string;
    neutral11: string;
    neutral12: string;
}>;
//# sourceMappingURL=v5-themes.d.ts.map