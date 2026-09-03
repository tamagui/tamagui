import { shorthands } from '@tamagui/shorthands/v6';
import type { CreateTamaguiProps } from '@tamagui/web';
import { selectionStyles } from './settings';
import { v6RemovedThemeNames, v6ThemeNameReplacements } from '@tamagui/style-grammar/v6-themes';
export { shorthands };
export { createSystemFont } from './fonts';
export { breakpoints, media, mediaQueryDefaultActive } from './media';
export { selectionStyles };
export { tailwindSource } from './v6-tailwind-scales.generated';
export { v6RemovedThemeNames, v6ThemeNameReplacements };
export { toV6Themes, type V6Theme, type V6Themes } from './v6-themes';
export declare const tokens: {
    readonly space: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '-px': -1;
        readonly '-0.5': -2;
        readonly '-0-5': -2;
        readonly '-1': -4;
        readonly '-1.5': -6;
        readonly '-1-5': -6;
        readonly '-2': -8;
        readonly '-2.5': -10;
        readonly '-2-5': -10;
        readonly '-3': -12;
        readonly '-3.5': -14;
        readonly '-3-5': -14;
        readonly '-4': -16;
        readonly '-5': -20;
        readonly '-6': -24;
        readonly '-7': -28;
        readonly '-8': -32;
        readonly '-9': -36;
        readonly '-10': -40;
        readonly '-11': -44;
        readonly '-12': -48;
        readonly '-14': -56;
        readonly '-16': -64;
        readonly '-20': -80;
        readonly '-24': -96;
        readonly '-28': -112;
        readonly '-32': -128;
        readonly '-36': -144;
        readonly '-40': -160;
        readonly '-44': -176;
        readonly '-48': -192;
        readonly '-52': -208;
        readonly '-56': -224;
        readonly '-60': -240;
        readonly '-64': -256;
        readonly '-72': -288;
        readonly '-80': -320;
        readonly '-96': -384;
    };
    readonly size: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
    };
    readonly width: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly minWidth: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly maxWidth: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly inlineSize: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly minInlineSize: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly maxInlineSize: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly flexBasis: {
        readonly '0': 0;
        readonly '1': 4;
        readonly '2': 8;
        readonly '3': 12;
        readonly '4': 16;
        readonly '5': 20;
        readonly '6': 24;
        readonly '7': 28;
        readonly '8': 32;
        readonly '9': 36;
        readonly '10': 40;
        readonly '11': 44;
        readonly '12': 48;
        readonly '14': 56;
        readonly '16': 64;
        readonly '20': 80;
        readonly '24': 96;
        readonly '28': 112;
        readonly '32': 128;
        readonly '36': 144;
        readonly '40': 160;
        readonly '44': 176;
        readonly '48': 192;
        readonly '52': 208;
        readonly '56': 224;
        readonly '60': 240;
        readonly '64': 256;
        readonly '72': 288;
        readonly '80': 320;
        readonly '96': 384;
        readonly px: 1;
        readonly '0.5': 2;
        readonly '0-5': 2;
        readonly '1.5': 6;
        readonly '1-5': 6;
        readonly '2.5': 10;
        readonly '2-5': 10;
        readonly '3.5': 14;
        readonly '3-5': 14;
        readonly '3xs': 256;
        readonly '2xs': 288;
        readonly xs: 320;
        readonly sm: 384;
        readonly md: 448;
        readonly lg: 512;
        readonly xl: 576;
        readonly '2xl': 672;
        readonly '3xl': 768;
        readonly '4xl': 896;
        readonly '5xl': 1024;
        readonly '6xl': 1152;
        readonly '7xl': 1280;
    };
    readonly outlineWidth: {
        readonly 0: 0;
        readonly 1: 1;
        readonly 2: 2;
        readonly 4: 4;
        readonly 8: 8;
    };
    readonly outlineOffset: {
        readonly 0: 0;
        readonly 1: 1;
        readonly 2: 2;
        readonly 4: 4;
        readonly 8: 8;
        readonly '-1': -1;
        readonly '-2': -2;
        readonly '-4': -4;
        readonly '-8': -8;
    };
    readonly boxShadow: {
        readonly '2xs': '0 1px rgb(0 0 0 / 0.05)';
        readonly xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        readonly sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
        readonly md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
        readonly lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
        readonly xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
        readonly '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)';
    };
    readonly perspective: {
        readonly dramatic: 100;
        readonly near: 300;
        readonly normal: 500;
        readonly midrange: 800;
        readonly distant: 1200;
    };
    readonly radius: {
        readonly xs: 2;
        readonly sm: 4;
        readonly md: 6;
        readonly lg: 8;
        readonly xl: 12;
        readonly '2xl': 16;
        readonly '3xl': 24;
        readonly '4xl': 32;
        readonly full: 9999;
        readonly 0: 0;
        readonly 1: 3;
        readonly 2: 5;
        readonly 3: 7;
        readonly 4: 9;
        readonly 5: 10;
        readonly 6: 16;
        readonly 7: 19;
        readonly 8: 22;
        readonly 9: 26;
        readonly 10: 34;
        readonly 11: 42;
        readonly 12: 50;
    };
};
export declare const fonts: {
    body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16> & {
        size: {
            xs: 12;
            sm: 14;
            base: 16;
            lg: 18;
            xl: 20;
            '2xl': 24;
            '3xl': 30;
            '4xl': 36;
            '5xl': 48;
            '6xl': 60;
            '7xl': 72;
            '8xl': 96;
            '9xl': 128;
        };
        lineHeight: {
            xs: 16;
            sm: 20;
            base: 24;
            lg: 28;
            xl: 28;
            '2xl': 32;
            '3xl': 36;
            '4xl': 40;
            '5xl': 48;
            '6xl': 60;
            '7xl': 72;
            '8xl': 96;
            '9xl': 128;
        };
    };
    heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16> & {
        size: {
            xs: 12;
            sm: 14;
            base: 16;
            lg: 18;
            xl: 20;
            '2xl': 24;
            '3xl': 30;
            '4xl': 36;
            '5xl': 48;
            '6xl': 60;
            '7xl': 72;
            '8xl': 96;
            '9xl': 128;
        };
        lineHeight: {
            xs: 16;
            sm: 20;
            base: 24;
            lg: 28;
            xl: 28;
            '2xl': 32;
            '3xl': 36;
            '4xl': 40;
            '5xl': 48;
            '6xl': 60;
            '7xl': 72;
            '8xl': 96;
            '9xl': 128;
        };
    };
};
export declare const settings: {
    mediaQueryDefaultActive: {
        touchable: boolean;
        hoverable: boolean;
        'max-xxl': boolean;
        'max-xl': boolean;
        'max-lg': boolean;
        'max-md': boolean;
        'max-sm': boolean;
        'max-xs': boolean;
        'max-xxs': boolean;
        'max-xxxs': boolean;
        xxxs: boolean;
        xxs: boolean;
        xs: boolean;
        sm: boolean;
        md: boolean;
        lg: boolean;
        xl: boolean;
        xxl: boolean;
        'max-height-sm': boolean;
        'max-height-md': boolean;
        'max-height-lg': boolean;
        'height-sm': boolean;
        'height-md': boolean;
        'height-lg': boolean;
    };
    defaultFont: string;
    fastSchemeChange: true;
    shouldAddPrefersColorThemes: true;
    allowedStyleValues: "somewhat-strict-web";
    addThemeClassName: "html";
    onlyAllowShorthands: true;
    styleCompat: "web";
};
export type V6Settings = typeof settings;
/**
 * A v6 colors pack: the one seam where color choice enters the config.
 * Themes should be generated from the same palette as the color tokens.
 */
