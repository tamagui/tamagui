import vm from 'vm'

import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { createCSSVariable } from '@tamagui/core-node'
import esbuild from 'esbuild'

import { FAILED_EVAL } from '../constants'
import { TamaguiOptionsWithFileInfo } from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import { isValidThemeHook } from './extractHelpers'

export function createEvaluator({
  props,
  staticNamespace,
  sourcePath,
  traversePath,
  shouldPrintDebug,
}: {
  props: TamaguiOptionsWithFileInfo
  staticNamespace: Record<string, any>
  sourcePath?: string
  traversePath?: NodePath<t.JSXElement>
  shouldPrintDebug: boolean | 'verbose'
}) {
  // called when evaluateAstNode encounters a dynamic-looking prop
  const evalFn = (n: t.Node) => {
    // themes
    if (
      t.isMemberExpression(n) &&
      t.isIdentifier(n.property) &&
      traversePath &&
      isValidThemeHook(props, traversePath, n, sourcePath)
    ) {
      const key = n.property.name
      if (shouldPrintDebug) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('    > found theme prop', key)
      }
      return createCSSVariable(key)
    }
    // variable
    if (t.isIdentifier(n) && typeof staticNamespace[n.name] !== 'undefined') {
      return staticNamespace[n.name]
    }
    const evalContext = vm.createContext(staticNamespace)
    // @ts-ignore
    const codeWithTypescriptAnnotations = `(${generate(n as any).code})`
    const code = esbuild
      .transformSync(codeWithTypescriptAnnotations, { loader: 'tsx' })
      .code.replace(/;\n$/, '')

    if (shouldPrintDebug) {
      // rome-ignore lint/nursery/noConsoleLog: ok
      console.log('evaluating', code)
    }
    return vm.runInContext(code, evalContext)
  }

  return (n: t.Node) => {
    return evaluateAstNode(n, evalFn)
  }
}

export function createSafeEvaluator(attemptEval: (n: t.Node) => any) {
  return (n: t.Node) => {
    try {
      return attemptEval(n)
    } catch (err) {
      return FAILED_EVAL
    }
  }
}
