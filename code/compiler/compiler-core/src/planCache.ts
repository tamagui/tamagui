import { createHash, randomBytes } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import {
  mkdir,
  readdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { HostModuleInput, ResolvedModuleId } from './contracts'
import { contentHash, stableStringify } from './hash'
import { LOWERED_MODULE_PLAN_VERSION, type LoweredModulePlan } from './lower'
import { moduleContentHash } from './graph'

export const PLAN_CACHE_SCHEMA_VERSION = 1

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
export const PLAN_CACHE_MAX_ENTRIES = 20_000

/**
 * The one on-disk cache location for a project. Metro's plan manifest already
 * lives under it, and the build-time benchmark's "cold" state is defined as
 * deleting it, so everything the compiler persists belongs here and nowhere
 * else.
 */
export function tamaguiCacheRoot(projectRoot: string): string {
  return join(projectRoot, 'node_modules', '.cache', 'tamagui')
}

export function defaultPlanCacheRoot(projectRoot: string, target: string): string {
  return join(tamaguiCacheRoot(projectRoot), 'plans', target)
}

/**
 * Everything a plan depends on that is not a module: the compiler build, the
 * evaluated Tamagui config and component registry, the platform, and the
 * structural pass. `stamp` comes from `loadCompilerProject`'s `cacheStamp`.
 */
export interface PlanCacheIdentity {
  stamp: string
  target: string
  structuralPassHash: string
}

export interface PlanCacheEntry {
  schemaVersion: typeof PLAN_CACHE_SCHEMA_VERSION
  moduleId: ResolvedModuleId
  /** Digest of this module plus its whole non-external import closure. */
  closureDigest: string
  plan: LoweredModulePlan
}

export interface ModuleClosureNode {
  contentHash: string
  /** Non-external dependencies only: the edges symbol resolution can cross. */
  dependencies: readonly ResolvedModuleId[]
}

export type ModuleClosureLookup = (id: ResolvedModuleId) => ModuleClosureNode | null

/**
 * Reads a closure node straight off host module records, for callers that have
 * not built a ProjectGraph (Metro's prepass skips it entirely on a full hit).
 */
export function moduleClosureNode(
  input: HostModuleInput,
  options?: { includeExternal?: boolean }
): ModuleClosureNode {
  return {
    contentHash: moduleContentHash(input),
    dependencies: input.imports
      .filter(({ external }) => options?.includeExternal || !external)
      .map(({ resolvedId }) => resolvedId),
  }
}

/**
 * Closure nodes for ids the graph does not own: package entries. Their bytes
 * decide which static configs lowering resolved against (configured
 * `components` and discovered modules alike), so a package bump changes the
 * digest of every module that imports it. Ids that are not files hash to a
 * constant so they never make a closure incomplete.
 */
export function createExternalClosureLookup(): (
  id: ResolvedModuleId
) => ModuleClosureNode {
  const memo = new Map<string, { size: number; mtimeMs: number; contentHash: string }>()
  return (id) => {
    const file = id.split(/[?#]/, 1)[0]
    if (!file.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(file)) {
      return { contentHash: 'external', dependencies: [] }
    }
    try {
      const stat = statSync(file)
      const cached = memo.get(file)
      if (cached && cached.size === stat.size && cached.mtimeMs === stat.mtimeMs) {
        return { contentHash: cached.contentHash, dependencies: [] }
      }
      const hash = createHash('sha256').update(readFileSync(file)).digest('hex')
      memo.set(file, { size: stat.size, mtimeMs: stat.mtimeMs, contentHash: hash })
      return { contentHash: hash, dependencies: [] }
    } catch {
      return { contentHash: 'external', dependencies: [] }
    }
  }
}

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
export function moduleClosureDigest(
  id: ResolvedModuleId,
  lookup: ModuleClosureLookup,
  memo?: Map<ResolvedModuleId, string | null>
): string | null {
  const cached = memo?.get(id)
  if (cached !== undefined) return cached
  const reached = new Map<ResolvedModuleId, string>()
  const queue: ResolvedModuleId[] = [id]
  let complete = true
  while (queue.length) {
    const current = queue.pop()!
    if (reached.has(current)) continue
    const node = lookup(current)
    if (!node) {
      complete = false
      break
    }
    reached.set(current, node.contentHash)
    for (const dependency of node.dependencies) queue.push(dependency)
  }
  const digest = complete
    ? contentHash(
        [...reached]
          .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
          .map(([current, hash]) => `${current}\0${hash}`)
          .join('\0')
      )
    : null
  memo?.set(id, digest)
  return digest
}

export function planCacheKey(
  identity: PlanCacheIdentity,
  id: ResolvedModuleId,
  closureDigest: string
): string {
  return contentHash(
    stableStringify({
      schema: PLAN_CACHE_SCHEMA_VERSION,
      plan: LOWERED_MODULE_PLAN_VERSION,
      stamp: identity.stamp,
      target: identity.target,
      structuralPassHash: identity.structuralPassHash,
      id,
      closureDigest,
    })
  )
}

/**
 * Content-addressed JSON entries on disk, one file per key. There is no
 * manifest on purpose: a manifest is what makes a cache all-or-nothing, and the
 * point of these caches is that editing one module leaves every other module's
 * entry valid.
 */
export class JsonFileCache {
  #hits = 0
  #misses = 0
  #writes = 0
  #writesSincePrune = 0
  #prunedThisProcess = false
  readonly #created = new Set<string>()

  constructor(
    readonly root: string,
    readonly schemaVersion: number,
    readonly maxEntries: number = PLAN_CACHE_MAX_ENTRIES
  ) {}

  get stats(): { hits: number; misses: number; writes: number } {
    return { hits: this.#hits, misses: this.#misses, writes: this.#writes }
  }

  resetStats(): void {
    this.#hits = 0
    this.#misses = 0
    this.#writes = 0
  }

  #path(key: string): string {
    return join(this.root, `v${this.schemaVersion}`, key.slice(0, 2), `${key}.json`)
  }

  /**
   * Null on anything short of an entry `validate` fully accepts. A miss
   * recompiles; nothing here repairs or partially trusts an entry, and a later
   * successful compile overwrites the bad file.
   */
  async read<T>(key: string, validate: (value: unknown) => T | null): Promise<T | null> {
    let parsed: unknown
    try {
      parsed = JSON.parse(await readFile(this.#path(key), 'utf8'))
    } catch {
      this.#misses++
      return null
    }
    const entry = validate(parsed)
    if (entry === null) {
      this.#misses++
      return null
    }
    this.#hits++
    return entry
  }

  async write(key: string, value: unknown): Promise<void> {
    const path = this.#path(key)
    const directory = dirname(path)
    // a full first build writes one entry per module, so the directory syscall
    // is worth remembering
    if (!this.#created.has(directory)) {
      await mkdir(directory, { recursive: true })
      this.#created.add(directory)
    }
    const temporaryPath = `${path}.${process.pid}-${randomBytes(6).toString('hex')}.tmp`
    await writeFile(temporaryPath, `${stableStringify(value)}\n`, 'utf8')
    await rename(temporaryPath, path)
    this.#writes++
    // Once per process, plus once per cap-sized batch inside a long-lived one.
    // Checking only the batch counter would never prune the common case, where
    // every build is a fresh process writing far fewer entries than the cap.
    this.#writesSincePrune++
    const batch = Math.max(1, Math.floor(this.maxEntries / 4))
    if (!this.#prunedThisProcess || this.#writesSincePrune >= batch) {
      this.#prunedThisProcess = true
      this.#writesSincePrune = 0
      await this.#prune()
    }
  }

  /**
   * Drops the oldest entries once the store exceeds its cap, oldest by the later
   * of read and write time so an entry a build keeps hitting is not treated as
   * dead on filesystems that maintain access times.
   */
  async #prune(): Promise<void> {
    const versionRoot = join(this.root, `v${this.schemaVersion}`)
    let shards: string[]
    try {
      shards = await readdir(versionRoot)
    } catch {
      return
    }
    const paths: string[] = []
    for (const shard of shards) {
      const directory = join(versionRoot, shard)
      let files: string[]
      try {
        files = await readdir(directory)
      } catch {
        continue
      }
      for (const file of files) {
        if (file.endsWith('.json')) paths.push(join(directory, file))
      }
    }
    // names are enough to know whether pruning is needed, so a store under its
    // cap costs one readdir per shard and no stat at all
    if (paths.length <= this.maxEntries) return
    const entries: { path: string; usedAt: number }[] = []
    for (const path of paths) {
      try {
        const stats = await stat(path)
        entries.push({ path, usedAt: Math.max(stats.atimeMs, stats.mtimeMs) })
      } catch {
        // a concurrent build may have pruned it already
      }
    }
    entries.sort((left, right) => left.usedAt - right.usedAt)
    for (const entry of entries.slice(0, Math.max(0, entries.length - this.maxEntries))) {
      await unlink(entry.path).catch(() => {})
    }
  }
}

/** Per-module lowering plans, keyed by `planCacheKey`. */
export class ModulePlanCache {
  readonly #files: JsonFileCache

  constructor(readonly root: string) {
    this.#files = new JsonFileCache(root, PLAN_CACHE_SCHEMA_VERSION)
  }

  get stats(): { hits: number; misses: number; writes: number } {
    return this.#files.stats
  }

  resetStats(): void {
    this.#files.resetStats()
  }

  read(
    key: string,
    id: ResolvedModuleId,
    closureDigest: string
  ): Promise<PlanCacheEntry | null> {
    return this.#files.read(key, (value) => {
      const entry = value as PlanCacheEntry | null
      const plan = entry?.plan
      return entry?.schemaVersion === PLAN_CACHE_SCHEMA_VERSION &&
        entry.moduleId === id &&
        entry.closureDigest === closureDigest &&
        plan &&
        plan.version === LOWERED_MODULE_PLAN_VERSION &&
        plan.id === id &&
        typeof plan.sourceHash === 'string' &&
        typeof plan.css === 'string' &&
        Array.isArray(plan.edits) &&
        Array.isArray(plan.diagnostics) &&
        Array.isArray(plan.dependencies) &&
        !!plan.stats
        ? entry
        : null
    })
  }

  write(key: string, entry: PlanCacheEntry): Promise<void> {
    return this.#files.write(key, entry)
  }
}
