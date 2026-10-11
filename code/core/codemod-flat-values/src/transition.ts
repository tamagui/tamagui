// v2 `transition` values that v3 removed: the `['preset', {...}]` array, the
// `default` preset selector, a per-property `type` naming a preset, and spring
// physics written directly on the transition object.
//
// The migration itself lives in the grammar package, so the codemod and the
// runtime agree on what a v2 value meant. This file only decides whether a
// value is v2 at all, reads it out of the syntax tree, and prints the result.

import { Node, SyntaxKind, type Expression, type SourceFile } from 'ts-morph'
import {
  migrateLegacyTransition,
  printMigratedTransition,
  TRANSITION_RESERVED_KEYS,
  type LegacyTransitionValue,
} from '@tamagui/style-grammar/tooling'
import type { Flag } from './convert'
import { staticLeafValue, unwrapExpression } from './expressions'
import type { createProvenance } from './provenance'

/** spring physics v2 accepted inline, which v3 spells under `spring` */
const legacySpringKeys = new Set([
  'stiffness',
  'damping',
  'mass',
  'velocity',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
  'tension',
  'friction',
  'bounciness',
  'speed',
])

const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$-]*$/

/**
 * the expression as a plain value, or null when any part of it is computed.
 * a transition is small and always authored inline, so a value that is not
 * fully static is left exactly as written rather than half-migrated.
 */
function staticValue(expression: Expression): { value: unknown } | null {
  const current = unwrapExpression(expression)

  const leaf = staticLeafValue(current)
  if (leaf) return { value: leaf.value }

  if (Node.isArrayLiteralExpression(current)) {
    const values: unknown[] = []
    for (const element of current.getElements()) {
      const item = staticValue(element)
      if (!item) return null
      values.push(item.value)
    }
    return { value: values }
  }

  if (Node.isObjectLiteralExpression(current)) {
    const value: Record<string, unknown> = {}
    for (const property of current.getProperties()) {
      if (!Node.isPropertyAssignment(property)) return null
      const nameNode = property.getNameNode()
      if (Node.isComputedPropertyName(nameNode)) return null
      const name = Node.isIdentifier(nameNode)
        ? nameNode.getText()
        : Node.isStringLiteral(nameNode)
          ? nameNode.getLiteralValue()
          : null
      if (name === null) return null
      const item = staticValue(property.getInitializerOrThrow())
      if (!item) return null
      value[name] = item.value
    }
    return { value }
  }

  return null
}

/** the `animateOnly` list, or null when the value is not a static string array */
function animateOnlyList(expression: Expression): readonly string[] | null {
  const evaluated = staticValue(expression)
  if (!evaluated || !Array.isArray(evaluated.value)) return null
  const list: string[] = []
  for (const item of evaluated.value) {
    if (typeof item !== 'string') return null
    list.push(item)
  }
  return list
}

/** is this the v2 spelling, so migrating it changes the meaning of the source */
function isLegacyTransition(value: unknown): boolean {
  if (Array.isArray(value)) return true
  if (!value || typeof value !== 'object') return false

  const object = value as Record<string, unknown>
  if (object.default !== undefined) return true
  for (const key in object) {
    if (legacySpringKeys.has(key)) return true
    if (TRANSITION_RESERVED_KEYS.has(key)) continue
    const entry = object[key]
    if (!entry || typeof entry !== 'object') continue
    const config = entry as Record<string, unknown>
    if (config.type !== undefined) return true
    for (const nested in config) {
      if (legacySpringKeys.has(nested)) return true
    }
  }
  return false
}

/**
 * every identifier-shaped string in the value. v2 read a bare identifier there
 * as the name of a configured animation, and the codemod has no config, so it
 * takes the authored spelling at its word.
 */
function presetNamesIn(value: unknown, names: Set<string>): void {
  if (typeof value === 'string') {
    if (identifierPattern.test(value)) names.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) presetNamesIn(item, names)
    return
  }
  if (!value || typeof value !== 'object') return
  for (const key in value as Record<string, unknown>) {
    presetNamesIn((value as Record<string, unknown>)[key], names)
  }
}

interface TransitionMigration {
  /** the migrated value as source, ready to print inside `{...}` */
  text: string | null
  /** true when the value is a bare string, which a jsx attribute quotes */
  isString: boolean
  /** why a v2 value could not be migrated, for the report */
  error: string | null
}