export type V6Colors = {
    themes: NonNullable<CreateTamaguiProps['themes']>;
    /** flat named colors added at tokens.color */
    colorTokens?: Record<string, string>;
    /** extra 12-step color scales merged into the light and dark base themes */
    scales?: V6ColorScales;
};
type Twelve<Value> = readonly [
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value,
    Value
];
/** one 12-step scale, light and dark values from step 1 (faintest) to 12 (strongest) */
export type V6ColorScale = {
    light: Twelve<string>;
    dark: Twelve<string>;
};
export type V6ColorScales = Record<string, V6ColorScale>;
type ScaleStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColorScaleThemeKeys<Scales extends V6ColorScales> = {
    [Name in keyof Scales & string as `${Name}${ScaleStep}`]: string;
};
type WithColorScales<Themes extends Record<string, object>, Scales extends V6ColorScales> = {
    [Name in keyof Themes]: Name extends 'light' | 'dark' ? Themes[Name] & ColorScaleThemeKeys<Scales> : Themes[Name];
};
declare const alignedConfig: {
    media: {
        readonly touchable: {
            pointer: string;
        };
        readonly hoverable: {
            hover: string;
        };
        readonly 'max-xxl': {
            readonly maxWidth: number;
        };
        readonly 'max-xl': {
            readonly maxWidth: number;
        };
        readonly 'max-lg': {
            readonly maxWidth: number;
        };
        readonly 'max-md': {
            readonly maxWidth: number;
        };
        readonly 'max-sm': {
            readonly maxWidth: number;
        };
        readonly 'max-xs': {
            readonly maxWidth: number;
        };
        readonly 'max-xxs': {
            readonly maxWidth: number;
        };
        readonly 'max-xxxs': {
            readonly maxWidth: number;
        };
        readonly 'max-200': {
            readonly maxWidth: number;
        };
        readonly 'max-100': {
            readonly maxWidth: number;
        };
        readonly xxxs: {
            readonly minWidth: number;
        };
        readonly xxs: {
            readonly minWidth: number;
        };
        readonly xs: {
            readonly minWidth: number;
        };
        readonly sm: {
            readonly minWidth: number;
        };
        readonly md: {
            readonly minWidth: number;
        };
        readonly lg: {
            readonly minWidth: number;
        };
        readonly xl: {
            readonly minWidth: number;
        };
        readonly xxl: {
            readonly minWidth: number;
        };
        readonly 'max-height-lg': {
            readonly maxHeight: number;
        };
        readonly 'max-height-md': {
            readonly maxHeight: number;
        };
        readonly 'max-height-sm': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xxs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-xxxs': {
            readonly maxHeight: number;
        };
        readonly 'max-height-200': {
            readonly maxHeight: number;
        };
        readonly 'max-height-100': {
            readonly maxHeight: number;
        };
        readonly 'height-sm': {
            readonly minHeight: number;
        };
        readonly 'height-md': {
            readonly minHeight: number;
        };
        readonly 'height-lg': {
            readonly minHeight: number;
        };
    };
    shorthands: {
        text: "textAlign";
        b: "bottom";
        bg: "background";
        content: "alignContent";
        grow: "flexGrow";
        h: "height";
        items: "alignItems";
        justify: "justifyContent";
        l: "left";
        m: "margin";
        maxH: "maxHeight";
        maxW: "maxWidth";
        mb: "marginBottom";
        minH: "minHeight";
        minW: "minWidth";
        ml: "marginLeft";
        mr: "marginRight";
        mt: "marginTop";
        mx: "marginHorizontal";
        my: "marginVertical";
        p: "padding";
        pb: "paddingBottom";
        pl: "paddingLeft";
        pr: "paddingRight";
        pt: "paddingTop";
        px: "paddingHorizontal";
        py: "paddingVertical";
        r: "right";
        rounded: "borderRadius";
        select: "userSelect";
        self: "alignSelf";
        shrink: "flexShrink";
        t: "top";
        w: "width";
        z: "zIndex";
    };
    fonts: {
        body: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16> & {
            size: {
                xs: 12;
                sm: 14;
                base: 16;
                lg: 18;
                xl: 20;
                '2xl': 24;
                '3xl': 30;
                '4xl': 36;
                '5xl': 48;
                '6xl': 60;
                '7xl': 72;
                '8xl': 96;
                '9xl': 128;
            };
            lineHeight: {
                xs: 16;
                sm: 20;
                base: 24;
                lg: 28;
                xl: 28;
                '2xl': 32;
                '3xl': 36;
                '4xl': 40;
                '5xl': 48;
                '6xl': 60;
                '7xl': 72;
                '8xl': 96;
                '9xl': 128;
            };
        };
        heading: import("@tamagui/web").FillInFont<import("@tamagui/web").GenericFont, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16> & {
            size: {
                xs: 12;
                sm: 14;
                base: 16;
                lg: 18;
                xl: 20;
                '2xl': 24;
                '3xl': 30;
                '4xl': 36;
                '5xl': 48;
                '6xl': 60;
                '7xl': 72;
                '8xl': 96;
                '9xl': 128;
            };
            lineHeight: {
                xs: 16;
                sm: 20;
                base: 24;
                lg: 28;
                xl: 28;
                '2xl': 32;
                '3xl': 36;
                '4xl': 40;
                '5xl': 48;
                '6xl': 60;
                '7xl': 72;
                '8xl': 96;
                '9xl': 128;
            };
        };
    };
    selectionStyles: typeof selectionStyles;
    settings: {
        mediaQueryDefaultActive: {
            touchable: boolean;
            hoverable: boolean;
            'max-xxl': boolean;
            'max-xl': boolean;
            'max-lg': boolean;
            'max-md': boolean;
            'max-sm': boolean;
            'max-xs': boolean;
            'max-xxs': boolean;
            'max-xxxs': boolean;
            xxxs: boolean;
            xxs: boolean;
            xs: boolean;
            sm: boolean;
            md: boolean;
            lg: boolean;
            xl: boolean;
            xxl: boolean;
            'max-height-sm': boolean;
            'max-height-md': boolean;
            'max-height-lg': boolean;
            'height-sm': boolean;
            'height-md': boolean;
            'height-lg': boolean;
        };
        defaultFont: string;
        fastSchemeChange: true;
        shouldAddPrefersColorThemes: true;
        allowedStyleValues: "somewhat-strict-web";
        addThemeClassName: "html";
        onlyAllowShorthands: true;
        styleCompat: "web";
    };
};
/** Compose the aligned v6 base with a colors pack into a createTamagui-ready config. */
export declare function createV6Config<Themes extends NonNullable<CreateTamaguiProps['themes']>, ColorTokens extends Record<string, string>, Scales extends V6ColorScales = Record<never, V6ColorScale>>(colors: {
    themes: Themes;
    colorTokens: ColorTokens;
    scales?: Scales;
}): typeof alignedConfig & {
    themes: WithColorScales<Themes, Scales>;
    tokens: typeof tokens & {
        color: ColorTokens;
    };
};
export declare function createV6Config<Themes extends NonNullable<CreateTamaguiProps['themes']>, Scales extends V6ColorScales = Record<never, V6ColorScale>>(colors: {
    themes: Themes;
    colorTokens?: undefined;
    scales?: Scales;
}): typeof alignedConfig & {
    themes: WithColorScales<Themes, Scales>;
    tokens: typeof tokens;
};
//# sourceMappingURL=v6-base.d.ts.map