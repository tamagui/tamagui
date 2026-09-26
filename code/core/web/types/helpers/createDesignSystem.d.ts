import type { CreateTamaguiProps, Variable } from '../types';
type ThemeConfig = {
    cssRuleSets: string[];
    getThemeRulesSets: () => string[];
};
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
 * Everything `getCSS` emits ahead of the runtime rules. It is a pure function of
 * the config, so a per-config slot holds it across calls and SSR stops
 * regenerating every theme's variable block per request. It is NOT hoisted to
 * `createTamagui` time: generating theme rules is what mints auto variables, so
 * doing it eagerly would renumber them whenever a process builds more than one
 * config, and the point of this cache is that nothing about the output moves.
 */
type StaticCSS = {
    /** the variable generation these were built against */
    generation: number;
    /** the config whose settings `getThemeCSSRules` read while building them */
    config: unknown;
    /** keyed by separator and whether the theme rules are in the string */
    byKey: Map<string, string>;
};
export type GetCSSState = {
    /** index into the sorted rule list that `sinceLastCall` slices from */
    lastIndex: number;
    static: StaticCSS | null;
};
/**
 * Gets all generated CSS - design system + runtime styles
 */
export declare function getCSS(themeConfig: ThemeConfig, opts: {
    separator?: string;
    sinceLastCall?: boolean;
    exclude?: 'themes' | 'design-system' | string | null;
} | undefined, state: GetCSSState): string;
export {};
//# sourceMappingURL=createDesignSystem.d.ts.map