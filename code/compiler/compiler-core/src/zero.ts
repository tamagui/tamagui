import { childNode, childNodes, walkAst } from './ast'
import type { AstNode, ResolvedModuleId, SourceSpan } from './contracts'
import type { BailoutReason, ZeroRule } from './diagnostics'
import { zeroRuleForBailout } from './diagnostics'
import type { LoweredModulePlan } from './lower'
import type { SourceEdit } from './output'
import { parseModuleAst } from './yuku'

/**
 * Zero-runtime reference erasure and the rule-mapped diagnostics that gate it.
 *
 * A passing lowering plan already proved every Tamagui use in this module became
 * host markup. That fact is stronger than anything a bundler can derive, so the
 * compiler removes the now-dead references before the bundler records this
 * module's dependencies. Metro fixes its dependency graph at resolution time and
 * does no export-level shaking, so nothing later in the pipeline can do this.
 */

export type { ZeroRule }

export type ZeroViolationCode =
  | 'zero/static-island-import'
  | 'zero/side-effect-import'
  | 'zero/live-tamagui-reference'
  | 'zero/design-state-read'
  | 'zero/runtime-provider'
  | BailoutReason['code']

export interface ZeroViolation {
  rule: ZeroRule
  code: ZeroViolationCode
  span: SourceSpan
  message: string
  component?: string
}

/** The last line of every zero-runtime failure, in both gates. */
export const ZERO_FAILURE_FOOTER =
  'Fix every site or move the owning module to a declared full-runtime island. Zero-runtime never retains one component as a fallback.'

/**
 * The JavaScript design-state surface. A reference to any of these in a zero
 * graph is rule 7: the value only exists once a runtime has parsed the config.
 */
export const ZERO_DESIGN_STATE_APIS = new Set([
  'useMedia',
  'useTheme',
  'useThemeName',
  'getConfig',
  'getTokens',
  'useTokens',
  'getVariableValue',
  'getToken',
  'getTokenValue',
  'useConfiguration',
  'useAnimationDriver',
  'updateTheme',
  'addTheme',
  'replaceTheme',
  'forceUpdateThemes',
])

/** Root providers. Their use is illegal in a zero graph, never erasable. */
export const ZERO_PROVIDER_EXPORTS = new Set([
  'TamaguiProvider',
  'ThemeProvider',
  'TamaguiRoot',
])

/**
 * The four public animated-number hooks. They are the one opt-in runtime a zero
 * graph may keep, and only through the leaf module: the public barrel would drag
 * the config-bound driver resolution in with them.
 */
export const ZERO_ANIMATED_NUMBER_HOOKS = new Set([
  'useAnimatedNumber',
  'useAnimatedNumberStyle',
  'useAnimatedNumbersStyle',
  'useAnimatedNumberReaction',
])

export const ZERO_ANIMATED_NUMBER_MODULE = '@tamagui/animations-css/animated-number'

export interface ZeroRuleParams {
  component?: string
  expression?: string
  prop?: string
  detail?: string
  api?: string
  /** Rule 8 only: what to do about this import, which differs per code. */
  remediation?: string
}

/** The rule map's developer messages, verbatim. */
export function zeroRuleMessage(rule: ZeroRule, params: ZeroRuleParams): string {
  const component = params.component ?? 'this component'
  switch (rule) {
    case 1:
      return `Zero-runtime rule 1: ${component} cannot receive a prop spread because the compiler cannot prove it is style-free. Pass non-style props explicitly or move this module to a full-runtime island.`
    case 2:
      return `Zero-runtime rule 2: component expression ${params.expression ?? component} does not resolve to one literal lowerable host component. Use a literal Tamagui or html.* component, or move this module to a full-runtime island.`
    case 3:
      return `Zero-runtime rule 3: value for ${params.prop ?? 'a style prop'} on ${component} cannot be lowered: ${params.detail ?? 'the compiler could not evaluate it'}. Use a supported build-time value or move this module to a full-runtime island.`
    case 4:
      return `Zero-runtime rule 4: ${params.detail ?? component} requires runtime theme or config state. Theme names and modifier targets must be statically enumerable, Theme value props and config must be build-time data, and runtime mutation belongs in a full-runtime island.`
    case 5:
      return `Zero-runtime rule 5: ${params.detail ?? component} requires a component animation runtime. Use a static CSS transition or move this module to a full-runtime island.`
    case 6:
      return `Zero-runtime rule 6: ${component} does not lower to one host element with className and is island-only. Move this module to a declared full-runtime island.`
    case 7:
      return `Zero-runtime rule 7: ${params.api ?? component} reads Tamagui design state in JavaScript. Express the condition in CSS or move this module to a full-runtime island.`
    case 8:
      return `Zero-runtime rule 8: ${params.detail ?? 'a module-level import'} defeats the zero-runtime graph. ${params.remediation ?? ''}`.trimEnd()
  }
}

