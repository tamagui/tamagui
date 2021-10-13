import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { ExtractedAttr, Ternary } from '../types'

export function isPresent<T extends Object>(input: null | void | undefined | T): input is T {
  return input != null
}

export function isSimpleSpread(node: t.JSXSpreadAttribute) {
  return t.isIdentifier(node.argument) || t.isMemberExpression(node.argument)
}

export const attrStr = (attr: ExtractedAttr) => {
  return attr.type === 'attr'
    ? getNameAttr(attr.value)
    : attr.type === 'ternary'
    ? `...${ternaryStr(attr.value)}`
    : `${attr.type}(${objToStr(attr.value)})`
}

export const objToStr = (obj: any) => {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${Array.isArray(v) ? `[...]` : v && typeof v === 'object' ? `{${objToStr(v)}}` : v}`)
    .join(', ')
}

const getNameAttr = (attr: t.JSXAttribute | t.JSXSpreadAttribute) => {
  if (t.isJSXSpreadAttribute(attr)) {
    return `...${attr.argument['name']}`
  }
  return 'name' in attr ? attr.name.name : `unknown-${attr['type']}`
}

export const ternaryStr = (x: Ternary) => {
  return [
    'ternary:',
    t.isIdentifier(x.test)
      ? x.test.name
      : t.isMemberExpression(x.test)
      ? [x.test.object['name'], x.test.property['name']]
      : x.test,
    x.consequent ? `  ? ${objToStr(x.consequent)}` : '  ? ⚫️',
    x.alternate ? `  : ${objToStr(x.alternate)}` : '  : ⚫️',
  ]
    .flat()
    .join('')
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

export function isValidThemeHook(jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourcePath: string) {
  if (!t.isIdentifier(n.object) || !t.isIdentifier(n.property)) return false
  const bindings = jsxPath.scope.getAllBindings()
  const binding = bindings[n.object.name]
  if (!binding?.path) return false
  if (!binding.path.isVariableDeclarator()) return false
  const init = binding.path.node.init
  if (!t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useTheme by looking up import first
  if (init.callee.name !== 'useTheme') return false
  const importNode = binding.scope.getBinding('useTheme')?.path.parent
  if (!t.isImportDeclaration(importNode)) return false
  if (importNode.source.value !== 'tamagui') {
    if (!isInsideTamagui(sourcePath)) {
      return false
    }
  }
  return true
}

export const isInsideTamagui = (srcName: string) => srcName.includes('/tamagui/')
