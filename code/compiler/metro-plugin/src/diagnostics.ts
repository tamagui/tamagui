import { isAbsolute, relative } from 'node:path'

import type { SourceSpan } from '@tamagui/compiler-core'

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
  span?: SourceSpan
  line?: number
  column?: number
  component?: string
}

export function metroDiagnostic(
  code: MetroCompilerDiagnosticCode,
  message: string,
  details: Omit<MetroCompilerDiagnostic, 'code' | 'message'> = {}
): MetroCompilerDiagnostic {
  return { code, message, ...details }
}

export function formatMetroCompilerDiagnostic(
  diagnostic: MetroCompilerDiagnostic,
  projectRoot: string
): string {
  const sourceId = diagnostic.span?.id ?? diagnostic.moduleId
  const file = sourceId
    ? isAbsolute(sourceId)
      ? relative(projectRoot, sourceId) || '.'
      : sourceId
    : null
  const location =
    file && diagnostic.line != null && diagnostic.column != null
      ? `${file}:${diagnostic.line}:${diagnostic.column}: `
      : ''
  return `[@tamagui/metro-plugin] ${location}${diagnostic.code}: ${diagnostic.message}`
}
