import { isAstNode, parseModuleAst, type AstNode } from '@tamagui/compiler-core'

const ignoredKeys = new Set(['loc', 'range', 'parent', 'comments', 'tokens'])

function isFunctionBoundary(node: AstNode): boolean {
  return (
    node.type.includes('Function') ||
    node.type === 'ArrowFunctionExpression' ||
    node.type.endsWith('Method')
  )
}

function containsTopLevelAwait(node: AstNode, functionDepth: number): boolean {
  if (functionDepth === 0) {
    if (node.type === 'AwaitExpression') return true
    if (node.type === 'ForOfStatement' && node.await === true) return true
  }

  const nextDepth = functionDepth + (isFunctionBoundary(node) ? 1 : 0)
  for (const [key, value] of Object.entries(node)) {
    if (ignoredKeys.has(key)) continue
    if (isAstNode(value) && containsTopLevelAwait(value, nextDepth)) return true
    if (Array.isArray(value)) {
      for (const child of value) {
        if (isAstNode(child) && containsTopLevelAwait(child, nextDepth)) return true
      }
    }
  }
  return false
}

export function hasTopLevelAwait(contents: string, fileName?: string) {
  if (!contents.includes('await')) {
    return false
  }
  return containsTopLevelAwait(parseModuleAst(contents, fileName), 0)
}
