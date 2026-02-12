import { createThemes } from '@tamagui/theme-builder';
export declare const V5_BG_OFFSET: number;
export { interpolateColor, opacify } from './opacify';
export declare const v5ComponentThemes: {
    readonly Button: {
        readonly template: "surface2";
    };
    readonly Input: {
        readonly template: "surface1";
    };
    readonly Progress: {
        readonly template: "surface1";
    };
    readonly ProgressIndicator: {
        readonly template: "surface3";
    };
    readonly Slider: {
        readonly template: "surface1";
    };
    readonly SliderActive: {
        readonly template: "surface3";
    };
    readonly SliderThumb: {
        readonly template: "surface2";
    };
    readonly Switch: {
        readonly template: "surface2";
    };
    readonly TextArea: {
        readonly template: "surface1";
    };
    readonly Tooltip: {
        readonly template: "accent";
    };
    readonly SwitchThumb: {
        readonly template: "accent";
    };
};
export declare const v5ComponentThemesWithInverses: {
    readonly ProgressIndicator: {
        readonly template: "accent";
    };
    readonly SliderThumb: {
        readonly template: "accent";
    };
    readonly Tooltip: {
        readonly template: "accent";
    };
    readonly Button: {
        readonly template: "surface2";
    };
    readonly Input: {
        readonly template: "surface1";
    };
    readonly Progress: {
        readonly template: "surface1";
    };
    readonly Slider: {
        readonly template: "surface1";
    };
    readonly SliderActive: {
        readonly template: "surface3";
    };
    readonly Switch: {
        readonly template: "surface2";
    };
    readonly TextArea: {
        readonly template: "surface1";
    };
    readonly SwitchThumb: {
        readonly template: "accent";
    };
};
/** Default grandchildren themes available in v5 */
export declare const v5GrandchildrenThemes: {
    accent: {
        template: string;
    };
    surface1: {
        template: string;
    };
    surface2: {
        template: string;
    };
};
export type HSL = {
    h: number;
    s: number;
    l: number;
};
/** callback receives hsl and 1-based index, returns adjusted hsl */
export type AdjustFn = (hsl: HSL, index: number) => HSL;
/** parse hsl string to HSL object */
export declare function parseHSL(str: string): HSL | null;
/** parse hex color to HSL object */
export declare function parseHex(str: string): HSL | null;
/** parse any color format to HSL */
export declare function parseColor(str: string): HSL | null;
export declare function hslToString(hsl: HSL): string;
/** adjust a palette of colors (hsl or hex) using a callback */
export declare function adjustPalette(palette: Record<string, string>, fn: AdjustFn): Record<string, string>;
type SingleAdjustment = {
    light?: AdjustFn;
    dark?: AdjustFn;
};
export type PaletteAdjustments<T extends Record<string, any>> = {
    [K in keyof T]?: SingleAdjustment;
} & {
    /** fallback for themes not explicitly listed */
    default?: SingleAdjustment;
};
/**
 * Adjust color palettes using callback functions.
 *
 * @example
 * const adjusted = adjustPalettes(defaultChildrenThemes, {
 *   default: {
 *     light: (hsl, i) => ({ ...hsl, s: hsl.s * 0.8 }),
 *     dark: (hsl, i) => ({ ...hsl, s: hsl.s * 0.5, l: hsl.l * 0.9 }),
 *   },
 *   yellow: {
 *     light: (hsl, i) => ({ ...hsl, s: hsl.s * 0.5 }),
 *   },
 * })
 */
