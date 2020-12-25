import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { ExtractedAttr, Ternary } from '../types'

export function isPresent<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null
}

export function isSimpleSpread(node: t.JSXSpreadAttribute) {
  return t.isIdentifier(node.argument) || t.isMemberExpression(node.argument)
}

export const attrGetName = (attr: ExtractedAttr) => {
  return `${attr.type === 'attr' ? '' : `${attr.type}`}${
    attr.type === 'attr'
      ? getNameAttr(attr.value)
      : attr.type === 'ternary'
      ? getNameTernary(attr.value)
      : '...'
  }`
}

const getNameAttr = (attr: t.JSXAttribute | t.JSXSpreadAttribute) => {
  if (t.isJSXSpreadAttribute(attr)) {
    return `...${attr.argument['name']}`
  }
  return 'name' in attr ? attr.name.name : `unknown-${attr['type']}`
}

export const getNameTernary = (x: Ternary) => {
  return [
    t.isIdentifier(x.test)
      ? x.test.name
      : t.isMemberExpression(x.test)
      ? [x.test.object['name'], x.test.property['name']]
      : x.test,
    x.consequent,
    x.alternate,
  ]
    .flat()
    .join('_')
}

export function findComponentName(scope) {
  let componentName = ''
  let cur = scope.path
  while (cur.parentPath && !t.isProgram(cur.parentPath.parent)) {
    cur = cur.parentPath
  }
  let node = cur.parent
  if (t.isExportNamedDeclaration(node)) {
    node = node.declaration
  }
  if (t.isVariableDeclaration(node)) {
    const [dec] = node.declarations
    if (t.isVariableDeclarator(dec) && t.isIdentifier(dec.id)) {
      return dec.id.name
    }
  }
  if (t.isFunctionDeclaration(node)) {
    return node.id?.name
  }
  return componentName
}

export function isValidThemeHook(
  jsxPath: NodePath<t.JSXElement>,
  n: t.MemberExpression,
  sourceFileName: string
) {
  if (!t.isIdentifier(n.object) || !t.isIdentifier(n.property)) return false
  const binding = jsxPath.scope.bindings[n.object.name]
  if (!binding.path.isVariableDeclarator()) return false
  const init = binding.path.node.init
  if (!t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useTheme by looking up import first
  if (init.callee.name !== 'useTheme') return false
  const importNode = binding.scope.getBinding('useTheme')?.path.parent
  if (!t.isImportDeclaration(importNode)) return false
  if (importNode.source.value !== 'snackui') {
    if (!isInsideSnackUI(sourceFileName)) {
      return false
    }
  }
  return true
}

export const isInsideSnackUI = (srcName: string) =>
  srcName.includes('/snackui/')
