import { createThemes } from '@tamagui/theme-builder';
export declare const defaultComponentThemes: {
    readonly Button: {
        readonly template: "surface3";
    };
    readonly Tooltip: {
        readonly template: "inverse";
    };
};
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
/** Default grandchildren themes available in v5 */
export declare const defaultGrandChildrenThemes: {
    accent: {
        template: string;
    };
    alt1: {
        template: string;
    };
    alt2: {
        template: string;
    };
    surface1: {
        template: string;
    };
    surface2: {
        template: string;
    };
    surface3: {
        template: string;
    };
};
/** Union of all color values from children themes (for light or dark) */
type ChildrenColors<T extends Record<string, ChildTheme>, Mode extends 'light' | 'dark'> = {
    [K in keyof T]: T[K][Mode];
}[keyof T];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type CreateV5ThemeOptions<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof defaultGrandChildrenThemes> = {
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
     * Pass undefined or omit to use defaultGrandChildrenThemes
     */
    grandChildrenThemes?: GrandChildren;
    /**
     * @deprecated component themes are no longer recommended - configure component styles directly via themes or component defaultProps instead
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
export declare function createV5Theme<Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes, GrandChildren extends Record<string, GrandChildrenThemeDefinition> = typeof defaultGrandChildrenThemes>(options?: CreateV5ThemeOptions<Children, GrandChildren>): Record<"light" | "dark" | "light_accent" | "dark_accent" | ("black" | "white" | keyof Children extends string ? `light_${(GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) extends infer T ? T extends (GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) ? T extends undefined ? "black" | "white" | (string & keyof Children) : "black" | "white" | (string & keyof Children) | (keyof T extends infer T_1 ? T_1 extends keyof T ? T_1 extends string ? `black_${T_1}` | `white_${T_1}` | `${string & keyof Children}_${T_1}` : never : never : never) : never : never}` | `dark_${(GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) extends infer T_2 ? T_2 extends (GrandChildren extends undefined ? undefined : Record<keyof GrandChildren, any>) ? T_2 extends undefined ? "black" | "white" | (string & keyof Children) : "black" | "white" | (string & keyof Children) | (keyof T_2 extends infer T_3 ? T_3 extends keyof T_2 ? T_3 extends string ? `black_${T_3}` | `white_${T_3}` | `${string & keyof Children}_${T_3}` : never : never : never) : never : never}` : never), { [ThemeKey in "color" | "shadowColor" | "borderColor" | "borderColorHover" | "colorHover" | "colorFocus" | "colorPress" | "color1" | "color2" | "color3" | "color4" | "color5" | "color6" | "color7" | "color8" | "color9" | "color10" | "color11" | "color12" | "background" | "backgroundHover" | "backgroundPress" | "backgroundFocus" | "colorTransparent" | "borderColorFocus" | "borderColorPress" | "placeholderColor" | "accentBackground" | "accentColor" | "background0" | "color0" | "outlineColor" | "white0" | "black0" | "white1" | "white2" | "white3" | "white4" | "white5" | "white6" | "white7" | "white8" | "white9" | "white10" | "white11" | "white12" | "black1" | "black2" | "black3" | "black4" | "black5" | "black6" | "black7" | "black8" | "black9" | "black10" | "black11" | "black12" | "black" | "white" | "shadow1" | "shadow2" | "shadow3" | "shadow4" | "shadow5" | "shadow6" | "background02" | "background04" | "background06" | "background08" | "color02" | "color04" | "color06" | "color08" | "accent0" | "accent2" | "accent1" | "accent4" | "accent8" | "accent12" | "accent3" | "accent5" | "accent7" | "accent9" | "accent10" | "accent6" | "accent11" | "white02" | "white04" | "white06" | "white08" | "black02" | "black04" | "black06" | "black08" | keyof UnionToIntersection<ChildrenColors<Children, "dark">>]: string; } & {
    color0pt5: string;
    color1pt5: string;
    color2pt5: string;
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
}>;
export declare const themes: Record<"light_blue" | "light_gray" | "light_green" | "light_red" | "light_yellow" | "dark_blue" | "dark_gray" | "dark_green" | "dark_red" | "dark_yellow" | "light" | "dark" | "light_blue_alt1" | "light_blue_alt2" | "light_green_alt1" | "light_green_alt2" | "light_red_alt1" | "light_red_alt2" | "light_yellow_alt1" | "light_yellow_alt2" | "dark_blue_alt1" | "dark_blue_alt2" | "dark_green_alt1" | "dark_green_alt2" | "dark_red_alt1" | "dark_red_alt2" | "dark_yellow_alt1" | "dark_yellow_alt2" | "light_gray_alt1" | "light_gray_alt2" | "dark_gray_alt1" | "dark_gray_alt2" | "light_blue_surface1" | "light_blue_surface2" | "light_blue_surface3" | "light_gray_surface1" | "light_gray_surface2" | "light_gray_surface3" | "light_green_surface1" | "light_green_surface2" | "light_green_surface3" | "light_red_surface1" | "light_red_surface2" | "light_red_surface3" | "light_yellow_surface1" | "light_yellow_surface2" | "light_yellow_surface3" | "dark_blue_surface1" | "dark_blue_surface2" | "dark_blue_surface3" | "dark_gray_surface1" | "dark_gray_surface2" | "dark_gray_surface3" | "dark_green_surface1" | "dark_green_surface2" | "dark_green_surface3" | "dark_red_surface1" | "dark_red_surface2" | "dark_red_surface3" | "dark_yellow_surface1" | "dark_yellow_surface2" | "dark_yellow_surface3" | "light_accent" | "dark_accent" | "light_black" | "light_white" | "light_blue_accent" | "light_green_accent" | "light_red_accent" | "light_yellow_accent" | "light_black_accent" | "light_white_accent" | "dark_black" | "dark_white" | "dark_blue_accent" | "dark_green_accent" | "dark_red_accent" | "dark_yellow_accent" | "dark_black_accent" | "dark_white_accent" | "light_gray_accent" | "light_black_alt1" | "light_white_alt1" | "light_black_alt2" | "light_white_alt2" | "light_black_surface1" | "light_white_surface1" | "light_black_surface2" | "light_white_surface2" | "light_black_surface3" | "light_white_surface3" | "dark_gray_accent" | "dark_black_alt1" | "dark_white_alt1" | "dark_black_alt2" | "dark_white_alt2" | "dark_black_surface1" | "dark_white_surface1" | "dark_black_surface2" | "dark_white_surface2" | "dark_black_surface3" | "dark_white_surface3" | "light_neutral" | "light_neutral_accent" | "light_neutral_alt1" | "light_neutral_alt2" | "light_neutral_surface1" | "light_neutral_surface2" | "light_neutral_surface3" | "dark_neutral" | "dark_neutral_accent" | "dark_neutral_alt1" | "dark_neutral_alt2" | "dark_neutral_surface1" | "dark_neutral_surface2" | "dark_neutral_surface3", {
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
    backgroundHover: string;
    backgroundPress: string;
    backgroundFocus: string;
    colorTransparent: string;
    borderColorFocus: string;
    borderColorPress: string;
    placeholderColor: string;
    accentBackground: string;
    accentColor: string;
    background0: string;
    color0: string;
    outlineColor: string;
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
    white02: string;
    white04: string;
    white06: string;
    white08: string;
    black02: string;
    black04: string;
    black06: string;
    black08: string;
} & {
    color0pt5: string;
    color1pt5: string;
    color2pt5: string;
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
}>;
//# sourceMappingURL=v5-themes.d.ts.map