/**
 * Rule 8's two codes.
 *
 * They are module-level imports rather than element sites, and neither one is
 * fixed by moving the module to an island: a stray side-effect import wants
 * deleting, and an island import wants the generated loader. Reporting them as
 * rule 6 sent developers to do island work that would not have helped.
 */
export function zeroSideEffectImportMessage(specifier: string): string {
  return zeroRuleMessage(8, {
    detail: `the bare side-effect import of "${specifier}", whose effects zero-runtime cannot prove or erase,`,
    remediation: `Remove it, or import the values this module uses so the compiler can lower and erase them.`,
  })
}

export function zeroStaticIslandImportMessage(
  specifier: string,
  islandId: string
): string {
  return zeroRuleMessage(8, {
    detail: `the static import of "${specifier}", which is declared as full-runtime island "${islandId}",`,
    remediation: `Import the generated island loader instead; the island is a separately built entry and the zero graph never contains it.`,
  })
}

export const ZERO_PROVIDER_MESSAGE =
  '[tamagui zero-runtime] Rule 4: TamaguiProvider is not used by a zero-runtime root. The bundler loads generated CSS and the compiler lowers static Theme nodes. Remove this provider or make this entry full-runtime.'

export function zeroThemeBoundaryMessage(component: string, prop: string): string {
  return `[tamagui zero-runtime] Rule 4: ${component} uses ${prop}, which creates a runtime component theme boundary. Replace it with a static <Theme name="..."> wrapper (use name="inverse" for themeInverse) or move this module to a full-runtime island.`
}

export function zeroConfigDriverMessage(name: string, outputStyle: unknown): string {
  return `[tamagui zero-runtime] Rule 5: createTamagui animations must resolve to the CSS driver. Driver ${name} has outputStyle=${String(outputStyle)}. Remove it from the zero entry or move its consumers to a full-runtime island.`
}

export function zeroIslandThemeMessage(entry: string): string {
  return `[tamagui zero-runtime] Rule 4: island ${entry} has no statically resolved theme context at this mount. Place the island boundary under a compiler-visible static <Theme> or make this entry full-runtime.`
}

/**
 * The lowering plan's own diagnostics, read as zero-runtime violations.
 *
 * Only the diagnostics that stopped a candidate from lowering count: one
 * recorded next to a successful lowering describes a dropped prop and leaves no
 * runtime behind.
 */
export function zeroViolationsFromPlan(plan: LoweredModulePlan): ZeroViolation[] {
  const violations: ZeroViolation[] = []
  for (const diagnostic of plan.diagnostics) {
    if (!diagnostic.blocking) continue
    const rule = zeroRuleForBailout(diagnostic)
    violations.push({
      rule,
      code: diagnostic.code,
      span: diagnostic.span,
      component: diagnostic.component,
      message:
        diagnostic.zeroMessage ??
        zeroRuleMessage(rule, {
          component: diagnostic.component,
          prop: diagnostic.prop,
          detail: diagnostic.message,
        }),
    })
  }
  return violations
}

// every bundler plugin resolves the zero-forbidden surface through this one
// predicate. subpaths count: `tamagui/theme-update` is as much runtime surface
// as `tamagui` itself, and a plugin that missed them read <ThemeUpdate> as an
// opaque component and failed rule 4 at every island mount beneath it.
export function isTamaguiSpecifier(specifier: string): boolean {
  return (
    specifier === 'tamagui' ||
    specifier.startsWith('tamagui/') ||
    specifier.startsWith('@tamagui/')
  )
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
  /**
   * Erased declarators this module also exported. The build-wide gate proves
   * every importer of them inside the zero entry graph was itself transformed.
   */
  erasedExports: string[]
  /** Hooks rewritten to the animated-number leaf, by their imported name. */
  rewrittenAnimatedNumberHooks: string[]
  liveBindings: string[]
  violations: ZeroViolation[]
}

