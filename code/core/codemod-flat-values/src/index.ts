import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as styleGrammarRuntime from '@tamagui/style-grammar'
import type {
  LonghandProgram,
  ModifierRegistryView,
  ParsedClause,
  ParsedValue,
} from '../../style-grammar/src/valueTypes'
import { stylePropsAll } from '@tamagui/helpers'
import { shorthands } from '@tamagui/shorthands/v6'
import {
  Node,
  Project,
  ScriptTarget,
  SyntaxKind,
  type CallExpression,
  type Expression,
  type JsxAttribute,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type ObjectLiteralExpression,
  type PropertyAssignment,
  type SourceFile,
} from 'ts-morph'

const {
  convertLegacyConditionProp,
  createModifierRegistry,
  defaultMediaKeys,
  grammarEntries,
  mergePrograms,
  pseudoToModifier,
  standaloneValueProps,
  unitlessNumberProperties,
} = styleGrammarRuntime as typeof import('../../style-grammar/src/index')

type SiteKind = 'jsx' | 'styled'

interface CodemodOptions {
  transforms: boolean
}

interface Flag {
  code: string
  detail: string
}

interface SiteReport {
  kind: SiteKind
  label: string
  line: number
  before: string
  after: string
  flags: Flag[]
  skipped: boolean
}

interface FileReport {
  file: string
  sites: SiteReport[]
}

interface Accumulator {
  programs: Map<string, LonghandProgram>
  blocked: Set<string>
  dynamicBases: Map<string, DynamicBase>
  dynamicProgramProperties: Set<string>
  untouched: string[]
  flags: Flag[]
}

interface DynamicBase {
  properties: readonly string[]
  source: string
  flagDetail: string
}

interface LegacyObjectResult {
  value: Record<string, unknown> | null
  fatal: string | null
  dynamicLeaves: Array<{ path: string; source: string }>
}

type JsxElementWithAttributes = JsxOpeningElement | JsxSelfClosingElement

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(packageDir, '../../..')
const defaultReportPath =
  '/private/tmp/claude-501/-Users-n8-tamagui/e3d93bb4-c721-4132-b1fd-d2ed6d04318f/scratchpad/codemod-dryrun-report.md'

const styleProps = new Set<string>([
  ...grammarEntries.map((entry) => entry.prop),
  ...Object.keys(standaloneValueProps),
  ...Object.keys(stylePropsAll),
  ...Object.keys(shorthands),
  ...Object.values(shorthands),
])

const defaultCorpus = [
  resolve(repoRoot, 'code/kitchen-sink/src/usecases'),
  resolve(repoRoot, 'code/ui/tamagui/src/components/Button.tsx'),
]

const extraMediaNames = ['motionReduce', 'motionSafe']
const nestedStyledContainers = new Set(['variants', 'compoundVariants'])
const transformProgramProps = new Set(['scale', 'x', 'y', 'rotate'])
const transformDefaults: Readonly<Record<string, string>> = {
  scale: '1',
  x: '0',
  y: '0',
  rotate: '0deg',
}
const lengthTokenCategories = new Set([
  'space',
  'size',
  'radius',
  'fontSize',
  'lineHeight',
  'letterSpacing',
])
const tokenCategoryByProp = new Map(
  grammarEntries.map((entry) => [entry.prop, entry.tokenCategory])
)

