import { createThemes } from '@tamagui/theme-builder';
declare const darkPalette: string[];
declare const lightPalette: string[];
export { darkPalette, lightPalette };
export declare const defaultColors: {
    light: {
        blue: {
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
        gray: {
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
        green: {
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
        red: {
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
        yellow: {
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
    dark: {
        blue: {
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
        gray: {
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
        green: {
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
        red: {
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
        yellow: {
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
};
export type ColorPalette = string[];
export type ColorTheme = {
    palette: {
        dark: ColorPalette;
        light: ColorPalette;
    };
};
export type GrandChildrenThemeDefinition = {
    template: string;
};
/** Default color names available in v5 themes */
export type DefaultColorName = 'blue' | 'gray' | 'green' | 'red' | 'yellow';
export type ColorDefinition = {
    dark: ColorPalette;
    light: ColorPalette;
};
/** Default children themes available in v5 */
export declare const defaultChildrenThemes: {
    black: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    white: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    gray: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    blue: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    red: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    yellow: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    green: {
        palette: {
            dark: string[];
            light: string[];
        };
    };
    neutral: {
        palette: {
            dark: string[];
            light: string[];
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
export type CreateV5ThemeOptions = {
    /** Override the dark base palette (12 colors from darkest to lightest) */
    darkPalette?: ColorPalette;
    /** Override the light base palette (12 colors from lightest to darkest) */
    lightPalette?: ColorPalette;
    /**
     * Override children themes (color themes like blue, red, etc.)
     * Pass undefined or omit to use defaultChildrenThemes
     * @example Use only a subset of colors
     * { blue: defaultChildrenThemes.blue, brand: { palette: { dark: [...], light: [...] } } }
     */
    childrenThemes?: Record<string, ColorTheme>;
    /**
     * Override grandChildren themes (alt1, alt2, surface1, etc.)
     * Pass undefined or omit to use defaultGrandChildrenThemes
     */
    grandChildrenThemes?: Record<string, GrandChildrenThemeDefinition>;
    /** Override component themes. Pass false to disable, or provide custom component themes. Defaults to defaultComponentThemes */
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
 * Custom children themes with brand color
 * const themes = createV5Theme({
 *   childrenThemes: {
 *     ...defaultChildrenThemes,
 *     brand: {
 *       palette: {
 *         light: ['#fff', '#fef', ...],
 *         dark: ['#101', '#202', ...],
 *       },
 *     },
 *   },
 * })
 *
 * @example
 * Minimal - no color themes
 * const themes = createV5Theme({
 *   childrenThemes: {},
 * })
 *
 * @example
 * Override base palettes
 * const themes = createV5Theme({
 *   lightPalette: ['#fff', '#fafafa', ...],
 *   darkPalette: ['#000', '#111', ...],
 * })
 */
export declare function createV5Theme(options?: CreateV5ThemeOptions): Record<"light" | "dark" | "light_accent" | "dark_accent", {
    [x: string]: string;
} & Record<string, string>>;
export declare const themes: Record<"light" | "dark" | "light_accent" | "dark_accent", {
    [x: string]: string;
} & Record<string, string>>;
//# sourceMappingURL=v5-themes.d.ts.map