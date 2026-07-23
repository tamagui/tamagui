import { createRequire } from 'node:module'

import {
  applyLoweredModule,
  resolvedModuleId,
  type LoweredModulePlan,
  type LoweredModuleStats,
} from '@tamagui/compiler-core'
import {
  GREATEST_LOWER_BOUND,
  TraceMap,
  originalPositionFor,
} from '@jridgewell/trace-mapping'

import type { CompiledMetroModule, MetroBabelTransformArgs } from './babel'

export interface MetroCompilerLoweringResult {
  applied: boolean
  diagnostics: LoweredModulePlan['diagnostics']
  sourceMapComposed: boolean
  stats: LoweredModuleStats
}

interface Position {
  line: number
  column: number
}

function lineStarts(source: string): number[] {
  const starts = [0]
  for (let index = 0; index < source.length; index++) {
    if (source.charCodeAt(index) === 10) starts.push(index + 1)
  }
  return starts
}

function sourceIndex(starts: readonly number[], position: Position): number {
  return (starts[position.line - 1] ?? starts.at(-1) ?? 0) + position.column
}

function tracePosition(
  loweredMap: TraceMap,
  babelMap: TraceMap,
  position: Position
): Position | null {
  const compiled = originalPositionFor(loweredMap, {
    line: position.line,
    column: position.column,
    bias: GREATEST_LOWER_BOUND,
  })
  if (compiled.line == null || compiled.column == null) return null
  const original = originalPositionFor(babelMap, {
    line: compiled.line,
    column: compiled.column,
    bias: GREATEST_LOWER_BOUND,
  })
  return original.line == null || original.column == null
    ? null
    : { line: original.line, column: original.column }
}

function remapAstLocations(
  ast: Record<string, any>,
  loweredMap: TraceMap,
  babelMap: TraceMap,
  source: string,
  filename: string
): void {
  const starts = lineStarts(source)
  const seen = new Set<object>()
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object' || seen.has(value as object)) return
    seen.add(value as object)
    if (Array.isArray(value)) {
      for (const child of value) visit(child)
      return
    }
    const node = value as Record<string, any>
    const loc = node.loc
    if (loc?.start && loc?.end) {
      const start = tracePosition(loweredMap, babelMap, loc.start)
      const end = tracePosition(loweredMap, babelMap, loc.end)
      if (start && end) {
        node.start = sourceIndex(starts, start)
        node.end = sourceIndex(starts, end)
        node.loc = {
          ...loc,
          start,
          end,
          filename,
        }
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === 'loc' || key === 'tokens') continue
      visit(child)
    }
  }
  visit(ast)
}

/** Applies the cacheable E3 plan and returns a Babel AST mapped to the original module. */
export function applyMetroCompilerPlan(
  compiled: CompiledMetroModule,
  plan: LoweredModulePlan,
  args: MetroBabelTransformArgs,
  transformerPath: string
): { ast: Record<string, any>; lowering: MetroCompilerLoweringResult } {
  const output = applyLoweredModule(compiled.code, resolvedModuleId(args.filename), plan)
  if (!output.changed || !output.map) {
    return {
      ast: compiled.result.ast,
      lowering: {
        applied: false,
        diagnostics: plan.diagnostics,
        sourceMapComposed: false,
        stats: plan.stats,
      },
    }
  }

  const requireFromTransformer = createRequire(transformerPath)
  const parserModule = requireFromTransformer('@babel/parser')
  const parse = parserModule.parse ?? parserModule.default?.parse
  if (typeof parse !== 'function') {
    throw new Error(`Metro Babel transformer ${transformerPath} has no Babel parser`)
  }
  const ast = parse(output.code, {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    plugins: [
      'jsx',
      'flow',
      'decorators-legacy',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'dynamicImport',
      'importAttributes',
      'importMeta',
      'topLevelAwait',
    ],
    sourceFilename: args.filename,
    sourceType: 'unambiguous',
  }) as Record<string, any>
  remapAstLocations(
    ast,
    new TraceMap(output.map as any),
    new TraceMap(compiled.map as any),
    args.src,
    args.filename
  )
  return {
    ast,
    lowering: {
      applied: true,
      diagnostics: plan.diagnostics,
      sourceMapComposed: true,
      stats: plan.stats,
    },
  }
}
