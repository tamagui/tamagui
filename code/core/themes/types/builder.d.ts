import { type GetThemeContext, type ThemeDefinitionContext } from '@tamagui/create-theme';
import { type ColorTokenName } from './tokens';
export { createThemes } from '@tamagui/create-theme';
export type { GetThemeContext, ThemeDefinitionContext } from '@tamagui/create-theme';
export { colorTokens, tailwindColors, tokens } from './tokens';
export declare const shades: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
export declare const shadows: {
    readonly light: {
        readonly 'shadow-1': 'rgba(0, 0, 0, 0.04)';
        readonly 'shadow-2': 'rgba(0, 0, 0, 0.08)';
        readonly 'shadow-3': 'rgba(0, 0, 0, 0.12)';
        readonly 'shadow-4': 'rgba(0, 0, 0, 0.22)';
        readonly 'shadow-5': 'rgba(0, 0, 0, 0.33)';
        readonly 'shadow-6': 'rgba(0, 0, 0, 0.44)';
        readonly 'shadow-7': 'rgba(0, 0, 0, 0.6)';
    };
    readonly dark: {
        readonly 'shadow-1': 'rgba(0, 0, 0, 0.15)';
        readonly 'shadow-2': 'rgba(0, 0, 0, 0.23)';
        readonly 'shadow-3': 'rgba(0, 0, 0, 0.33)';
        readonly 'shadow-4': 'rgba(0, 0, 0, 0.45)';
        readonly 'shadow-5': 'rgba(0, 0, 0, 0.65)';
        readonly 'shadow-6': 'rgba(0, 0, 0, 0.8)';
        readonly 'shadow-7': 'rgba(0, 0, 0, 0.9)';
    };
};
export type ShadowName = keyof (typeof shadows)['light'];
export type Shade = (typeof shades)[number];
type PaletteFromToken<Token> = Token extends `${infer Name}-${Shade}` ? Name : never;
export type Palette = PaletteFromToken<ColorTokenName>;
export type Scheme = 'light' | 'dark';
export type Level = 1 | 2 | 3 | 4;
export declare const semanticThemeKeys: readonly ['background', 'background-hover', 'background-press', 'background-focus', 'background-active', 'border-color', 'border-color-hover', 'border-color-press', 'border-color-focus', 'color', 'color-hover', 'color-press', 'color-focus', 'placeholder-color', 'outline-color', 'shadow-color', 'accent-background', 'accent-color'];
export type SemanticThemeKey = (typeof semanticThemeKeys)[number];
export type ThemeScale<TokenName extends string = ColorTokenName> = Record<Exclude<SemanticThemeKey, 'shadow-color'>, Shade | TokenName> & {
    'shadow-color': ShadowName;
};
export declare function raise<TokenName extends string>(scale: ThemeScale<TokenName>, steps: number): ThemeScale<TokenName>;
export declare function activeScale<TokenName extends string>(scale: ThemeScale<TokenName>): ThemeScale<TokenName>;
export declare const scales: {
    readonly normal: {
        readonly light: {
            readonly 1: {
                readonly background: 50;
                readonly 'background-hover': 'white';
                readonly 'background-press': 100;
                readonly 'background-focus': 'white';
                readonly 'background-active': 'white';
                readonly 'border-color': 200;
                readonly 'border-color-hover': 300;
                readonly 'border-color-press': 200;
                readonly 'border-color-focus': 300;
                readonly color: 950;
                readonly 'color-hover': 950;
                readonly 'color-press': 950;
                readonly 'color-focus': 950;
                readonly 'placeholder-color': 500;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-600';
                readonly 'accent-color': 'brand-50';
            };
            readonly 2: ThemeScale<"brand-50" | "brand-600" | "white">;
            readonly 3: ThemeScale<"brand-50" | "brand-600" | "white">;
            readonly 4: ThemeScale<"brand-50" | "brand-600" | "white">;
        };
        readonly dark: {
            readonly 1: {
                readonly 'placeholder-color': 500;
                readonly 'outline-color': 400;
                readonly 'accent-background': 'brand-600';
                readonly 'accent-color': 'brand-50';
                readonly background: 950;
                readonly 'background-hover': 900;
                readonly 'background-press': 'black';
                readonly 'background-focus': 900;
                readonly 'background-active': 900;
                readonly 'border-color': 800;
                readonly 'border-color-hover': 700;
                readonly 'border-color-press': 800;
                readonly 'border-color-focus': 700;
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'shadow-color': 'shadow-3';
            };
            readonly 2: ThemeScale<"black" | "brand-50" | "brand-600">;
            readonly 3: ThemeScale<"black" | "brand-50" | "brand-600">;
            readonly 4: ThemeScale<"black" | "brand-50" | "brand-600">;
        };
    };
    readonly bold: {
        readonly light: {
            readonly 1: {
                readonly background: 600;
                readonly 'background-hover': 500;
                readonly 'background-press': 700;
                readonly 'background-focus': 500;
                readonly 'background-active': 500;
                readonly 'border-color': 700;
                readonly 'border-color-hover': 600;
                readonly 'border-color-press': 700;
                readonly 'border-color-focus': 600;
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
            };
            readonly 2: {
                readonly background: 600;
                readonly 'background-hover': 500;
                readonly 'background-press': 700;
                readonly 'background-focus': 500;
                readonly 'background-active': 500;
                readonly 'border-color': 700;
                readonly 'border-color-hover': 600;
                readonly 'border-color-press': 700;
                readonly 'border-color-focus': 600;
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
            };
            readonly 3: {
                readonly background: 600;
                readonly 'background-hover': 500;
                readonly 'background-press': 700;
                readonly 'background-focus': 500;
                readonly 'background-active': 500;
                readonly 'border-color': 700;
                readonly 'border-color-hover': 600;
                readonly 'border-color-press': 700;
                readonly 'border-color-focus': 600;
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
            };
            readonly 4: {
                readonly background: 600;
                readonly 'background-hover': 500;
                readonly 'background-press': 700;
                readonly 'background-focus': 500;
                readonly 'background-active': 500;
                readonly 'border-color': 700;
                readonly 'border-color-hover': 600;
                readonly 'border-color-press': 700;
                readonly 'border-color-focus': 600;
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
            };
        };
        readonly dark: {
            readonly 1: {
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
                readonly background: 500;
                readonly 'background-hover': 400;
                readonly 'background-press': 600;
                readonly 'background-focus': 400;
                readonly 'background-active': 400;
                readonly 'border-color': 600;
                readonly 'border-color-hover': 500;
                readonly 'border-color-press': 600;
                readonly 'border-color-focus': 500;
                readonly 'shadow-color': 'shadow-3';
            };
            readonly 2: {
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
                readonly background: 500;
                readonly 'background-hover': 400;
                readonly 'background-press': 600;
                readonly 'background-focus': 400;
                readonly 'background-active': 400;
                readonly 'border-color': 600;
                readonly 'border-color-hover': 500;
                readonly 'border-color-press': 600;
                readonly 'border-color-focus': 500;
                readonly 'shadow-color': 'shadow-3';
            };
            readonly 3: {
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
                readonly background: 500;
                readonly 'background-hover': 400;
                readonly 'background-press': 600;
                readonly 'background-focus': 400;
                readonly 'background-active': 400;
                readonly 'border-color': 600;
                readonly 'border-color-hover': 500;
                readonly 'border-color-press': 600;
                readonly 'border-color-focus': 500;
                readonly 'shadow-color': 'shadow-3';
            };
            readonly 4: {
                readonly color: 50;
                readonly 'color-hover': 50;
                readonly 'color-press': 50;
                readonly 'color-focus': 50;
                readonly 'placeholder-color': 200;
                readonly 'outline-color': 400;
                readonly 'accent-background': 'brand-50';
                readonly 'accent-color': 'brand-700';
                readonly background: 500;
                readonly 'background-hover': 400;
                readonly 'background-press': 600;
                readonly 'background-focus': 400;
                readonly 'background-active': 400;
                readonly 'border-color': 600;
                readonly 'border-color-hover': 500;
                readonly 'border-color-press': 600;
                readonly 'border-color-focus': 500;
                readonly 'shadow-color': 'shadow-3';
            };
        };
    };
    readonly tint: {
        readonly light: {
            readonly 1: {
                readonly background: 100;
                readonly 'background-hover': 50;
                readonly 'background-press': 200;
                readonly 'background-focus': 50;
                readonly 'background-active': 50;
                readonly 'border-color': 300;
                readonly 'border-color-hover': 400;
                readonly 'border-color-press': 300;
                readonly 'border-color-focus': 400;
                readonly color: 700;
                readonly 'color-hover': 700;
                readonly 'color-press': 700;
                readonly 'color-focus': 700;
                readonly 'placeholder-color': 400;
                readonly 'outline-color': 400;
                readonly 'shadow-color': 'shadow-3';
                readonly 'accent-background': 'brand-600';
                readonly 'accent-color': 'brand-50';
            };
            readonly 2: ThemeScale<"brand-50" | "brand-600">;
            readonly 3: ThemeScale<"brand-50" | "brand-600">;
            readonly 4: ThemeScale<"brand-50" | "brand-600">;
        };
        readonly dark: {
            readonly 1: {
                readonly 'accent-background': 'brand-600';
                readonly 'accent-color': 'brand-50';
                readonly background: 900;
                readonly 'background-hover': 800;
                readonly 'background-press': 950;
                readonly 'background-focus': 800;
                readonly 'background-active': 800;
                readonly 'border-color': 700;
                readonly 'border-color-hover': 600;
                readonly 'border-color-press': 700;
                readonly 'border-color-focus': 600;
                readonly color: 200;
                readonly 'color-hover': 200;
                readonly 'color-press': 200;
                readonly 'color-focus': 200;
                readonly 'placeholder-color': 500;
                readonly 'outline-color': 600;
                readonly 'shadow-color': 'shadow-3';
            };
            readonly 2: ThemeScale<"brand-50" | "brand-600">;
            readonly 3: ThemeScale<"brand-50" | "brand-600">;
            readonly 4: ThemeScale<"brand-50" | "brand-600">;
        };
    };
};
export type Treatment = keyof typeof scales;
export type DefaultRecipe = {
    scheme: Scheme;
    palette: Palette;
    treatment?: Treatment;
    level?: Level;
    active?: boolean;
};
export type Ramp<PaletteName extends string = Palette> = Record<`color-${Level | 5 | 6 | 7 | 8 | 9 | 10 | 11}`, `${PaletteName}-${Shade}`>;
export declare function rampReversed(scheme: Scheme, scale?: ThemeScale<string>): boolean;
export declare function ramp<const PaletteName extends string>(palette: PaletteName, scheme: Scheme, scale?: ThemeScale<string>): Ramp<PaletteName>;
export declare function fromShades<const PaletteName extends string, TokenName extends string>(palette: PaletteName, scale: ThemeScale<TokenName>): Record<SemanticThemeKey, `${PaletteName}-${Shade}` | TokenName>;
export type PaletteRecipe = {
    scheme: Scheme;
    palette: string;
    treatment?: Treatment;
    level?: Level;
    active?: boolean;
};
export type PaletteTheme = Record<keyof Ramp | SemanticThemeKey | ShadowName, string>;
export declare function getTheme({ recipe, tokens, }: GetThemeContext<{
    color: Record<string, string>;
}, PaletteRecipe>): PaletteTheme;
/** eleven colors, from the 50 shade (palest) to 950 (deepest) */
export type PaletteRamp = readonly string[];
export type PaletteTokens<Palettes extends Record<string, PaletteRamp>> = {
    [Name in keyof Palettes & string as `${Name}-${Shade}`]: string;
};
/** color tokens for palettes: `{ brand: [...] }` becomes `brand-50` through `brand-950` */
export declare function paletteTokens<const Palettes extends Record<string, PaletteRamp>>(palettes: Palettes): PaletteTokens<Palettes>;
export type PaletteThemesInput = {
    surface?: PaletteRamp;
    brand?: PaletteRamp;
} & Record<string, PaletteRamp>;
/**
 * the whole theme system from your own palettes. `surface` grounds light and
 * dark (mauve when absent), `brand` fills the accent tint, the emphasis
 * `brand` theme and `accent-background` (blue when absent), and any other name
 * becomes a ramp addressable as `name-50` through `name-950`. dark reads each
 * ramp in reverse, so one ramp per palette covers both schemes, and every
 * role (background, hover, press, border, type, placeholder, accent) derives.
 */
