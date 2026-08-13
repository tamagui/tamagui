// Style site extraction over an ESTree program.
//
// One walker serves every ESTree producer: eslint (espree/typescript-eslint),
// oxc-parser's raw-transfer AST, and anything else emitting the standard
// shape. Node spans read `range` when present (eslint) and `start`/`end`
// otherwise (oxc), so the same call works in both worlds.
//
// The recognized site shapes match the sucrase extractor exactly:
// string-valued JSX attributes on tamagui components, and string property
// values anywhere inside a styled() definition object.

import type { StyleSite } from './document'

interface EstreeNode {
  type: string
  range?: readonly [number, number]
  start?: number
  end?: number
  [key: string]: unknown
}

export interface EstreeStyleSite extends StyleSite {
  /** the Literal or TemplateLiteral node holding the value, for reporters */
  node: unknown
}

export interface EstreeExtractorOptions {
  /** which prop names produce sites; default: every prop */
  isStyleProp?: (name: string) => boolean
  /**
   * which import sources mark components and `styled` as tamagui's.
   * default: `tamagui`, `tamagui/*`, `@tamagui/*`
   */
  isTamaguiModule?: (source: string) => boolean
  /** treat every capitalized JSX element as a tamagui component */
  allComponents?: boolean
}

function defaultIsTamaguiModule(source: string): boolean {
  return (
    source === 'tamagui' ||
    source.startsWith('tamagui/') ||
    source.startsWith('@tamagui/')
  )
}

function span(node: EstreeNode): readonly [number, number] | null {
  if (node.range) return node.range
  if (typeof node.start === 'number' && typeof node.end === 'number') {
    return [node.start, node.end]
  }
  return null
}

/** cooked string value plus its content span, or null when not static/exact */
function staticString(
  node: EstreeNode | null | undefined
): { value: string; start: number; end: number } | null {
  if (!node) return null
  const at = span(node)
  if (!at) return null
  if (node.type === 'Literal') {
    const value = node.value
    if (typeof value !== 'string') return null
    // escapes cook differently than they read; an approximate replacement
    // span could delete a runtime clause, so exact-raw literals only
    const raw = node.raw
    if (typeof raw === 'string' && raw.slice(1, -1) !== value) return null
    return { value, start: at[0] + 1, end: at[1] - 1 }
  }
  if (node.type === 'TemplateLiteral') {
    const expressions = node.expressions as EstreeNode[] | undefined
    const quasis = node.quasis as
      | Array<{ value?: { cooked?: string | null; raw?: string } }>
      | undefined
    if (expressions?.length !== 0 || quasis?.length !== 1) return null
    const cooked = quasis[0]?.value?.cooked
    if (typeof cooked !== 'string') return null
    if (quasis[0]?.value?.raw !== cooked) return null
    return { value: cooked, start: at[0] + 1, end: at[1] - 1 }
  }
  return null
}

function identifierName(node: EstreeNode | null | undefined): string | null {
  if (!node) return null
  if (node.type === 'Identifier' || node.type === 'JSXIdentifier') {
    return typeof node.name === 'string' ? node.name : null
  }
  return null
}

/** the root identifier of a JSX element name (`T` in `<T.Stack.Deep>`) */
function jsxRootName(name: EstreeNode | null | undefined): string | null {
  let current = name
  while (current?.type === 'JSXMemberExpression') {
    current = current.object as EstreeNode
  }
  return identifierName(current)
}

const skipKeys = new Set([
  'parent',
  'loc',
  'range',
  'leadingComments',
  'trailingComments',
])

function walk(node: EstreeNode, visit: (node: EstreeNode) => void): void {
  visit(node)
  for (const key in node) {
    if (skipKeys.has(key)) continue
    const value = node[key]
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === 'object' && typeof item.type === 'string') {
          walk(item as EstreeNode, visit)
        }
      }
    } else if (
      value &&
      typeof value === 'object' &&
      typeof (value as EstreeNode).type === 'string'
    ) {
      walk(value as EstreeNode, visit)
    }
  }
}