interface Range {
  start: number
  end: number
}

interface Occurrence extends Range {
  parent: AstNode | null
}

interface ImportBinding {
  local: string
  imported: string
  specifierNode: AstNode
  declaration: AstNode
  moduleSpecifier: string
}

/**
 * Every value-position occurrence of each identifier name in the module,
 * excluding binding sites and non-reference positions such as member property
 * names, object keys, and JSX attribute names.
 */
function collectNameOccurrences(program: AstNode): Map<string, Occurrence[]> {
  const occurrences = new Map<string, Occurrence[]>()
  walkAst(program, (node, parent, key) => {
    if (node.type !== 'Identifier' && node.type !== 'JSXIdentifier') return
    const name = typeof node.name === 'string' ? node.name : null
    if (!name) return
    if (parent) {
      // binding sites, not references
      if (
        parent.type === 'ImportSpecifier' ||
        parent.type === 'ImportDefaultSpecifier' ||
        parent.type === 'ImportNamespaceSpecifier' ||
        parent.type === 'ExportSpecifier'
      ) {
        return
      }
      // property names, not references
      if (
        (parent.type === 'MemberExpression' ||
          parent.type === 'JSXMemberExpression' ||
          parent.type === 'OptionalMemberExpression') &&
        key === 'property' &&
        !parent.computed
      ) {
        return
      }
      if (
        (parent.type === 'Property' || parent.type === 'PropertyDefinition') &&
        key === 'key' &&
        !parent.computed
      ) {
        return
      }
      if (parent.type === 'JSXAttribute' && key === 'name') return
      // declaration binding sites, not references
      if (
        (parent.type === 'VariableDeclarator' ||
          parent.type === 'FunctionDeclaration' ||
          parent.type === 'ClassDeclaration') &&
        key === 'id'
      ) {
        return
      }
    }
    const entry: Occurrence = { start: node.start, end: node.end, parent: parent ?? null }
    const list = occurrences.get(name)
    if (list) list.push(entry)
    else occurrences.set(name, [entry])
  })
  return occurrences
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
 * The smallest source text that names what a surviving reference is doing. A
 * bare identifier says nothing about why it could not lower, so the enclosing
 * expression is reported when there is one.
 */
function referenceExpression(source: string, reference: Occurrence): string {
  const parent = reference.parent
  const node =
    parent &&
    (parent.type === 'ConditionalExpression' ||
      parent.type === 'LogicalExpression' ||
      parent.type === 'CallExpression' ||
      parent.type === 'MemberExpression' ||
      parent.type === 'ArrayExpression')
      ? parent
      : reference
  const text = source.slice(node.start, node.end).replace(/\s+/g, ' ').trim()
  return text.length > 80 ? `${text.slice(0, 77)}...` : text
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
    // an exported declarator's whole statement carries the export keyword
    found.push({
      name,
      declarator,
      declaration: exported ? statement : declaration,
      exported,
    })
  }
  return found
}

