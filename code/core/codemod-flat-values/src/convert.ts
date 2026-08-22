// One conversion site is one style object: a JSX attribute list, a `styled()`
// config, or a single variant branch. Conversion is a two-phase pass over the
// site's members in authored order.
//
// Phase one classifies each member. A legacy condition object becomes clauses
// through the shared converter. A base value that V3 spells differently (`$token`)
// must convert. Every other base value stays exactly as authored, and only folds
// into a program when a clause would otherwise need a second attribute of the same
// name (`opacity={0.5}` plus `enterStyle={{ opacity: 0 }}` cannot stay two
// `opacity` props, so it becomes `opacity="0.5 enter:0"`).
//
// Phase two merges the contributions with the grammar's own clause merge, prints
// each program at the position of its first contributing member, and re-parses
// what it printed. A program that does not read back identically is reported
// instead of suggested.

import {
  Node,
  SyntaxKind,
  type Expression,
  type JsxAttribute,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type ObjectLiteralExpression,
  type PropertyAssignment,
} from 'ts-morph'
import type { ContainerPlan } from './containers'
import {
  compact,
  literalTree,
  numericValue,
  runtimeType,
  staticLeafValue,
  unwrapExpression,
} from './expressions'
import {
  assessFlatConversion,
  convertLegacyConditionProp,
  expandToLonghands,
  flatStringValue,
  mergeProgramValues,
  parseValue,
  printProgram,
  resolveProp,
  sharedPayload,
  shorthands,
  styleProps,
  unitSuffix,
  type ConversionReason,
  type ConversionTargets,
  type HostView,
  type ModifierRegistryView,
  type ParsedClause,
  type ParsedValue,
} from './grammar'
import { isLegacyConditionName, resolveLegacyName } from './legacyNames'
import { classifyStructuredNativeValue } from './structuredNative'

export type SiteKind = 'jsx' | 'styled'

export interface Flag {
  code: string
  detail: string
}

/** one converted flat prop, as the report suggests writing it */
export interface EmittedProgram {
  name: string
  /** the flat program text, with `${...}` where the source was dynamic */
  value: string
  dynamic: boolean
}

export interface ConversionFinding {
  property: string
  verdict: 'needs-relocation' | 'unknown-host' | 'ineligible'
  reasons: readonly ConversionReason[]
}

export interface SiteReport {
  kind: SiteKind
  label: string
  line: number
  before: string
  after: string
  programs: EmittedProgram[]
  /** semantic or host constraints that make an otherwise valid rewrite unsafe */
  assessments: ConversionFinding[]
  assessmentVerdict: 'clean' | ConversionFinding['verdict']
  /** non-blocking configuration risks the codemod cannot verify */
  warnings: Flag[]
  /** the site cannot be converted correctly without a human */
  flags: Flag[]
  /** values left authored because they belong to another migration */
  inventory: Flag[]
  /** conversions the runtime cannot read yet, so they are not offered */
  pending: Flag[]
  notes: string[]
  /** legacy condition props the conversion could not remove */
  legacyLeft: number
}

function assessmentVerdict(
  assessments: readonly ConversionFinding[]
): SiteReport['assessmentVerdict'] {
  if (assessments.some((assessment) => assessment.verdict === 'ineligible')) {
    return 'ineligible'
  }
  if (assessments.some((assessment) => assessment.verdict === 'needs-relocation')) {
    return 'needs-relocation'
  }
  return assessments.length ? 'unknown-host' : 'clean'
}

interface Contribution {
  prop: string
  clause: ParsedClause
  dynamic: boolean
}

/** an opaque spread: its contents can reorder any program merged across it */
interface SpreadMember {
  type: 'spread'
  index: number
  text: string
}

/** a prop the conversion keeps verbatim at its authored position */
interface PassthroughMember {
  type: 'passthrough'
  index: number
  text: string
}

interface AuthoredMember {
  type: 'authored'
  index: number
  prop: string
  text: string
  /** the flat payload this value folds into a program as, when it can */
  payload: string | null
  dynamic: boolean
  /** why it cannot fold, raised only if a clause forces it */
  blocked: Flag | null
  /** the authored value contains a `$token` spelling that v3 must rewrite */
  token: boolean
  activated: boolean
}

interface LegacyMember {
  type: 'legacy'
  index: number
  name: string
  text: string
  contributions: Contribution[]
  /** the longhands this condition object sets, or null when it could not be read */
  properties: ReadonlySet<string> | null
  failed: boolean
}

type Member = SpreadMember | PassthroughMember | AuthoredMember | LegacyMember

interface Slot {
  property: string
  sourceProp: string
  value: ParsedValue
  anchor: number
  last: number
  dynamic: boolean
}

export interface Site {
  kind: SiteKind
  registry: ModifierRegistryView
  /** which `group` declarations have a proven descendant needing a query container */
  containers: ContainerPlan
  targets: ConversionTargets
  host: HostView | undefined
  members: Member[]
  comments: Map<number, readonly string[]>
  extras: Array<{ index: number; text: string }>
  warnings: Flag[]
  flags: Flag[]
  inventory: Flag[]
  pending: Flag[]
  assessments: ConversionFinding[]
  notes: string[]
  /** the site contains v1-only syntax, so it is a conversion site at all */
  legacy: boolean
  index: number
}

function createSite(
  kind: SiteKind,
  registry: ModifierRegistryView,
  containers: ContainerPlan,
  targets: ConversionTargets,
  host: HostView | undefined
): Site {
  return {
    kind,
    registry,
    containers,
    targets,
    host,
    members: [],
    comments: new Map(),
    extras: [],
    warnings: [],
    flags: [],
    inventory: [],
    pending: [],
    assessments: [],
    notes: [],
    legacy: false,
    index: 0,
  }
}

function assessProgram(
  site: Site,
  property: string,
  modifiers: readonly string[]
): boolean {
  const targetProperty = resolveProp(property)
  const assessment = assessFlatConversion(
    {
      property: targetProperty,
      modifiers,
      targets: site.targets,
      host: site.host,
    },
    site.registry
  )
  if (assessment.verdict !== 'clean') addAssessment(site, targetProperty, assessment)

  // A host warning or platform relocation was useful while this tool was only a
  // report, but V3 has no legacy syntax to leave behind. Only a property family
  // with no flat spelling can block the rewrite; every other assessment remains
  // visible in the report for review while the migration proceeds.
  return assessment.verdict !== 'ineligible'
}

