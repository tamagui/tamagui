import { resolve } from 'node:path'

import { expect, test } from 'vitest'

import {
  createCompilerStatsReport,
  formatCompilerStatsReport,
  type CompilerModuleReport,
} from '../src/compilerStats'

test('compiler stats reports are deterministic, relative, and machine readable', () => {
  const root = resolve('/repo')
  const reports = new Map<string, CompilerModuleReport>([
    [
      resolve(root, 'src/z.tsx'),
      {
        stats: { found: 2, lowered: 2, flattened: 1, styled: 1, bailed: 0 },
        diagnostics: [
          {
            code: 'local/dynamic-style-value',
            message: 'Style prop color could not be safely extracted',
          },
        ],
      },
    ],
    [
      resolve(root, 'src/a.tsx'),
      {
        stats: { found: 3, lowered: 1, flattened: 1, styled: 0, bailed: 2 },
        diagnostics: [
          {
            code: 'local/unsupported-target',
            message:
              '/machine/workspace/code/ui/button.mjs#Button does not accept className',
            component: 'Button',
            span: { id: '/machine/workspace/App.tsx', start: 0, end: 1 },
          },
          {
            code: 'local/unsupported-target',
            message:
              '/machine/workspace/code/ui/button.mjs#Button does not accept className',
            component: 'Button',
            kind: 'local',
          },
        ] as CompilerModuleReport['diagnostics'],
      },
    ],
    [
      resolve(root, 'src/empty.tsx'),
      {
        stats: { found: 0, lowered: 0, flattened: 0, styled: 0, bailed: 0 },
        diagnostics: [],
      },
    ],
  ])

  const report = createCompilerStatsReport(root, reports)

  expect(report).toEqual({
    schemaVersion: 1,
    selector: { id: 'all', include: ['**'] },
    totals: {
      modules: 2,
      found: 5,
      lowered: 3,
      flattened: 2,
      partial: 1,
      styled: 1,
      bailed: 2,
      notFlattened: 3,
      flattenRate: 0.4,
    },
    bailoutCodes: {
      'local/unsupported-target': 2,
      'local/dynamic-style-value': 1,
    },
    bailoutReasons: [
      {
        code: 'local/unsupported-target',
        message: 'Button does not accept className',
        component: 'Button',
        count: 2,
      },
      {
        code: 'local/dynamic-style-value',
        message: 'Style prop color could not be safely extracted',
        count: 1,
      },
    ],
    modules: [
      {
        id: 'src/a.tsx',
        stats: {
          found: 3,
          lowered: 1,
          flattened: 1,
          styled: 0,
          bailed: 2,
          partial: 0,
          notFlattened: 2,
        },
        diagnostics: [
          {
            code: 'local/unsupported-target',
            message: 'Button does not accept className',
            component: 'Button',
          },
          {
            code: 'local/unsupported-target',
            message: 'Button does not accept className',
            component: 'Button',
          },
        ],
      },
      {
        id: 'src/z.tsx',
        stats: {
          found: 2,
          lowered: 2,
          flattened: 1,
          styled: 1,
          bailed: 0,
          partial: 1,
          notFlattened: 1,
        },
        diagnostics: [
          {
            code: 'local/dynamic-style-value',
            message: 'Style prop color could not be safely extracted',
          },
        ],
      },
    ],
  })
  expect(formatCompilerStatsReport(report, true)).toContain(
    'src/a.tsx: found 3 lowered 1 flattened 1 bailed 2'
  )
})
