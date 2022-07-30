import vm from 'vm'

import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import type { TamaguiConfig } from '@tamagui/core-node'
import { createCSSVariable } from '@tamagui/core-node'
import esbuild from 'esbuild'

import { FAILED_EVAL } from '../constants'
import { evaluateAstNode } from './evaluateAstNode'
import { isValidThemeHook } from './extractHelpers'

export function createEvaluator({
  tamaguiConfig,
  staticNamespace,
  sourcePath,
  traversePath,
  shouldPrintDebug,
}: {
  tamaguiConfig: TamaguiConfig
  staticNamespace: Record<string, any>
  sourcePath: string
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
      isValidThemeHook(traversePath, n, sourcePath)
    ) {
      const key = n.property.name
      if (shouldPrintDebug) {
        console.log('    > found theme prop', key)
      }
      return createCSSVariable(key)
    }
    // variable
    if (t.isIdentifier(n) && staticNamespace.hasOwnProperty(n.name)) {
      return staticNamespace[n.name]
    }
    const evalContext = vm.createContext(staticNamespace)
    const codeWithTypescriptAnnotations = `(${generate(n as any).code})`
    const code = esbuild
      .transformSync(codeWithTypescriptAnnotations, { loader: 'tsx' })
      .code.replace(/;\n$/, '')

    if (shouldPrintDebug) {
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
