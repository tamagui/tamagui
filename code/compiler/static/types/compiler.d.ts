import { type AppliedLoweredModule, type CompilerTarget, type LoweredModulePlan, type ResolvedModuleId } from '@tamagui/compiler-core';
import type { TamaguiOptions } from '@tamagui/types';
import { type ComponentModuleEvaluator } from './componentDiscovery';
import type { TamaguiProjectInfo } from './extractor/bundleConfig';
export interface CompilerProjectComponentModule {
    moduleName: string;
    id: string;
}
export interface CompilerProject {
    projectInfo: TamaguiProjectInfo;
    componentModules: CompilerProjectComponentModule[];
    generation: string;
    /** Keep elements with dynamic style props fully on the runtime path. */
    disablePartialExtraction?: boolean;
    /** emit native theme-token mappings for the native style engine */
    experimentalNativeFastPath?: boolean;
    /** Zero-runtime mode, which makes the host's diagnostics mode-aware. */
    zeroRuntime?: boolean;
    /**
     * Content identity of everything a lowering plan depends on that is not a
     * module: the compiler build, the evaluated config and component registry,
     * the platform, and the modes. Null when the project could not name the files
     * that determine it, in which case nothing is cached to disk.
     */
    cacheStamp: string | null;
}
export interface LoadCompilerProjectInput {
    root: string;
    target: CompilerTarget;
    options: Partial<TamaguiOptions>;
    generation: string | ((projectInfo: TamaguiProjectInfo, componentModules: CompilerProjectComponentModule[], options: TamaguiOptions) => string);
    rebuild?: boolean;
    /**
     * `name@version` for the host integration package, folded into the cache
     * stamp so a plugin upgrade cannot reuse plans built by the previous one.
     */
    hostVersions?: readonly string[];
    missingProjectMessage?: string;
    load?: (options: TamaguiOptions, rebuild: boolean) => Promise<TamaguiProjectInfo | null>;
    resolveComponents?: (moduleNames: readonly string[], projectInfo: TamaguiProjectInfo, options: TamaguiOptions) => Promise<CompilerProjectComponentModule[]>;
}
/**
 * normalize and load the compiler-owned project contract. module resolution and
 * evaluation stay with the adapter through the two callbacks.
 */
export declare function loadCompilerProject({ root, target, options: optionsIn, generation, rebuild, hostVersions, missingProjectMessage, load, resolveComponents, }: LoadCompilerProjectInput): Promise<CompilerProject>;
/**
 * The non-module half of every plan cache key. Null when the project named no
 * stamp sources: a stamp that cannot see a config change is worse than no
 * cache, so that project simply does not cache.
 */
export declare function compilerProjectStamp(input: {
    stampSources: readonly string[];
    hostVersions: readonly string[];
    target: CompilerTarget;
    componentModules: readonly CompilerProjectComponentModule[];
    disablePartialExtraction: boolean;
    experimentalNativeFastPath: boolean;
    zeroRuntime: boolean;
    /**
     * `process.env.NODE_ENV === 'development'` in the process that builds plans.
     * The host emits debug-receipt edits into `plan.edits` only in development
     * (compilerHost.ts's developmentDebugInstrumentation), so a development plan
     * is not a plan a production build may reuse. This is the ONLY ambient input
     * to a plan, and it lives in the stamp so every host inherits it rather than
     * each one remembering to add it to its own key.
     */
    development: boolean;
}): string | null;
export interface CompilerResolution {
    id: string;
    external?: boolean;
}
export interface CompilerInput {
    id: string;
    source: string;
    root: string;
    target: CompilerTarget;
    /** Host environment whose resolver produced this module graph. */
    environment?: string;
    project: CompilerProject;
    resolve(specifier: string, importer: string): Promise<CompilerResolution | null>;
    load(id: string): Promise<string | null>;
    /**
     * Evaluate a host-resolved module and return its exports. The frontend asks
     * for every package a JSX element or styled() base imports from that is not
     * in the configured `components` list, once per module per project, and
     * lowers against the static configs it finds. Return null (or throw) when
     * the host cannot evaluate the module; those elements stay on the runtime
     * path exactly as before.
     */
    evaluate?: ComponentModuleEvaluator;
}
export type CompilerUpdateInput = CompilerInput;
export interface CompilerResult {
    plan: LoweredModulePlan;
    output: AppliedLoweredModule;
    invalidatedIds: ResolvedModuleId[];
}
/**
 * Long-lived host-resolved graph frontend. The adapter supplies every identity and
 * load result; compiler-core never guesses package, alias, or workspace resolution.
 */
export declare class CompilerFrontend {
    private readonly session;
    private queue;
    private readonly planCaches;
    private readonly moduleRecords;
    private moduleContext;
    private readonly discovery;
    /**
     * One cache per project root and platform. Absent when the project produced
     * no content stamp, in which case plans are never persisted rather than
     * persisted under an identity that cannot see a config change.
     */
    private planCacheFor;
    /** Hits, misses and writes across every plan cache this frontend has used. */
    get planCacheStats(): {
        hits: number;
        misses: number;
        writes: number;
    };
    compile(input: CompilerInput): Promise<CompilerResult>;
    update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]>;
    has(id: string): boolean;
    dependentsOf(id: string): ResolvedModuleId[];
    remove(id: string): Promise<import("@tamagui/compiler-core").GraphInvalidation>;
    parseCount(id: string): number;
    private compileNow;
    /** host-resolved ids of every module discovery found components in */
    discoveredModuleIds(): string[];
    private buildTree;
}
//# sourceMappingURL=compiler.d.ts.map