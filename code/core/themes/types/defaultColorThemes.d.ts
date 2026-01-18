export type ColorPalette = string[];
export type ColorTheme = {
    palette: {
        dark: ColorPalette;
        light: ColorPalette;
    };
};
/**
 * Default color themes for v5.
 * Each theme has a light and dark palette variant.
 */
export declare const defaultColorThemes: {
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
export type DefaultColorThemes = typeof defaultColorThemes;
/**
 * Generates the extra colors for base theme from color themes.
 * This ensures base.extra contains named colors (blue1-12, red1-12, etc.)
 * for all provided color themes.
 */
export declare function colorThemesToExtra<T extends Record<string, ColorTheme>>(colorThemes: T, scheme: 'light' | 'dark'): Record<string, string>;
//# sourceMappingURL=defaultColorThemes.d.ts.map