function addAssessment(
  site: Site,
  property: string,
  assessment: ReturnType<typeof assessFlatConversion>
): void {
  if (assessment.verdict === 'clean') return
  if (
    !site.assessments.some(
      (finding) =>
        finding.property === property &&
        finding.verdict === assessment.verdict &&
        JSON.stringify(finding.reasons) === JSON.stringify(assessment.reasons)
    )
  ) {
    site.assessments.push({
      property,
      verdict: assessment.verdict,
      reasons: assessment.reasons,
    })
  }
}

function addFlag(list: Flag[], code: string, detail: string): void {
  if (!list.some((flag) => flag.code === code && flag.detail === detail)) {
    list.push({ code, detail })
  }
}

function addNote(site: Site, note: string): void {
  if (!site.notes.includes(note)) site.notes.push(note)
}

const legacyPaletteStepPattern =
  /(?:^|[^\w-])\$?((?:gray|mauve|slate|sage|olive|sand|tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|bronze|gold|brown|orange|amber|yellow|lime|mint|sky)(?:1[0-2]|[1-9]))(?![\w-])/g

function legacyPaletteStepWarning(prop: string, values: readonly string[]): Flag | null {
  const names = new Set<string>()
  for (const value of values) {
    legacyPaletteStepPattern.lastIndex = 0
    for (const match of value.matchAll(legacyPaletteStepPattern)) names.add(match[1])
  }
  if (!names.size) return null
  const formatted = [...names]
    .sort()
    .map((name) => `\`${name}\``)
    .join(', ')
  return {
    code: 'legacy-palette-token',
    detail: `${prop} preserves ${formatted}, which @tamagui/config/v6 does not define; choose an absolute palette token or an adaptive colorN value`,
  }
}

// —— value classification ————————————————————————————————————————————————

interface Classification {
  /** the flat payload the value folds into a program as */
  payload: string | null
  /** the authored text, rewritten when the source held `$` token spellings */
  text: string | null
  /** the payload interpolates an expression, so the program prints as a template */
  dynamic: boolean
  /** a problem with the value itself, raised on sight */
  problem: Flag | null
  /** a non-blocking configuration risk visible in the authored literals */
  warning: Flag | null
  /** raised only when a clause forces the value into a program */
  blocked: Flag | null
  /** recorded for a migration that is not the flat-value migration */
  inventory: Flag | null
}

const empty: Classification = {
  payload: null,
  text: null,
  dynamic: false,
  problem: null,
  warning: null,
  blocked: null,
  inventory: null,
}

function interpolate(
  prop: string,
  text: string,
  kind: 'number' | 'string',
  registry: ModifierRegistryView
): string {
  return `\${${text}}${kind === 'number' ? unitSuffix(resolveProp(prop), registry) : ''}`
}

/**
 * A static value's flat spelling, taken from the shared converter so a base and a
 * clause payload for the same property always agree on units and token names.
 */
function classifyStatic(
  prop: string,
  value: string | number,
  registry: ModifierRegistryView
): Classification {
  const probe = sharedPayload(prop, value, registry)
  const error = probe.errors[0]
  if (error || probe.payload === null) {
    const flag: Flag = {
      code: error?.code ?? 'unsupported-legacy-value',
      detail: `${prop}: ${error?.message ?? `"${String(value)}" has no flat spelling`}`,
    }
    return { ...empty, problem: flag, blocked: flag }
  }
  return { ...empty, payload: probe.payload }
}

/**
 * A plain string is only safe to leave authored if the flat parser reads it back
 * as exactly one base value: a top-level colon or brace in a v1 string means
 * something else in V3.
 */
function reparsesAsBase(value: string, registry: ModifierRegistryView): boolean {
  const parsed = parseValue(value, registry)
  return (
    parsed.ok && parsed.value.clauses.length === 0 && parsed.value.base === value.trim()
  )
}

function classifyDynamic(
  prop: string,
  expression: Expression,
  registry: ModifierRegistryView
): Classification {
  const current = unwrapExpression(expression)
  const source = compact(current.getText())

  const structured = classifyStructuredNativeValue(
    resolveProp(prop),
    current,
    source,
    registry
  )
  if (structured) {
    return {
      ...empty,
      payload: structured.payload,
      blocked: structured.blocked,
    }
  }

  const tree = literalTree(current, registry)
  if (tree && tree.error) {
    const flag: Flag = {
      code: tree.error.code,
      detail: `${prop}: ${tree.error.message}`,
    }
    return { ...empty, problem: flag, blocked: flag }
  }
  if (tree && tree.kind !== 'nullish') {
    const rewrittenTokenText =
      /\$(?=[\w-])/.test(source) && tree.text !== source ? tree.text : null
    return {
      ...empty,
      payload: interpolate(prop, tree.text, tree.kind, registry),
      text: rewrittenTokenText,
      dynamic: true,
      warning: legacyPaletteStepWarning(prop, tree.strings),
    }
  }
  if (tree) {
    const flag: Flag = {
      code: 'empty-style-value',
      detail: `${prop} value "${source}" is always nullish and cannot join a program`,
    }
    return { ...empty, blocked: flag }
  }

  const runtime = runtimeType(current)
  if (runtime.kind === 'number') {
    return {
      ...empty,
      payload: interpolate(prop, source, 'number', registry),
      dynamic: true,
    }
  }
  if (runtime.kind === 'string') {
    const tokens = runtime.literals?.filter((literal) => literal.startsWith('$'))
    if (tokens?.length) {
      const flag: Flag = {
        code: 'legacy-token-constant',
        detail: `${prop} value "${source}" resolves to legacy token ${tokens
          .map((token) => `"${token}"`)
          .join(', ')}; migrate the constant it comes from`,
      }
      return { ...empty, problem: flag, blocked: flag }
    }
    if (runtime.literals === null) {
      return {
        ...empty,
        payload: interpolate(prop, source, 'string', registry),
        dynamic: true,
        inventory: {
          code: 'dynamic-string-value',
          detail: `${prop} value "${source}" is an open string; confirm it never holds a legacy "$token" spelling`,
        },
      }
    }
    return {
      ...empty,
      payload: interpolate(prop, source, 'string', registry),
      dynamic: true,
    }
  }

  const flag: Flag = {
    code: 'unprovable-dynamic-value',
    detail: `${prop} value "${source}" has no provable number or string type, so it cannot fold into a program`,
  }
  return { ...empty, blocked: flag }
}

