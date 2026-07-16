import { Analyzer, type Module, type Symbol as YukuSymbol } from 'yuku-analyzer'

import type {
  AnalyzerCandidate,
  AstNode,
  CandidateFactory,
  DefinitionSite,
  ParseDiagnostic,
  ProjectInput,
  ReferenceSite,
} from './contracts'
import { resolveFromHost, resolvedModuleId } from './contracts'
import { childNode, walkAst } from './ast'
import { asAstNode, declarationForName, definitionFromDeclaration } from './normalize'

class YukuCandidate implements AnalyzerCandidate {
  readonly name = 'yuku' as const
  readonly #analyzer: Analyzer
  readonly #parseCounts = new Map<string, number>()

  constructor(private readonly project: ProjectInput) {
    this.#analyzer = new Analyzer({
      resolve: (specifier, importer) =>
        resolveFromHost(this.project.resolutions, specifier, importer),
    })
    for (const [id, source] of project.files) this.addFile(id, source)
  }

  addFile(id: string, source: string): void {
    this.#analyzer.addFile(id, source, { preserveParens: true, sourceType: 'module' })
    this.#parseCounts.set(id, (this.#parseCounts.get(id) ?? 0) + 1)
  }

  removeFile(id: string): boolean {
    return this.#analyzer.removeFile(id)
  }

  link(): void {
    this.#analyzer.link()
  }

  #module(id: string): Module {
    const module = this.#analyzer.module(id)
    if (!module) throw new Error(`yuku: unknown module ${id}`)
    return module
  }

  #canonicalSymbol(id: string, localName: string): YukuSymbol | null {
    const symbol = this.#module(id).resolve(localName)
    return symbol ? (this.#analyzer.definitionOf(symbol)?.symbol ?? null) : null
  }

  definitionOf(id: string, localName: string): DefinitionSite | null {
    const symbol = this.#canonicalSymbol(id, localName)
    if (!symbol) return null
    const declaration = symbol.declarations[0]
    if (!declaration) return null
    const program = asAstNode(symbol.module.ast, `${symbol.module.path} program`)
    const normalizedDeclaration =
      declarationForName(program, symbol.name) ??
      asAstNode(declaration, `${symbol.name} declaration`)
    return definitionFromDeclaration(
      symbol.module.path,
      symbol.name,
      program,
      normalizedDeclaration
    )
  }

  referencesOf(definition: DefinitionSite): ReferenceSite[] {
    const symbol = this.#canonicalSymbol(definition.id, definition.name)
    if (!symbol) return []
    return this.#analyzer.referencesOf(symbol).map(({ module, reference }) => ({
      id: resolvedModuleId(module.path),
      name: reference.name,
      start: reference.node.start,
      end: reference.node.end,
    }))
  }

  dependenciesOf(id: string): string[] {
    return this.#module(id)
      .dependencies.map((module) => module.path)
      .sort()
  }

  dependentsOf(id: string): string[] {
    return this.#module(id)
      .dependents.map((module) => module.path)
      .sort()
  }

  affectedBy(id: string): string[] {
    const affected = new Set([id])
    const queue = [id]
    while (queue.length) {
      const current = queue.shift()!
      for (const dependent of this.dependentsOf(current)) {
        if (!affected.has(dependent)) {
          affected.add(dependent)
          queue.push(dependent)
        }
      }
    }
    return [...affected].sort()
  }

  programOf(id: string) {
    return asAstNode(this.#module(id).ast, `${id} program`)
  }

  sourceOf(id: string): string {
    return this.#module(id).source
  }

  parseCount(id: string): number {
    return this.#parseCounts.get(id) ?? 0
  }

  diagnostics(): ParseDiagnostic[] {
    const parseDiagnostics = [...this.#analyzer.modules.values()].flatMap((module) =>
      module.diagnostics.map((diagnostic) => ({
        kind: 'parse' as const,
        id: resolvedModuleId(module.path),
        message: diagnostic.message,
      }))
    )
    return [
      ...parseDiagnostics,
      ...this.#analyzer.diagnostics.map((diagnostic) => ({
        kind: 'link' as const,
        id: resolvedModuleId(diagnostic.module),
        message: diagnostic.message,
      })),
    ]
  }
}

export const yukuFactory: CandidateFactory = {
  name: 'yuku',
  create: (project) => new YukuCandidate(project),
  scanImports(id, source) {
    const candidate = new YukuCandidate({
      files: new Map([[id, source]]),
      resolutions: new Map(),
    })
    const found: { start: number; specifier: string }[] = []
    walkAst(candidate.programOf(id), (node) => {
      if (
        node.type !== 'ImportDeclaration' &&
        node.type !== 'ExportNamedDeclaration' &&
        node.type !== 'ExportAllDeclaration' &&
        node.type !== 'ImportExpression'
      ) {
        return
      }
      const sourceNode = childNode(node, 'source')
      if (sourceNode && typeof sourceNode.value === 'string') {
        found.push({ start: node.start, specifier: sourceNode.value })
      }
    })
    return [
      ...new Set(
        found
          .sort((left, right) => left.start - right.start)
          .map(({ specifier }) => specifier)
      ),
    ]
  },
}

export function parseModuleAst(
  source: string,
  id = '/tamagui/compiler-module.tsx'
): AstNode {
  const candidate = yukuFactory.create({
    files: new Map([[id, source]]),
    resolutions: new Map(),
  })
  const diagnostics = candidate
    .diagnostics()
    .filter((diagnostic) => diagnostic.kind === 'parse')
  if (diagnostics.length) {
    throw new Error(
      `Unable to parse ${id}: ${diagnostics.map(({ message }) => message).join('; ')}`
    )
  }
  return candidate.programOf(id)
}