function compact(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function addFlag(accumulator: Accumulator, code: string, detail: string): void {
  if (!accumulator.flags.some((flag) => flag.code === code && flag.detail === detail)) {
    accumulator.flags.push({ code, detail })
  }
}

function getPropertyName(property: Node): string | null {
  if (
    Node.isIdentifier(property) ||
    Node.isStringLiteral(property) ||
    Node.isNumericLiteral(property)
  ) {
    return property.getText().replace(/^['"]|['"]$/g, '')
  }
  return null
}

function unwrapExpression(expression: Expression): Expression {
  let current = expression
  while (
    Node.isParenthesizedExpression(current) ||
    Node.isAsExpression(current) ||
    Node.isTypeAssertion(current)
  ) {
    current = current.getExpression()
  }
  return current
}

function numericValue(expression: Expression): number | null {
  const current = unwrapExpression(expression)
  if (Node.isNumericLiteral(current)) return Number(current.getText())
  if (Node.isPrefixUnaryExpression(current)) {
    const operand = current.getOperand()
    if (!Node.isNumericLiteral(operand)) return null
    const value = Number(operand.getText())
    const operator = current.getOperatorToken()
    if (operator === SyntaxKind.MinusToken) return -value
    if (operator === SyntaxKind.PlusToken) return value
  }
  return null
}

function staticLeafValue(expression: Expression): { found: true; value: unknown } | null {
  const current = unwrapExpression(expression)
  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    return { found: true, value: current.getLiteralValue() }
  }
  const number = numericValue(current)
  if (number !== null) return { found: true, value: number }
  if (current.getKind() === SyntaxKind.TrueKeyword) return { found: true, value: true }
  if (current.getKind() === SyntaxKind.FalseKeyword) return { found: true, value: false }
  if (current.getKind() === SyntaxKind.NullKeyword) return { found: true, value: null }
  return null
}

function evaluateLegacyObject(
  object: ObjectLiteralExpression,
  rootPath: string
): LegacyObjectResult {
  const dynamicLeaves: Array<{ path: string; source: string }> = []

  const visitObject = (
    current: ObjectLiteralExpression,
    currentPath: string
  ): { value: Record<string, unknown> | null; fatal: string | null } => {
    const value: Record<string, unknown> = {}

    for (const property of current.getProperties()) {
      if (Node.isSpreadAssignment(property)) {
        return {
          value: null,
          fatal: `spread "${compact(property.getText())}" hides legacy condition entries`,
        }
      }
      if (!Node.isPropertyAssignment(property)) {
        return {
          value: null,
          fatal: `property "${compact(property.getText())}" is not a static assignment`,
        }
      }

      const nameNode = property.getNameNode()
      if (Node.isComputedPropertyName(nameNode)) {
        return {
          value: null,
          fatal: `computed property "${compact(nameNode.getText())}" hides the affected style property`,
        }
      }
      const name = getPropertyName(nameNode)
      if (name === null) {
        return {
          value: null,
          fatal: `property name "${compact(nameNode.getText())}" is not statically known`,
        }
      }

      const path = `${currentPath}.${name}`
      const initializer = unwrapExpression(property.getInitializerOrThrow())
      if (Node.isObjectLiteralExpression(initializer)) {
        const nested = visitObject(initializer, path)
        if (nested.fatal) return nested
        value[name] = nested.value
        continue
      }
      if (Node.isArrayLiteralExpression(initializer)) {
        value[name] = initializer
          .getElements()
          .map((element) => compact(element.getText()))
        continue
      }

      const leaf = staticLeafValue(initializer)
      if (leaf) {
        value[name] = leaf.value
        continue
      }

      const source = compact(initializer.getText())
      dynamicLeaves.push({ path, source })
      value[name] = { __codemodDynamicValue: source }
    }

    return { value, fatal: null }
  }

  const result = visitObject(object, rootPath)
  return { ...result, dynamicLeaves }
}

function tokenPayload(value: string): { payload: string; error: string | null } {
  if (!value.startsWith('$')) return { payload: value, error: null }
  const token = value.slice(1)
  if (!token) return { payload: value, error: 'a bare "$" is not a token name' }
  if (/^[A-Za-z_][A-Za-z0-9_-]*\./.test(token)) {
    return {
      payload: value,
      error: `token "${value}" uses dot-path naming and needs an explicit flat name`,
    }
  }
  return { payload: token, error: null }
}

function isPlainDynamicExpression(expression: Expression): boolean {
  const current = unwrapExpression(expression)
  return (
    Node.isIdentifier(current) ||
    Node.isPropertyAccessExpression(current) ||
    Node.isElementAccessExpression(current) ||
    Node.isConditionalExpression(current) ||
    Node.isCallExpression(current)
  )
}

function isProvablyNumeric(expression: Expression): boolean {
  const current = unwrapExpression(expression)
  if (numericValue(current) !== null) return true
  return (
    Node.isConditionalExpression(current) &&
    isProvablyNumeric(current.getWhenTrue()) &&
    isProvablyNumeric(current.getWhenFalse())
  )
}

function isProvablyString(expression: Expression): boolean {
  const current = unwrapExpression(expression)
  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    return true
  }
  return (
    Node.isConditionalExpression(current) &&
    isProvablyString(current.getWhenTrue()) &&
    isProvablyString(current.getWhenFalse())
  )
}

function dynamicExpressionSource(expression: Expression): string {
  const current = unwrapExpression(expression)
  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    const token = tokenPayload(current.getLiteralValue())
    return JSON.stringify(token.error ? current.getLiteralValue() : token.payload)
  }
  if (Node.isConditionalExpression(current)) {
    return `${current.getCondition().getText().trim()} ? ${dynamicExpressionSource(
      current.getWhenTrue()
    )} : ${dynamicExpressionSource(current.getWhenFalse())}`
  }
  return current.getText().trim()
}

