import type { Shorthands } from '@tamagui/shorthands/v4';
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5';
import type { V5Fonts } from './v5-fonts';
import type { Media as V5Media } from './media';
import { selectionStyles, sizes } from './settings';
import type { Settings as V5Settings } from './settings';
export { shorthands } from '@tamagui/shorthands/v4';
export { sizes } from './settings';
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
export declare const defaultConfig: V5DefaultConfig;
//# sourceMappingURL=v5-base.d.ts.map