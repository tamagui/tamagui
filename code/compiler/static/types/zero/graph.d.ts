/**
 * The zero-runtime bundle gate.
 *
 * Reference erasure is what removes the modules; this is what proves it. A green
 * build is not evidence, so every integration hands its own resolved module ids
 * and importer chains to this one check and writes a machine-readable receipt.
 */
export interface ZeroGraphModule {
    id: string;
    /** Direct importers of this module inside the same graph. */
    importers?: readonly string[];
}
export interface ZeroForbiddenModule {
    id: string;
    /** Shortest importer chain from an entry to the forbidden module. */
    chain: string[];
}
export interface ZeroGraphReceipt {
    integration: string;
    graph: 'zero' | 'island' | 'negative-control';
    entries: string[];
    moduleCount: number;
    tamaguiModules: string[];
    forbidden: ZeroForbiddenModule[];
    cssArtifact: {
        path: string;
        hash: string;
    } | null;
    identity: string;
    gzip?: Record<string, number>;
    /**
     * Whether this build restored its artifact from a persisted plan cache
     * instead of rescanning. Only integrations that cache plans set it.
     */
    plansRestoredFromCache?: boolean;
}
/**
 * A module's owning package name, read from the nearest package.json.
 *
 * Path matching is not enough: in this monorepo `@tamagui/web` resolves to
 * `code/core/web/dist/...`, which contains no `@tamagui` path segment at all. A
 * gate that greps ids would report a clean graph on a bundle that ships the
 * whole runtime.
 */
export declare function packageNameOf(id: string): string | null;
export declare function isTamaguiModuleId(id: string): boolean;
export declare function isForbiddenZeroModuleId(id: string): boolean;
export declare function checkZeroGraph(input: {
    entries: readonly string[];
    /** The modules that actually shipped in the emitted chunks. */
    modules: readonly ZeroGraphModule[];
    /**
     * Importer edges for the whole resolved graph. A forbidden module's chain
     * usually runs through modules that were merged into another chunk, so the
     * shipped set alone cannot reconstruct it.
     */
    importerEdges?: ReadonlyMap<string, readonly string[]>;
}): {
    tamaguiModules: string[];
    forbidden: ZeroForbiddenModule[];
};
export declare function formatZeroGraphFailure(receipt: ZeroGraphReceipt): string;
export declare function writeZeroGraphReceipt(outDir: string, name: string, receipt: ZeroGraphReceipt): string;
export interface ZeroViolationSite {
    file: string;
    line: number;
    column: number;
    code: string;
    message: string;
}
/**
 * The compiler collects every violation before failing, sorted by normalized
 * file path, source offset, rule, then message.
 */
export declare function formatZeroViolations(sites: readonly ZeroViolationSite[]): string;
/** UTF-16 offset to 1-based line/column, for diagnostic sites. */
export declare function offsetToLineColumn(source: string, offset: number): {
    line: number;
    column: number;
};
//# sourceMappingURL=graph.d.ts.map