function dynamicBasePayload(prop: string, expression: Expression): string | null {
  if (!isPlainDynamicExpression(expression)) return null

  const resolvedProp = shorthands[prop] ?? prop
  const category = tokenCategoryByProp.get(resolvedProp)
  const expectsLength = category !== undefined && lengthTokenCategories.has(category)
  const numeric = isProvablyNumeric(expression)
  const string = isProvablyString(expression)
  if (expectsLength && !numeric && !string) return null

  const suffix = numeric && !unitlessNumberProperties.has(resolvedProp) ? 'px' : ''
  return `\${${dynamicExpressionSource(expression)}}${suffix}`
}

function emptyAccumulator(): Accumulator {
  return {
    programs: new Map(),
    blocked: new Set(),
    dynamicBases: new Map(),
    dynamicProgramProperties: new Set(),
    untouched: [],
    flags: [],
  }
}

function expansion(prop: string, value: ParsedValue): Map<string, LonghandProgram> {
  return mergePrograms([{ prop, value }], shorthands)
}

function touchProgram(
  programs: Map<string, LonghandProgram>,
  property: string,
  program: LonghandProgram
): void {
  programs.delete(property)
  programs.set(property, program)
}

function activateDynamicBase(accumulator: Accumulator, dynamic: DynamicBase): void {
  for (const property of dynamic.properties) {
    if (accumulator.dynamicBases.get(property) !== dynamic) continue
    accumulator.blocked.delete(property)
    accumulator.dynamicProgramProperties.add(property)
  }
  const untouchedIndex = accumulator.untouched.indexOf(dynamic.source)
  if (untouchedIndex !== -1) accumulator.untouched.splice(untouchedIndex, 1)
  const flagIndex = accumulator.flags.findIndex(
    (flag) => flag.code === 'dynamic-style-value' && flag.detail === dynamic.flagDetail
  )
  if (flagIndex !== -1) accumulator.flags.splice(flagIndex, 1)
}

function addDynamicBase(
  accumulator: Accumulator,
  prop: string,
  payload: string,
  source: string,
  flagDetail: string
): void {
  const value: ParsedValue = { base: payload, clauses: [] }
  const expanded = [...expansion(prop, value)]
  const dynamic: DynamicBase = {
    properties: expanded.map(([property]) => property),
    source,
    flagDetail,
  }
  let hasClauses = false

  for (const [property, next] of expanded) {
    const previous = accumulator.programs.get(property)
    if (previous?.value.clauses.length) hasClauses = true
    touchProgram(accumulator.programs, property, {
      ...next,
      value: {
        base: payload,
        clauses: previous?.value.clauses ?? [],
      },
    })
    accumulator.dynamicBases.set(property, dynamic)
    accumulator.blocked.add(property)
  }

  accumulator.untouched.push(source)
  addFlag(accumulator, 'dynamic-style-value', flagDetail)
  if (hasClauses) activateDynamicBase(accumulator, dynamic)
}

function addBase(accumulator: Accumulator, prop: string, payload: string): void {
  const value: ParsedValue = { base: payload, clauses: [] }
  for (const [property, next] of expansion(prop, value)) {
    const previous = accumulator.programs.get(property)
    touchProgram(accumulator.programs, property, {
      ...next,
      value: {
        base: payload,
        clauses: previous?.value.clauses ?? [],
      },
    })
    accumulator.blocked.delete(property)
    accumulator.dynamicBases.delete(property)
    accumulator.dynamicProgramProperties.delete(property)
  }
}

function blockBase(accumulator: Accumulator, prop: string, source: string): void {
  const value: ParsedValue = { base: null, clauses: [] }
  for (const [property, next] of expansion(prop, value)) {
    const previous = accumulator.programs.get(property)
    touchProgram(accumulator.programs, property, {
      ...next,
      value: {
        base: null,
        clauses: previous?.value.clauses ?? [],
      },
    })
    accumulator.blocked.add(property)
    accumulator.dynamicBases.delete(property)
    accumulator.dynamicProgramProperties.delete(property)
  }
  accumulator.untouched.push(source)
}

function addClause(
  accumulator: Accumulator,
  prop: string,
  clause: ParsedClause
): boolean {
  const clauseValue: ParsedValue = { base: null, clauses: [clause] }
  let complete = true
  for (const [property, next] of expansion(prop, clauseValue)) {
    if (accumulator.blocked.has(property)) {
      const dynamic = accumulator.dynamicBases.get(property)
      if (dynamic) {
        activateDynamicBase(accumulator, dynamic)
      } else {
        addFlag(
          accumulator,
          'condition-targets-unconvertible-prop',
          `"${prop}" contributes to "${property}", whose base value must remain authored`
        )
        complete = false
        continue
      }
    }
    const previous = accumulator.programs.get(property)
    touchProgram(accumulator.programs, property, {
      ...next,
      value: {
        base: previous?.value.base ?? null,
        clauses: [...(previous?.value.clauses ?? []), clause],
      },
    })
  }
  return complete
}

