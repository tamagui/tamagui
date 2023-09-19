import { DedupedThemes, ThemeParsed } from '../types';
export declare const themesRaw: Record<string, ThemeParsed>;
export declare function proxyThemesToParents(dedupedThemes: DedupedThemes): Record<string, ThemeParsed>;
export declare function proxyThemeToParents(themeName: string, theme: ThemeParsed): ThemeParsed;
//# sourceMappingURL=proxyThemeToParents.d.ts.map