/**
 * migrates one `transition` value.
 *
 * returns null when the value is already the v3 spelling or is not statically
 * known, both of which mean the site is left exactly as authored.
 */
function migrateTransitionValue(
  expression: Expression | null,
  animateOnly: readonly string[] | undefined
): TransitionMigration | null {
  if (expression === null) return null

  const evaluated = staticValue(expression)
  if (!evaluated) {
    // a computed value is only a finding when the syntax around it is v2
    if (animateOnly) {
      return {
        text: null,
        isString: false,
        error:
          'the removed `animateOnly` narrows a computed transition, so it needs a hand migration to `properties`',
      }
    }
    return Node.isArrayLiteralExpression(unwrapExpression(expression))
      ? {
          text: null,
          isString: false,
          error:
            'the v2 transition array form holds a computed value, so it needs a hand migration to `{ preset }`',
        }
      : null
  }
  if (!animateOnly && !isLegacyTransition(evaluated.value)) return null

  const names = new Set<string>()
  presetNamesIn(evaluated.value, names)

  const migrated = migrateLegacyTransition(
    evaluated.value as LegacyTransitionValue,
    names,
    animateOnly
  )
  if (!migrated.ok) {
    return {
      text: null,
      isString: false,
      error: migrated.diagnostics.map((one) => one.message).join('; '),
    }
  }
  return {
    text: printMigratedTransition(migrated.value),
    isString: typeof migrated.value === 'string',
    error: null,
  }
}

export interface TransitionReport {
  label: string
  line: number
  before: string
  after: string
  flags: Flag[]
}

/**
 * rewrites every v2 `transition` value in the file.
 *
 * this is its own pass rather than part of a style site, because it respells
 * one value and nothing else. routing it through site assembly would pull the
 * whole element's already-migrated props back through the program printer for
 * no reason.
 */
