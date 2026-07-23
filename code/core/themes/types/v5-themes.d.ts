import { createThemes, type CreateThemesProps } from '@tamagui/theme-builder';
import { v5Templates } from './v5-templates';
export declare const V5_BG_OFFSET: number;
export { interpolateColor, opacify } from './opacify';
export declare const v5ComponentThemes: {
    readonly Button: {
        readonly template: 'surface2';
    };
    readonly Input: {
        readonly template: 'surface1';
    };
    readonly Progress: {
        readonly template: 'surface1';
    };
    readonly ProgressIndicator: {
        readonly template: 'surface3';
    };
    readonly Slider: {
        readonly template: 'surface1';
    };
    readonly SliderActive: {
        readonly template: 'surface3';
    };
    readonly SliderThumb: {
        readonly template: 'surface2';
    };
    readonly Switch: {
        readonly template: 'surface2';
    };
    readonly TextArea: {
        readonly template: 'surface1';
    };
    readonly Tooltip: {
        readonly template: 'accent';
    };
    readonly SwitchThumb: {
        readonly template: 'accent';
    };
};
export declare const v5ComponentThemesWithInverses: {
    readonly Button: {
        readonly template: 'surface2';
    };
    readonly Input: {
        readonly template: 'surface1';
    };
    readonly Progress: {
        readonly template: 'surface1';
    };
    readonly Slider: {
        readonly template: 'surface1';
    };
    readonly SliderActive: {
        readonly template: 'surface3';
    };
    readonly Switch: {
        readonly template: 'surface2';
    };
    readonly TextArea: {
        readonly template: 'surface1';
    };
    readonly SwitchThumb: {
        readonly template: 'accent';
    };
    readonly ProgressIndicator: {
        readonly template: 'accent';
    };
    readonly SliderThumb: {
        readonly template: 'accent';
    };
    readonly Tooltip: {
        readonly template: 'accent';
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
            neutral1: string;
            neutral10: string;
            neutral11: string;
            neutral12: string;
            neutral2: string;
            neutral3: string;
            neutral4: string;
            neutral5: string;
            neutral6: string;
            neutral7: string;
            neutral8: string;
            neutral9: string;
        };
        dark: {
            neutral1: string;
            neutral10: string;
            neutral11: string;
            neutral12: string;
            neutral2: string;
            neutral3: string;
            neutral4: string;
            neutral5: string;
            neutral6: string;
            neutral7: string;
            neutral8: string;
            neutral9: string;
        };
    };
};
/** Union of all color values from children themes (for light or dark) */
type ChildrenColors<T extends Record<string, ChildTheme>, Mode extends 'light' | 'dark'> = {
    [K in keyof T]: T[K][Mode];
}[keyof T];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type V5GetThemeProps = Parameters<NonNullable<CreateThemesProps<any, any, any, any, any, typeof v5Templates, any>['getTheme']>>[0];
type DefaultV5ThemeValues = {
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
};
type ComponentThemeOption = Exclude<Parameters<typeof createThemes>[0]['componentThemes'], undefined>;
export type CreateV5ThemeOptions<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof v5GrandchildrenThemes, GetThemeReturn extends Record<string, string | number> = {}> = {
    /** Override the dark base palette (12 colors from darkest to lightest) */
    darkPalette?: string[];
    /** Override the light base palette (12 colors from lightest to darkest) */
    lightPalette?: string[];
    /**
     * Custom accent palette. If not provided, accent uses the inverted base palette.
     * Accepts named color objects: { light: { accent1: '#...', ... }, dark: { accent1: '#...', ... } }
     */
    accent?: ChildTheme;
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
    componentThemes?: false | ComponentThemeOption;
    /**
     * Add computed values to every generated theme.
     * These values merge on top of the built-in v5 computed tokens.
     */
    getTheme?: (props: V5GetThemeProps) => GetThemeReturn;
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
export declare function createV5Theme<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof v5GrandchildrenThemes, GetThemeReturn extends Record<string, string | number> = {}>(options?: CreateV5ThemeOptions<Children, GrandChildren, GetThemeReturn>): Record<"dark" | "dark_accent" | "light" | "light_accent" | ("black" | "white" | keyof Children extends string ? `dark_${(GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) extends infer T ? T extends (GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) ? T extends undefined ? "black" | "white" | (string & keyof Children) : "black" | "white" | (keyof T extends infer T_1 ? T_1 extends keyof T ? T_1 extends string ? `${string & keyof Children}_${T_1}` | `black_${T_1}` | `white_${T_1}` : never : never : never) | (string & keyof Children) : never : never}` | `light_${(GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) extends infer T ? T extends (GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) ? T extends undefined ? "black" | "white" | (string & keyof Children) : "black" | "white" | (keyof T extends infer T_1 ? T_1 extends keyof T ? T_1 extends string ? `${string & keyof Children}_${T_1}` | `black_${T_1}` | `white_${T_1}` : never : never : never) | (string & keyof Children) : never : never}` : never), { [ThemeKey in "accent0" | "accent1" | "accent10" | "accent11" | "accent12" | "accent2" | "accent3" | "accent4" | "accent5" | "accent6" | "accent7" | "accent8" | "accent9" | "accentBackground" | "accentColor" | "background" | "background0" | "background02" | "background04" | "background06" | "background08" | "backgroundFocus" | "backgroundHover" | "backgroundPress" | "black" | "black0" | "black02" | "black04" | "black06" | "black08" | "black1" | "black10" | "black11" | "black12" | "black2" | "black3" | "black4" | "black5" | "black6" | "black7" | "black8" | "black9" | "borderColor" | "borderColorFocus" | "borderColorHover" | "borderColorPress" | "color" | "color0" | "color02" | "color04" | "color06" | "color08" | "color1" | "color10" | "color11" | "color12" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "colorFocus" | "colorHover" | "colorPress" | "colorTransparent" | "highlight1" | "highlight2" | "highlight3" | "highlight4" | "highlight5" | "highlight6" | "highlight7" | "highlight8" | "outlineColor" | "placeholderColor" | "shadow1" | "shadow2" | "shadow3" | "shadow4" | "shadow5" | "shadow6" | "shadow7" | "shadow8" | "shadowColor" | "white" | "white0" | "white02" | "white04" | "white06" | "white08" | "white1" | "white10" | "white11" | "white12" | "white2" | "white3" | "white4" | "white5" | "white6" | "white7" | "white8" | "white9" | keyof UnionToIntersection<ChildrenColors<Children, "dark">>]: string; } & Omit<DefaultV5ThemeValues, keyof GetThemeReturn> & GetThemeReturn>;
//# sourceMappingURL=v5-themes.d.ts.map