export function extractStyleSitesFromEstree(
  program: unknown,
  options: EstreeExtractorOptions = {}
): readonly EstreeStyleSite[] {
  const isStyleProp = options.isStyleProp ?? (() => true)
  const isTamaguiModule = options.isTamaguiModule ?? defaultIsTamaguiModule
  const root = program as EstreeNode

  // ── pass 1: imported vocabulary ──────────────────────────────────────────
  const styledBindings = new Set<string>()
  const componentNames = new Set<string>()

  walk(root, (node) => {
    if (node.type === 'ImportDeclaration') {
      const source = (node.source as EstreeNode | undefined)?.value
      if (typeof source !== 'string' || !isTamaguiModule(source)) return
      for (const specifier of (node.specifiers as EstreeNode[]) || []) {
        const local = identifierName(specifier.local as EstreeNode)
        if (!local) continue
        if (specifier.type === 'ImportNamespaceSpecifier') {
          componentNames.add(local)
          continue
        }
        if (specifier.type !== 'ImportSpecifier') continue
        const importedNode = specifier.imported as EstreeNode
        const imported =
          identifierName(importedNode) ??
          (typeof importedNode?.value === 'string' ? importedNode.value : null)
        if (imported === 'styled') styledBindings.add(local)
        else if (imported && /^[A-Z]/.test(imported)) componentNames.add(local)
      }
      return
    }
    if (node.type === 'VariableDeclarator') {
      const name = identifierName(node.id as EstreeNode)
      const init = node.init as EstreeNode | undefined
      if (
        name &&
        init?.type === 'CallExpression' &&
        identifierName(init.callee as EstreeNode) !== null &&
        styledBindings.has(identifierName(init.callee as EstreeNode)!)
      ) {
        componentNames.add(name)
      }
    }
  })

  // ── pass 2: sites ────────────────────────────────────────────────────────
  const sites: EstreeStyleSite[] = []

  const pushSite = (
    property: string,
    valueNode: EstreeNode,
    kind: StyleSite['kind']
  ): void => {
    if (!isStyleProp(property)) return
    const content = staticString(valueNode)
    if (!content) return
    sites.push({
      property,
      value: content.value,
      start: content.start,
      end: content.end,
      kind,
      node: valueNode,
    })
  }

  const visitStyleObject = (object: EstreeNode): void => {
    for (const member of (object.properties as EstreeNode[]) || []) {
      if (member.type !== 'Property') continue
      if (member.computed) continue
      const key = member.key as EstreeNode
      const property =
        identifierName(key) ?? (typeof key?.value === 'string' ? key.value : null)
      const value = member.value as EstreeNode
      if (property && isStyleProp(property)) {
        pushSite(property, value, 'styled-property')
        continue
      }
      if (value?.type === 'ObjectExpression') {
        visitStyleObject(value)
      } else if (value?.type === 'ArrayExpression') {
        for (const element of (value.elements as Array<EstreeNode | null>) || []) {
          if (element?.type === 'ObjectExpression') visitStyleObject(element)
        }
      }
    }
  }

  walk(root, (node) => {
    if (node.type === 'CallExpression') {
      const callee = identifierName(node.callee as EstreeNode)
      if (!callee || !styledBindings.has(callee)) return
      const definition = (node.arguments as EstreeNode[])?.[1]
      if (definition?.type === 'ObjectExpression') visitStyleObject(definition)
      return
    }
    if (node.type === 'JSXOpeningElement') {
      const componentRoot = jsxRootName(node.name as EstreeNode)
      const accepted = options.allComponents
        ? componentRoot !== null && /^[A-Z]/.test(componentRoot)
        : componentRoot !== null && componentNames.has(componentRoot)
      if (!accepted) return
      for (const attribute of (node.attributes as EstreeNode[]) || []) {
        if (attribute.type !== 'JSXAttribute') continue
        const property = identifierName(attribute.name as EstreeNode)
        if (!property) continue
        const rawValue = attribute.value as EstreeNode | undefined
        const valueNode =
          rawValue?.type === 'JSXExpressionContainer'
            ? (rawValue.expression as EstreeNode)
            : rawValue
        if (valueNode) pushSite(property, valueNode, 'jsx-attribute')
      }
    }
  })

  sites.sort((a, b) => a.start - b.start)
  return sites
}
