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
import {
  compact,
  literalTree,
  numericValue,
  runtimeType,
  staticLeafValue,
  stripTokenPrefixes,
  unwrapExpression,
} from './expressions'
import {
  convertLegacyConditionProp,
  expandToLonghands,
  mergeProgramValues,
  parseValue,
  printProgram,
  resolveProp,
  sharedPayload,
  shorthands,
  styleProps,
  unitSuffix,
  type ModifierRegistryView,
  type ParsedClause,
  type ParsedValue,
} from './grammar'
import { isLegacyConditionName, resolveLegacyName } from './legacyNames'

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

export interface SiteReport {
  kind: SiteKind
  label: string
  line: number
  before: string
  after: string
  programs: EmittedProgram[]
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
  /** the authored value still spells a `$token`, so it waits for the cutover */
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
  /** group names whose descendants use a legacy container-size condition */
  containerGroups: ReadonlySet<string>
  members: Member[]
  extras: Array<{ index: number; text: string }>
  flags: Flag[]
  inventory: Flag[]
  pending: Flag[]
  notes: string[]
  /** the site contains v1-only syntax, so it is a conversion site at all */
  legacy: boolean
  index: number
}

function createSite(
  kind: SiteKind,
  registry: ModifierRegistryView,
  containerGroups: ReadonlySet<string>
): Site {
  return {
    kind,
    registry,
    containerGroups,
    members: [],
    extras: [],
    flags: [],
    inventory: [],
    pending: [],
    notes: [],
    legacy: false,
    index: 0,
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

  if (resolveProp(prop) === 'transition') {
    const flag: Flag = {
      code: 'legacy-transition-value',
      detail: `transition value "${source}" uses the v1 animation config shape; the flat transition migration is still open in the plan`,
    }
    return { ...empty, inventory: flag, blocked: flag }
  }

  if (Node.isObjectLiteralExpression(current) || Node.isArrayLiteralExpression(current)) {
    const flag: Flag = {
      code: 'structured-native-value',
      detail: `${prop} value "${source}" is a structured React Native value with no flat spelling yet`,
    }
    return { ...empty, inventory: flag, blocked: flag }
  }

  const tree = literalTree(current)
  if (tree && tree.error) {
    const flag: Flag = { code: 'legacy-token-name', detail: `${prop}: ${tree.error}` }
    return { ...empty, problem: flag, blocked: flag }
  }
  if (tree && tree.kind !== 'nullish') {
    return {
      ...empty,
      payload: interpolate(prop, tree.text, tree.kind, registry),
      text: tree.text === source ? null : tree.text,
      dynamic: true,
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
    if (literalString.includes('$')) {
      site.legacy = true
      const stripped = stripTokenPrefixes(literalString)
      const problem: Flag | null = stripped.errors.length
        ? {
            code: 'legacy-token-dot-path',
            detail: `${prop}: legacy token ${stripped.errors
              .map((token) => `"${token}"`)
              .join(
                ', '
              )} uses dot-path naming; rename it to one configured flat token name before conversion`,
          }
        : !stripped.converted
          ? {
              code: 'legacy-token-name',
              detail: `${prop} value ${JSON.stringify(literalString)} spells "$" where V3 expects a token name`,
            }
          : !reparsesAsBase(stripped.text, site.registry)
            ? {
                code: 'value-reparses-as-program',
                detail: `${prop} value ${JSON.stringify(stripped.text)} does not read back as one flat base value`,
              }
            : null

      if (problem !== null) addFlag(site.flags, problem.code, problem.detail)
      // a token base only loses its `$` when it joins a program that has clauses:
      // that is the exact condition under which the value reaches the flat engine
      // and resolves config-first (contributePrograms bails when a value has no
      // clauses, and the legacy resolver only resolves `$`-prefixed strings)
      site.members.push({
        type: 'authored',
        index,
        prop,
        text,
        payload: problem === null ? stripped.text : null,
        dynamic: false,
        blocked: problem,
        token: true,
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
  if (classified.inventory) {
    addFlag(site.inventory, classified.inventory.code, classified.inventory.detail)
  }
  // a rewritten expression (`active ? '$red10' : '$blue10'`) is a token strip too, so
  // it also waits until the value joins a clause-bearing program
  if (classified.text !== null) site.legacy = true
  site.members.push({
    type: 'authored',
    index,
    prop,
    text,
    payload: classified.payload,
    dynamic: classified.dynamic,
    blocked: classified.blocked,
    token: classified.text !== null,
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

/** every longhand a legacy condition object sets, at any condition depth */
function conditionProperties(
  value: Record<string, unknown>,
  registry: ModifierRegistryView
): Set<string> {
  const properties = new Set<string>()
  const visit = (object: Record<string, unknown>): void => {
    for (const key in object) {
      const child = object[key]
      if (
        child !== null &&
        typeof child === 'object' &&
        isLegacyConditionName(key) &&
        resolveLegacyName(key, registry).ok
      ) {
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
  initializer: Expression | null
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
  const properties = conditionProperties(evaluated.value, site.registry)

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
      })
    }
  }
  return ordered
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
      member.activated = contributed.has(name)
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

  for (const member of site.members) {
    if (member.type !== 'authored' || member.activated || !member.token) continue
    addFlag(
      site.pending,
      'clause-free-token',
      `${compact(member.text)} still needs its "$": the value has no clauses, so it never reaches the flat engine`
    )
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
    output.push({
      index: slot.anchor,
      text:
        site.kind === 'styled'
          ? `${name}: ${value}`
          : `${name}=${slot.dynamic ? `{${value}}` : value}`,
    })
  }

  verify(
    site,
    slots,
    [...output].sort((left, right) => left.index - right.index)
  )
  return { output, programs }
}

const interpolation = /\$\{[\s\S]*?\}/g

function sanitize(text: string): string {
  return text.replace(interpolation, 'zz')
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

/**
 * V3 separates the group from the query container, so a legacy group condition
 * carrying a container size (`$group-card-sm-hover`) needs the element that
 * declares the group to declare the container too. `group` is the group name, or
 * the empty string for the unnamed nearest group.
 */
function containerExtras(site: Site, group: string, index: number): void {
  if (!site.containerGroups.has(group)) return
  const text =
    site.kind === 'styled'
      ? group === ''
        ? 'container: true'
        : `container: true, containerName: ${JSON.stringify(group)}`
      : group === ''
        ? 'container'
        : `container containerName=${JSON.stringify(group)}`
  // adding the container is itself a migration edit, so this element is a site even
  // when it has no other v1 syntax
  site.legacy = true
  site.extras.push({ index, text })
  if (group !== '') {
    addFlag(
      site.pending,
      'container-name-not-wired',
      `the "@…/${group}" query this migration emits needs containerName to reach the host, which core does not do yet`
    )
  }
  addNote(
    site,
    `a descendant uses a legacy container-size condition on this group, so it declares a query container`
  )
}

export function convertJsxSite(
  opening: JsxElementWithAttributes,
  registry: ModifierRegistryView,
  containerGroups: ReadonlySet<string>
): SiteReport | null {
  const site = createSite('jsx', registry, containerGroups)
  const before: string[] = []

  for (const attribute of opening.getAttributes()) {
    if (Node.isJsxSpreadAttribute(attribute)) {
      const expression = unwrapExpression(attribute.getExpression())
      // spreading an object literal is the same thing as writing its properties
      if (Node.isObjectLiteralExpression(expression)) {
        before.push(compact(attribute.getText()))
        for (const property of expression.getProperties()) {
          if (!Node.isPropertyAssignment(property)) continue
          const name = propertyName(property.getNameNode())
          if (name === null) continue
          pushStyledProperty(site, name, property)
        }
        continue
      }
      before.push(compact(attribute.getText()))
      site.members.push({
        type: 'spread',
        index: site.index++,
        text: compact(attribute.getText()),
      })
      continue
    }

    const name = jsxAttributeName(attribute)
    if (!name) continue
    const text = compact(attribute.getText())

    if (name === 'group') {
      before.push(text)
      const declared = attribute.getInitializer() ? jsxLiteralString(attribute) : ''
      if (declared !== null) containerExtras(site, declared, site.index)
      site.members.push({ type: 'passthrough', index: site.index++, text })
      continue
    }

    if (isLegacyConditionName(name)) {
      before.push(text)
      pushLegacy(site, name, text, jsxExpression(attribute))
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
  return {
    kind: 'jsx',
    label: `<${opening.getTagNameNode().getText()}>`,
    line: sourceFile.getLineAndColumnAtPos(opening.getStart()).line,
    before: before.join(' '),
    after: entries.map((entry) => entry.text).join(' ') || '(no style props left)',
    programs,
    flags: site.flags,
    inventory: site.inventory,
    pending: site.pending,
    notes: site.notes,
    legacyLeft: site.members.filter((member) => member.type === 'legacy' && member.failed)
      .length,
  }
}

function pushStyledProperty(
  site: Site,
  name: string,
  property: PropertyAssignment
): void {
  const text = compact(property.getText())
  const initializer = unwrapExpression(property.getInitializerOrThrow())

  if (name === 'group') {
    const declared =
      Node.isStringLiteral(initializer) ||
      Node.isNoSubstitutionTemplateLiteral(initializer)
        ? initializer.getLiteralValue()
        : initializer.getKind() === SyntaxKind.TrueKeyword
          ? ''
          : null
    if (declared !== null) containerExtras(site, declared, site.index)
    site.members.push({ type: 'passthrough', index: site.index++, text })
    return
  }

  if (isLegacyConditionName(name)) {
    pushLegacy(site, name, text, initializer)
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
  containerGroups: ReadonlySet<string>
): SiteReport | null {
  const site = createSite(kind, registry, containerGroups)
  const before: string[] = []

  for (const property of object.getProperties()) {
    if (Node.isSpreadAssignment(property)) {
      const expression = unwrapExpression(property.getExpression())
      before.push(compact(property.getText()))
      if (Node.isObjectLiteralExpression(expression)) {
        for (const nested of expression.getProperties()) {
          if (!Node.isPropertyAssignment(nested)) continue
          const name = propertyName(nested.getNameNode())
          if (name === null) continue
          pushStyledProperty(site, name, nested)
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
  return {
    kind,
    label,
    line: sourceFile.getLineAndColumnAtPos(object.getStart()).line,
    before: before.join(', '),
    after: entries.map((entry) => entry.text).join(', ') || '(no style props left)',
    programs,
    flags: site.flags,
    inventory: site.inventory,
    pending: site.pending,
    notes: site.notes,
    legacyLeft: site.members.filter((member) => member.type === 'legacy' && member.failed)
      .length,
  }
}
