import type { Shorthands } from '@tamagui/shorthands/v4';
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5';
import type { GenericSizing } from '@tamagui/web';
import type { V5Fonts } from './v5-fonts';
import type { Media as V5Media } from './media';
import type { Settings as V5Settings } from './settings';
export { shorthands } from '@tamagui/shorthands/v4';
export { tokens, type V5Theme, type V5ThemeNames, type V5Themes, type V5Tokens, } from '@tamagui/themes/v5';
export { createSystemFont, fonts } from './v5-fonts';
export type { V5Fonts } from './v5-fonts';
export { breakpoints, media, mediaQueryDefaultActive } from './media';
export type { Media as V5Media } from './media';
export { selectionStyles, settings } from './settings';
export type { Settings as V5Settings } from './settings';
export type V5DefaultConfig = {
    media: V5Media;
    shorthands: Shorthands;
    themes: V5Themes;
    tokens: V5Tokens;
    fonts: V5Fonts;
    settings: V5Settings;
    sizing: GenericSizing;
};
export declare const defaultSizing: {
    readonly default: 'md';
    readonly sizes: {
        readonly xs: {
            readonly fontSize: '1';
            readonly controlFontSize: '1';
            readonly paddingInline: '2';
            readonly paddingBlock: '1-5';
            readonly gap: '1-5';
            readonly radius: '1';
            readonly px: {
                readonly height: 24;
                readonly icon: 12;
                readonly square: 17;
            };
        };
        readonly sm: {
            readonly fontSize: '3';
            readonly controlFontSize: '3';
            readonly paddingInline: '3';
            readonly paddingBlock: '2';
            readonly gap: '2';
            readonly radius: '2';
            readonly px: {
                readonly height: 32;
                readonly icon: 16;
                readonly square: 20;
            };
        };
        readonly md: {
            readonly fontSize: '3';
            readonly controlFontSize: '3';
            readonly paddingInline: '3-5';
            readonly paddingBlock: '2';
            readonly gap: '2';
            readonly radius: '2';
            readonly px: {
                readonly height: 36;
                readonly icon: 16;
                readonly square: 22;
            };
        };
        readonly lg: {
            readonly fontSize: '5';
            readonly controlFontSize: '5';
            readonly paddingInline: '5';
            readonly paddingBlock: '2';
            readonly gap: '2';
            readonly radius: '2';
            readonly px: {
                readonly height: 40;
                readonly icon: 16;
                readonly square: 25;
            };
        };
        readonly xl: {
            readonly fontSize: '6';
            readonly controlFontSize: '6';
            readonly paddingInline: '6';
            readonly paddingBlock: '2-5';
            readonly gap: '2-5';
            readonly radius: '3';
            readonly px: {
                readonly height: 48;
                readonly icon: 20;
                readonly square: 28;
            };
        };
    };
};
export declare const defaultConfig: V5DefaultConfig;
//# sourceMappingURL=v5-base.d.ts.map