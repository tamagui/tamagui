import { createHash } from 'node:crypto'

import type {
  AnalyzerCandidate,
  CandidateFactory,
  ExpressionReference,
  HostModuleInput,
  HostResolvedImport,
  HostResolvedProject,
  ProjectInput,
  ResolvedModuleId,
  SymbolDefinition,
  SymbolResolver,
} from './contracts'
import { expressionReference, resolutionKey, resolvedModuleId } from './contracts'
import { linkedBailout, localBailout, type BailoutReason } from './diagnostics'
import { evaluateBinding, evaluateExpression, type EvaluationResult } from './evaluate'
import type { ElementIRResult } from './ir'
import { nodeAtSpan, normalizeElements } from './normalize'

interface ModuleRecord {
  input: HostModuleInput
  hash: string
}

interface CachedElements {
  hash: string
  result: ElementIRResult
}

export interface GraphInvalidation {
  changed: boolean
  id: ResolvedModuleId
  previousHash: string | null
  contentHash: string | null
  invalidatedIds: ResolvedModuleId[]
}

function compareIds(left: ResolvedModuleId, right: ResolvedModuleId): number {
  return compareCodeUnits(left, right)
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function stableImports(imports: readonly HostResolvedImport[]): HostResolvedImport[] {
  return [...imports].sort((left, right) => {
    const bySpecifier = compareCodeUnits(left.specifier, right.specifier)
    return bySpecifier || compareCodeUnits(left.resolvedId, right.resolvedId)
  })
}

export function moduleContentHash(input: HostModuleInput): string {
  const hash = createHash('sha256')
  hash.update(input.source)
  hash.update('\0')
  for (const dependency of stableImports(input.imports)) {
    hash.update(dependency.specifier)
    hash.update('\0')
    hash.update(dependency.resolvedId)
    hash.update('\0')
    hash.update(dependency.external ? 'external' : 'internal')
    hash.update('\0')
  }
  return hash.digest('hex')
}

/**
 * Long-lived semantic graph. The host owns resolution and supplies every canonical id;
 * this service owns parsing, linking, hashes, reverse edges, IR, and evaluation caches.
 */
export class ProjectGraph implements SymbolResolver {
  readonly #files = new Map<string, string>()
  readonly #resolutions = new Map<string, string>()
  readonly #modules = new Map<ResolvedModuleId, ModuleRecord>()
  readonly #dependencies = new Map<ResolvedModuleId, Set<ResolvedModuleId>>()
  readonly #dependents = new Map<ResolvedModuleId, Set<ResolvedModuleId>>()
  readonly #elementCache = new Map<ResolvedModuleId, CachedElements>()
  readonly #candidate: AnalyzerCandidate

  constructor(factory: CandidateFactory, project: HostResolvedProject) {
    for (const input of project.modules) this.#installHostRecord(input)
    const candidateProject: ProjectInput = {
      files: this.#files,
      resolutions: this.#resolutions,
    }
    this.#candidate = factory.create(candidateProject)
    this.#candidate.link()
  }

  moduleIds(): ResolvedModuleId[] {
    return [...this.#modules.keys()].sort(compareIds)
  }

  contentHash(id: ResolvedModuleId): string | null {
    return this.#modules.get(id)?.hash ?? null
  }

  sourceOf(id: ResolvedModuleId): string {
    const source = this.#modules.get(id)?.input.source
    if (source === undefined) throw new Error(`Unknown host module ${id}`)
    return source
  }

  dependenciesOf(id: ResolvedModuleId): ResolvedModuleId[] {
    return [...(this.#dependencies.get(id) ?? [])].sort(compareIds)
  }

  dependentsOf(id: ResolvedModuleId): ResolvedModuleId[] {
    return [...(this.#dependents.get(id) ?? [])].sort(compareIds)
  }

  affectedBy(id: ResolvedModuleId): ResolvedModuleId[] {
    const affected = new Set<ResolvedModuleId>([id])
    const queue = [id]
    while (queue.length) {
      const current = queue.shift()!
      for (const dependent of this.#dependents.get(current) ?? []) {
        if (affected.has(dependent)) continue
        affected.add(dependent)
        queue.push(dependent)
      }
    }
    return [...affected].sort(compareIds)
  }

  parseCount(id: ResolvedModuleId): number {
    return this.#candidate.parseCount(id)
  }

  resolveBinding(id: ResolvedModuleId, localName: string): SymbolDefinition | null {
    const definition = this.#candidate.definitionOf(id, localName)
    if (!definition) return null
    return {
      id: definition.id,
      name: definition.name,
      span: {
        id: definition.id,
        start: definition.start,
        end: definition.end,
      },
      initializer: definition.initializer
        ? expressionReference(definition.id, definition.initializer)
        : null,
      constant: definition.constant,
    }
  }

  expressionNode(reference: ExpressionReference) {
    if (!this.#modules.has(reference.id)) return null
    return nodeAtSpan(
      this.#candidate.programOf(reference.id),
      reference.start,
      reference.end
    )
  }

  evaluate(reference: ExpressionReference): EvaluationResult {
    return evaluateExpression(this, reference)
  }

  evaluateBinding(id: ResolvedModuleId, localName: string): EvaluationResult {
    return evaluateBinding(this, id, localName)
  }

  elementsOf(id: ResolvedModuleId): ElementIRResult {
    const record = this.#modules.get(id)
    if (!record) throw new Error(`Unknown host module ${id}`)
    const cached = this.#elementCache.get(id)
    if (cached?.hash === record.hash) return cached.result
    const result = normalizeElements(this.#candidate, id, record.input.imports)
    this.#elementCache.set(id, { hash: record.hash, result })
    return result
  }

  diagnostics(): BailoutReason[] {
    const diagnostics = this.#candidate
      .diagnostics()
      .map((diagnostic) =>
        diagnostic.kind === 'parse'
          ? localBailout(
              'local/parse-error',
              { id: diagnostic.id, start: 0, end: 0 },
              diagnostic.message
            )
          : linkedBailout(
              'linked/unresolved-binding',
              { id: diagnostic.id, start: 0, end: 0 },
              diagnostic.message
            )
      )
    for (const [id, record] of this.#modules) {
      for (const dependency of record.input.imports) {
        if (dependency.external) continue
        if (this.#modules.has(dependency.resolvedId)) continue
        diagnostics.push(
          linkedBailout(
            'linked/unresolved-import',
            { id, start: 0, end: 0 },
            `Host-resolved import ${dependency.specifier} points outside the project graph`,
            dependency.resolvedId
          )
        )
      }
    }
    return diagnostics.sort((left, right) => {
      const byId = compareCodeUnits(left.span.id, right.span.id)
      return (
        byId ||
        left.span.start - right.span.start ||
        compareCodeUnits(left.code, right.code)
      )
    })
  }

  updateModule(input: HostModuleInput): GraphInvalidation {
    const previous = this.#modules.get(input.id)
    const nextHash = moduleContentHash(input)
    if (previous?.hash === nextHash) {
      return {
        changed: false,
        id: input.id,
        previousHash: previous.hash,
        contentHash: previous.hash,
        invalidatedIds: [],
      }
    }

    const invalidatedIds = this.affectedBy(input.id)
    const previousHash = previous?.hash ?? null
    if (previous) this.#candidate.removeFile(input.id)
    this.#installHostRecord(input)
    this.#candidate.addFile(input.id, input.source)
    this.#candidate.link()
    for (const id of invalidatedIds) this.#elementCache.delete(id)

    return {
      changed: true,
      id: input.id,
      previousHash,
      contentHash: nextHash,
      invalidatedIds,
    }
  }

  removeModule(id: ResolvedModuleId): GraphInvalidation {
    const previous = this.#modules.get(id)
    if (!previous) {
      return {
        changed: false,
        id,
        previousHash: null,
        contentHash: null,
        invalidatedIds: [],
      }
    }
    const invalidatedIds = this.affectedBy(id)
    this.#candidate.removeFile(id)
    this.#removeOutgoingEdges(id)
    this.#removeResolutions(id)
    this.#modules.delete(id)
    this.#files.delete(id)
    this.#candidate.link()
    for (const invalidated of invalidatedIds) this.#elementCache.delete(invalidated)
    return {
      changed: true,
      id,
      previousHash: previous.hash,
      contentHash: null,
      invalidatedIds,
    }
  }

  #installHostRecord(input: HostModuleInput): void {
    resolvedModuleId(input.id)
    const seenSpecifiers = new Set<string>()
    for (const dependency of input.imports) {
      resolvedModuleId(dependency.resolvedId)
      if (seenSpecifiers.has(dependency.specifier)) {
        throw new Error(
          `Duplicate host resolution for ${input.id}:${dependency.specifier}`
        )
      }
      seenSpecifiers.add(dependency.specifier)
    }

    this.#removeOutgoingEdges(input.id)
    this.#removeResolutions(input.id)
    const dependencies = new Set(
      input.imports
        .filter(({ external }) => !external)
        .map(({ resolvedId }) => resolvedId)
    )
    this.#dependencies.set(input.id, dependencies)
    for (const dependency of dependencies) {
      let reverse = this.#dependents.get(dependency)
      if (!reverse) {
        reverse = new Set()
        this.#dependents.set(dependency, reverse)
      }
      reverse.add(input.id)
    }
    for (const dependency of input.imports) {
      if (dependency.external) continue
      this.#resolutions.set(
        resolutionKey(input.id, dependency.specifier),
        dependency.resolvedId
      )
    }
    const installedInput: HostModuleInput = {
      ...input,
      imports: input.imports.map((dependency) => ({ ...dependency })),
    }
    this.#files.set(installedInput.id, installedInput.source)
    this.#modules.set(installedInput.id, {
      input: installedInput,
      hash: moduleContentHash(installedInput),
    })
  }

  #removeOutgoingEdges(id: ResolvedModuleId): void {
    for (const dependency of this.#dependencies.get(id) ?? []) {
      const reverse = this.#dependents.get(dependency)
      reverse?.delete(id)
      if (reverse?.size === 0) this.#dependents.delete(dependency)
    }
    this.#dependencies.delete(id)
  }

  #removeResolutions(id: ResolvedModuleId): void {
    const prefix = `${id}\0`
    for (const key of this.#resolutions.keys()) {
      if (key.startsWith(prefix)) this.#resolutions.delete(key)
    }
  }
}