export declare function adjustPalettes<T extends Record<string, {
    light: Record<string, string>;
    dark: Record<string, string>;
}>>(themes: T, adjustments: PaletteAdjustments<T>): T;
declare const darkPalette: string[];
declare const lightPalette: string[];
export { darkPalette as defaultDarkPalette, lightPalette as defaultLightPalette };
type NamedColors = Record<string, string>;
type ChildTheme<T extends NamedColors = NamedColors> = {
    light: T;
    dark: T;
};
type GrandChildrenThemeDefinition = {
    template: string;
};
/** Default children themes - accepts radix colors directly */
export declare const defaultChildrenThemes: {
    gray: {
        light: {
            gray1: string;
            gray2: string;
            gray3: string;
            gray4: string;
            gray5: string;
            gray6: string;
            gray7: string;
            gray8: string;
            gray9: string;
            gray10: string;
            gray11: string;
            gray12: string;
        };
        dark: {
            gray1: string;
            gray2: string;
            gray3: string;
            gray4: string;
            gray5: string;
            gray6: string;
            gray7: string;
            gray8: string;
            gray9: string;
            gray10: string;
            gray11: string;
            gray12: string;
        };
    };
    blue: {
        light: {
            blue1: string;
            blue2: string;
            blue3: string;
            blue4: string;
            blue5: string;
            blue6: string;
            blue7: string;
            blue8: string;
            blue9: string;
            blue10: string;
            blue11: string;
            blue12: string;
        };
        dark: {
            blue1: string;
            blue2: string;
            blue3: string;
            blue4: string;
            blue5: string;
            blue6: string;
            blue7: string;
            blue8: string;
            blue9: string;
            blue10: string;
            blue11: string;
            blue12: string;
        };
    };
    red: {
        light: {
            red1: string;
            red2: string;
            red3: string;
            red4: string;
            red5: string;
            red6: string;
            red7: string;
            red8: string;
            red9: string;
            red10: string;
            red11: string;
            red12: string;
        };
        dark: {
            red1: string;
            red2: string;
            red3: string;
            red4: string;
            red5: string;
            red6: string;
            red7: string;
            red8: string;
            red9: string;
            red10: string;
            red11: string;
            red12: string;
        };
    };
    yellow: {
        light: {
            yellow1: string;
            yellow2: string;
            yellow3: string;
            yellow4: string;
            yellow5: string;
            yellow6: string;
            yellow7: string;
            yellow8: string;
            yellow9: string;
            yellow10: string;
            yellow11: string;
            yellow12: string;
        };
        dark: {
            yellow1: string;
            yellow2: string;
            yellow3: string;
            yellow4: string;
            yellow5: string;
            yellow6: string;
            yellow7: string;
            yellow8: string;
            yellow9: string;
            yellow10: string;
            yellow11: string;
            yellow12: string;
        };
    };
    green: {
        light: {
            green1: string;
            green2: string;
            green3: string;
            green4: string;
            green5: string;
            green6: string;
            green7: string;
            green8: string;
            green9: string;
            green10: string;
            green11: string;
            green12: string;
        };
        dark: {
            green1: string;
            green2: string;
            green3: string;
            green4: string;
            green5: string;
            green6: string;
            green7: string;
            green8: string;
            green9: string;
            green10: string;
            green11: string;
            green12: string;
        };
    };
    orange: {
        light: {
            orange1: string;
            orange2: string;
            orange3: string;
            orange4: string;
            orange5: string;
            orange6: string;
            orange7: string;
            orange8: string;
            orange9: string;
            orange10: string;
            orange11: string;
            orange12: string;
        };
        dark: {
            orange1: string;
            orange2: string;
            orange3: string;
            orange4: string;
            orange5: string;
            orange6: string;
            orange7: string;
            orange8: string;
            orange9: string;
            orange10: string;
            orange11: string;
            orange12: string;
        };
    };
    pink: {
        light: {
            pink1: string;
            pink2: string;
            pink3: string;
            pink4: string;
            pink5: string;
            pink6: string;
            pink7: string;
            pink8: string;
            pink9: string;
            pink10: string;
            pink11: string;
            pink12: string;
        };
        dark: {
            pink1: string;
            pink2: string;
            pink3: string;
            pink4: string;
            pink5: string;
            pink6: string;
            pink7: string;
            pink8: string;
            pink9: string;
            pink10: string;
            pink11: string;
            pink12: string;
        };
    };
    purple: {
        light: {
            purple1: string;
            purple2: string;
            purple3: string;
            purple4: string;
            purple5: string;
            purple6: string;
            purple7: string;
            purple8: string;
            purple9: string;
            purple10: string;
            purple11: string;
            purple12: string;
        };
        dark: {
            purple1: string;
            purple2: string;
            purple3: string;
            purple4: string;
            purple5: string;
            purple6: string;
            purple7: string;
            purple8: string;
            purple9: string;
            purple10: string;
            purple11: string;
            purple12: string;
        };
    };
    teal: {
        light: {
            teal1: string;
            teal2: string;
            teal3: string;
            teal4: string;
            teal5: string;
            teal6: string;
            teal7: string;
            teal8: string;
            teal9: string;
            teal10: string;
            teal11: string;
            teal12: string;
        };
        dark: {
            teal1: string;
            teal2: string;
            teal3: string;
            teal4: string;
            teal5: string;
            teal6: string;
            teal7: string;
            teal8: string;
            teal9: string;
            teal10: string;
            teal11: string;
            teal12: string;
        };
    };
    neutral: {
        light: {
            neutral2: string;
            neutral1: string;
            neutral4: string;
            neutral8: string;
            neutral12: string;
            neutral3: string;
            neutral5: string;
            neutral7: string;
            neutral9: string;
            neutral10: string;
            neutral6: string;
            neutral11: string;
        };
        dark: {
            neutral2: string;
            neutral1: string;
            neutral4: string;
            neutral8: string;
            neutral12: string;
            neutral3: string;
            neutral5: string;
            neutral7: string;
            neutral9: string;
            neutral10: string;
            neutral6: string;
            neutral11: string;
        };
    };
};
/** Union of all color values from children themes (for light or dark) */
type ChildrenColors<T extends Record<string, ChildTheme>, Mode extends 'light' | 'dark'> = {
    [K in keyof T]: T[K][Mode];
}[keyof T];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type CreateV5ThemeOptions<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof v5GrandchildrenThemes> = {
    /** Override the dark base palette (12 colors from darkest to lightest) */
    darkPalette?: string[];
    /** Override the light base palette (12 colors from lightest to darkest) */
    lightPalette?: string[];
    /**
     * Override children themes (color themes like blue, red, etc.)
     * Accepts radix color objects directly: { blue: { light: blue, dark: blueDark } }
     */
    childrenThemes?: Children;
    /**
     * Override grandChildren themes (alt1, alt2, surface1, etc.)
     * Pass undefined or omit to use v5GrandchildrenThemes
     */
    grandChildrenThemes?: GrandChildren;
    /**
     * @deprecated component themes are no longer recommended -
     * configure component styles directly via themes or component defaultProps instead
     */
    componentThemes?: false | Parameters<typeof createThemes>[0]['componentThemes'];
};
/**
 * Creates v5 themes with optional customizations.
 *
 * @example
 * Use default themes
 * const themes = createV5Theme()
 *
 * @example
 * Custom children themes with brand color (accepts radix colors directly)
 * const themes = createV5Theme({
 *   childrenThemes: {
 *     ...defaultChildrenThemes,
 *     brand: { light: brandLight, dark: brandDark },
 *   },
 * })
 *
 * @example
 * Minimal - no color themes
 * const themes = createV5Theme({
 *   childrenThemes: {},
 * })
 */
