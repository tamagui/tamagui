import type { HostModuleInput, ResolvedModuleId } from './contracts';
import { type LoweredModulePlan } from './lower';
export declare const PLAN_CACHE_SCHEMA_VERSION = 1;
/**
 * Entries are content addressed, so every edit of a shared module writes new
 * files and nothing ever replaces the old ones. Twenty edits of one module a
 * hundred consumers import leaves two thousand dead entries that would live
 * forever. A pruned entry is just a miss, and a miss recompiles, so dropping
 * entries can never be wrong - only slower.
 *
 * The cap has to sit well above the module count of a real project, or an
 * unchanged rebuild of a project larger than the cap would miss on every module
 * the last build evicted. Twenty thousand entries is a few hundred MB at the
 * high end and comfortably holds a large app plus several generations of edits.
 *
 * It is a soft cap: pruning runs between batches of writes, so a store can sit
 * up to one batch above it. Bounding growth is the point, not an exact size.
 */
export declare const PLAN_CACHE_MAX_ENTRIES = 20000;
/**
 * The one on-disk cache location for a project. Metro's plan manifest already
 * lives under it, and the build-time benchmark's "cold" state is defined as
 * deleting it, so everything the compiler persists belongs here and nowhere
 * else.
 */
export declare function tamaguiCacheRoot(projectRoot: string): string;
export declare function defaultPlanCacheRoot(projectRoot: string, target: string): string;
/**
 * Everything a plan depends on that is not a module: the compiler build, the
 * evaluated Tamagui config and component registry, the platform, and the
 * structural pass. `stamp` comes from `loadCompilerProject`'s `cacheStamp`.
 */
export interface PlanCacheIdentity {
    stamp: string;
    target: string;
    structuralPassHash: string;
}
export interface PlanCacheEntry {
    schemaVersion: typeof PLAN_CACHE_SCHEMA_VERSION;
    moduleId: ResolvedModuleId;
    /** Digest of this module plus its whole non-external import closure. */
    closureDigest: string;
    plan: LoweredModulePlan;
}
export interface ModuleClosureNode {
    contentHash: string;
    /** Non-external dependencies only: the edges symbol resolution can cross. */
    dependencies: readonly ResolvedModuleId[];
}
export type ModuleClosureLookup = (id: ResolvedModuleId) => ModuleClosureNode | null;
/**
 * Reads a closure node straight off host module records, for callers that have
 * not built a ProjectGraph (Metro's prepass skips it entirely on a full hit).
 */
export declare function moduleClosureNode(input: HostModuleInput, options?: {
    includeExternal?: boolean;
}): ModuleClosureNode;
/**
 * Closure nodes for ids the graph does not own: package entries. Their bytes
 * decide which static configs lowering resolved against (configured
 * `components` and discovered modules alike), so a package bump changes the
 * digest of every module that imports it. Ids that are not files hash to a
 * constant so they never make a closure incomplete.
 */
export declare function createExternalClosureLookup(): (id: ResolvedModuleId) => ModuleClosureNode;
/**
 * Identity of a module's whole compile input: itself plus every module reachable
 * from it over non-external imports, each by content hash.
 *
 * This is deliberately the import closure rather than the dependency set a
 * successful compile recorded. The recorded set is only known after compiling,
 * and it omits the module that made a value bail, so a dependency edit that
 * turns a bailout into a static value would not invalidate its consumer, which
 * is exactly how a stale style ships. The import closure is the same edge set
 * `ProjectGraph.affectedBy` propagates over in memory, so it can never
 * invalidate less than a live session would.
 *
 * Null when any module in the closure is unknown: an unknown input is a miss,
 * never a guess.
 */
export declare function moduleClosureDigest(id: ResolvedModuleId, lookup: ModuleClosureLookup, memo?: Map<ResolvedModuleId, string | null>): string | null;
export declare function planCacheKey(identity: PlanCacheIdentity, id: ResolvedModuleId, closureDigest: string): string;
/**
 * Content-addressed JSON entries on disk, one file per key. There is no
 * manifest on purpose: a manifest is what makes a cache all-or-nothing, and the
 * point of these caches is that editing one module leaves every other module's
 * entry valid.
 */
export declare class JsonFileCache {
    #private;
    readonly root: string;
    readonly schemaVersion: number;
    readonly maxEntries: number;
    constructor(root: string, schemaVersion: number, maxEntries?: number);
    get stats(): {
        hits: number;
        misses: number;
        writes: number;
    };
    resetStats(): void;
    /**
     * Null on anything short of an entry `validate` fully accepts. A miss
     * recompiles; nothing here repairs or partially trusts an entry, and a later
     * successful compile overwrites the bad file.
     */
    read<T>(key: string, validate: (value: unknown) => T | null): Promise<T | null>;
    write(key: string, value: unknown): Promise<void>;
}
/** Per-module lowering plans, keyed by `planCacheKey`. */
export declare class ModulePlanCache {
    #private;
    readonly root: string;
    constructor(root: string);
    get stats(): {
        hits: number;
        misses: number;
        writes: number;
    };
    resetStats(): void;
    read(key: string, id: ResolvedModuleId, closureDigest: string): Promise<PlanCacheEntry | null>;
    write(key: string, entry: PlanCacheEntry): Promise<void>;
}
//# sourceMappingURL=planCache.d.ts.map