function printProgram(value: ParsedValue): string {
  const parts: string[] = []
  if (value.base !== null) parts.push(value.base)
  for (const clause of value.clauses) {
    parts.push(`${clause.modifiers.join(':')}:${clause.payload}`)
  }
  return parts.join(' ')
}

function printAfter(accumulator: Accumulator, kind: SiteKind): string {
  const printed = new Set<string>()
  const output: string[] = []

  for (const [property, program] of accumulator.programs) {
    if (printed.has(property) || accumulator.blocked.has(property)) continue

    const sourceExpansion = [...expansion(program.sourceProp, program.value).keys()]
    const serialized = printProgram(program.value)
    const isDynamic = accumulator.dynamicProgramProperties.has(property)
    const canUseSourceProp =
      sourceExpansion.length > 0 &&
      sourceExpansion.every((expanded) => {
        const candidate = accumulator.programs.get(expanded)
        return (
          candidate !== undefined &&
          !accumulator.blocked.has(expanded) &&
          candidate.sourceProp === program.sourceProp &&
          printProgram(candidate.value) === serialized &&
          accumulator.dynamicProgramProperties.has(expanded) === isDynamic
        )
      })

    const valueSource = isDynamic ? `\`${serialized}\`` : JSON.stringify(serialized)
    if (canUseSourceProp) {
      for (const expanded of sourceExpansion) printed.add(expanded)
      output.push(
        kind === 'styled'
          ? `${program.sourceProp}: ${valueSource}`
          : `${program.sourceProp}=${isDynamic ? `{${valueSource}}` : valueSource}`
      )
    } else {
      printed.add(property)
      output.push(
        kind === 'styled'
          ? `${property}: ${valueSource}`
          : `${property}=${isDynamic ? `{${valueSource}}` : valueSource}`
      )
    }
  }

  output.push(...accumulator.untouched)
  if (!output.length) return '(no automatic flat props)'

  const manual = output.filter((part) => part.startsWith('/* manual '))
  const props = output.filter((part) => !part.startsWith('/* manual '))
  const printedProps = props.join(kind === 'styled' ? ', ' : ' ')
  return [printedProps, ...manual].filter(Boolean).join(' ')
}

function isLegacyName(name: string): boolean {
  return name.startsWith('$') || pseudoToModifier[name] !== undefined
}

function transformPayload(prop: string, value: unknown): string | null {
  if (typeof value === 'string') {
    const token = tokenPayload(value)
    return token.error ? null : token.payload
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || prop === 'rotate') {
    return null
  }
  if (prop === 'scale') return String(value)
  return value === 0 ? '0' : `${value}px`
}

function legacyValueAtPath(
  rootName: string,
  value: Record<string, unknown>,
  path: string
): unknown {
  if (!path.startsWith(`${rootName}.`)) return undefined
  const parts = path.slice(rootName.length + 1).split('.')
  let current: unknown = value
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

function transformClause(
  rootName: string,
  path: string,
  payload: string,
  registry: ModifierRegistryView
): ParsedClause | null {
  if (!path.startsWith(`${rootName}.`)) return null
  const parts = path.slice(rootName.length + 1).split('.')
  parts.pop()
  const probe: Record<string, unknown> = {}
  let current = probe
  for (const condition of parts) {
    const nested: Record<string, unknown> = {}
    current[condition] = nested
    current = nested
  }
  current.opacity = payload
  const converted = convertLegacyConditionProp(rootName, probe, { registry })
  return converted?.errors.length === 0
    ? (converted.contributions[0]?.clause ?? null)
    : null
}

function jsxAttributeName(attribute: JsxAttribute): string | null {
  const name = attribute.getNameNode()
  return Node.isIdentifier(name) ? name.getText() : null
}

function jsxStringValue(attribute: JsxAttribute): string | null {
  const initializer = attribute.getInitializer()
  if (Node.isStringLiteral(initializer)) return initializer.getLiteralValue()
  if (!Node.isJsxExpression(initializer)) return null
  const expression = initializer.getExpression()
  if (!expression) return null
  const current = unwrapExpression(expression)
  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    return current.getLiteralValue()
  }
  return null
}

