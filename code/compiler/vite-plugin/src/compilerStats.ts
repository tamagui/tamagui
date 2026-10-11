import path from 'node:path'

export interface CompilerModuleReport {
  stats: {
    found: number
    lowered: number
    flattened: number
    styled: number
    bailed: number
  }
  diagnostics: { code: string; message: string; component?: string }[]
}

export interface CompilerStatsReport {
  schemaVersion: 1
  selector: { id: 'all'; include: ['**'] }
  totals: CompilerModuleReport['stats'] & {
    modules: number
    partial: number
    notFlattened: number
    flattenRate: number
  }
  bailoutCodes: Record<string, number>
  bailoutReasons: Array<{
    code: string
    message: string
    component?: string
    count: number
  }>
  modules: Array<
    CompilerModuleReport & {
      id: string
      stats: CompilerModuleReport['stats'] & {
        partial: number
        notFlattened: number
      }
    }
  >
}

const normalizePath = (value: string) => value.replace(/\\/g, '/')

function normalizeDiagnostic(
  diagnostic: CompilerModuleReport['diagnostics'][number]
): CompilerModuleReport['diagnostics'][number] {
  const unsupportedComponentSuffix =
    diagnostic.component && `#${diagnostic.component} does not accept className`
  const message =
    unsupportedComponentSuffix && diagnostic.message.endsWith(unsupportedComponentSuffix)
      ? `${diagnostic.component} does not accept className`
      : diagnostic.message
  return {
    code: diagnostic.code,
    message,
    ...(diagnostic.component && { component: diagnostic.component }),
  }
}

export function createCompilerStatsReport(
  root: string,
  reports: Map<string, CompilerModuleReport>
): CompilerStatsReport {
  const totals = {
    modules: 0,
    found: 0,
    lowered: 0,
    flattened: 0,
    partial: 0,
    styled: 0,
    bailed: 0,
    notFlattened: 0,
    flattenRate: 0,
  }
  const bailoutCodes = new Map<string, number>()
  const bailoutReasons = new Map<
    string,
    {
      code: string
      message: string
      component?: string
      count: number
    }
  >()
  const modules: CompilerStatsReport['modules'] = []

  for (const [id, report] of [...reports].sort(([left], [right]) =>
    left.localeCompare(right)
  )) {
    if (report.stats.found === 0) continue
    const partial = report.stats.lowered - report.stats.flattened
    const notFlattened = report.stats.found - report.stats.flattened
    totals.modules++
    totals.found += report.stats.found
    totals.lowered += report.stats.lowered
    totals.flattened += report.stats.flattened
    totals.partial += partial
    totals.styled += report.stats.styled
    totals.bailed += report.stats.bailed
    totals.notFlattened += notFlattened

    const diagnostics = report.diagnostics.map(normalizeDiagnostic)
    for (const diagnostic of diagnostics) {
      bailoutCodes.set(diagnostic.code, (bailoutCodes.get(diagnostic.code) ?? 0) + 1)
      const key = JSON.stringify([
        diagnostic.code,
        diagnostic.message,
        diagnostic.component,
      ])
      const reason = bailoutReasons.get(key)
      if (reason) {
        reason.count++
      } else {
        bailoutReasons.set(key, { ...diagnostic, count: 1 })
      }
    }

    modules.push({
      id: normalizePath(path.relative(root, id)),
      stats: { ...report.stats, partial, notFlattened },
      diagnostics,
    })
  }

  totals.flattenRate = totals.found ? totals.flattened / totals.found : 0

  return {
    schemaVersion: 1,
    selector: { id: 'all', include: ['**'] },
    totals,
    bailoutCodes: Object.fromEntries(
      [...bailoutCodes].sort(
        ([leftCode, leftCount], [rightCode, rightCount]) =>
          rightCount - leftCount || leftCode.localeCompare(rightCode)
      )
    ),
    bailoutReasons: [...bailoutReasons.values()].sort(
      (left, right) =>
        right.count - left.count ||
        left.code.localeCompare(right.code) ||
        left.message.localeCompare(right.message) ||
        (left.component ?? '').localeCompare(right.component ?? '')
    ),
    modules,
  }
}

export function formatCompilerStatsReport(report: CompilerStatsReport, verbose: boolean) {
  const moduleLines = report.modules.map(({ id, stats, diagnostics }) => {
    const codes = [...new Set(diagnostics.map(({ code }) => code))]
    return (
      `  ${id}: found ${stats.found} lowered ${stats.lowered} ` +
      `flattened ${stats.flattened} bailed ${stats.bailed}` +
      (codes.length ? ` (${codes.join(', ')})` : '')
    )
  })
  const summary =
    `\n[tamagui] compiler stats: ${report.totals.modules} modules with candidates\n` +
    `  found ${report.totals.found} · lowered ${report.totals.lowered} ` +
    `(flattened ${report.totals.flattened}, partial ${report.totals.partial}, ` +
    `styled ${report.totals.styled}) · bailed ${report.totals.bailed}`
  const bailouts = Object.entries(report.bailoutCodes)
    .map(([code, count]) => `  bailout ${code}: ${count}`)
    .join('\n')

  return [summary, bailouts, verbose ? moduleLines.join('\n') : '']
    .filter(Boolean)
    .join('\n')
}
