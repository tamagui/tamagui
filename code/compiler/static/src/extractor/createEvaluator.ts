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

    const result1 = vm.runInContext(code, evalContext)
    const result2 = vm.runInContext(code, evalContext)

    const isDeterministic =
      Object.is(result1, result2) ||
      (typeof result1 === 'object' &&
        typeof result2 === 'object' &&
        JSON.stringify(result1) === JSON.stringify(result2))

    if (!isDeterministic) {
      if (shouldPrintDebug) {
        console.info(
          'Bailing on non-deterministic expression:',
          code,
          '\nFirst result:',
          result1,
          'Second result:',
          result2
        )
      }
      throw new Error(`Non-deterministic value, bailing`)
    }

    return result1
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
