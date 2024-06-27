import vm from 'node:vm'

import generate from '@babel/generator'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import esbuild from 'esbuild'

import { FAILED_EVAL } from '../constants'
import type { TamaguiOptionsWithFileInfo } from '../types'
import { evaluateAstNode } from './evaluateAstNode'

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
      console.info('evaluating', code)
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