function jsxExpression(attribute: JsxAttribute): Expression | null {
  const initializer = attribute.getInitializer()
  if (!Node.isJsxExpression(initializer)) return null
  const expression = initializer.getExpression()
  return expression ? unwrapExpression(expression) : null
}

function hasOldJsxSyntax(opening: JsxElementWithAttributes): boolean {
  return opening.getAttributes().some((attribute) => {
    if (!Node.isJsxAttribute(attribute)) return false
    const name = jsxAttributeName(attribute)
    if (name && isLegacyName(name)) return true
    const value = jsxStringValue(attribute)
    return Boolean(name && styleProps.has(name) && value?.startsWith('$'))
  })
}

function convertLegacy(
  accumulator: Accumulator,
  name: string,
  object: ObjectLiteralExpression,
  registry: ModifierRegistryView,
  options: CodemodOptions
): boolean {
  const evaluated = evaluateLegacyObject(object, name)
  if (evaluated.fatal) {
    addFlag(accumulator, 'dynamic-legacy-condition', evaluated.fatal)
    return false
  }
  for (const leaf of evaluated.dynamicLeaves) {
    addFlag(
      accumulator,
      'dynamic-condition-value',
      `${leaf.path} uses dynamic value "${leaf.source}"`
    )
  }

  const converted = convertLegacyConditionProp(name, evaluated.value, { registry })
  if (converted === null) {
    addFlag(
      accumulator,
      'unknown-legacy-condition',
      `"${name}" is not a registered legacy condition spelling`
    )
    accumulator.untouched.push(`/* manual ${name} */`)
    return true
  }

  let needsManual = false
  for (const error of converted.errors) {
    if (options.transforms && error.code === 'legacy-transform-part') {
      const prop = error.path.slice(error.path.lastIndexOf('.') + 1)
      if (transformProgramProps.has(prop)) {
        const payload = transformPayload(
          prop,
          legacyValueAtPath(name, evaluated.value!, error.path)
        )
        const clause =
          payload === null ? null : transformClause(name, error.path, payload, registry)
        if (payload !== null && clause !== null) {
          const hasProgram = [
            ...expansion(prop, { base: null, clauses: [] }).keys(),
          ].some((property) => accumulator.programs.has(property))
          if (!hasProgram) addBase(accumulator, prop, transformDefaults[prop])
          if (!addClause(accumulator, prop, clause)) needsManual = true
          continue
        }
      }
    }
    addFlag(accumulator, error.code, `${error.path}: ${error.message}`)
    needsManual = true
  }
  for (const contribution of converted.contributions) {
    if (!styleProps.has(contribution.prop)) {
      addFlag(
        accumulator,
        'non-style-condition-entry',
        `${name}.${contribution.prop} is not a registered style property and cannot become a flat style value`
      )
      needsManual = true
      continue
    }
    if (!addClause(accumulator, contribution.prop, contribution.clause)) {
      needsManual = true
    }
  }
  if (needsManual) {
    accumulator.untouched.push(`/* manual ${name} */`)
  }
  return true
}

