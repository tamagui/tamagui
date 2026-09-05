import type { AstNode } from './contracts'

const ignoredKeys = new Set(['loc', 'range', 'parent', 'comments', 'tokens'])

export function isAstNode(value: unknown): value is AstNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AstNode).type === 'string' &&
    typeof (value as AstNode).start === 'number' &&
    typeof (value as AstNode).end === 'number'
  )
}

export function walkAst(
  node: AstNode,
  visitor: (node: AstNode, parent: AstNode | null, key: string | null) => void,
  parent: AstNode | null = null,
  key: string | null = null
): void {
  visitor(node, parent, key)

  for (const [childKey, value] of Object.entries(node)) {
    if (ignoredKeys.has(childKey)) continue
    if (isAstNode(value)) {
      walkAst(value, visitor, node, childKey)
    } else if (Array.isArray(value)) {
      for (const child of value) {
        if (isAstNode(child)) {
          walkAst(child, visitor, node, childKey)
        }
      }
    }
  }
}

/** With a source range, only descend into nodes that contain that range. */
export function findAstNode(
  root: AstNode,
  predicate: (node: AstNode, parent: AstNode | null, key: string | null) => boolean,
  span?: Pick<AstNode, 'start' | 'end'>
): AstNode | null {
  function visit(
    node: AstNode,
    parent: AstNode | null,
    key: string | null
  ): AstNode | null {
    if (span && (node.start > span.start || node.end < span.end)) return null
    if (predicate(node, parent, key)) return node
    for (const childKey of Object.keys(node)) {
      if (ignoredKeys.has(childKey)) continue
      const value = node[childKey]
      if (isAstNode(value)) {
        const found = visit(value, node, childKey)
        if (found) return found
      } else if (Array.isArray(value)) {
        for (const child of value) {
          if (!isAstNode(child)) continue
          const found = visit(child, node, childKey)
          if (found) return found
        }
      }
    }
    return null
  }
  return visit(root, null, null)
}

export function childNode(node: AstNode, key: string): AstNode | null {
  const value = node[key]
  return isAstNode(value) ? value : null
}

export function childNodes(node: AstNode, key: string): AstNode[] {
  const value = node[key]
  return Array.isArray(value) ? value.filter(isAstNode) : []
}

export function identifierName(node: AstNode | null): string | null {
  if (!node || (node.type !== 'Identifier' && node.type !== 'JSXIdentifier')) return null
  return typeof node.name === 'string' ? node.name : null
}

export function literalValue(node: AstNode | null): unknown {
  if (!node) return undefined
  if (node.type === 'Literal' || node.type.endsWith('Literal')) {
    return node.value
  }
  return undefined
}

export function unwrapExpression(node: AstNode): AstNode {
  let current = node
  while (
    current.type === 'TSAsExpression' ||
    current.type === 'TSSatisfiesExpression' ||
    current.type === 'TSNonNullExpression' ||
    current.type === 'ParenthesizedExpression'
  ) {
    const expression = childNode(current, 'expression')
    if (!expression) break
    current = expression
  }
  return current
}
