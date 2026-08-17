import { childNode, childNodes } from './ast'
import type { AstNode, ResolvedModuleId, SourceSpan } from './contracts'
import type { SourceEdit } from './output'
import { yukuFactory } from './yuku'

/**
 * Zero-runtime reference erasure.
 *
 * A passing lowering plan already proved every Tamagui use in this module became
 * host markup. That fact is stronger than anything a bundler can derive, so the
 * compiler removes the now-dead references before the bundler records this
 * module's dependencies. Metro fixes its dependency graph at resolution time and
 * does no export-level shaking, so nothing later in the pipeline can do this.
 */

export interface ZeroViolation {
  code:
    | 'zero/static-island-import'
    | 'zero/side-effect-import'
    | 'zero/live-tamagui-reference'
  span: SourceSpan
  message: string
}

export interface ZeroErasureInput {
  id: ResolvedModuleId
  source: string
  /** Edits already committed by lowering. A reference inside one is consumed. */
  loweredEdits: readonly SourceEdit[]
  /** True when this import specifier names the zero-forbidden Tamagui surface. */
  isTamaguiSpecifier(specifier: string): boolean
  /** Returns the island id when this specifier names a declared island module. */
  islandIdFor(specifier: string): string | null
}

export interface ZeroErasureResult {
  edits: SourceEdit[]
  removedModules: string[]
  removedBindings: string[]
  erasedStyledDefinitions: string[]
  liveBindings: string[]
  violations: ZeroViolation[]
}

interface Range {
  start: number
  end: number
}

interface ImportBinding {
  local: string
  specifierNode: AstNode
  declaration: AstNode
  moduleSpecifier: string
}

function coversRange(outer: Range, inner: Range): boolean {
  return outer.start <= inner.start && outer.end >= inner.end
}

function stringValueOf(node: AstNode | null): string | null {
  return node && typeof node.value === 'string' ? node.value : null
}

function identifierNameOf(node: AstNode | null): string | null {
  return node && node.type === 'Identifier' && typeof node.name === 'string'
    ? node.name
    : null
}

/**
 * Declarators of the form `const Card = styled(Base, {...})` at module scope.
 * The styled binding must come from the Tamagui surface; anything else with that
 * name is an unrelated local function.
 */
function collectStyledDeclarators(
  program: AstNode,
  styledLocals: ReadonlySet<string>
): { name: string; declarator: AstNode; declaration: AstNode; exported: boolean }[] {
  const found: {
    name: string
    declarator: AstNode
    declaration: AstNode
    exported: boolean
  }[] = []
  for (const statement of childNodes(program, 'body')) {
    const exported = statement.type === 'ExportNamedDeclaration'
    const declaration = exported ? childNode(statement, 'declaration') : statement
    if (!declaration || declaration.type !== 'VariableDeclaration') continue
    const declarators = childNodes(declaration, 'declarations')
    if (declarators.length !== 1) continue
    const declarator = declarators[0]!
    const name = identifierNameOf(childNode(declarator, 'id'))
    const init = childNode(declarator, 'init')
    if (!name || !init || init.type !== 'CallExpression') continue
    const callee = identifierNameOf(childNode(init, 'callee'))
    if (!callee || !styledLocals.has(callee)) continue
    found.push({ name, declarator, declaration, exported })
  }
  return found
}