function convertJsx(
  opening: JsxElementWithAttributes,
  registry: ModifierRegistryView,
  options: CodemodOptions
): SiteReport | null {
  if (!hasOldJsxSyntax(opening)) return null

  const accumulator = emptyAccumulator()
  const before: string[] = []
  let skipped = false

  for (const attribute of opening.getAttributes()) {
    if (Node.isJsxSpreadAttribute(attribute)) {
      before.push(compact(attribute.getText()))
      addFlag(
        accumulator,
        'jsx-spread',
        `spread "${compact(attribute.getText())}" may hide style props or their authored order`
      )
      continue
    }

    const name = jsxAttributeName(attribute)
    if (!name || (!styleProps.has(name) && !isLegacyName(name))) continue
    before.push(compact(attribute.getText()))

    if (isLegacyName(name)) {
      const expression = jsxExpression(attribute)
      if (!expression || !Node.isObjectLiteralExpression(expression)) {
        addFlag(
          accumulator,
          'dynamic-legacy-condition',
          `"${name}" is not an inline object literal`
        )
        skipped = true
        continue
      }
      if (!convertLegacy(accumulator, name, expression, registry, options)) {
        skipped = true
      }
      continue
    }

    const stringValue = jsxStringValue(attribute)
    if (stringValue !== null) {
      const token = tokenPayload(stringValue)
      if (token.error) {
        addFlag(accumulator, 'legacy-token-name', `${name}: ${token.error}`)
        blockBase(accumulator, name, compact(attribute.getText()))
      } else {
        addBase(accumulator, name, token.payload)
      }
      continue
    }

    const expression = jsxExpression(attribute)
    const number = expression ? numericValue(expression) : null
    const transformBase =
      options.transforms && transformProgramProps.has(name) && number !== null
        ? transformPayload(name, number)
        : null
    if (transformBase !== null) {
      addBase(accumulator, name, transformBase)
      continue
    }
    if (
      !attribute.getInitializer() ||
      expression?.getKind() === SyntaxKind.TrueKeyword ||
      expression?.getKind() === SyntaxKind.FalseKeyword ||
      expression?.getKind() === SyntaxKind.NullKeyword ||
      number !== null
    ) {
      blockBase(accumulator, name, compact(attribute.getText()))
      continue
    }

    const detail = `"${name}" uses dynamic value "${compact(attribute.getText())}"`
    const dynamicPayload = expression ? dynamicBasePayload(name, expression) : null
    if (dynamicPayload !== null) {
      addDynamicBase(
        accumulator,
        name,
        dynamicPayload,
        compact(attribute.getText()),
        detail
      )
      continue
    }

    addFlag(accumulator, 'dynamic-style-value', detail)
    blockBase(accumulator, name, compact(attribute.getText()))
  }

  const sourceFile = opening.getSourceFile()
  const position = sourceFile.getLineAndColumnAtPos(opening.getStart())
  return {
    kind: 'jsx',
    label: `<${opening.getTagNameNode().getText()}>`,
    line: position.line,
    before: before.join(' '),
    after: skipped
      ? '(site skipped: legacy condition shape is dynamic)'
      : printAfter(accumulator, 'jsx'),
    flags: accumulator.flags,
    skipped,
  }
}

function styledPropertyName(property: PropertyAssignment): string | null {
  const name = property.getNameNode()
  return Node.isComputedPropertyName(name) ? null : getPropertyName(name)
}

function nestedLegacySyntax(property: PropertyAssignment): {
  conditions: number
  tokens: number
} {
  let conditions = 0
  let tokens = 0

  for (const nested of property.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
    const name = styledPropertyName(nested)
    if (name && isLegacyName(name)) conditions++
  }
  for (const literal of property.getDescendantsOfKind(SyntaxKind.StringLiteral)) {
    const parent = literal.getParent()
    if (Node.isPropertyAssignment(parent) && parent.getNameNode() === literal) continue
    if (literal.getLiteralValue().startsWith('$')) tokens++
  }

  return { conditions, tokens }
}

function hasOldStyledSyntax(object: ObjectLiteralExpression): boolean {
  return object.getProperties().some((property) => {
    if (!Node.isPropertyAssignment(property)) return false
    const name = styledPropertyName(property)
    if (!name) return false
    if (nestedStyledContainers.has(name)) {
      const nested = nestedLegacySyntax(property)
      if (nested.conditions || nested.tokens) return true
    }
    if (isLegacyName(name)) return true
    if (!styleProps.has(name)) return false
    const initializer = unwrapExpression(property.getInitializerOrThrow())
    return (
      (Node.isStringLiteral(initializer) ||
        Node.isNoSubstitutionTemplateLiteral(initializer)) &&
      initializer.getLiteralValue().startsWith('$')
    )
  })
}

