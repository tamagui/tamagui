// the decision-24 standing metric: how much of kitchen-sink compiles to the
// static fast path. run on demand:
//   BAILOUT_METRIC=1 bun run test:run:web -- tests/bailoutMetric.web.test.tsx
// found/lowered/flattened/bailed come from the compiler's own LoweredModuleStats;
// record the aggregate in plans/dom-tailwind-flat-values.md when it moves.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test.skipIf(!process.env.BAILOUT_METRIC)(
  'kitchen-sink usecase bailout rate',
  { timeout: 300_000 },
  async () => {
    const dir = resolve(process.cwd(), '../../kitchen-sink/src/usecases')
    const files = readdirSync(dir).filter((name) => name.endsWith('.tsx'))
    const totals = {
      files: 0,
      failed: 0,
      found: 0,
      lowered: 0,
      flattened: 0,
      styled: 0,
      bailed: 0,
    }
    const reasons = new Map<string, number>()
    const details: string[] = []

    for (const name of files) {
      const path = resolve(dir, name)
      totals.files++
      try {
        const source = readFileSync(path, 'utf8')
        const output = await extractForWeb(source, {
          sourcePath: path,
          options: { platform: 'web', components: ['tamagui', '@tamagui/core'] },
        })
        const stats = output.stats
        if (!stats) continue
        totals.found += stats.found
        totals.lowered += stats.lowered
        totals.flattened += stats.flattened
        totals.styled += stats.styled
        totals.bailed += stats.bailed
        for (const diagnostic of output.diagnostics) {
          const message = diagnostic.message.endsWith(' does not accept className')
            ? `${diagnostic.component ?? 'unknown component'} does not accept className`
            : diagnostic.message
          const reason = `${diagnostic.code}: ${message}`
          reasons.set(reason, (reasons.get(reason) ?? 0) + 1)
          details.push(
            `${name}\t${diagnostic.span.start}\t${reason}\t${source
              .slice(diagnostic.span.start, diagnostic.span.end)
              .replace(/\s+/g, ' ')}`
          )
        }
      } catch {
        totals.failed++
      }
    }

    const rate = totals.found ? ((totals.bailed / totals.found) * 100).toFixed(1) : 'n/a'
    const report = `bailout metric over ${totals.files} usecases (${totals.failed} failed to compile): found ${totals.found}, lowered ${totals.lowered}, flattened ${totals.flattened}, styled ${totals.styled}, bailed ${totals.bailed} (${rate}%)`
    const reasonReport = [...reasons]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([reason, count]) => `${count}\t${reason}`)
      .join('\n')
    const completeReport = `${report}\n\n${reasonReport}`
    process.stdout.write(`\n${completeReport}\n`)
    writeFileSync('/tmp/tamagui-bailout-metric.txt', completeReport)
    writeFileSync('/tmp/tamagui-bailout-details.txt', details.join('\n'))

    expect(totals.found).toBeGreaterThan(0)
    expect([...reasons.values()].reduce((sum, count) => sum + count, 0)).toBe(
      totals.bailed
    )
  }
)
