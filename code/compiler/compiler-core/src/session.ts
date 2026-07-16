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
import { materializeModule } from './materialize'
import type { AppliedLoweredModule } from './output'
import { applyLoweredModule } from './output'
import { yukuFactory } from './yuku'

export interface CompilerAdapter {
  target: CompilerTarget
  projectGeneration: string
  host: CompilerLoweringHost
  load(id: ResolvedModuleId): Promise<HostModuleInput | null>
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
    const plan = lowerModule({
      module: materializeModule(this.#graph, module.id),
      source: module.source,
      target: adapter.target,
      host: adapter.host,
      options: { projectGeneration: adapter.projectGeneration },
      structuralPass,
    })
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