export declare function createPaletteThemes<const Palettes extends PaletteThemesInput>(palettes: Palettes): {
    colorTokens: {
        white: string;
        black: string;
        'slate-50': string;
        'slate-100': string;
        'slate-200': string;
        'slate-300': string;
        'slate-400': string;
        'slate-500': string;
        'slate-600': string;
        'slate-700': string;
        'slate-800': string;
        'slate-900': string;
        'slate-950': string;
        'gray-50': string;
        'gray-100': string;
        'gray-200': string;
        'gray-300': string;
        'gray-400': string;
        'gray-500': string;
        'gray-600': string;
        'gray-700': string;
        'gray-800': string;
        'gray-900': string;
        'gray-950': string;
        'zinc-50': string;
        'zinc-100': string;
        'zinc-200': string;
        'zinc-300': string;
        'zinc-400': string;
        'zinc-500': string;
        'zinc-600': string;
        'zinc-700': string;
        'zinc-800': string;
        'zinc-900': string;
        'zinc-950': string;
        'neutral-50': string;
        'neutral-100': string;
        'neutral-200': string;
        'neutral-300': string;
        'neutral-400': string;
        'neutral-500': string;
        'neutral-600': string;
        'neutral-700': string;
        'neutral-800': string;
        'neutral-900': string;
        'neutral-950': string;
        'stone-50': string;
        'stone-100': string;
        'stone-200': string;
        'stone-300': string;
        'stone-400': string;
        'stone-500': string;
        'stone-600': string;
        'stone-700': string;
        'stone-800': string;
        'stone-900': string;
        'stone-950': string;
        'olive-50': string;
        'olive-100': string;
        'olive-200': string;
        'olive-300': string;
        'olive-400': string;
        'olive-500': string;
        'olive-600': string;
        'olive-700': string;
        'olive-800': string;
        'olive-900': string;
        'olive-950': string;
        'mist-50': string;
        'mist-100': string;
        'mist-200': string;
        'mist-300': string;
        'mist-400': string;
        'mist-500': string;
        'mist-600': string;
        'mist-700': string;
        'mist-800': string;
        'mist-900': string;
        'mist-950': string;
        'taupe-50': string;
        'taupe-100': string;
        'taupe-200': string;
        'taupe-300': string;
        'taupe-400': string;
        'taupe-500': string;
        'taupe-600': string;
        'taupe-700': string;
        'taupe-800': string;
        'taupe-900': string;
        'taupe-950': string;
        'red-50': string;
        'red-100': string;
        'red-200': string;
        'red-300': string;
        'red-400': string;
        'red-500': string;
        'red-600': string;
        'red-700': string;
        'red-800': string;
        'red-900': string;
        'red-950': string;
        'orange-50': string;
        'orange-100': string;
        'orange-200': string;
        'orange-300': string;
        'orange-400': string;
        'orange-500': string;
        'orange-600': string;
        'orange-700': string;
        'orange-800': string;
        'orange-900': string;
        'orange-950': string;
        'amber-50': string;
        'amber-100': string;
        'amber-200': string;
        'amber-300': string;
        'amber-400': string;
        'amber-500': string;
        'amber-600': string;
        'amber-700': string;
        'amber-800': string;
        'amber-900': string;
        'amber-950': string;
        'yellow-50': string;
        'yellow-100': string;
        'yellow-200': string;
        'yellow-300': string;
        'yellow-400': string;
        'yellow-500': string;
        'yellow-600': string;
        'yellow-700': string;
        'yellow-800': string;
        'yellow-900': string;
        'yellow-950': string;
        'lime-50': string;
        'lime-100': string;
        'lime-200': string;
        'lime-300': string;
        'lime-400': string;
        'lime-500': string;
        'lime-600': string;
        'lime-700': string;
        'lime-800': string;
        'lime-900': string;
        'lime-950': string;
        'green-50': string;
        'green-100': string;
        'green-200': string;
        'green-300': string;
        'green-400': string;
        'green-500': string;
        'green-600': string;
        'green-700': string;
        'green-800': string;
        'green-900': string;
        'green-950': string;
        'emerald-50': string;
        'emerald-100': string;
        'emerald-200': string;
        'emerald-300': string;
        'emerald-400': string;
        'emerald-500': string;
        'emerald-600': string;
        'emerald-700': string;
        'emerald-800': string;
        'emerald-900': string;
        'emerald-950': string;
        'teal-50': string;
        'teal-100': string;
        'teal-200': string;
        'teal-300': string;
        'teal-400': string;
        'teal-500': string;
        'teal-600': string;
        'teal-700': string;
        'teal-800': string;
        'teal-900': string;
        'teal-950': string;
        'cyan-50': string;
        'cyan-100': string;
        'cyan-200': string;
        'cyan-300': string;
        'cyan-400': string;
        'cyan-500': string;
        'cyan-600': string;
        'cyan-700': string;
        'cyan-800': string;
        'cyan-900': string;
        'cyan-950': string;
        'sky-50': string;
        'sky-100': string;
        'sky-200': string;
        'sky-300': string;
        'sky-400': string;
        'sky-500': string;
        'sky-600': string;
        'sky-700': string;
        'sky-800': string;
        'sky-900': string;
        'sky-950': string;
        'blue-50': string;
        'blue-100': string;
        'blue-200': string;
        'blue-300': string;
        'blue-400': string;
        'blue-500': string;
        'blue-600': string;
        'blue-700': string;
        'blue-800': string;
        'blue-900': string;
        'blue-950': string;
        'indigo-50': string;
        'indigo-100': string;
        'indigo-200': string;
        'indigo-300': string;
        'indigo-400': string;
        'indigo-500': string;
        'indigo-600': string;
        'indigo-700': string;
        'indigo-800': string;
        'indigo-900': string;
        'indigo-950': string;
        'violet-50': string;
        'violet-100': string;
        'violet-200': string;
        'violet-300': string;
        'violet-400': string;
        'violet-500': string;
        'violet-600': string;
        'violet-700': string;
        'violet-800': string;
        'violet-900': string;
        'violet-950': string;
        'purple-50': string;
        'purple-100': string;
        'purple-200': string;
        'purple-300': string;
        'purple-400': string;
        'purple-500': string;
        'purple-600': string;
        'purple-700': string;
        'purple-800': string;
        'purple-900': string;
        'purple-950': string;
        'fuchsia-50': string;
        'fuchsia-100': string;
        'fuchsia-200': string;
        'fuchsia-300': string;
        'fuchsia-400': string;
        'fuchsia-500': string;
        'fuchsia-600': string;
        'fuchsia-700': string;
        'fuchsia-800': string;
        'fuchsia-900': string;
        'fuchsia-950': string;
        'pink-50': string;
        'pink-100': string;
        'pink-200': string;
        'pink-300': string;
        'pink-400': string;
        'pink-500': string;
        'pink-600': string;
        'pink-700': string;
        'pink-800': string;
        'pink-900': string;
        'pink-950': string;
        'rose-50': string;
        'rose-100': string;
        'rose-200': string;
        'rose-300': string;
        'rose-400': string;
        'rose-500': string;
        'rose-600': string;
        'rose-700': string;
        'rose-800': string;
        'rose-900': string;
        'rose-950': string;
        'mauve-50': '#faf9fb';
        'mauve-100': '#eceaee';
        'mauve-200': '#dfdbe3';
        'mauve-300': '#d1cdd7';
        'mauve-400': '#bab7c3';
        'mauve-500': '#a19faa';
        'mauve-600': '#8a8794';
        'mauve-700': '#6a6872';
        'mauve-800': '#54515a';
        'mauve-900': '#3d3a41';
        'mauve-950': '#1c1b1e';
        'brand-50': string;
        'brand-100': string;
        'brand-200': string;
        'brand-300': string;
        'brand-400': string;
        'brand-500': string;
        'brand-600': string;
        'brand-700': string;
        'brand-800': string;
        'brand-900': string;
        'brand-950': string;
    } & PaletteTokens<Palettes>;
    themes: import("@tamagui/create-theme").CreatedThemes<import("@tamagui/create-theme").ThemeNames<{
        readonly light: {
            readonly scheme: 'light';
            readonly palette: "mauve" | "surface";
        };
        readonly dark: {
            readonly scheme: 'dark';
            readonly palette: "mauve" | "surface";
        };
        readonly children: {
            readonly level2: LevelDefinition<3>;
            readonly level3: LevelDefinition<3>;
            readonly level4: LevelDefinition<3>;
            readonly accent: {
                readonly palette: 'brand';
                readonly treatment: 'tint';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            brand: {
                palette: string;
                treatment: string;
                children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            } | (({ parent }: ThemeDefinitionContext) => {
                scheme: string;
                children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            });
            readonly inverse: ({ parent }: ThemeDefinitionContext) => {
                scheme: string;
                children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly active: {
                readonly active: true;
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly black: {
                readonly scheme: 'dark';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly white: {
                readonly scheme: 'light';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly red: {
                readonly palette: 'red';
                readonly treatment: 'tint';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly yellow: {
                readonly palette: 'yellow';
                readonly treatment: 'tint';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
            readonly green: {
                readonly palette: 'green';
                readonly treatment: 'tint';
                readonly children: {
                    level2: LevelDefinition<3>;
                    level3: LevelDefinition<3>;
                    level4: LevelDefinition<3>;
                };
            };
        };
    }>, PaletteTheme>;
};
type LevelParent = Record<string, unknown> & {
    level?: Level;
};
type LevelDefinition<Depth extends number> = (context: ThemeDefinitionContext<LevelParent>) => {
    level: Level;
    children: LevelChildren<Depth>;
} | null;
export type LevelChildren<Depth extends number = 4> = Depth extends 4 ? {
    level2: LevelDefinition<3>;
    level3: LevelDefinition<3>;
    level4: LevelDefinition<3>;
} : Depth extends 3 ? {
    level2: LevelDefinition<2>;
    level3: LevelDefinition<2>;
    level4: LevelDefinition<2>;
} : Depth extends 2 ? {
    level2: LevelDefinition<1>;
    level3: LevelDefinition<1>;
    level4: LevelDefinition<1>;
} : Depth extends 1 ? {
    level2: LevelDefinition<0>;
    level3: LevelDefinition<0>;
    level4: LevelDefinition<0>;
} : {};
export declare function levels(max?: Level): LevelChildren;
export declare const tree: {
    readonly light: {
        readonly scheme: 'light';
        readonly palette: 'mauve';
    };
    readonly dark: {
        readonly scheme: 'dark';
        readonly palette: 'mauve';
    };
    readonly children: {
        readonly level2: LevelDefinition<3>;
        readonly level3: LevelDefinition<3>;
        readonly level4: LevelDefinition<3>;
        readonly accent: {
            readonly palette: 'brand';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly brand: ({ parent }: ThemeDefinitionContext) => {
            scheme: string;
            children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly inverse: ({ parent }: ThemeDefinitionContext) => {
            scheme: string;
            children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly active: {
            readonly active: true;
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly black: {
            readonly scheme: 'dark';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly white: {
            readonly scheme: 'light';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly red: {
            readonly palette: 'red';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly yellow: {
            readonly palette: 'yellow';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly green: {
            readonly palette: 'green';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
    };
};
export declare const themes: import("@tamagui/create-theme").CreatedThemes<import("@tamagui/create-theme").ThemeNames<{
    readonly light: {
        readonly scheme: 'light';
        readonly palette: 'mauve';
    };
    readonly dark: {
        readonly scheme: 'dark';
        readonly palette: 'mauve';
    };
    readonly children: {
        readonly level2: LevelDefinition<3>;
        readonly level3: LevelDefinition<3>;
        readonly level4: LevelDefinition<3>;
        readonly accent: {
            readonly palette: 'brand';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly brand: ({ parent }: ThemeDefinitionContext) => {
            scheme: string;
            children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly inverse: ({ parent }: ThemeDefinitionContext) => {
            scheme: string;
            children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly active: {
            readonly active: true;
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly black: {
            readonly scheme: 'dark';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly white: {
            readonly scheme: 'light';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly red: {
            readonly palette: 'red';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly yellow: {
            readonly palette: 'yellow';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
        readonly green: {
            readonly palette: 'green';
            readonly treatment: 'tint';
            readonly children: {
                level2: LevelDefinition<3>;
                level3: LevelDefinition<3>;
                level4: LevelDefinition<3>;
            };
        };
    };
}>, PaletteTheme>;
//# sourceMappingURL=builder.d.ts.map