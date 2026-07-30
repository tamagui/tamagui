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
    const totals = { files: 0, failed: 0, found: 0, lowered: 0, flattened: 0, styled: 0, bailed: 0 }

    for (const name of files) {
      const path = resolve(dir, name)
      totals.files++
      try {
        const output = await extractForWeb(readFileSync(path, 'utf8'), {
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
      } catch {
        totals.failed++
      }
    }

    const rate = totals.found ? ((totals.bailed / totals.found) * 100).toFixed(1) : 'n/a'
    const report = `bailout metric over ${totals.files} usecases (${totals.failed} failed to compile): found ${totals.found}, lowered ${totals.lowered}, flattened ${totals.flattened}, styled ${totals.styled}, bailed ${totals.bailed} (${rate}%)`
    process.stdout.write(`\n${report}\n`)
    writeFileSync('/tmp/tamagui-bailout-metric.txt', report)

    expect(totals.found).toBeGreaterThan(0)
  }
)
