import type { GenericVariables, TamaguiInternalConfig, TokensParsed, Variable, VariablesProps, VariableValIn } from '../types';
export declare const isUnitlessVariableKey: (key: string) => boolean;
export declare const getThemeKeySet: (conf: TamaguiInternalConfig) => Set<string>;
/**
 * Resolves one <Variables> value to a CSS value string.
 * References emit var() so they stay live in the cascade; literals serialize
 * with the same unit rule numeric style props use (px unless unitless key).
 * Returns undefined for unresolvable references (dev-warned, dropped).
 */
export declare function resolveVariableValueToCSS(key: string, value: VariableValIn, conf: TamaguiInternalConfig): string | undefined;
export type VariablesCSS = {
    identifier: string;
    rules: string[];
};
/**
 * Builds the deterministic identifier + CSS rules for a <Variables> node.
 * Identifier is a pure function of the resolved declarations so SSR and
 * client agree, and a build-time extractor can precompute it.
 *
 * Scheme scoping supports two levels of light/dark inversion, matching the
 * theme system's own selector strategy (getThemeCSSRules).
 */
export declare function getVariablesCSSRules(props: VariablesProps, conf: TamaguiInternalConfig): VariablesCSS | null;
/**
 * Config-level custom variables: merged into every base theme at createTamagui
 * time so they behave exactly like theme keys in every existing code path.
 * References resolve per-theme at parse time; sub-themes inherit through
 * proxyThemesToParents (native) and the cascade (web).
 */
export declare function mergeConfigVariablesIntoTheme(theme: Record<string, Variable>, themeName: string, variables: GenericVariables, specificTokens: Record<string, Variable>, tokensParsed: TokensParsed): void;
//# sourceMappingURL=variables.d.ts.map