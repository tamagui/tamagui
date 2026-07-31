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

const structuralClassJustifications = {
  'component runtime contract':
    'behavior HOCs, custom hosts, and styled-context frames cannot be erased by the plain-element path',
  'animation runtime':
    'animation lifecycles, dynamic targets, conditional targets, callbacks, and runtime theme or presence inputs require the selected driver',
  'dynamic value':
    'a value the compiler cannot evaluate or safely extract must retain runtime prop and token resolution',
  'runtime event mapping':
    'React Native press events require Tamagui responder mapping and are not equivalent to bare DOM props',
  'unevaluated spread':
    'an unknown spread may change style values and duplicate-prop precedence',
  'theme boundary': 'theme selection and inversion depend on runtime provider state',
} as const

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
    const structuralClasses = new Map<
      keyof typeof structuralClassJustifications,
      number
    >()
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
          let structuralClass: keyof typeof structuralClassJustifications | undefined
          if (isStructuralCandidate && component in structurallyRetainedComponents) {
            structuralClass = 'component runtime contract'
          } else if (
            diagnostic.code === 'local/unsupported-target' &&
            diagnostic.message === 'Animated candidates remain on the runtime path'
          ) {
            structuralClass = 'animation runtime'
          } else if (diagnostic.code === 'local/dynamic-style-value') {
            structuralClass = 'dynamic value'
          } else if (
            diagnostic.code === 'local/unsupported-target' &&
            diagnostic.message.endsWith(' requires Tamagui runtime event mapping')
          ) {
            structuralClass = 'runtime event mapping'
          } else if (diagnostic.code === 'local/unsafe-style-spread') {
            structuralClass = 'unevaluated spread'
          } else if (
            diagnostic.code === 'local/unsupported-target' &&
            diagnostic.message === 'Theme boundary candidates remain on the runtime path'
          ) {
            structuralClass = 'theme boundary'
          }
          const classification = structuralClass ? 'STRUCTURALLY RETAINED' : 'RECOVERABLE'
          if (structuralClass) {
            structurallyRetained++
            structuralClasses.set(
              structuralClass,
              (structuralClasses.get(structuralClass) ?? 0) + 1
            )
            if (structuralClass === 'component runtime contract') {
              structuralComponents.set(
                component,
                (structuralComponents.get(component) ?? 0) + 1
              )
            }
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
    const structuralClassReport = [...structuralClasses]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(
        ([structuralClass, count]) =>
          `${count}\t${structuralClass}\t${structuralClassJustifications[structuralClass]}`
      )
      .join('\n')
    const classificationReport = `classification: RECOVERABLE ${recoverable}, STRUCTURALLY RETAINED ${structurallyRetained}`
    const completeReport = `${classificationReport}\n${report}\n\nstructural classes:\n${structuralClassReport}\n\nstructurally retained components:\n${structuralReport}\n\nall reasons:\n${reasonReport}`
    process.stdout.write(`\n${completeReport}\n`)
    writeFileSync('/tmp/tamagui-bailout-metric.txt', completeReport)
    writeFileSync('/tmp/tamagui-bailout-details.txt', details.join('\n'))

    // Two new files joined the corpus: FontLanguageSwapCase adds 6/5/5/0/1
    // and ProgramCascadeCase adds 4/4/2/0/0 to found/lowered/flattened/styled/bailed.
    expect(totals).toEqual({
      files: 253,
      failed: 0,
      found: 2575,
      lowered: 2047,
      flattened: 2032,
      styled: 55,
      bailed: 528,
    })
    expect([...unexpectedStructuralComponents].sort()).toEqual([])
    expect([...structuralClasses.keys()].sort()).toEqual(
      Object.keys(structuralClassJustifications).sort()
    )
    expect([...structuralComponents.keys()].sort()).toEqual(
      Object.keys(structurallyRetainedComponents).sort()
    )
    expect(recoverable + structurallyRetained).toBe(totals.bailed)
    expect([...reasons.values()].reduce((sum, count) => sum + count, 0)).toBe(
      totals.bailed
    )
  }
)