// —— members ————————————————————————————————————————————————————————————

function pushBase(
  site: Site,
  prop: string,
  text: string,
  value: Expression | null,
  literalString: string | null
): void {
  const index = site.index++

  if (literalString !== null) {
    const warning = legacyPaletteStepWarning(prop, [literalString])
    if (warning) addFlag(site.warnings, warning.code, warning.detail)
    if (literalString.includes('$')) {
      site.legacy = true
      const allowed = assessProgram(site, prop, [])
      // the same converter a clause payload goes through, so a base and a clause
      // for one property agree on which `$` is a token candidate at all: one
      // inside a quoted string or an unquoted url() body is literal CSS
      const flat = flatStringValue(literalString, site.registry)
      const problem: Flag | null =
        flat.text === null
          ? {
              code: flat.error?.code ?? 'unsupported-legacy-value',
              detail: `${prop}: ${flat.error?.message ?? `${JSON.stringify(literalString)} has no flat spelling`}`,
            }
          : !reparsesAsBase(flat.text, site.registry)
            ? {
                code: 'value-reparses-as-program',
                detail: `${prop} value ${JSON.stringify(flat.text)} does not read back as one flat base value`,
              }
            : null

      if (problem !== null) addFlag(site.flags, problem.code, problem.detail)
      // v3 sends clause-free strings through the flat engine too, so a token base
      // becomes a base-only program even when no legacy condition targets it
      site.members.push({
        type: 'authored',
        index,
        prop,
        text,
        payload: allowed && problem === null ? flat.text : null,
        dynamic: false,
        blocked: problem,
        token: allowed,
        activated: false,
      })
      return
    }

    if (!reparsesAsBase(literalString, site.registry)) {
      const flag: Flag = {
        code: 'value-reparses-as-program',
        detail: `${prop} value ${JSON.stringify(literalString)} does not read back as one flat base value`,
      }
      addFlag(site.flags, flag.code, flag.detail)
      site.members.push({
        type: 'authored',
        index,
        prop,
        text,
        payload: null,
        dynamic: false,
        blocked: flag,
        token: false,
        activated: false,
      })
      return
    }

    site.members.push({
      type: 'authored',
      index,
      prop,
      text,
      payload: literalString,
      dynamic: false,
      blocked: null,
      token: false,
      activated: false,
    })
    return
  }

  const number = value ? numericValue(value) : null
  if (number !== null) {
    const classified = classifyStatic(prop, number, site.registry)
    site.members.push({
      type: 'authored',
      index,
      prop,
      text,
      payload: classified.payload,
      dynamic: false,
      blocked: classified.blocked,
      token: false,
      activated: false,
    })
    return
  }

  const kind = value?.getKind()
  if (
    value === null ||
    kind === SyntaxKind.TrueKeyword ||
    kind === SyntaxKind.FalseKeyword ||
    kind === SyntaxKind.NullKeyword
  ) {
    site.members.push({
      type: 'authored',
      index,
      prop,
      text,
      payload: null,
      dynamic: false,
      blocked: {
        code: 'non-css-style-value',
        detail: `${prop} value "${compact(text)}" is not a CSS value and cannot join a program`,
      },
      token: false,
      activated: false,
    })
    return
  }

  const classified = classifyDynamic(prop, value, site.registry)
  if (classified.problem) {
    site.legacy = true
    addFlag(site.flags, classified.problem.code, classified.problem.detail)
  }
  if (classified.warning) {
    addFlag(site.warnings, classified.warning.code, classified.warning.detail)
  }
  if (classified.inventory) {
    addFlag(site.inventory, classified.inventory.code, classified.inventory.detail)
  }
  // a rewritten expression (`active ? '$red10' : '$blue10'`) also becomes a
  // base-only program when no legacy condition targets it
  if (classified.text !== null) site.legacy = true
  const allowed = classified.text === null || assessProgram(site, prop, [])
  site.members.push({
    type: 'authored',
    index,
    prop,
    text,
    payload: allowed ? classified.payload : null,
    dynamic: classified.dynamic,
    blocked: classified.blocked,
    token: allowed && classified.text !== null,
    activated: false,
  })
}

interface LegacyLeaf {
  path: string
  prop: string
  expression: Expression
}

interface LegacyObject {
  value: Record<string, unknown> | null
  fatal: string | null
  leaves: LegacyLeaf[]
}

const sentinelMark = '\u0001'

function evaluateLegacyObject(
  object: ObjectLiteralExpression,
  rootPath: string
): LegacyObject {
  const leaves: LegacyLeaf[] = []

  const visit = (
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
      const name = propertyName(nameNode)
      if (name === null) {
        return {
          value: null,
          fatal: `property name "${compact(nameNode.getText())}" is not statically known`,
        }
      }

      const path = `${currentPath}.${name}`
      const initializer = unwrapExpression(property.getInitializerOrThrow())
      if (Node.isObjectLiteralExpression(initializer)) {
        const nested = visit(initializer, path)
        if (nested.fatal) return nested
        value[name] = nested.value
        continue
      }

      const leaf = staticLeafValue(initializer)
      if (leaf) {
        value[name] = leaf.value
        continue
      }

      value[name] = `${sentinelMark}${leaves.length}${sentinelMark}`
      leaves.push({ path, prop: name, expression: initializer })
    }

    return { value, fatal: null }
  }

  const result = visit(object, rootPath)
  return { ...result, leaves }
}

/**
 * Every longhand a legacy condition object sets, at any condition depth. A nested
 * condition this pass cannot resolve still sets its descendants under some
 * condition, so they all belong here: this set is the member's barrier, and
 * leaving them out lets a later clause move across a value that can beat it.
 */
function conditionProperties(value: Record<string, unknown>): Set<string> {
  const properties = new Set<string>()
  const visit = (object: Record<string, unknown>): void => {
    for (const key in object) {
      const child = object[key]
      if (child !== null && typeof child === 'object' && isLegacyConditionName(key)) {
        visit(child as Record<string, unknown>)
        continue
      }
      if (!styleProps.has(key)) continue
      for (const property of expandToLonghands(key, shorthands)) properties.add(property)
    }
  }
  visit(value)
  return properties
}