export function planZeroErasure(input: ZeroErasureInput): ZeroErasureResult {
  const { id, source, loweredEdits } = input
  const analyzer = yukuFactory.create({
    files: new Map([[id, source]]),
    resolutions: new Map(),
  })
  analyzer.link()
  const program = analyzer.programOf(id)

  const violations: ZeroViolation[] = []
  const span = (node: Range): SourceSpan => ({ id, start: node.start, end: node.end })

  const bindings: ImportBinding[] = []
  const tamaguiDeclarations: AstNode[] = []

  for (const statement of childNodes(program, 'body')) {
    if (statement.type !== 'ImportDeclaration') continue
    if (statement.importKind === 'type') continue
    const moduleSpecifier = stringValueOf(childNode(statement, 'source'))
    if (!moduleSpecifier) continue

    const islandId = input.islandIdFor(moduleSpecifier)
    if (islandId) {
      violations.push({
        code: 'zero/static-island-import',
        span: span(statement),
        message: `Zero-runtime islands are separately built full-runtime entries. "${moduleSpecifier}" is declared as island "${islandId}" and cannot be imported from the zero graph. Import the generated island loader instead.`,
      })
      continue
    }

    if (!input.isTamaguiSpecifier(moduleSpecifier)) continue
    tamaguiDeclarations.push(statement)

    const specifiers = childNodes(statement, 'specifiers')
    if (specifiers.length === 0) {
      violations.push({
        code: 'zero/side-effect-import',
        span: span(statement),
        message: `Zero-runtime cannot erase a bare side-effect import of "${moduleSpecifier}" because its effects are unknown. Remove it or move this module to a full-runtime island.`,
      })
      continue
    }
    for (const specifier of specifiers) {
      if (specifier.importKind === 'type') continue
      const local = identifierNameOf(childNode(specifier, 'local'))
      if (!local) continue
      bindings.push({
        local,
        specifierNode: specifier,
        declaration: statement,
        moduleSpecifier,
      })
    }
  }

  if (bindings.length === 0) {
    return {
      edits: [],
      removedModules: [],
      removedBindings: [],
      erasedStyledDefinitions: [],
      liveBindings: [],
      violations,
    }
  }

  // A reference is consumed when lowering overwrote the source range holding it.
  const consumed: Range[] = loweredEdits
    .filter((edit) => edit.end > edit.start)
    .map((edit) => ({ start: edit.start, end: edit.end }))

  const referencesOf = (local: string): Range[] => {
    const definition = analyzer.definitionOf(id, local)
    if (!definition) return []
    return analyzer
      .referencesOf(definition)
      .filter((reference) => reference.id === id)
      .map((reference) => ({ start: reference.start, end: reference.end }))
  }

  const isConsumed = (reference: Range) =>
    consumed.some((range) => coversRange(range, reference))

  // Pass 1: erase app-local `styled()` declarators whose binding lowering fully
  // consumed. Their spans then count as consumed for the import pass, which is
  // what lets `styled` and its base component drop with them.
  const styledLocals = new Set(
    bindings.filter((binding) => binding.local === 'styled').map((b) => b.local)
  )
  const erasedStyledDefinitions: string[] = []
  const styledEdits: SourceEdit[] = []
  for (const definition of collectStyledDeclarators(program, styledLocals)) {
    if (definition.exported) continue
    const references = referencesOf(definition.name)
    if (references.length === 0) continue
    if (!references.every(isConsumed)) continue
    styledEdits.push({
      start: definition.declaration.start,
      end: definition.declaration.end,
      content: '',
      origin: span(definition.declaration),
    })
    consumed.push({
      start: definition.declaration.start,
      end: definition.declaration.end,
    })
    erasedStyledDefinitions.push(definition.name)
  }

  // Pass 2: drop every Tamagui import specifier with no surviving reference, and
  // the whole declaration when none survives.
  const deadBindings = new Set<AstNode>()
  const removedBindings: string[] = []
  const liveBindings: string[] = []
  for (const binding of bindings) {
    const references = referencesOf(binding.local)
    if (references.length > 0 && !references.every(isConsumed)) {
      liveBindings.push(binding.local)
      continue
    }
    deadBindings.add(binding.specifierNode)
    removedBindings.push(binding.local)
  }

  const edits: SourceEdit[] = [...styledEdits]
  const removedModules: string[] = []
  for (const declaration of tamaguiDeclarations) {
    const specifiers = childNodes(declaration, 'specifiers').filter(
      (specifier) => specifier.importKind !== 'type'
    )
    if (specifiers.length === 0) continue
    const dead = specifiers.filter((specifier) => deadBindings.has(specifier))
    if (dead.length === 0) continue
    if (dead.length === specifiers.length) {
      edits.push({
        start: declaration.start,
        end: declaration.end,
        content: '',
        origin: span(declaration),
      })
      removedModules.push(stringValueOf(childNode(declaration, 'source'))!)
      continue
    }
    // Partial removal keeps the declaration, so rewrite the specifier list once
    // rather than surgically deleting commas.
    const survivors = specifiers.filter((specifier) => !deadBindings.has(specifier))
    const braceStart = specifiers[0]!.start
    const braceEnd = specifiers[specifiers.length - 1]!.end
    edits.push({
      start: braceStart,
      end: braceEnd,
      content: survivors
        .map((specifier) => source.slice(specifier.start, specifier.end))
        .join(', '),
      origin: span({ start: braceStart, end: braceEnd }),
    })
  }

  if (liveBindings.length > 0) {
    for (const binding of bindings) {
      if (!liveBindings.includes(binding.local)) continue
      violations.push({
        code: 'zero/live-tamagui-reference',
        span: span(binding.specifierNode),
        message: `Zero-runtime cannot erase "${binding.local}" from "${binding.moduleSpecifier}" because a reference survived lowering. Express it with a lowerable component or move this module to a full-runtime island.`,
      })
    }
  }

  return {
    edits,
    removedModules,
    removedBindings,
    erasedStyledDefinitions,
    liveBindings,
    violations,
  }
}
