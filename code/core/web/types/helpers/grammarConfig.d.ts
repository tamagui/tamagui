import { type ModifierRegistryView, type ResolvedReference } from '@tamagui/style-grammar';
import type { TamaguiInternalConfig, ThemeParsed } from '../types';
export interface GrammarRuntimeContext {
    /** every modifier the config registers, plus parameterized group and container forms */
    registry: ModifierRegistryView;
    /** collision diagnostics from registry construction, for development logging */
    modifierDiagnostics: readonly string[];
    /** content-derived stamp; part of the program hash and the cache generation */
    configRevision: string;
    /** media key -> `@media` condition text */
    mediaQueries: Readonly<Record<string, string>>;
    /** container size -> `@container` condition text; size keys only */
    containerQueries: Readonly<Record<string, string>>;
    /** the media keys that measure a size, and so have an `@` form */
    containerSizes: readonly string[];
    /** color token names, for the background family split */
    colorTokens: ReadonlySet<string>;
    /**
     * the lookup for `resolvePayload`, scoped to one property. `fontFamily` is the
     * active font token and only matters for font-scoped props; it falls back to
     * the config default font exactly as `getTokenForKey` does.
     */
    getLookup(property: string, fontFamily?: string): (name: string) => ResolvedReference | undefined;
    /** whether bare numbers resolve for this property */
    resolvesNumbers(property: string): boolean;
    /** web: the `var(--x)` text for a reference name */
    toVar(name: string): string;
    /**
     * native: the value for a reference name, resolved against one theme. Theme
     * values differ per theme, so this is built per render from the active theme,
     * not once per config.
     */
    createNativeValueGetter(theme?: ThemeParsed): (name: string) => string | number;
}
export interface CreateGrammarRuntimeContextOptions {
    /**
     * Overrides the derived container query table. Every size-measuring media key
     * must be present, and extra keys are allowed for sizes the derivation misses.
     * A missing size is a config-time error, never a lowering-time throw.
     */
    containerQueries?: Readonly<Record<string, string>>;
}
export declare function createGrammarRuntimeContext(config: TamaguiInternalConfig, options?: CreateGrammarRuntimeContextOptions): GrammarRuntimeContext;
//# sourceMappingURL=grammarConfig.d.ts.map