function pushLegacy(
  site: Site,
  name: string,
  text: string,
  initializer: Expression | null,
  node: Node
): void {
  const index = site.index++
  site.legacy = true

  const keep = (properties: ReadonlySet<string> | null): void => {
    site.members.push({
      type: 'legacy',
      index,
      name,
      text,
      contributions: [],
      properties,
      failed: true,
    })
  }

  if (initializer === null || !Node.isObjectLiteralExpression(initializer)) {
    addFlag(
      site.flags,
      'dynamic-legacy-condition',
      `"${name}" is not an inline object literal, so its entries are not statically known`
    )
    keep(null)
    return
  }

  const evaluated = evaluateLegacyObject(initializer, name)
  if (evaluated.fatal || evaluated.value === null) {
    addFlag(site.flags, 'dynamic-legacy-condition', evaluated.fatal ?? 'unresolved')
    keep(null)
    return
  }

  // what this object sets, whether or not it converts: an object left authored
  // still contributes at its position, which is what decides whether a program can
  // merge across it
  const properties = conditionProperties(evaluated.value)

  const eligibilityStack: Array<{
    object: Record<string, unknown>
    path: string
  }> = [{ object: evaluated.value, path: name }]
  let hasRejectedProperty = false
  while (eligibilityStack.length > 0) {
    const current = eligibilityStack.pop()!
    for (const prop in current.object) {
      const value = current.object[prop]
      const targetProp = resolveProp(prop)
      if (styleProps.has(targetProp) && !isLegacyConditionName(prop)) {
        const assessment = assessFlatConversion(
          {
            property: targetProp,
            targets: site.targets,
            host: site.host,
          },
          site.registry
        )
        if (assessment.verdict === 'ineligible') {
          addAssessment(site, targetProp, assessment)
          hasRejectedProperty = true
        }
        continue
      }
      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        isLegacyConditionName(prop)
      ) {
        eligibilityStack.push({
          object: value as Record<string, unknown>,
          path: `${current.path}.${prop}`,
        })
      }
    }
  }
  if (hasRejectedProperty) {
    keep(properties)
    return
  }

  // the condition would convert, but the query it becomes needs a container this
  // pass cannot place, so the whole object stays authored rather than converting
  // into a query nothing matches
  const unresolved = site.containers.unresolved.get(node)
  if (unresolved !== undefined) {
    addFlag(site.flags, unresolved.code, unresolved.detail)
    keep(properties)
    return
  }

  const resolution = resolveLegacyName(name, site.registry)
  if (!resolution.ok) {
    addFlag(site.flags, resolution.code, resolution.message)
    keep(properties)
    return
  }

  const payloads = new Map<string, string>()
  let failed = false
  for (let index = 0; index < evaluated.leaves.length; index++) {
    const leaf = evaluated.leaves[index]
    const classified = classifyDynamic(leaf.prop, leaf.expression, site.registry)
    if (classified.warning) {
      addFlag(
        site.warnings,
        classified.warning.code,
        `${leaf.path}: ${classified.warning.detail}`
      )
    }
    if (classified.payload === null) {
      const flag = classified.problem ?? classified.blocked
      addFlag(
        site.flags,
        flag?.code ?? 'dynamic-condition-value',
        `${leaf.path}: ${flag?.detail ?? 'the value is not statically known'}`
      )
      failed = true
      continue
    }
    payloads.set(`${sentinelMark}${index}${sentinelMark}`, classified.payload)
  }
  if (failed) {
    keep(properties)
    return
  }

  const { canonical, replaceRoot } = resolution.resolved
  const converted = convertLegacyConditionProp(canonical, evaluated.value, {
    registry: site.registry,
  })
  if (converted === null) {
    addFlag(
      site.flags,
      'unknown-legacy-condition',
      `"${name}" is not a registered legacy condition spelling`
    )
    keep(properties)
    return
  }

  for (const error of converted.errors) {
    const path = error.path.startsWith(canonical)
      ? `${name}${error.path.slice(canonical.length)}`
      : error.path
    addFlag(site.flags, error.code, `${path}: ${error.message}`)
    failed = true
  }

  const contributions: Contribution[] = []
  for (const contribution of converted.contributions) {
    if (!styleProps.has(contribution.prop)) {
      addFlag(
        site.flags,
        'non-style-condition-entry',
        `${name}.${contribution.prop} is not a style property, so a flat value cannot carry it`
      )
      failed = true
      continue
    }
    const modifiers = replaceRoot
      ? [...replaceRoot, ...contribution.clause.modifiers.slice(1)]
      : contribution.clause.modifiers
    const dynamicPayload = payloads.get(contribution.clause.payload)
    contributions.push({
      prop: contribution.prop,
      clause: {
        modifiers,
        payload: dynamicPayload ?? contribution.clause.payload,
      },
      dynamic: dynamicPayload !== undefined,
    })
    if (!assessProgram(site, contribution.prop, modifiers)) failed = true
  }

  if (failed) {
    keep(properties)
    return
  }

  site.members.push({
    type: 'legacy',
    index,
    name,
    text,
    contributions,
    properties,
    failed: false,
  })
}

// —— assembly ————————————————————————————————————————————————————————————

function activationName(prop: string): string {
  return resolveProp(prop)
}

interface Entry {
  prop: string
  value: ParsedValue
  dynamic: boolean
  index: number
  base: boolean
  /** the legacy attribute this clause came from, when it came from one */
  from: LegacyMember | null
  /** V2 resolved overlapping pseudo objects by this fixed priority. */
  legacyStatePriority: number | null
}

/**
 * A member the merge leaves in place still contributes at its authored position, so
 * a program merged across it can change what wins. A base only competes with other
 * bases and a clause only with other clauses, and an opaque spread competes with
 * both.
 */
interface Barrier {
  index: number
  /** the authored text, so the report can name what blocks the merge */
  source: string
  bases: ReadonlySet<string> | null
  clauses: ReadonlySet<string> | null
}

const noProperties: ReadonlySet<string> = new Set()

const legacyStatePriorities: Readonly<Record<string, number>> = Object.freeze({
  hover: 2,
  press: 3,
  active: 3,
  focus: 4,
  'focus-visible': 4,
  'focus-within': 4,
  enter: 4,
  disabled: 5,
  exit: 5,
})

