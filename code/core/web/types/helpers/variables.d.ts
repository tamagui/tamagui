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
 * The themes map emits each bucket under its theme-class scope. dark/light
 * buckets keep the scheme strategy (two levels of light/dark inversion plus
 * the prefers-color-scheme fallback, matching getThemeCSSRules); other names
 * scope by plain theme class.
 */
export declare function getVariablesCSSRules(props: VariablesProps, conf: TamaguiInternalConfig): VariablesCSS | null;
type InlineValues = Pick<VariablesProps, 'values' | 'themes'>;
export declare const inlineLayerKey = "_tmgInlineLayer";
export type InlineLayerInfo = {
    key: string;
    overridden: Set<string>;
    pairs: Record<string, {
        light: string | number;
        dark: string | number;
    }>;
};
export declare const getInlineValuesKey: (inline: InlineValues) => string;
/**
 * Builds the merged theme for a <Variables> layer: parent theme spread plus
 * overridden keys as Variables, resolved per the shared contract (effective
 * map = values + matching non-scheme theme buckets + scheme bucket,
 * fixed-point references, cycle-involved keys dropped everywhere). Non-scheme
 * buckets match the subtree's resolved theme name by segment (bucket "blue"
 * under "dark_blue"), mirroring the theme-class scoping on web; dark/light
 * buckets resolve by the scheme derived from the theme name. Returns the
 * parent theme unchanged when nothing applies. Identity-stable per
 * (parentTheme, values, matched buckets, scheme) so snapshot bailouts and
 * proxy caches hold.
 */
export declare function getMergedInlineTheme(parentTheme: Record<string, Variable>, inline: InlineValues, themeName: string | undefined, conf: TamaguiInternalConfig): Record<string, Variable>;
/**
 * Config-level custom variables: merged into every base theme at createTamagui
 * time so they behave exactly like theme keys in every existing code path.
 * References resolve per-theme at parse time; sub-themes inherit through
 * proxyThemesToParents (native) and the cascade (web).
 */
export declare function mergeConfigVariablesIntoTheme(theme: Record<string, Variable>, themeName: string, variables: GenericVariables, specificTokens: Record<string, Variable>, tokensParsed: TokensParsed): void;
export {};
//# sourceMappingURL=variables.d.ts.map