export function convertTransitions(
  sourceFile: SourceFile,
  provenance: ReturnType<typeof createProvenance>,
  write: boolean
): TransitionReport[] {
  const found: Array<{
    label: string
    node: Node
    value: Expression | null
    /** the removed `animateOnly` sitting next to it, to fold in and delete */
    animateOnly: readonly string[] | undefined
    animateOnlyNode: Node | null
    /** set when the site cannot be migrated at all, so it only reports */
    blocked: string | null
    replace: (text: string) => void
  }> = []

  /** the `animateOnly` next to a transition, and how to read its list */
  const readAnimateOnly = (
    node: Node | null
  ): { list: readonly string[] | undefined } => {
    if (!node) return { list: undefined }
    const initializer = Node.isJsxAttribute(node)
      ? node.getInitializer()
      : Node.isPropertyAssignment(node)
        ? node.getInitializer()
        : undefined
    const expression =
      initializer && Node.isJsxExpression(initializer)
        ? initializer.getExpression()
        : (initializer as Expression | undefined)
    return { list: (expression && animateOnlyList(expression)) ?? undefined }
  }

  for (const opening of [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
  ]) {
    if (!provenance.isTamaguiElement(opening)) continue

    type Attribute = ReturnType<typeof opening.getAttributes>[number]
    let transitionNode: Attribute | null = null
    let animateOnlyNode: Attribute | null = null
    for (const attribute of opening.getAttributes()) {
      if (!Node.isJsxAttribute(attribute)) continue
      const name = attribute.getNameNode().getText()
      if (name === 'transition') transitionNode = attribute
      else if (name === 'animateOnly') animateOnlyNode = attribute
    }

    // `transition="quick"` is a string literal initializer; `transition={...}`
    // wraps its value in a JsxExpression. both carry a value to migrate.
    const initializer = transitionNode?.getInitializer()
    const expression = Node.isJsxExpression(initializer)
      ? (initializer.getExpression() ?? null)
      : Node.isStringLiteral(initializer)
        ? initializer
        : null

    const { list: animateOnly } = readAnimateOnly(animateOnlyNode)
    const tag = opening.getTagNameNode().getText()

    if (animateOnlyNode && (!transitionNode || !animateOnly)) {
      // an `animateOnly` with no transition to fold into, or a computed list:
      // both need a person, so report rather than guess at a property list
      found.push({
        label: `<${tag} animateOnly>`,
        node: animateOnlyNode,
        value: null,
        animateOnly: undefined,
        animateOnlyNode: null,
        blocked: transitionNode
          ? 'the removed `animateOnly` holds a computed list; spell it as `properties` inside the transition'
          : 'the removed `animateOnly` has no `transition` next to it; spell it as `properties` wherever the transition is authored',
        replace: () => {},
      })
      continue
    }
    if (!transitionNode) continue

    found.push({
      label: `<${tag} transition>`,
      node: transitionNode,
      value: expression,
      animateOnly,
      animateOnlyNode,
      blocked: null,
      replace: (text) =>
        transitionNode!.replaceWithText(
          text.startsWith('"') ? `transition=${text}` : `transition={${text}}`
        ),
    })
  }

  for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (!provenance.isTamaguiStyledCall(call)) continue
    for (const literal of call.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)) {
      let transitionNode: ReturnType<typeof literal.getProperty> | undefined
      let animateOnlyNode: typeof transitionNode
      for (const property of literal.getProperties()) {
        if (!Node.isPropertyAssignment(property)) continue
        const nameNode = property.getNameNode()
        const name = Node.isIdentifier(nameNode)
          ? nameNode.getText()
          : Node.isStringLiteral(nameNode)
            ? nameNode.getLiteralValue()
            : null
        if (name === 'transition') transitionNode = property
        else if (name === 'animateOnly') animateOnlyNode = property
      }

      const { list: animateOnly } = readAnimateOnly(animateOnlyNode ?? null)

      if (animateOnlyNode && (!transitionNode || !animateOnly)) {
        found.push({
          label: `styled(…) animateOnly`,
          node: animateOnlyNode,
          value: null,
          animateOnly: undefined,
          animateOnlyNode: null,
          blocked: transitionNode
            ? 'the removed `animateOnly` holds a computed list; spell it as `properties` inside the transition'
            : 'the removed `animateOnly` has no `transition` next to it; spell it as `properties` wherever the transition is authored',
          replace: () => {},
        })
        continue
      }
      if (!transitionNode || !Node.isPropertyAssignment(transitionNode)) continue

      const assignment = transitionNode
      found.push({
        label: `styled(…) transition`,
        node: assignment,
        value: assignment.getInitializerOrThrow(),
        animateOnly,
        animateOnlyNode: animateOnlyNode ?? null,
        blocked: null,
        replace: (text) => assignment.replaceWithText(`transition: ${text}`),
      })
    }
  }

  const reports: TransitionReport[] = []
  // one edit list, applied strictly back to front so every earlier node's
  // position stays valid. an `animateOnly` whose list folded into a transition
  // is its own edit and takes its turn in that same order.
  const edits: Array<{ start: number; apply: () => void }> = []

  for (const candidate of found) {
    const migrated = candidate.blocked
      ? { text: null, isString: false, error: candidate.blocked }
      : migrateTransitionValue(candidate.value, candidate.animateOnly)
    if (migrated === null) continue
    const report: TransitionReport = {
      label: candidate.label,
      line: candidate.node.getStartLineNumber(),
      before: candidate.node.getText(),
      after: candidate.node.getText(),
      flags: [],
    }
    if (migrated.text === null) {
      report.flags.push({
        code: 'unsupported-legacy-value',
        detail: migrated.error ?? '',
      })
    } else {
      // a bare string reads as an ordinary jsx attribute, not an expression
      const text =
        migrated.isString && Node.isJsxAttribute(candidate.node)
          ? `"${migrated.text.slice(1, -1).replace(/"/g, '&quot;')}"`
          : migrated.text
      report.after = Node.isJsxAttribute(candidate.node)
        ? migrated.isString
          ? `transition=${text}`
          : `transition={${text}}`
        : `transition: ${text}`
      edits.push({
        start: candidate.node.getStart(),
        apply: () => candidate.replace(text),
      })
      const removed = candidate.animateOnlyNode
      if (removed) {
        edits.push({
          start: removed.getStart(),
          apply: () => {
            if (Node.isJsxAttribute(removed)) removed.remove()
            else if (Node.isPropertyAssignment(removed)) removed.remove()
          },
        })
      }
    }
    reports.push(report)
  }

  if (write) {
    edits.sort((left, right) => right.start - left.start)
    for (const edit of edits) edit.apply()
  }

  reports.sort((left, right) => left.line - right.line)
  return reports
}