function legacyStatePriority(modifiers: readonly string[]): number | null {
  let priority: number | null = null
  for (const modifier of modifiers) {
    const candidate = legacyStatePriorities[modifier]
    if (candidate !== undefined && (priority === null || candidate > priority)) {
      priority = candidate
    }
  }
  return priority
}

function orderedEntries(site: Site): Entry[] {
  const ordered: Entry[] = []
  for (const member of site.members) {
    if (member.type === 'authored') {
      if (!member.activated || member.payload === null) continue
      ordered.push({
        prop: member.prop,
        value: { base: member.payload, clauses: [] },
        dynamic: member.dynamic,
        index: member.index,
        base: true,
        from: null,
        legacyStatePriority: null,
      })
      continue
    }
    if (member.type !== 'legacy' || member.failed) continue
    for (const contribution of member.contributions) {
      // no base is invented here. A legacy condition object only ever added a
      // conditional value, and a clause-only program (decision 21) keeps whatever
      // base the styled component, variant, or call site defined — the same thing
      // v1's separate `enterStyle` prop did
      ordered.push({
        prop: contribution.prop,
        value: { base: null, clauses: [contribution.clause] },
        dynamic: contribution.dynamic,
        index: member.index,
        base: false,
        from: member,
        legacyStatePriority: legacyStatePriority(contribution.clause.modifiers),
      })
    }
  }

  // New flat programs are authored-order by design, but V2 pseudo objects had
  // fixed overlap precedence regardless of object-property order. Reorder only
  // the legacy state entries in their existing positions; authored bases and
  // non-state conditions remain anchored exactly where they were.
  const ranked = ordered
    .filter((entry) => entry.legacyStatePriority !== null)
    .sort(
      (left, right) =>
        left.legacyStatePriority! - right.legacyStatePriority! || left.index - right.index
    )
  if (ranked.length < 2) return ordered

  let rankedIndex = 0
  return ordered.map((entry) =>
    entry.legacyStatePriority === null ? entry : ranked[rankedIndex++]
  )
}

function buildSlots(ordered: readonly Entry[]): Map<string, Slot> {
  const slots = new Map<string, Slot>()
  for (const entry of ordered) {
    for (const property of expandToLonghands(entry.prop, shorthands)) {
      const previous = slots.get(property)
      const value = previous
        ? mergeProgramValues(previous.value, entry.value)
        : entry.value
      slots.delete(property)
      slots.set(property, {
        property,
        sourceProp: entry.prop,
        value,
        anchor: previous ? Math.min(previous.anchor, entry.index) : entry.index,
        last: previous ? Math.max(previous.last, entry.index) : entry.index,
        dynamic: (previous?.dynamic ?? false) || entry.dynamic,
      })
    }
  }
  return slots
}

function barriers(site: Site): Barrier[] {
  const list: Barrier[] = []
  for (const member of site.members) {
    if (member.type === 'spread') {
      list.push({ index: member.index, source: member.text, bases: null, clauses: null })
      continue
    }
    if (member.type === 'authored' && !member.activated) {
      list.push({
        index: member.index,
        source: member.text,
        bases: new Set(expandToLonghands(member.prop, shorthands)),
        clauses: noProperties,
      })
      continue
    }
    if (member.type === 'legacy' && member.failed) {
      list.push({
        index: member.index,
        source: member.name,
        bases: noProperties,
        clauses: member.properties,
      })
    }
  }
  return list
}

/**
 * Merging is only allowed when the merged program lands where every contribution
 * still beats and loses to the same things it did. A barrier between contributions
 * of the same kind breaks that, so the contributions after it go back to being
 * authored: partial conversion in authored order beats a reordered whole one.
 */
function resolveBarriers(
  site: Site,
  ordered: readonly Entry[],
  slots: Map<string, Slot>
): boolean {
  let changed = false

  for (const slot of slots.values()) {
    const contributions = ordered.filter((entry) =>
      expandToLonghands(entry.prop, shorthands).includes(slot.property)
    )
    for (const barrier of barriers(site)) {
      if (barrier.index <= slot.anchor || barrier.index >= slot.last) continue

      if (barrier.clauses === null || barrier.clauses.has(slot.property)) {
        for (const entry of contributions) {
          if (entry.base || entry.index < barrier.index || !entry.from) continue
          addFlag(
            site.flags,
            'condition-order-not-preservable',
            `"${compact(barrier.source)}" can set "${slot.property}" between the values contributing to it, so "${entry.from.name}" stays authored instead of merging`
          )
          entry.from.failed = true
          changed = true
        }
      }

      if (barrier.bases === null || barrier.bases.has(slot.property)) {
        for (const entry of contributions) {
          if (!entry.base || entry.index < barrier.index) continue
          const authored = site.members.find(
            (member) =>
              member.type === 'authored' &&
              member.index === entry.index &&
              member.activated
          )
          if (authored && authored.type === 'authored') {
            authored.payload = null
            authored.blocked = {
              code: 'base-order-not-preservable',
              detail: `"${compact(barrier.source)}" can set "${slot.property}" between the values contributing to it, so this base cannot move`,
            }
            changed = true
            continue
          }
          addFlag(
            site.flags,
            'base-order-not-preservable',
            `"${compact(barrier.source)}" can set "${slot.property}" between the values contributing to it, so the merged base may win where it did not before`
          )
        }
      }
    }
  }

  return changed
}

