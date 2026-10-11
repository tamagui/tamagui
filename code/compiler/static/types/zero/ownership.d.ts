import type { TamaguiOptions } from '../types';
/**
 * Artifact ownership, shared by every integration and by both CSS tiers.
 *
 * A build may claim `TAMAGUI_DID_OUTPUT_CSS='1'` only after the artifact that
 * replaces the stripped JavaScript rules is proven to exist, to match the CSS
 * this build's config generates, and to be loaded by the entry graph. Those are
 * three separate failures with three separate causes, so they are three
 * separate diagnostics.
 */
export type GlobalCSSFailureKind = 'missing' | 'stale' | 'unimported';
export interface GlobalCSSFailure {
    kind: GlobalCSSFailureKind;
    cssPath: string;
    message: string;
}
export declare const hashCSS: (css: string) => string;
/**
 * `TAMAGUI_DOES_SSR_CSS='mutates-themes'` declares that themes are mutated at
 * runtime, which is the one declaration that keeps the runtime theme generator
 * alive. It therefore blocks the compiled-global-CSS claim outright.
 */
export declare const declaresRuntimeThemeMutation: () => boolean;
export interface GlobalCSSOwnership {
    /** Absolute path of the artifact this build owns. */
    cssPath: string;
}
/**
 * The compiled-global-CSS tier for one web build, or null when the build is not
 * in that tier.
 *
 * Zero mode owns its own combined artifact and derives the flag through
 * `ZeroCSSArtifact`, so it is deliberately excluded here: one tier, one owner.
 */
export declare function resolveGlobalCSSOwnership(options: Pick<TamaguiOptions, 'experimental' | 'outputCSS' | 'platform' | 'disable'>, root: string): GlobalCSSOwnership | null;
/**
 * The three ways the stripping fact and its replacement asset can diverge.
 *
 * `loadedModuleIds` is the set of module ids the entry graph actually shipped.
 * An integration that publishes the artifact as a static file rather than as a
 * graph module passes the published copy's path instead, which is the same
 * question asked of a different transport.
 */
export declare function checkGlobalCSSArtifact(input: {
    cssPath: string;
    expectedCSS: string;
    loadedModuleIds: Iterable<string>;
    /** How the entry is expected to reach the artifact, printed on failure. */
    importHint: string;
}): GlobalCSSFailure | null;
//# sourceMappingURL=ownership.d.ts.map