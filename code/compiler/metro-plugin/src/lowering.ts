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

import {
  compileWithUserBabel,
  type CompiledMetroModule,
  type MetroBabelTransformArgs,
} from './babel'

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

function tracePosition(loweredMap: TraceMap, position: Position): Position | null {
  const original = originalPositionFor(loweredMap, {
    line: position.line,
    column: position.column,
    bias: GREATEST_LOWER_BOUND,
  })
  return original.line == null || original.column == null
    ? null
    : { line: original.line, column: original.column }
}

function remapAstLocations(
  ast: Record<string, any>,
  loweredMap: TraceMap,
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
      const start = tracePosition(loweredMap, loc.start)
      const end = tracePosition(loweredMap, loc.end)
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

/**
 * Applies the cacheable E3 plan to the raw module source, then runs the user's
 * Babel transformer once over the lowered source. Plans carry spans into raw
 * source, so this process's Babel output never needs to match the planning
 * process's byte for byte — Babel options can differ freely between them.
 */
export async function applyMetroCompilerPlan(
  args: MetroBabelTransformArgs,
  plan: LoweredModulePlan,
  transformerPath: string
): Promise<{ compiled: CompiledMetroModule; lowering: MetroCompilerLoweringResult }> {
  const output = applyLoweredModule(args.src, resolvedModuleId(args.filename), plan)
  if (!output.changed || !output.map) {
    return {
      compiled: await compileWithUserBabel(transformerPath, args),
      lowering: {
        applied: false,
        diagnostics: plan.diagnostics,
        sourceMapComposed: false,
        stats: plan.stats,
      },
    }
  }

  const compiled = await compileWithUserBabel(transformerPath, {
    ...args,
    src: output.code,
  })
  remapAstLocations(
    compiled.result.ast,
    new TraceMap(output.map as any),
    args.src,
    args.filename
  )
  return {
    compiled,
    lowering: {
      applied: true,
      diagnostics: plan.diagnostics,
      sourceMapComposed: true,
      stats: plan.stats,
    },
  }
}