function assemble(site: Site): {
  entries: Array<{ index: number; text: string }>
  programs: EmittedProgram[]
} {
  let slots = new Map<string, Slot>()

  // an authored base folds into a program only when the program would otherwise
  // need a second attribute of the same name; a base that cannot fold fails the
  // legacy attributes that need it, which can in turn release other bases and
  // change which merges are still in authored order
  for (;;) {
    let changed = false
    const contributed = new Set<string>()
    for (const member of site.members) {
      if (member.type !== 'legacy' || member.failed) continue
      for (const contribution of member.contributions) {
        contributed.add(activationName(contribution.prop))
      }
    }

    for (const member of site.members) {
      if (member.type !== 'authored') continue
      const name = activationName(member.prop)
      member.activated =
        (member.token && member.payload !== null) || contributed.has(name)
      if (!member.activated || member.payload !== null) continue

      // one root reason: the base a condition needs cannot become a flat payload
      const blocked = member.blocked
      addFlag(
        site.flags,
        blocked?.code ?? 'unprovable-dynamic-value',
        `a legacy condition targets "${member.prop}": ${
          blocked?.detail ??
          `its base value "${compact(member.text)}" cannot join a program`
        }`
      )
      member.activated = false
      for (const other of site.members) {
        if (other.type !== 'legacy' || other.failed) continue
        if (other.contributions.some((one) => activationName(one.prop) === name)) {
          other.failed = true
          changed = true
        }
      }
    }
    if (changed) continue

    const ordered = orderedEntries(site)
    slots = buildSlots(ordered)
    if (!resolveBarriers(site, ordered, slots)) break
  }

  const entries: Array<{ index: number; text: string }> = []
  for (const member of site.members) {
    if (member.type === 'authored' && member.activated) continue
    if (member.type === 'legacy' && !member.failed) continue
    entries.push({ index: member.index, text: member.text })
  }
  const printed = printSlots(site, slots)
  entries.push(...printed.output)
  entries.push(...site.extras)
  entries.sort((left, right) => left.index - right.index)
  return { entries, programs: printed.programs }
}

function printSlots(
  site: Site,
  slots: Map<string, Slot>
): { output: Array<{ index: number; text: string }>; programs: EmittedProgram[] } {
  const printed = new Set<string>()
  const output: Array<{ index: number; text: string }> = []
  const programs: EmittedProgram[] = []
  const outputCommentRanges: Array<{ outputIndex: number; first: number; last: number }> =
    []

  for (const [property, slot] of slots) {
    if (printed.has(property)) continue
    const serialized = printProgram(slot.value)
    const expansion = expandToLonghands(slot.sourceProp, shorthands)
    const collapses =
      expansion.length > 0 &&
      expansion.every((expanded) => {
        const candidate = slots.get(expanded)
        return (
          candidate !== undefined &&
          candidate.sourceProp === slot.sourceProp &&
          candidate.anchor === slot.anchor &&
          candidate.dynamic === slot.dynamic &&
          printProgram(candidate.value) === serialized
        )
      })
    const name = collapses ? slot.sourceProp : property
    if (collapses) for (const expanded of expansion) printed.add(expanded)
    else printed.add(property)

    const value = slot.dynamic ? `\`${serialized}\`` : JSON.stringify(serialized)
    programs.push({ name, value: serialized, dynamic: slot.dynamic })
    const propertyText =
      site.kind === 'styled'
        ? `${name}: ${value}`
        : `${name}=${slot.dynamic ? `{${value}}` : value}`
    output.push({
      index: slot.anchor,
      text: propertyText,
    })
    outputCommentRanges.push({
      outputIndex: output.length - 1,
      first: slot.anchor,
      last: slot.last,
    })
  }

  verify(
    site,
    slots,
    [...output].sort((left, right) => left.index - right.index)
  )
  if (site.kind === 'styled') {
    const commentedIndexes = new Set<number>()
    for (const range of outputCommentRanges) {
      const comments: string[] = []
      for (const [index, texts] of site.comments) {
        if (index < range.first || index > range.last || commentedIndexes.has(index)) {
          continue
        }
        comments.push(...texts)
        commentedIndexes.add(index)
      }
      if (comments.length) {
        output[range.outputIndex].text = `${comments.join('\n')}\n${
          output[range.outputIndex].text
        }`
      }
    }
  }
  return { output, programs }
}

/**
 * Every `${...}` hole replaced by one opaque word, so a printed program can be
 * re-parsed as a program. Brace matching, not a regex: an interpolated expression
 * can hold braces of its own (`${`accent${n}`}`).
 */
export function sanitize(text: string): string {
  let result = ''
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== '$' || text[index + 1] !== '{') {
      result += text[index]
      continue
    }
    let depth = 0
    let end = index + 1
    for (; end < text.length; end++) {
      if (text[end] === '{') depth++
      else if (text[end] === '}' && --depth === 0) break
    }
    result += 'zz'
    index = end
  }
  return result
}

/**
 * The printed props are parsed back with the real value parser and merged with the
 * real clause merge. Anything the printer got wrong — a lost clause, a bad unit, an
 * unregistered modifier, a collapse that does not expand back — shows up here
 * instead of in an app.
 */
function verify(
  site: Site,
  slots: Map<string, Slot>,
  output: Array<{ index: number; text: string }>
): void {
  const separator = site.kind === 'styled' ? ': ' : '='
  const reparsed = new Map<string, ParsedValue>()

  for (const entry of output) {
    const split = entry.text.indexOf(separator)
    const prop = entry.text.slice(0, split)
    let raw = entry.text.slice(split + separator.length)
    if (raw.startsWith('{')) raw = raw.slice(1, -1)
    const text = sanitize(raw.slice(1, -1))
    const parsed = parseValue(text, site.registry)
    if (!parsed.ok) {
      addFlag(
        site.flags,
        'emitted-value-invalid',
        `"${prop}=${text}" does not parse: ${parsed.errors.map((error) => error.message).join('; ')}`
      )
      return
    }
    for (const property of expandToLonghands(prop, shorthands)) {
      const previous = reparsed.get(property)
      reparsed.set(
        property,
        previous ? mergeProgramValues(previous, parsed.value) : parsed.value
      )
    }
  }

  for (const [property, slot] of slots) {
    const actual = reparsed.get(property)
    const expected = sanitize(printProgram(slot.value))
    if (actual === undefined || sanitize(printProgram(actual)) !== expected) {
      addFlag(
        site.flags,
        'emitted-program-mismatch',
        `"${property}" reads back as "${actual ? sanitize(printProgram(actual)) : '(missing)'}" instead of "${expected}"`
      )
    }
  }
}

// —— JSX and styled walkers ——————————————————————————————————————————————