export declare function createV5Theme<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof v5GrandchildrenThemes>(options?: CreateV5ThemeOptions<Children, GrandChildren>): Record<"light" | "dark" | "light_accent" | "dark_accent" | ("black" | "white" | keyof Children extends string ? "light_black" | "light_white" | `light_black_${string}` | `light_white_${string}` | "dark_black" | "dark_white" | `dark_black_${string}` | `dark_white_${string}` | `light_${string & keyof Children}` | `light_${string & keyof Children}_${string}` | `dark_${string & keyof Children}` | `dark_${string & keyof Children}_${string}` : never), { [ThemeKey in "color" | "shadowColor" | "borderColor" | "borderColorHover" | "colorHover" | "colorFocus" | "colorPress" | "color1" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "color10" | "color11" | "color12" | "background" | "placeholderColor" | "colorTransparent" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "borderColorFocus" | "borderColorPress" | "accentBackground" | "accentColor" | "background0" | "background02" | "background04" | "background06" | "background08" | "color0" | "color02" | "color04" | "color06" | "color08" | "black" | "black2" | "black1" | "black4" | "black8" | "black12" | "black3" | "black5" | "black7" | "black9" | "black10" | "black6" | "black11" | "white" | "white2" | "white1" | "white4" | "white8" | "white12" | "white3" | "white5" | "white7" | "white9" | "white10" | "white6" | "white11" | "white0" | "white02" | "white04" | "white06" | "white08" | "black0" | "black02" | "black04" | "black06" | "black08" | "shadow1" | "shadow2" | "shadow3" | "shadow4" | "shadow5" | "shadow6" | "shadow7" | "shadow8" | "highlight1" | "highlight2" | "highlight3" | "highlight4" | "highlight5" | "highlight6" | "highlight7" | "highlight8" | "outlineColor" | "accent0" | "accent2" | "accent1" | "accent4" | "accent8" | "accent12" | "accent3" | "accent5" | "accent7" | "accent9" | "accent10" | "accent6" | "accent11" | keyof UnionToIntersection<ChildrenColors<Children, "dark">>]: string; } & {
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
}>;
export declare const themes: Record<"light_blue" | "light_gray" | "light_green" | "light_orange" | "light_pink" | "light_purple" | "light_red" | "light_yellow" | "dark_blue" | "dark_gray" | "dark_green" | "dark_orange" | "dark_pink" | "dark_purple" | "dark_red" | "dark_yellow" | "light" | "dark" | "light_accent" | "dark_accent" | "light_neutral" | "light_black" | "light_white" | "light_teal" | `light_blue_${string}` | `light_gray_${string}` | `light_green_${string}` | `light_orange_${string}` | `light_pink_${string}` | `light_purple_${string}` | `light_red_${string}` | `light_yellow_${string}` | `light_neutral_${string}` | `light_black_${string}` | `light_white_${string}` | `light_teal_${string}` | "dark_neutral" | "dark_black" | "dark_white" | "dark_teal" | `dark_blue_${string}` | `dark_gray_${string}` | `dark_green_${string}` | `dark_orange_${string}` | `dark_pink_${string}` | `dark_purple_${string}` | `dark_red_${string}` | `dark_yellow_${string}` | `dark_neutral_${string}` | `dark_black_${string}` | `dark_white_${string}` | `dark_teal_${string}`, {
    yellow1: string;
    yellow2: string;
    yellow3: string;
    yellow4: string;
    yellow5: string;
    yellow6: string;
    yellow7: string;
    yellow8: string;
    yellow9: string;
    yellow10: string;
    yellow11: string;
    yellow12: string;
    red1: string;
    red2: string;
    red3: string;
    red4: string;
    red5: string;
    red6: string;
    red7: string;
    red8: string;
    red9: string;
    red10: string;
    red11: string;
    red12: string;
    purple1: string;
    purple2: string;
    purple3: string;
    purple4: string;
    purple5: string;
    purple6: string;
    purple7: string;
    purple8: string;
    purple9: string;
    purple10: string;
    purple11: string;
    purple12: string;
    pink1: string;
    pink2: string;
    pink3: string;
    pink4: string;
    pink5: string;
    pink6: string;
    pink7: string;
    pink8: string;
    pink9: string;
    pink10: string;
    pink11: string;
    pink12: string;
    orange1: string;
    orange2: string;
    orange3: string;
    orange4: string;
    orange5: string;
    orange6: string;
    orange7: string;
    orange8: string;
    orange9: string;
    orange10: string;
    orange11: string;
    orange12: string;
    green1: string;
    green2: string;
    green3: string;
    green4: string;
    green5: string;
    green6: string;
    green7: string;
    green8: string;
    green9: string;
    green10: string;
    green11: string;
    green12: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    gray9: string;
    gray10: string;
    gray11: string;
    gray12: string;
    blue1: string;
    blue2: string;
    blue3: string;
    blue4: string;
    blue5: string;
    blue6: string;
    blue7: string;
    blue8: string;
    blue9: string;
    blue10: string;
    blue11: string;
    blue12: string;
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
    placeholderColor: string;
    colorTransparent: string;
    backgroundHover: string;
    backgroundPress: string;
    backgroundFocus: string;
    borderColorFocus: string;
    borderColorPress: string;
    accentBackground: string;
    accentColor: string;
    background0: string;
    background02: string;
    background04: string;
    background06: string;
    background08: string;
    color0: string;
    color02: string;
    color04: string;
    color06: string;
    color08: string;
    neutral2: string;
    neutral1: string;
    neutral4: string;
    neutral8: string;
    neutral12: string;
    neutral3: string;
    neutral5: string;
    neutral7: string;
    neutral9: string;
    neutral10: string;
    neutral6: string;
    neutral11: string;
    black: string;
    black2: string;
    black1: string;
    black4: string;
    black8: string;
    black12: string;
    black3: string;
    black5: string;
    black7: string;
    black9: string;
    black10: string;
    black6: string;
    black11: string;
    white: string;
    white2: string;
    white1: string;
    white4: string;
    white8: string;
    white12: string;
    white3: string;
    white5: string;
    white7: string;
    white9: string;
    white10: string;
    white6: string;
    white11: string;
    teal1: string;
    teal2: string;
    teal3: string;
    teal4: string;
    teal5: string;
    teal6: string;
    teal7: string;
    teal8: string;
    teal9: string;
    teal10: string;
    teal11: string;
    teal12: string;
    white0: string;
    white02: string;
    white04: string;
    white06: string;
    white08: string;
    black0: string;
    black02: string;
    black04: string;
    black06: string;
    black08: string;
    shadow1: string;
    shadow2: string;
    shadow3: string;
    shadow4: string;
    shadow5: string;
    shadow6: string;
    shadow7: string;
    shadow8: string;
    highlight1: string;
    highlight2: string;
    highlight3: string;
    highlight4: string;
    highlight5: string;
    highlight6: string;
    highlight7: string;
    highlight8: string;
    outlineColor: string;
    accent0: string;
    accent2: string;
    accent1: string;
    accent4: string;
    accent8: string;
    accent12: string;
    accent3: string;
    accent5: string;
    accent7: string;
    accent9: string;
    accent10: string;
    accent6: string;
    accent11: string;
} & {
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
}>;
//# sourceMappingURL=v5-themes.d.ts.map