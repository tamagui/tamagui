import { basename } from 'node:path'

import generate from '@babel/generator'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import findRoot from 'find-root'

import { memoize } from '../helpers/memoize'
import type { ExtractedAttr, TamaguiOptionsWithFileInfo, Ternary } from '../types'

// import { astToLiteral } from './literalToAst'

export function isPresent<T extends Object>(
  input: null | void | undefined | T
): input is T {
  return input != null
}

export function isSimpleSpread(node: t.JSXSpreadAttribute) {
  return t.isIdentifier(node.argument) || t.isMemberExpression(node.argument)
}

export const attrStr = (attr?: ExtractedAttr) => {
  return !attr
    ? ''
    : attr.type === 'attr'
      ? getNameAttr(attr.value)
      : attr.type === 'ternary'
        ? `...${ternaryStr(attr.value)}`
        : `${attr.type}(${objToStr(attr.value)})`
}

export const objToStr = (obj: any, spacer = ', ') => {
  if (!obj) {
    return `${obj}`
  }
  return `{${Object.entries(obj)
    .map(
      ([k, v]) =>
        `${k}:${
          Array.isArray(v)
            ? `[...]`
            : v && typeof v === 'object'
              ? `${objToStr(v, ',')}`
              : JSON.stringify(v)
        }`
    )
    .join(spacer)}}`
}

const getNameAttr = (attr: t.JSXAttribute | t.JSXSpreadAttribute) => {
  if (t.isJSXSpreadAttribute(attr)) {
    return `...${attr.argument['name']}`
  }
  return 'name' in attr ? attr.name.name : `unknown-${attr['type']}`
}

export const ternaryStr = (x: Ternary) => {
  const conditional = t.isIdentifier(x.test)
    ? x.test.name
    : t.isMemberExpression(x.test)
      ? [x.test.object['name'], x.test.property['name']]
      : // @ts-ignore
        generate(x.test as any).code
  return [
    'ternary(',
    conditional,
    isFilledObj(x.consequent) ? ` ? ${objToStr(x.consequent)}` : ' ? 🚫',
    isFilledObj(x.alternate) ? ` : ${objToStr(x.alternate)}` : ' : 🚫',
    ')',
  ]
    .flat()
    .join('')
}

const isFilledObj = (obj: any) => obj && Object.keys(obj).length

export function findComponentName(scope) {
  const componentName = ''
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
  props: TamaguiOptionsWithFileInfo,
  jsxPath: NodePath<t.JSXElement>,
  n: t.MemberExpression,
  sourcePath?: string
) {
  if (!t.isIdentifier(n.object) || !t.isIdentifier(n.property)) return false
  const bindings = jsxPath.scope.getAllBindings()
  const binding = bindings[n.object.name]
  if (!binding?.path) return false
  if (!binding.path.isVariableDeclarator()) return false
  const init = binding.path.node.init
  if (!init || !t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useTheme by looking up import first
  if (init.callee.name !== 'useTheme') return false
  const importNode = binding.scope.getBinding('useTheme')?.path.parent
  if (!t.isImportDeclaration(importNode)) return false
  if (sourcePath && !isValidImport(props, sourcePath)) {
    return false
  }
  return true
}

export const isInsideComponentPackage = (
  props: TamaguiOptionsWithFileInfo,
  moduleName: string
) => {
  return getValidComponentsPaths(props).some((path) => {
    return moduleName.startsWith(path)
  })
}

export const isComponentPackage = (
  props: TamaguiOptionsWithFileInfo,
  srcName: string
) => {
  return getValidComponentsPaths(props).some((path) => {
    return srcName.startsWith(path)
  })
}

export function getValidComponent(
  props: TamaguiOptionsWithFileInfo,
  moduleName: string,
  componentName: string
) {
  // must be uppercase of course
  if (componentName[0].toUpperCase() !== componentName[0]) {
    return false
  }

  for (const loaded of props.allLoadedComponents) {
    if (!loaded) continue
    const isInModule = moduleName === '*' || moduleName.startsWith(loaded.moduleName)
    const foundComponent = loaded.nameToInfo[componentName]
    if (isInModule && foundComponent) {
      return foundComponent
    }
  }

  return null
}

export const isValidModule = (props: TamaguiOptionsWithFileInfo, moduleName: string) => {
  if (typeof moduleName !== 'string') {
    throw new Error(`No module name`)
  }
  const isLocal = moduleName.startsWith('.')
  return {
    isLocal,
    isValid: isLocal
      ? isInsideComponentPackage(props, moduleName)
      : isComponentPackage(props, moduleName),
  }
}

export const getValidImport = (
  props: TamaguiOptionsWithFileInfo,
  moduleName: string,
  componentName?: string
) => {
  const { isValid, isLocal } = isValidModule(props, moduleName)
  if (!isValid || !componentName) {
    return null
  }
  return getValidComponent(props, isLocal ? '*' : moduleName, componentName) || null
}

export const isValidImport = (
  props: TamaguiOptionsWithFileInfo,
  moduleName: string,
  componentName?: string
) => {
  if (!componentName) {
    return isValidModule(props, moduleName).isValid
  }
  return Boolean(getValidImport(props, moduleName, componentName))
}

const getValidComponentPackages = memoize((props: TamaguiOptionsWithFileInfo) => {
  // just always look for `tamagui` and `@tamagui/core`
  return [...new Set(['@tamagui/core', 'tamagui', ...(props.components || [])])]
})

export const getValidComponentsPaths = memoize((props: TamaguiOptionsWithFileInfo) => {
  return getValidComponentPackages(props).flatMap((pkg) => {
    const root = findRoot(pkg)
    const based = basename(root)
    return [based, pkg].filter(Boolean)
  })
})
