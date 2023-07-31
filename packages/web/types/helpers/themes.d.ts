import { DedupedThemes, ThemeParsed, Tokens, TokensParsed } from '../types';
export declare function ensureThemeVariable(theme: any, key: string): void;
export declare function proxyThemesToParents(dedupedThemes: DedupedThemes, tokens: Tokens): Record<string, ThemeParsed>;
export declare function proxyThemeToParents(themeName: string, theme: ThemeParsed, tokens?: TokensParsed): ThemeParsed;
//# sourceMappingURL=themes.d.ts.map