import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import {
  ProjectGraph,
  resolvedModuleId,
  yukuFactory,
  type CompleteElementIR,
  type ElementEntryIR,
  type ElementIR,
  type ElementValue,
  type HostModuleInput,
  type HostResolvedProject,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import { describe, expect, test } from 'vitest'

type ObservableValue =
  | string
  | number
  | boolean
  | null
  | ObservableValue[]
  | { [key: string]: ObservableValue }

type ObservableEntry =
  | { kind: 'prop'; name: string; value: ObservableValue | 'dynamic' }
  | { kind: 'spread'; value: ObservableValue | 'dynamic' }
  | { kind: 'child'; value: ObservableValue | 'dynamic' | 'element' | 'empty' }

interface ObservableElement {
  component: string
  entries: ObservableEntry[]
}

interface ParityCase {
  name: string
  source: string
  sourcePath?: string
  imports?: HostModuleInput['imports']
  extraModules?: HostModuleInput[]
}

const fixtureDirectory = resolve(import.meta.dirname, 'fixtures')
const coreId = resolvedModuleId('/node_modules/@tamagui/core/index.ts')
const jsxRuntimeId = resolvedModuleId('/node_modules/react/jsx-runtime.js')
const reactId = resolvedModuleId('/node_modules/react/index.js')

function plainValue(value: unknown): ObservableValue | 'dynamic' {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  try {
    const serialized = JSON.stringify(value)
    return serialized === undefined ? 'dynamic' : JSON.parse(serialized)
  } catch {
    return 'dynamic'
  }
}

function newValue(graph: ProjectGraph, value: ElementValue): ObservableValue | 'dynamic' {
  if (value.kind === 'static') return value.value
  const result = graph.evaluate(value)
  return result.ok ? plainValue(result.value) : 'dynamic'
}

function newEntry(graph: ProjectGraph, entry: ElementEntryIR): ObservableEntry {
  if (entry.kind === 'prop') {
    return { kind: 'prop', name: entry.name, value: newValue(graph, entry.value) }
  }
  if (entry.kind === 'spread') {
    const result = graph.evaluate(entry.value)
    return {
      kind: 'spread',
      value: result.ok ? plainValue(result.value) : 'dynamic',
    }
  }
  if (entry.value.kind === 'element' || entry.value.kind === 'empty') {
    return { kind: 'child', value: entry.value.kind }
  }
  return { kind: 'child', value: newValue(graph, entry.value) }
}

function completeElement(element: ElementIR): asserts element is CompleteElementIR {
  expect(element.complete, `${element.form} element must be safe to consume`).toBe(true)
}

function newObservation(graph: ProjectGraph, element: ElementIR): ObservableElement {
  completeElement(element)
  const definition = element.component.definition
  return {
    component: definition ? `@tamagui/core#${definition.name}` : element.component.name,
    entries: element.entries.map((entry) => newEntry(graph, entry)),
  }
}

function hostProject(testCase: ParityCase): {
  project: HostResolvedProject
  sourceId: ResolvedModuleId
} {
  const sourceId = resolvedModuleId(
    testCase.sourcePath ?? resolve(fixtureDirectory, `${testCase.name}.tsx`)
  )
  return {
    sourceId,
    project: {
      modules: [
        {
          id: sourceId,
          source: testCase.source,
          imports: [
            { specifier: '@tamagui/core', resolvedId: coreId },
            ...(testCase.imports ?? []),
          ],
        },
        { id: coreId, source: 'export const View = 1\n', imports: [] },
        ...(testCase.extraModules ?? []),
      ],
    },
  }
}

function observeNew(testCase: ParityCase): ObservableElement[] {
  const { project, sourceId } = hostProject(testCase)
  const graph = new ProjectGraph(yukuFactory, project)
  const result = graph.elementsOf(sourceId)
  expect(result.bailouts).toEqual([])
  return result.elements.map((element) => newObservation(graph, element))
}

const frozenLegacy = {
  literalOrderAndUnicode: [
    {
      component: '@tamagui/core#View',
      entries: [
        { kind: 'prop', name: 'padding', value: 1 },
        { kind: 'prop', name: 'margin', value: 3 },
        { kind: 'child', value: 'π🙂' },
        { kind: 'child', value: 7 },
      ],
    },
  ],
  staticConditional: [
    {
      component: '@tamagui/core#View',
      entries: [
        { kind: 'prop', name: 'padding', value: 4 },
        { kind: 'prop', name: 'opacity', value: 0.5 },
      ],
    },
  ],
} satisfies Record<string, ObservableElement[]>

describe('E2 shared IR parity with frozen legacy observations', () => {
  test('literal order and UTF-16 unicode spans', () => {
    const observations = observeNew({
      name: 'literal-order-and-unicode',
      source: `
import { View } from '@tamagui/core'
export const Example = <View padding={1} margin={3}>π🙂{7}</View>
`,
    })
    expect(observations).toEqual(frozenLegacy.literalOrderAndUnicode)
  })

  test('static conditional values', () => {
    const observations = observeNew({
      name: 'static-conditional',
      source: `
import { View } from '@tamagui/core'
export const Example = <View padding={true ? 4 : 8} opacity={!true ? 1 : 0.5} />
`,
    })
    expect(observations).toEqual(frozenLegacy.staticConditional)
  })

  test('ordered spread and duplicate override are preserved past a frozen legacy deopt', () => {
    const observations = observeNew({
      name: 'ordered-spread-deopt',
      source: `
import { View } from '@tamagui/core'
const local = 7
const spread = { margin: 3 }
export const Example = <View padding={1} {...spread} padding={local}>π🙂{local}</View>
`,
    })
    expect(observations).toEqual([
      {
        component: '@tamagui/core#View',
        entries: [
          { kind: 'prop', name: 'padding', value: 1 },
          { kind: 'spread', value: { margin: 3 } },
          { kind: 'prop', name: 'padding', value: 7 },
          { kind: 'child', value: 'π🙂' },
          { kind: 'child', value: 7 },
        ],
      },
    ])
  })

  test('dynamic value retains an explicit evaluation bailout past a frozen legacy deopt', () => {
    const observations = observeNew({
      name: 'dynamic-bailout',
      source: `
import { View } from '@tamagui/core'
export function Example(props: { value: string }) {
  return <View padding={props.value} />
}
`,
    })
    expect(observations).toEqual([
      {
        component: '@tamagui/core#View',
        entries: [{ kind: 'prop', name: 'padding', value: 'dynamic' }],
      },
    ])
  })

  test('cross-file host-resolved constants close a frozen legacy graph gap', async () => {
    const constantsPath = resolve(fixtureDirectory, 'e2-parity-constants.js')
    const constantsId = resolvedModuleId(constantsPath)
    const observations = observeNew({
      name: 'cross-file',
      sourcePath: resolve(fixtureDirectory, 'e2-parity-cross-file.tsx'),
      source: `
import { View } from '@tamagui/core'
import { importedValue } from './e2-parity-constants.js'
export const Example = <View padding={importedValue}>{importedValue}</View>
`,
      imports: [{ specifier: './e2-parity-constants.js', resolvedId: constantsId }],
      extraModules: [
        {
          id: constantsId,
          source: await readFile(constantsPath, 'utf8'),
          imports: [],
        },
      ],
    })
    expect(observations[0]?.entries).toEqual([
      { kind: 'prop', name: 'padding', value: 12 },
      { kind: 'child', value: 12 },
    ])
  })

  test.each([
    {
      name: 'jsx runtime',
      source: `
import { jsx } from 'react/jsx-runtime'
import { View } from '@tamagui/core'
const value = 9
export const Example = jsx(View, { padding: value, children: 'compiled' })
`,
      runtimeImport: { specifier: 'react/jsx-runtime', resolvedId: jsxRuntimeId },
    },
    {
      name: 'createElement',
      source: `
import { createElement } from 'react'
import { View } from '@tamagui/core'
const value = 9
export const Example = createElement(View, { padding: value }, 'compiled')
`,
      runtimeImport: { specifier: 'react', resolvedId: reactId },
    },
  ])('$name closes a frozen legacy coverage gap', ({ name, source, runtimeImport }) => {
    const observations = observeNew({
      name: `compiled-${name}`,
      source,
      imports: [{ ...runtimeImport, external: true }],
    })
    expect(observations).toEqual([
      {
        component: '@tamagui/core#View',
        entries: [
          { kind: 'prop', name: 'padding', value: 9 },
          { kind: 'child', value: 'compiled' },
        ],
      },
    ])
  })
})
