import type { HostModuleInput, ResolvedModuleId } from './contracts'
import type { GraphInvalidation } from './graph'
import { ProjectGraph } from './graph'
import type {
  CompilerLoweringHost,
  CompilerTarget,
  LoweredModulePlan,
  StructuralModulePass,
} from './lower'
import { lowerModule } from './lower'
import { materializeModule, type MaterializedModule } from './materialize'
import type { AppliedLoweredModule } from './output'
import { applyLoweredModule } from './output'
import type { ModulePlanCache } from './planCache'
import {
  PLAN_CACHE_SCHEMA_VERSION,
  createExternalClosureLookup,
  moduleClosureDigest,
  planCacheKey,
} from './planCache'
import { yukuFactory } from './yuku'

export interface CompilerAdapter {
  target: CompilerTarget
  projectGeneration: string
  host: CompilerLoweringHost
  load(id: ResolvedModuleId): Promise<HostModuleInput | null>
  /**
   * Runs after a module is materialized and before it lowers, once per uncached
   * compile. The frontend evaluates component modules the host does not know
   * yet here (element and styled() base provenance outside the configured
   * `components`), so lowering never meets an import it could have resolved.
   */
  prepare?(module: MaterializedModule): Promise<void>
  /**
   * Persistent per-module plan reuse across processes. Absent means the host
   * could not produce a content stamp for this project, so nothing is cached
   * rather than cached under a stamp that does not describe the config.
   */
  planCache?: { store: ModulePlanCache; stamp: string }
}

export interface CompileModuleInput {
  module: HostModuleInput
  adapter: CompilerAdapter
  structuralPass?: StructuralModulePass
}

export interface CompilerSessionResult {
  plan: LoweredModulePlan
  output: AppliedLoweredModule
  invalidatedIds: ResolvedModuleId[]
}

function compareIds(left: ResolvedModuleId, right: ResolvedModuleId): number {
  return left < right ? -1 : left > right ? 1 : 0
}

/**
 * Bundler-neutral compiler state. The adapter owns module resolution and loading;
 * the session only accepts canonical host-resolved module records.
 */
export class CompilerSession {
  readonly #graph = new ProjectGraph(yukuFactory, { modules: [] })
  readonly #externalClosure = createExternalClosureLookup()
  #queue: Promise<unknown> = Promise.resolve()

  compile(input: CompileModuleInput): Promise<CompilerSessionResult> {
    const operation = this.#queue.then(() => this.#compile(input))
    this.#queue = operation.catch(() => undefined)
    return operation
  }

  update(module: HostModuleInput): Promise<ResolvedModuleId[]> {
    return this.#enqueue(() => this.#graph.updateModule(module).invalidatedIds)
  }

  has(id: ResolvedModuleId): boolean {
    return this.#graph.contentHash(id) !== null
  }

  dependentsOf(id: ResolvedModuleId): ResolvedModuleId[] {
    return this.#graph.dependentsOf(id)
  }

  remove(id: ResolvedModuleId): Promise<GraphInvalidation> {
    return this.#enqueue(() => this.#graph.removeModule(id))
  }

  parseCount(id: ResolvedModuleId): number {
    return this.#graph.parseCount(id)
  }

  #enqueue<T>(operation: () => T | Promise<T>): Promise<T> {
    const queued = this.#queue.then(operation)
    this.#queue = queued.catch(() => undefined)
    return queued
  }

  async #compile({
    module,
    adapter,
    structuralPass,
  }: CompileModuleInput): Promise<CompilerSessionResult> {
    const invalidated = new Set<ResolvedModuleId>()
    await this.#install(module, adapter, new Set(), invalidated)
    const graph = this.#graph
    // an empty stamp is not an identity: a key without one would be shared by
    // every project and every config, so such a project simply does not cache
    const cache = adapter.planCache?.stamp ? adapter.planCache : null
    const closureDigest = cache
      ? moduleClosureDigest(module.id, (id) => {
          const hash = graph.contentHash(id)
          if (hash) {
            return {
              contentHash: hash,
              dependencies: [...graph.dependenciesOf(id), ...graph.externalImportsOf(id)],
            }
          }
          return this.#externalClosure(id)
        })
      : null
    const entry =
      cache && closureDigest
        ? {
            store: cache.store,
            digest: closureDigest,
            key: planCacheKey(
              {
                stamp: cache.stamp,
                target: adapter.target,
                structuralPassHash:
                  structuralPass?.versionHash ?? `${adapter.target}-noop-v1`,
              },
              module.id,
              closureDigest
            ),
          }
        : null

    const cached = entry
      ? await entry.store.read(entry.key, module.id, entry.digest)
      : null
    let plan = cached?.plan
    if (!plan) {
      const materialized = materializeModule(graph, module.id)
      if (adapter.prepare) await adapter.prepare(materialized)
      plan = lowerModule({
        module: materialized,
        source: module.source,
        target: adapter.target,
        host: adapter.host,
        options: { projectGeneration: adapter.projectGeneration },
        structuralPass,
      })
    }
    if (entry && !cached) {
      await entry.store.write(entry.key, {
        schemaVersion: PLAN_CACHE_SCHEMA_VERSION,
        moduleId: module.id,
        closureDigest: entry.digest,
        plan,
      })
    }
    return {
      plan,
      output: applyLoweredModule(module.source, module.id, plan),
      invalidatedIds: [...invalidated].sort(compareIds),
    }
  }

  async #install(
    module: HostModuleInput,
    adapter: CompilerAdapter,
    visited: Set<ResolvedModuleId>,
    invalidated: Set<ResolvedModuleId>
  ): Promise<void> {
    if (visited.has(module.id)) return
    visited.add(module.id)

    for (const dependency of module.imports) {
      if (dependency.external || this.has(dependency.resolvedId)) continue
      const loaded = await adapter.load(dependency.resolvedId)
      if (loaded) {
        await this.#install(loaded, adapter, visited, invalidated)
      }
    }

    const update = this.#graph.updateModule(module)
    for (const id of update.invalidatedIds) invalidated.add(id)
  }
}