function convertStyled(
  call: CallExpression,
  object: ObjectLiteralExpression,
  registry: ModifierRegistryView,
  options: CodemodOptions
): SiteReport | null {
  if (!hasOldStyledSyntax(object)) return null

  const accumulator = emptyAccumulator()
  const before: string[] = []
  let skipped = false

  for (const property of object.getProperties()) {
    if (Node.isSpreadAssignment(property)) {
      before.push(compact(property.getText()))
      addFlag(
        accumulator,
        'object-spread',
        `spread "${compact(property.getText())}" may hide style props or their authored order`
      )
      continue
    }
    if (!Node.isPropertyAssignment(property)) continue

    const name = styledPropertyName(property)
    if (name === null) {
      addFlag(
        accumulator,
        'computed-property',
        `"${compact(property.getNameNode().getText())}" hides the affected style property`
      )
      continue
    }
    if (nestedStyledContainers.has(name)) {
      const nested = nestedLegacySyntax(property)
      if (nested.conditions || nested.tokens) {
        before.push(compact(property.getText()))
        addFlag(
          accumulator,
          'nested-styled-style',
          `"${name}" contains ${nested.tokens} legacy token value(s) and ${nested.conditions} legacy condition object(s); each branch needs its own program merge`
        )
        accumulator.untouched.push(`/* manual ${name} */`)
      }
      continue
    }
    if (!styleProps.has(name) && !isLegacyName(name)) continue
    before.push(compact(property.getText()))

    const initializer = unwrapExpression(property.getInitializerOrThrow())
    if (isLegacyName(name)) {
      if (!Node.isObjectLiteralExpression(initializer)) {
        addFlag(
          accumulator,
          'dynamic-legacy-condition',
          `"${name}" is not an inline object literal`
        )
        skipped = true
        continue
      }
      if (!convertLegacy(accumulator, name, initializer, registry, options)) {
        skipped = true
      }
      continue
    }

    if (
      Node.isStringLiteral(initializer) ||
      Node.isNoSubstitutionTemplateLiteral(initializer)
    ) {
      const value = initializer.getLiteralValue()
      const token = tokenPayload(value)
      if (token.error) {
        addFlag(accumulator, 'legacy-token-name', `${name}: ${token.error}`)
        blockBase(accumulator, name, compact(property.getText()))
      } else {
        addBase(accumulator, name, token.payload)
      }
      continue
    }

    const number = numericValue(initializer)
    const transformBase =
      options.transforms && transformProgramProps.has(name) && number !== null
        ? transformPayload(name, number)
        : null
    if (transformBase !== null) {
      addBase(accumulator, name, transformBase)
      continue
    }
    if (
      number !== null ||
      initializer.getKind() === SyntaxKind.TrueKeyword ||
      initializer.getKind() === SyntaxKind.FalseKeyword ||
      initializer.getKind() === SyntaxKind.NullKeyword
    ) {
      blockBase(accumulator, name, compact(property.getText()))
      continue
    }

    const detail = `"${name}" uses dynamic value "${compact(initializer.getText())}"`
    const dynamicPayload = dynamicBasePayload(name, initializer)
    if (dynamicPayload !== null) {
      addDynamicBase(
        accumulator,
        name,
        dynamicPayload,
        compact(property.getText()),
        detail
      )
      continue
    }

    addFlag(accumulator, 'dynamic-style-value', detail)
    blockBase(accumulator, name, compact(property.getText()))
  }

  const sourceFile = call.getSourceFile()
  const position = sourceFile.getLineAndColumnAtPos(call.getStart())
  const target = call.getArguments()[0]?.getText() ?? 'unknown'
  return {
    kind: 'styled',
    label: `styled(${compact(target)}, …)`,
    line: position.line,
    before: before.join(', '),
    after: skipped
      ? '(site skipped: legacy condition shape is dynamic)'
      : printAfter(accumulator, 'styled'),
    flags: accumulator.flags,
    skipped,
  }
}

function explicitThemeNames(sourceFiles: readonly SourceFile[]): Set<string> {
  const names = new Set(['light', 'dark'])
  for (const sourceFile of sourceFiles) {
    for (const attribute of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
      const name = jsxAttributeName(attribute)
      if (name?.startsWith('$theme-')) names.add(name.slice('$theme-'.length))
    }
    for (const property of sourceFile.getDescendantsOfKind(
      SyntaxKind.PropertyAssignment
    )) {
      const name = styledPropertyName(property)
      if (name?.startsWith('$theme-')) names.add(name.slice('$theme-'.length))
    }
  }
  return names
}

function collectFiles(inputs: string[]): SourceFile[] {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: false,
      jsx: 4,
      target: ScriptTarget.ES2020,
    },
  })

  const patterns = inputs.map((input) => {
    const path = resolve(repoRoot, input)
    return /\.[cm]?[jt]sx?$/.test(path) ? path : `${path}/**/*.{ts,tsx}`
  })
  return project
    .addSourceFilesAtPaths(patterns)
    .sort((left, right) => left.getFilePath().localeCompare(right.getFilePath()))
}

function inspectFile(
  sourceFile: SourceFile,
  registry: ModifierRegistryView,
  options: CodemodOptions
): FileReport {
  const sites: SiteReport[] = []

  for (const opening of sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement)) {
    const converted = convertJsx(opening, registry, options)
    if (converted) sites.push(converted)
  }
  for (const opening of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement
  )) {
    const converted = convertJsx(opening, registry, options)
    if (converted) sites.push(converted)
  }
  for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (call.getExpression().getText() !== 'styled') continue
    const config = call.getArguments()[1]
    if (!Node.isObjectLiteralExpression(config)) continue
    const converted = convertStyled(call, config, registry, options)
    if (converted) sites.push(converted)
  }

  sites.sort(
    (left, right) => left.line - right.line || left.kind.localeCompare(right.kind)
  )
  return {
    file: relative(repoRoot, sourceFile.getFilePath()),
    sites,
  }
}

