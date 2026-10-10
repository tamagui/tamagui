// V3 splits the group from the query container, so a legacy group condition that
// carries a container size (`$group-card-maxMd`) needs the element declaring the
// group to declare a query container too.
//
// Which element that is has to be proven, never inferred. Declaring a container
// changes containment and layout, so adding one to a `group="card"` in an
// unrelated tree is a behavior change with no v1 counterpart. Only two answers
// are allowed: the ancestor is visible in this file's JSX, or the site is flagged
// for a human.

import {
  Node,
  SyntaxKind,
  type JsxAttribute,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type PropertyAssignment,
  type SourceFile,
} from 'ts-morph'
import type { Flag } from './convert'
import type { ModifierRegistryView } from './grammar'
import { isLegacyConditionName, resolveLegacyName } from './legacyNames'

/** the element or styled config that declares `group` */
type Declaration = JsxAttribute | PropertyAssignment

export interface ContainerTarget {
  /** the group name the declaration carries, or the empty string for the unnamed group */
  group: string
  /** a consumer named this group, so the container needs a name to match */
  named: boolean
  /** set when the render-tree relationship could not be proven from the source */
  flag: Flag | null
}

export interface ContainerPlan {
  /** keyed by the node declaring `group`, for the declarations that get a container */
  targets: ReadonlyMap<Node, ContainerTarget>
  /** keyed by the node holding the legacy container-size condition */
  unresolved: ReadonlyMap<Node, Flag>
}

const emptyPlan: ContainerPlan = {
  targets: new Map(),
  unresolved: new Map(),
}

/** the group name a declaration carries, or null when it is not statically known */
function declaredGroup(declaration: Declaration): string | null {
  if (Node.isJsxAttribute(declaration)) {
    const initializer = declaration.getInitializer()
    // a bare `group` prop declares the unnamed group
    if (initializer === undefined) return ''
    if (Node.isStringLiteral(initializer)) return initializer.getLiteralValue()
    if (!Node.isJsxExpression(initializer)) return null
    const expression = initializer.getExpression()
    if (expression === undefined) return null
    if (
      Node.isStringLiteral(expression) ||
      Node.isNoSubstitutionTemplateLiteral(expression)
    ) {
      return expression.getLiteralValue()
    }
    return expression.getKind() === SyntaxKind.TrueKeyword ? '' : null
  }

  const initializer = declaration.getInitializer()
  if (initializer === undefined) return null
  if (
    Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    return initializer.getLiteralValue()
  }
  return initializer.getKind() === SyntaxKind.TrueKeyword ? '' : null
}

function groupAttribute(
  opening: JsxOpeningElement | JsxSelfClosingElement
): JsxAttribute | null {
  for (const attribute of opening.getAttributes()) {
    if (!Node.isJsxAttribute(attribute)) continue
    const name = attribute.getNameNode()
    if (Node.isIdentifier(name) && name.getText() === 'group') return attribute
  }
  return null
}

/** an unnamed condition takes the nearest group; a named one takes its own */
function matches(consumerGroup: string, declaration: string | null): boolean {
  if (declaration === null) return true
  return consumerGroup === '' || consumerGroup === declaration
}

interface Consumer {
  /** the JSX attribute or object property holding the legacy condition */
  node: Declaration
  group: string
}

function containerConsumers(
  sourceFile: SourceFile,
  registry: ModifierRegistryView
): Consumer[] {
  const consumers: Consumer[] = []
  const add = (node: Declaration, name: string): void => {
    if (!isLegacyConditionName(name)) return
    const resolution = resolveLegacyName(name, registry)
    if (!resolution.ok || resolution.resolved.container === null) return
    consumers.push({ node, group: resolution.resolved.container.group ?? '' })
  }

  for (const attribute of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const name = attribute.getNameNode()
    if (Node.isIdentifier(name)) add(attribute, name.getText())
  }
  for (const property of sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
    const name = property.getNameNode()
    if (Node.isComputedPropertyName(name)) continue
    add(property, name.getText().replace(/^['"]|['"]$/g, ''))
  }
  return consumers
}

function declarations(sourceFile: SourceFile): Declaration[] {
  const found: Declaration[] = []
  for (const attribute of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const name = attribute.getNameNode()
    if (Node.isIdentifier(name) && name.getText() === 'group') found.push(attribute)
  }
  for (const property of sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
    const name = property.getNameNode()
    if (Node.isComputedPropertyName(name)) continue
    if (name.getText().replace(/^['"]|['"]$/g, '') === 'group') found.push(property)
  }
  return found
}

/**
 * The nearest JSX ancestor declaring the group, `'ambiguous'` when an ancestor
 * declares a group name this pass cannot read, or null when no ancestor declares
 * one at all.
 */
function provenAncestor(
  consumer: Consumer
): { declaration: JsxAttribute } | 'ambiguous' | null {
  const owner = consumer.node.getFirstAncestor(
    (node): node is JsxOpeningElement | JsxSelfClosingElement =>
      Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)
  )
  if (owner === undefined) return null

  // an element's own group never applies to itself, so the walk starts above it
  for (const ancestor of owner.getAncestors()) {
    if (!Node.isJsxElement(ancestor)) continue
    const declaration = groupAttribute(ancestor.getOpeningElement())
    if (declaration === null) continue
    const group = declaredGroup(declaration)
    if (group === null) return 'ambiguous'
    if (matches(consumer.group, group)) return { declaration }
  }
  return null
}

export function planContainers(
  sourceFile: SourceFile,
  registry: ModifierRegistryView
): ContainerPlan {
  const consumers = containerConsumers(sourceFile, registry)
  if (!consumers.length) return emptyPlan

  const targets = new Map<Node, ContainerTarget>()
  const unresolved = new Map<Node, Flag>()
  const all = declarations(sourceFile)

  const target = (declaration: Declaration, consumer: Consumer, flag: Flag | null) => {
    const existing = targets.get(declaration)
    if (existing) {
      existing.named ||= consumer.group !== ''
      existing.flag ??= flag
      return
    }
    targets.set(declaration, {
      group: declaredGroup(declaration) ?? consumer.group,
      named: consumer.group !== '',
      flag,
    })
  }

  for (const consumer of consumers) {
    const label =
      consumer.group === '' ? 'the nearest group' : `group "${consumer.group}"`
    const proven = provenAncestor(consumer)
    if (proven === 'ambiguous') {
      unresolved.set(consumer.node, {
        code: 'ambiguous-container-group',
        detail: `a JSX ancestor declares a group name this pass cannot read, so the element that has to declare the container for ${label} is not provable; add "container" by hand`,
      })
      continue
    }
    if (proven !== null) {
      target(proven.declaration, consumer, null)
      continue
    }

    const candidates = all.filter((declaration) =>
      matches(consumer.group, declaredGroup(declaration))
    )
    if (candidates.length === 1) {
      target(candidates[0], consumer, {
        code: 'unproven-container-group',
        detail: `a legacy container-size condition targets ${label} and this is the only declaration of it in the file, but no JSX ancestry proves it wraps that element; confirm the container belongs here`,
      })
      continue
    }
    unresolved.set(consumer.node, {
      code: candidates.length
        ? 'ambiguous-container-group'
        : 'container-group-not-declared',
      detail: candidates.length
        ? `${candidates.length} declarations of ${label} are in this file and no JSX ancestry picks one, so the element that has to declare the container is not provable; add "container" by hand`
        : `${label} is not declared in this file, so the "@…" query this condition becomes has no container to match; add "container" to the element declaring the group`,
    })
  }

  return { targets, unresolved }
}
