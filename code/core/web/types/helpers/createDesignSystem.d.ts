import type { CreateTamaguiProps, Variable } from '../types';
type ThemeConfig = {
    cssRuleSets: string[];
    getThemeRulesSets: () => string[];
};
declare function getFontPropertyDeclarations(fontParsed: any, tokenKey?: string): string[];
export { getFontPropertyDeclarations };
/**
 * Generates CSS for tokens - registers CSS variables and builds declaration strings
 */
export declare function createTokenCSS(tokens: Record<string, Record<string, Variable>>, shouldTokenCategoryHaveUnits: (category: string) => boolean): string[];
/**
 * Generates CSS for fonts
 */
export declare function createFontCSS(fontsParsed: Record<string, any> | undefined, registerFontVariables: (fontParsed: any) => string[]): Record<string, {
    name: string;
    declarations: string[];
    language?: string;
    fontParsed: any;
}>;
/**
 * Builds CSS rulesets from declarations
 */
export declare function buildCSSRuleSets(declarations: string[], fontDeclarations: Record<string, {
    name: string;
    declarations: string[];
    language?: string;
    fontParsed: any;
}>, defaultFontToken?: string): string[];
/**
 * Generates theme CSS rules
 */
export declare function createThemeCSS(dedupedThemes: Array<{
    names: string[];
    theme: any;
}>, configIn: CreateTamaguiProps): string[];
/**
 * Gets all generated CSS - design system + runtime styles
 */
export declare function getCSS(themeConfig: ThemeConfig, opts: {
    separator?: string;
    sinceLastCall?: boolean;
    exclude?: "themes" | "design-system" | string | null;
} | undefined, lastIndex: {
    value: number;
}): string;
//# sourceMappingURL=createDesignSystem.d.ts.map