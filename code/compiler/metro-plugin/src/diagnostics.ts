export type MetroCompilerDiagnosticCode =
  | 'metro/cache-corrupt'
  | 'metro/cache-stale'
  | 'metro/no-linked-components'
  | 'metro/plan-miss'
  | 'metro/resolve-failed'
  | 'metro/transform-failed'

export interface MetroCompilerDiagnostic {
  code: MetroCompilerDiagnosticCode
  message: string
  moduleId?: string
  dependency?: string
}

export function metroDiagnostic(
  code: MetroCompilerDiagnosticCode,
  message: string,
  details: Pick<MetroCompilerDiagnostic, 'moduleId' | 'dependency'> = {}
): MetroCompilerDiagnostic {
  return { code, message, ...details }
}
