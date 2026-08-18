import { type ZeroRule } from '@tamagui/compiler-core';
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
    /** The package that owns the module, which is what the gate matched on. */
    owner: string;
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
/** A module's owning package: the nearest package.json and the name in it. */
export interface OwningPackage {
    name: string | null;
    manifest: string;
}
/**
 * The package that owns a module, read from the nearest package.json.
 *
 * Path matching is not enough: in this monorepo `@tamagui/web` resolves to
 * `code/core/web/dist/...`, which contains no `@tamagui` path segment at all. A
 * gate that greps ids would report a clean graph on a bundle that ships the
 * whole runtime.
 */
export declare function owningPackageOf(id: string): OwningPackage | null;
/**
 * `ownManifest` is the building project's own package.json.
 *
 * A project may legitimately name itself `tamagui` or `@tamagui/something` —
 * this repo's own site and examples do — and then every one of its modules
 * answers this question the same way Tamagui's do. The distinction that
 * actually holds is ownership, not spelling: Tamagui reaches a build as a
 * resolved dependency, so its modules are owned by a different package.json
 * than the one being built. Excluding the project's own manifest keeps the gate
 * a name-free rule rather than a list of names to carve out.
 */
export declare function isTamaguiModuleId(id: string, ownManifest?: string | null): boolean;
export declare function isForbiddenZeroModuleId(id: string, ownManifest?: string | null): boolean;
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
    rule: ZeroRule;
    code: string;
    component?: string;
    message: string;
}
/**
 * One deterministic order for every integration: normalized file path, source
 * offset, rule, then message. A build that reports its violations in a
 * different order on a different machine is not a receipt anyone can diff.
 */
export declare function sortZeroViolations(sites: readonly ZeroViolationSite[]): ZeroViolationSite[];
/** The compiler collects every violation before failing. */
export declare function formatZeroViolations(sites: readonly ZeroViolationSite[]): string;
/**
 * The machine-readable half of the same list. `report` mode writes it and exits
 * successfully; `enforce` writes it and then fails, so the two are comparable.
 */
export declare function writeZeroViolationReport(outDir: string, name: string, report: {
    integration: string;
    mode: 'report' | 'enforce';
    violations: readonly ZeroViolationSite[];
}): string;
/**
 * An exported `styled()` declarator is only erasable because every importer in
 * this entry graph was itself transformed, and therefore lowered its uses. That
 * is a build-wide fact, so it is checked once here rather than guessed per
 * module.
 */
export declare function erasedExportEscape(input: {
    integration: string;
    /** Module ids the zero transform actually ran on. */
    transformed: ReadonlySet<string>;
    /** Erased exported binding names, by the module that declared them. */
    erasedExports: ReadonlyMap<string, readonly string[]>;
    importersOf: ReadonlyMap<string, readonly string[]>;
}): string | null;
/** UTF-16 offset to 1-based line/column, for diagnostic sites. */
export declare function offsetToLineColumn(source: string, offset: number): {
    line: number;
    column: number;
};
//# sourceMappingURL=graph.d.ts.map