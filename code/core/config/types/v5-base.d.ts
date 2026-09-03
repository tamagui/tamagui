import type { Shorthands } from '@tamagui/shorthands/v4';
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5';
import type { V5Fonts } from './v5-fonts';
import type { Media as V5Media } from './media';
import { selectionStyles } from './settings';
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
    selectionStyles: typeof selectionStyles;
    settings: V5Settings;
    sizes: typeof sizes;
};
/**
 * Named control sizes on the v5 scales. v5 space is a fraction of size, so the
 * keys step unevenly: space 2 = 7px, 2-5 = 10px, 3 = 13px, 4 = 18px.
 */
export declare const sizes: {
    readonly default: 'md';
    readonly xs: {
        readonly fontSize: '2';
        readonly paddingX: '2';
        readonly paddingY: '1-5';
        readonly radius: '2';
    };
    readonly sm: {
        readonly fontSize: '3';
        readonly paddingX: '3';
        readonly paddingY: '2';
        readonly radius: '3';
    };
    readonly md: {
        readonly fontSize: '4';
        readonly paddingX: '4';
        readonly paddingY: '2';
        readonly radius: '4';
    };
    readonly lg: {
        readonly fontSize: '5';
        readonly paddingX: '5';
        readonly paddingY: '2-5';
        readonly radius: '5';
    };
    readonly xl: {
        readonly fontSize: '6';
        readonly paddingX: '6';
        readonly paddingY: '3';
        readonly radius: '6';
    };
};
export declare const defaultConfig: V5DefaultConfig;
//# sourceMappingURL=v5-base.d.ts.map