import type { CreateMask, GenericTheme, MaskOptions, ThemeMask } from './createThemeTypes.js';
import type { ThemeInfo } from './themeInfo.js';
export declare function applyMask<Theme extends GenericTheme | ThemeMask>(theme: Theme, mask: CreateMask, options?: MaskOptions, parentName?: string, nextName?: string): Theme;
export declare function applyMaskStateless<Theme extends GenericTheme | ThemeMask>(info: ThemeInfo, mask: CreateMask, options?: MaskOptions, parentName?: string): ThemeInfo & {
    theme: Theme;
};
//# sourceMappingURL=applyMask.d.ts.map