export function planZeroErasure(input: ZeroErasureInput): ZeroErasureResult {
  const { id, source, loweredEdits } = input
  const program = parseModuleAst(source, id)

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
        rule: 8,
        code: 'zero/static-island-import',
        span: span(statement),
        message: zeroStaticIslandImportMessage(moduleSpecifier, islandId),
      })
      continue
    }

    if (!input.isTamaguiSpecifier(moduleSpecifier)) continue
    tamaguiDeclarations.push(statement)

    const specifiers = childNodes(statement, 'specifiers')
    if (specifiers.length === 0) {
      violations.push({
        rule: 8,
        code: 'zero/side-effect-import',
        span: span(statement),
        message: zeroSideEffectImportMessage(moduleSpecifier),
      })
      continue
    }
    for (const specifier of specifiers) {
      if (specifier.importKind === 'type') continue
      const local = identifierNameOf(childNode(specifier, 'local'))
      if (!local) continue
      bindings.push({
        local,
        imported: identifierNameOf(childNode(specifier, 'imported')) ?? local,
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
      erasedExports: [],
      rewrittenAnimatedNumberHooks: [],
      liveBindings: [],
      violations,
    }
  }

  // A reference is consumed when lowering overwrote the source range holding it.
  const consumed: Range[] = loweredEdits
    .filter((edit) => edit.end > edit.start)
    .map((edit) => ({ start: edit.start, end: edit.end }))

  // Name occurrences, collected in one walk. This deliberately over-counts a
  // shadowed name: over-counting keeps an import that could have been dropped,
  // while under-counting would erase a live one and break the app at runtime.
  const occurrences = collectNameOccurrences(program)
  const referencesOf = (local: string): Occurrence[] => occurrences.get(local) ?? []

  const isConsumed = (reference: Range) =>
    consumed.some((range) => coversRange(range, reference))

  // Pass 1: erase app-local `styled()` declarators whose binding lowering fully
  // consumed. Their spans then count as consumed for the import pass, which is
  // what lets `styled` and its base component drop with them.
  const styledLocals = new Set(
    bindings.filter((binding) => binding.imported === 'styled').map((b) => b.local)
  )
  const erasedStyledDefinitions: string[] = []
  const erasedExports: string[] = []
  const styledEdits: SourceEdit[] = []
  for (const definition of collectStyledDeclarators(program, styledLocals)) {
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
    if (definition.exported) erasedExports.push(definition.name)
  }

  // Pass 2: the animated-number hooks are rewritten to the leaf before any dead
  // specifier is dropped, so the public barrel never enters the client graph for
  // them. They are the one runtime a zero entry may keep.
  const animatedNumberBindings = bindings.filter(
    (binding) =>
      ZERO_ANIMATED_NUMBER_HOOKS.has(binding.imported) &&
      referencesOf(binding.local).some((reference) => !isConsumed(reference))
  )
  const rewrittenAnimatedNumberHooks = animatedNumberBindings.map(
    (binding) => binding.imported
  )
  const animatedNumberSpecifiers = new Set(
    animatedNumberBindings.map((binding) => binding.specifierNode)
  )
  const leafImportEdits: SourceEdit[] = []
  for (const declaration of tamaguiDeclarations) {
    const rewritten = animatedNumberBindings.filter(
      (binding) => binding.declaration === declaration
    )
    if (rewritten.length === 0) continue
    leafImportEdits.push({
      start: declaration.start,
      end: declaration.start,
      content: `import { ${rewritten
        .map((binding) =>
          binding.imported === binding.local
            ? binding.imported
            : `${binding.imported} as ${binding.local}`
        )
        .join(', ')} } from ${JSON.stringify(ZERO_ANIMATED_NUMBER_MODULE)};\n`,
      origin: span(declaration),
    })
  }

  // Pass 3: drop every Tamagui import specifier with no surviving reference, and
  // the whole declaration when none survives.
  const deadBindings = new Set<AstNode>(animatedNumberSpecifiers)
  const removedBindings: string[] = []
  const liveBindings: ImportBinding[] = []
  for (const binding of bindings) {
    if (animatedNumberSpecifiers.has(binding.specifierNode)) continue
    const references = referencesOf(binding.local)
    if (references.length > 0 && !references.every(isConsumed)) {
      liveBindings.push(binding)
      continue
    }
    deadBindings.add(binding.specifierNode)
    removedBindings.push(binding.local)
  }

  const edits: SourceEdit[] = [...styledEdits, ...leafImportEdits]
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

  // A binding lowering could not consume is a retained runtime. Which rule it is
  // depends on what the binding names, so the message names the API or the
  // expression rather than the import.
  for (const binding of liveBindings) {
    const live = referencesOf(binding.local).filter(
      (reference) => !isConsumed(reference)
    )[0]!
    if (ZERO_DESIGN_STATE_APIS.has(binding.imported)) {
      violations.push({
        rule: 7,
        code: 'zero/design-state-read',
        span: span(live),
        message: zeroRuleMessage(7, { api: binding.imported }),
      })
      continue
    }
    if (ZERO_PROVIDER_EXPORTS.has(binding.imported)) {
      violations.push({
        rule: 4,
        code: 'zero/runtime-provider',
        span: span(live),
        component: binding.imported,
        message: ZERO_PROVIDER_MESSAGE,
      })
      continue
    }
    violations.push({
      rule: 2,
      code: 'zero/live-tamagui-reference',
      span: span(live),
      component: binding.local,
      message: zeroRuleMessage(2, { expression: referenceExpression(source, live) }),
    })
  }

  return {
    edits,
    removedModules,
    removedBindings,
    erasedStyledDefinitions,
    erasedExports,
    rewrittenAnimatedNumberHooks,
    liveBindings: liveBindings.map((binding) => binding.local),
    violations,
  }
}
