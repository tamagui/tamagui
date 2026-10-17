import type { DedupedThemes, ThemeParsed } from '../types';
export declare function proxyThemesToParents(dedupedThemes: DedupedThemes, declarationOrder?: string[], lazy?: boolean): Record<string, ThemeParsed>;
export declare function proxyThemeToParents(themeName: string, theme: ThemeParsed, raw?: Record<string, ThemeParsed>): {};
//# sourceMappingURL=proxyThemeToParents.d.ts.map