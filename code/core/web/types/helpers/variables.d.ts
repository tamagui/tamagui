import type { GenericVariables, TamaguiInternalConfig, ThemeKeys, ThemeName, TokensParsed, Variable, VariableValIn } from '../types';
export type InlineValues = {
    values?: {
        [Key in ThemeKeys]?: VariableValIn;
    };
    themes?: {
        [Name in ThemeName]?: {
            [Key in ThemeKeys]?: VariableValIn;
        };
    };
};
export declare const isUnitlessVariableKey: (key: string) => boolean;
export declare const getThemeKeySet: (conf: TamaguiInternalConfig) => Set<string>;
/**
 * Resolves one inline `<Theme>` value to a CSS value string.
 * References emit var() so they stay live in the cascade; literals serialize
 * with the same unit rule numeric style props use (px unless unitless key).
 * Configured names resolve first; a lookup miss stays literal.
 */
export declare function resolveVariableValueToCSS(key: string, value: VariableValIn, conf: TamaguiInternalConfig): string | undefined;
type VariablesCSS = {
    identifier: string;
    rules: string[];
};
/**
 * Builds the deterministic identifier and CSS rules for inline `<Theme>` values.
 * Identifier is a pure function of the resolved declarations so SSR and
 * client agree, and a build-time extractor can precompute it.
 *
 * The themes map emits each bucket under its theme-class scope. dark/light
 * buckets keep the scheme strategy (two levels of light/dark inversion plus
 * the prefers-color-scheme fallback, matching getThemeCSSRules); other names
 * scope by plain theme class.
 */
export declare function getVariablesCSSRules(props: InlineValues, conf: TamaguiInternalConfig): VariablesCSS | null;
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
 * The props <Theme> owns. Every other prop is read as a theme key, so these
 * names can't be used as theme keys or config variables. development builds
 * report a collision instead of silently dropping the value.
 */
export declare const reservedThemeProps: Record<string, true>;
/**
 * Reads theme-key props off a <Theme> into the inline layer shape the rest of
 * the system already consumes. Returns null when the element carries no theme
 * key props at all, which is one loop over its props (two entries for a plain
 * `<Theme name="dark">`) and no allocation.
 *
 * A key that is present but currently undefined still produces an empty
 * layer. Presence, not value, is what makes an element a theme-updating
 * one (the same rule `hasThemeUpdatingProps` applies to `name`), and it is
 * what keeps `<Theme background={on ? 'red' : undefined}>` rendering the same
 * tree in both states instead of remounting its subtree when a value appears.
 */
export declare function getInlineValuesFromProps(props: Record<string, any>, conf: TamaguiInternalConfig): InlineValues | null;
/**
 * Builds the merged theme for an inline `<Theme>` layer: parent theme spread plus
 * overridden keys as variables, resolved per the shared contract (effective
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
export declare function mergeConfigVariablesIntoTheme(theme: Record<string, Variable>, themeName: string, variables: GenericVariables, tokensParsed: TokensParsed): void;
export {};
//# sourceMappingURL=variables.d.ts.map