function renderReport(
  files: FileReport[],
  registryDiagnostics: readonly string[],
  options: CodemodOptions
): string {
  const sites = files.flatMap((file) => file.sites)
  const clean = sites.filter((site) => site.flags.length === 0 && !site.skipped)
  const flagged = sites.filter((site) => site.flags.length > 0 || site.skipped)
  const jsx = sites.filter((site) => site.kind === 'jsx')
  const styled = sites.filter((site) => site.kind === 'styled')
  const cleanJsx = jsx.filter((site) => site.flags.length === 0 && !site.skipped)
  const cleanStyled = styled.filter((site) => site.flags.length === 0 && !site.skipped)
  const reasons = new Map<string, number>()
  for (const site of flagged) {
    for (const flag of site.flags)
      reasons.set(flag.code, (reasons.get(flag.code) ?? 0) + 1)
  }
  const sortedReasons = [...reasons].sort(
    ([leftCode, leftCount], [rightCode, rightCount]) =>
      rightCount - leftCount || leftCode.localeCompare(rightCode)
  )

  const lines = [
    '# Flat-values codemod dry-run',
    '',
    `Corpus: \`code/kitchen-sink/src/usecases\` and \`code/ui/tamagui/src/components/Button.tsx\`.`,
    '',
    'No source files were written.',
    `Transform-part conversion: ${options.transforms ? 'enabled' : 'disabled'}.`,
    '',
    '## Summary',
    '',
    `- ${sites.length} conversion sites found`,
    `- ${clean.length} converted cleanly`,
    `- ${flagged.length} flagged for manual work`,
    `- ${sites.filter((site) => site.skipped).length} skipped because a legacy condition shape was dynamic`,
    `- ${jsx.length} JSX sites: ${cleanJsx.length} clean, ${jsx.length - cleanJsx.length} flagged`,
    `- ${styled.length} styled() config sites: ${cleanStyled.length} clean, ${styled.length - cleanStyled.length} flagged`,
    '',
    '### Flag reasons',
    '',
    ...(sortedReasons.length
      ? sortedReasons.map(([code, count]) => `- ${code}: ${count}`)
      : ['- none']),
  ]

  if (registryDiagnostics.length) {
    lines.push('', '### Modifier registry diagnostics', '')
    for (const diagnostic of registryDiagnostics) lines.push(`- ${diagnostic}`)
  }

  for (const file of files) {
    if (!file.sites.length) continue
    lines.push('', `## \`${file.file}\``, '')
    for (const site of file.sites) {
      const status = site.skipped ? 'skipped' : site.flags.length ? 'flagged' : 'clean'
      lines.push(
        `### ${site.label} at line ${site.line} (${status})`,
        '',
        'Before:',
        '',
        '```tsx',
        site.before,
        '```',
        '',
        'After:',
        '',
        '```tsx',
        site.after,
        '```'
      )
      if (site.flags.length) {
        lines.push('', 'Flags:', '')
        for (const flag of site.flags) lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      lines.push('')
    }
  }

  return `${lines.join('\n')}\n`
}

function parseArguments(argv: string[]): {
  reportPath: string
  inputs: string[]
  options: CodemodOptions
} {
  const inputs: string[] = []
  let reportPath = defaultReportPath
  let transforms = false

  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === '--transforms') {
      transforms = true
      continue
    }
    if (argv[index] === '--report') {
      const next = argv[index + 1]
      if (!next) throw new Error('--report requires a path')
      reportPath = resolve(next)
      index++
      continue
    }
    inputs.push(argv[index])
  }

  return {
    reportPath,
    inputs: inputs.length ? inputs : defaultCorpus,
    options: { transforms },
  }
}

const { reportPath, inputs, options } = parseArguments(process.argv.slice(2))
const sourceFiles = collectFiles(inputs)
const themes = explicitThemeNames(sourceFiles)
const modifierRegistry = createModifierRegistry({
  mediaNames: [...defaultMediaKeys, ...extraMediaNames],
  themeNames: themes,
})
const files = sourceFiles.map((sourceFile) =>
  inspectFile(sourceFile, modifierRegistry.registry, options)
)
const report = renderReport(files, modifierRegistry.diagnostics, options)
mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, report)

const sites = files.flatMap((file) => file.sites)
const clean = sites.filter((site) => site.flags.length === 0 && !site.skipped).length
const flagged = sites.length - clean
console.log(`wrote ${reportPath}`)
console.log(`${sites.length} sites: ${clean} clean, ${flagged} flagged`)