function propertyName(node: Node): string | null {
  if (
    Node.isIdentifier(node) ||
    Node.isStringLiteral(node) ||
    Node.isNumericLiteral(node)
  ) {
    return node.getText().replace(/^['"]|['"]$/g, '')
  }
  return null
}

function jsxAttributeName(attribute: JsxAttribute): string | null {
  const name = attribute.getNameNode()
  return Node.isIdentifier(name) ? name.getText() : null
}

function jsxLiteralString(attribute: JsxAttribute): string | null {
  const initializer = attribute.getInitializer()
  if (Node.isStringLiteral(initializer)) return initializer.getLiteralValue()
  const expression = jsxExpression(attribute)
  if (
    expression &&
    (Node.isStringLiteral(expression) || Node.isNoSubstitutionTemplateLiteral(expression))
  ) {
    return expression.getLiteralValue()
  }
  return null
}

function jsxExpression(attribute: JsxAttribute): Expression | null {
  const initializer = attribute.getInitializer()
  if (!Node.isJsxExpression(initializer)) return null
  const expression = initializer.getExpression()
  return expression ? unwrapExpression(expression) : null
}

type JsxElementWithAttributes = JsxOpeningElement | JsxSelfClosingElement

function isConvertedJsxAttribute(attribute: Node): boolean {
  if (Node.isJsxSpreadAttribute(attribute)) return true
  if (!Node.isJsxAttribute(attribute)) return false
  const name = jsxAttributeName(attribute)
  return (
    !!name && (name === 'group' || styleProps.has(name) || isLegacyConditionName(name))
  )
}

function rewriteJsxSite(
  opening: JsxElementWithAttributes,
  entries: Array<{ index: number; text: string }>
): void {
  const attributes = opening.getAttributes()
  const rendered: string[] = []
  let inserted = false
  for (const attribute of attributes) {
    if (isConvertedJsxAttribute(attribute)) {
      if (!inserted) {
        rendered.push(...entries.map((entry) => entry.text))
        inserted = true
      }
    } else {
      rendered.push(attribute.getText())
    }
  }

  const source = opening.getText()
  const start = opening.getStart()
  const first = attributes[0]
  const last = attributes[attributes.length - 1]
  const prefix = source.slice(0, first.getStart() - start)
  const suffix = source.slice(last.getEnd() - start)
  opening.replaceWithText(`${prefix}${rendered.join(' ')}${suffix}`)
}

/**
 * V3 separates the group from the query container, so a legacy group condition
 * carrying a container size (`$group-card-sm-hover`) needs the element that
 * declares the group to declare the container too. `declaration` is the node that
 * declares `group`; the plan decided which declarations a container belongs on.
 */
function containerExtras(site: Site, declaration: Node, index: number): void {
  const target = site.containers.targets.get(declaration)
  if (target === undefined) return
  const name = target.named && target.group !== '' ? target.group : null
  const text =
    site.kind === 'styled'
      ? name === null
        ? 'container: true'
        : `container: true, containerName: ${JSON.stringify(name)}`
      : name === null
        ? 'container'
        : `container containerName=${JSON.stringify(name)}`
  // adding the container is itself a migration edit, so this element is a site even
  // when it has no other v1 syntax
  site.legacy = true
  site.extras.push({ index, text })
  if (target.flag !== null) addFlag(site.flags, target.flag.code, target.flag.detail)
  addNote(
    site,
    `a descendant uses a legacy container-size condition on this group, so it declares a query container`
  )
}

export function convertJsxSite(
  opening: JsxElementWithAttributes,
  registry: ModifierRegistryView,
  containers: ContainerPlan,
  targets: ConversionTargets,
  host: HostView | undefined,
  write = false
): SiteReport | null {
  const site = createSite('jsx', registry, containers, targets, host)
  const before: string[] = []

  for (const attribute of opening.getAttributes()) {
    if (Node.isJsxSpreadAttribute(attribute)) {
      const expression = unwrapExpression(attribute.getExpression())
      // spreading an object literal is the same thing as writing its properties
      if (Node.isObjectLiteralExpression(expression)) {
        before.push(compact(attribute.getText()))
        for (const property of expression.getProperties()) {
          if (Node.isPropertyAssignment(property)) {
            const name = propertyName(property.getNameNode())
            if (name !== null) {
              // a member the conversion leaves authored has to print as the JSX
              // attribute it becomes here, not as the object member it was
              if (
                name === 'group' ||
                styleProps.has(name) ||
                isLegacyConditionName(name)
              ) {
                pushStyledProperty(
                  site,
                  name,
                  property,
                  `${name}={${property.getInitializerOrThrow().getText()}}`
                )
              } else {
                site.members.push({
                  type: 'passthrough',
                  index: site.index++,
                  text: `${name}={${property.getInitializerOrThrow().getText()}}`,
                })
              }
              continue
            }
          }
          // a nested spread or a member whose key is not statically known can set
          // anything, so it stays where it was authored and orders the merge
          site.members.push({
            type: 'spread',
            index: site.index++,
            text: Node.isSpreadAssignment(property)
              ? `{${property.getText()}}`
              : `{...{ ${property.getText()} }}`,
          })
        }
        continue
      }
      before.push(compact(attribute.getText()))
      site.members.push({
        type: 'spread',
        index: site.index++,
        text: attribute.getText(),
      })
      continue
    }

    const name = jsxAttributeName(attribute)
    if (!name) continue
    const text = compact(attribute.getText())

    if (name === 'group') {
      before.push(text)
      containerExtras(site, attribute, site.index)
      site.members.push({ type: 'passthrough', index: site.index++, text })
      continue
    }

    if (isLegacyConditionName(name)) {
      before.push(text)
      pushLegacy(site, name, text, jsxExpression(attribute), attribute)
      continue
    }
    if (!styleProps.has(name)) continue
    before.push(text)

    const literal = jsxLiteralString(attribute)
    pushBase(
      site,
      name,
      text,
      literal === null ? jsxExpression(attribute) : null,
      literal
    )
  }

  if (!site.legacy) return null

  const { entries, programs } = assemble(site)
  const sourceFile = opening.getSourceFile()
  const report: SiteReport = {
    kind: 'jsx',
    label: `<${opening.getTagNameNode().getText()}>`,
    line: sourceFile.getLineAndColumnAtPos(opening.getStart()).line,
    before: before.join(' '),
    after: entries.map((entry) => entry.text).join(' ') || '(no style props left)',
    programs,
    assessments: site.assessments,
    assessmentVerdict: assessmentVerdict(site.assessments),
    warnings: site.warnings,
    flags: site.flags,
    inventory: site.inventory,
    pending: site.pending,
    notes: site.notes,
    legacyLeft: site.members.filter((member) => member.type === 'legacy' && member.failed)
      .length,
  }
  if (
    write &&
    !site.flags.some(
      (flag) =>
        flag.code === 'emitted-program-mismatch' || flag.code === 'emitted-value-invalid'
    )
  ) {
    rewriteJsxSite(opening, entries)
  }
  return report
}

function pushStyledProperty(
  site: Site,
  name: string,
  property: PropertyAssignment,
  authoredText?: string
): void {
  const comments = allCommentTexts(property)
  if (comments.length) site.comments.set(site.index, comments)
  const text = authoredText ?? textWithOuterComments(property)
  const initializer = unwrapExpression(property.getInitializerOrThrow())

  if (name === 'group') {
    containerExtras(site, property, site.index)
    site.members.push({ type: 'passthrough', index: site.index++, text })
    return
  }

  if (isLegacyConditionName(name)) {
    pushLegacy(site, name, text, initializer, property)
    return
  }
  if (!styleProps.has(name)) return

  const literal =
    Node.isStringLiteral(initializer) || Node.isNoSubstitutionTemplateLiteral(initializer)
      ? initializer.getLiteralValue()
      : null
  pushBase(site, name, text, literal === null ? initializer : null, literal)
}

export function convertStyleObject(
  object: ObjectLiteralExpression,
  kind: SiteKind,
  label: string,
  registry: ModifierRegistryView,
  containers: ContainerPlan,
  targets: ConversionTargets,
  host: HostView | undefined,
  write = false
): SiteReport | null {
  const site = createSite(kind, registry, containers, targets, host)
  const before: string[] = []

  for (const property of object.getProperties()) {
    if (Node.isSpreadAssignment(property)) {
      const expression = unwrapExpression(property.getExpression())
      before.push(compact(property.getText()))
      if (Node.isObjectLiteralExpression(expression)) {
        for (const nested of expression.getProperties()) {
          if (Node.isPropertyAssignment(nested)) {
            const name = propertyName(nested.getNameNode())
            if (name !== null) {
              if (
                name === 'group' ||
                styleProps.has(name) ||
                isLegacyConditionName(name)
              ) {
                pushStyledProperty(site, name, nested)
              } else {
                site.members.push({
                  type: 'passthrough',
                  index: site.index++,
                  text: compact(nested.getText()),
                })
              }
              continue
            }
          }
          // a nested spread or a member whose key is not statically known can set
          // anything, so it stays where it was authored and orders the merge
          site.members.push({
            type: 'spread',
            index: site.index++,
            text: compact(nested.getText()),
          })
        }
        continue
      }
      site.members.push({
        type: 'spread',
        index: site.index++,
        text: compact(property.getText()),
      })
      continue
    }
    if (!Node.isPropertyAssignment(property)) continue

    const nameNode = property.getNameNode()
    if (Node.isComputedPropertyName(nameNode)) {
      addFlag(
        site.flags,
        'computed-property',
        `"${compact(nameNode.getText())}" hides the affected style property`
      )
      continue
    }
    const name = propertyName(nameNode)
    if (name === null) continue
    if (!styleProps.has(name) && !isLegacyConditionName(name) && name !== 'group')
      continue
    before.push(compact(property.getText()))
    pushStyledProperty(site, name, property)
  }

  if (!site.legacy) return null

  const { entries, programs } = assemble(site)
  const sourceFile = object.getSourceFile()
  const report: SiteReport = {
    kind,
    label,
    line: sourceFile.getLineAndColumnAtPos(object.getStart()).line,
    before: before.join(', '),
    after: entries.map((entry) => entry.text).join(', ') || '(no style props left)',
    programs,
    assessments: site.assessments,
    assessmentVerdict: assessmentVerdict(site.assessments),
    warnings: site.warnings,
    flags: site.flags,
    inventory: site.inventory,
    pending: site.pending,
    notes: site.notes,
    legacyLeft: site.members.filter((member) => member.type === 'legacy' && member.failed)
      .length,
  }
  if (
    write &&
    !site.flags.some(
      (flag) =>
        flag.code === 'emitted-program-mismatch' || flag.code === 'emitted-value-invalid'
    )
  ) {
    rewriteStyleObject(object, entries)
  }
  return report
}

function isConvertedStyledProperty(property: Node): boolean {
  if (Node.isSpreadAssignment(property)) return true
  if (!Node.isPropertyAssignment(property)) return false
  const nameNode = property.getNameNode()
  if (Node.isComputedPropertyName(nameNode)) return false
  const name = propertyName(nameNode)
  return (
    !!name && (name === 'group' || styleProps.has(name) || isLegacyConditionName(name))
  )
}

function allCommentTexts(node: Node): string[] {
  const comments = new Map<number, string>()
  for (const current of [node, ...node.getDescendants()]) {
    for (const range of [
      ...current.getLeadingCommentRanges(),
      ...current.getTrailingCommentRanges(),
    ]) {
      comments.set(range.getPos(), range.getText())
    }
  }
  return [...comments.entries()]
    .sort((left, right) => left[0] - right[0])
    .map((entry) => entry[1])
}

function textWithOuterComments(node: Node): string {
  const comments = new Map<number, string>()
  for (const range of [
    ...node.getLeadingCommentRanges(),
    ...node.getTrailingCommentRanges(),
  ]) {
    comments.set(range.getPos(), range.getText())
  }
  const prefix = [...comments.entries()]
    .sort((left, right) => left[0] - right[0])
    .map((entry) => entry[1])
  return [...prefix, node.getText()].join('\n')
}

function rewriteStyleObject(
  object: ObjectLiteralExpression,
  entries: Array<{ index: number; text: string }>
): void {
  const rendered: string[] = []
  let inserted = false
  for (const property of object.getProperties()) {
    if (isConvertedStyledProperty(property)) {
      if (!inserted) {
        rendered.push(...entries.map((entry) => entry.text))
        inserted = true
      }
    } else {
      rendered.push(textWithOuterComments(property))
    }
  }
  if (rendered.length === 0) {
    object.replaceWithText('{}')
    return
  }

  // Indent one level and no more. replaceWithText re-indents what it is given by
  // the node's own depth, so the text here is RELATIVE: ts-morph supplies the
  // object's base indentation and this supplies the step inside it.
  //
  // Emitting the absolute indentation instead doubles it on every nested object,
  // which is how variant branches ended up six columns too deep. Emitting none,
  // as this did originally, flattens a top-level styled() config to column zero,
  // because a node at statement depth has no indentation for ts-morph to add.
  object.replaceWithText(`{\n${rendered.map((text) => `  ${text}`).join(',\n')}\n}`)
}
