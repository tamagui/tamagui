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

const structurallyRetainedComponents: Record<string, string> = {
  Button:
    'behavior HOC: semantic host selection, press/a11y mapping, text/icon wrapping, and context providers',
  ButtonStyled: 'inherits the Button behavior HOC',
  Card: 'styled-context frame: inherited size is also provided to descendants',
  Checkbox: 'behavior HOC: checked state, press handling, and descendant context',
  Form: 'behavior HOC: form registry and submission handling',
  Image: 'behavior HOC: image source, load, and host-prop adaptation',
  Input:
    'behavior HOC: input prop adaptation, focus registration, selection sync, and refs',
  Label: 'behavior HOC: label/control a11y wiring and press handling',
  ListItem: 'behavior HOC: icon/text expansion and descendant context',
  PlainButton: 'inherits the Button behavior HOC',
  Progress: 'behavior HOC: progress state and indicator context',
  ScrollView: 'custom scrolling host explicitly marked never-flatten',
  Spinner: 'behavior HOC: theme color resolution and activity-indicator rendering',
  StyledAnchor1: 'inherits the Anchor behavior HOC',
  StyledAnchor2: 'inherits the Anchor behavior HOC',
  StyledButton: 'inherits the Button behavior HOC',
  StyledButtonVariantTheme: 'inherits the Button behavior HOC',
  StyledCard: 'inherits the Card styled-context contract',
  StyledInput: 'inherits the Input behavior HOC',
  Switch: 'behavior HOC: controlled state, press handling, and thumb context',
  Tabs: 'behavior HOC: selection state, roving focus, and descendant context',
  TextArea: 'inherits the Input behavior HOC',
  TextInput2: 'inherits the Input behavior HOC',
  TransparentInput: 'inherits the Input behavior HOC',
  X1: 'inherits the Label behavior HOC',
  XGroup: 'behavior HOC: orientation, child indexing, and group context',
}

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
    const structuralComponents = new Map<string, number>()
    const unexpectedStructuralComponents = new Set<string>()
    const details: string[] = []
    let recoverable = 0
    let structurallyRetained = 0

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
          const component = diagnostic.component ?? 'unknown component'
          const isStructuralCandidate =
            diagnostic.code === 'local/unsupported-target' &&
            diagnostic.message.endsWith(' does not accept className')
          const classification =
            isStructuralCandidate && component in structurallyRetainedComponents
              ? 'STRUCTURALLY RETAINED'
              : 'RECOVERABLE'
          if (classification === 'STRUCTURALLY RETAINED') {
            structurallyRetained++
            structuralComponents.set(
              component,
              (structuralComponents.get(component) ?? 0) + 1
            )
          } else {
            recoverable++
            if (isStructuralCandidate) unexpectedStructuralComponents.add(component)
          }
          details.push(
            `${classification}\t${name}\t${diagnostic.span.start}\t${reason}\t${source
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
    const structuralReport = [...structuralComponents]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(
        ([component, count]) =>
          `${count}\t${component}\t${structurallyRetainedComponents[component]}`
      )
      .join('\n')
    const classificationReport = `classification: RECOVERABLE ${recoverable}, STRUCTURALLY RETAINED ${structurallyRetained}\n\nstructurally retained components:\n${structuralReport}`
    const completeReport = `${report}\n${classificationReport}\n\nall reasons:\n${reasonReport}`
    process.stdout.write(`\n${completeReport}\n`)
    writeFileSync('/tmp/tamagui-bailout-metric.txt', completeReport)
    writeFileSync('/tmp/tamagui-bailout-details.txt', details.join('\n'))

    expect(totals.found).toBeGreaterThan(0)
    expect([...unexpectedStructuralComponents].sort()).toEqual([])
    expect([...structuralComponents.keys()].sort()).toEqual(
      Object.keys(structurallyRetainedComponents).sort()
    )
    expect(recoverable + structurallyRetained).toBe(totals.bailed)
    expect([...reasons.values()].reduce((sum, count) => sum + count, 0)).toBe(
      totals.bailed
    )
  }
)
