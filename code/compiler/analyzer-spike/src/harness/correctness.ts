import assert from 'node:assert/strict'

import {
  applyLoweredModule,
  lowerModule,
  materializeModule,
  ProjectGraph,
  resolvedModuleId,
  textOfSpan,
  type AnalyzerCandidate,
  type CandidateFactory,
  type CompleteElementIR,
  type ElementEntryIR,
  type ElementIR,
  type ElementValue,
  type EvaluationResult,
  type HostModuleInput,
  type HostResolvedProject,
  type LoweringCandidateInput,
  type ProjectInput,
  type ReferenceSite,
} from '@tamagui/compiler-core'
import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping'
import { assertSpanEditSourceMap } from '../sourceMap'

function compactReferences(references: ReferenceSite[]): string[] {
  return references.map(({ id, name }) => `${id}:${name}`).sort()
}

function assertReferenceSpans(
  candidate: AnalyzerCandidate,
  references: ReferenceSite[]
): void {
  for (const reference of references) {
    assert.equal(
      textOfSpan(candidate.sourceOf(reference.id), reference),
      reference.name,
      `${candidate.name}: invalid reference span for ${reference.id}:${reference.name}`
    )
  }
}

function assertDefinition(
  candidate: AnalyzerCandidate,
  id: string,
  localName: string,
  expectedId: string,
  expectedName: string
) {
  const definition = candidate.definitionOf(id, localName)
  assert.ok(definition, `${candidate.name}: missing definition for ${id}:${localName}`)
  assert.deepEqual(
    { id: definition.id, name: definition.name },
    { id: expectedId, name: expectedName }
  )
  assert.equal(
    textOfSpan(candidate.sourceOf(definition.id), definition),
    definition.name,
    `${candidate.name}: invalid definition span for ${definition.id}:${definition.name}`
  )
  return definition
}

function assertEvaluation(
  result: EvaluationResult
): asserts result is Extract<EvaluationResult, { ok: true }> {
  assert.equal(result.ok, true, result.ok ? undefined : result.bailout.message)
}

function moduleById(project: HostResolvedProject, id: string): HostModuleInput {
  const found = project.modules.find((module) => module.id === id)
  assert.ok(found, `Missing host fixture module ${id}`)
  return found
}

function valueOf(graph: ProjectGraph, value: ElementValue): unknown {
  if (value.kind === 'static') return value.value
  const result = graph.evaluate(value)
  assertEvaluation(result)
  return result.value
}

function canonicalEntry(graph: ProjectGraph, entry: ElementEntryIR): unknown {
  if (entry.kind === 'prop') {
    return { kind: entry.kind, name: entry.name, value: valueOf(graph, entry.value) }
  }
  if (entry.kind === 'spread') {
    const result = graph.evaluate(entry.value)
    assertEvaluation(result)
    return { kind: entry.kind, value: result.value }
  }
  if (entry.value.kind === 'element' || entry.value.kind === 'empty') {
    return { kind: entry.kind, value: entry.value.kind }
  }
  return { kind: entry.kind, value: valueOf(graph, entry.value) }
}

function canonicalElement(graph: ProjectGraph, element: ElementIR): unknown {
  assertCompleteElement(element)
  return {
    complete: element.complete,
    component: {
      kind: element.component.kind,
      name: element.component.name,
      definition: element.component.definition && {
        id: element.component.definition.id,
        name: element.component.definition.name,
      },
    },
    entries: element.entries.map((entry) => canonicalEntry(graph, entry)),
  }
}

function assertCompleteElement(element: ElementIR): asserts element is CompleteElementIR {
  assert.equal(element.complete, true)
}

function assertOrderedEntries(element: CompleteElementIR): void {
  for (let index = 1; index < element.entries.length; index++) {
    assert.ok(
      element.entries[index - 1]!.span.start <= element.entries[index]!.span.start,
      `${element.form} entry order changed at ${element.id}:${element.span.start}`
    )
  }
}

function lineAndColumn(source: string, offset: number) {
  const lines = source.slice(0, offset).split('\n')
  return { line: lines.length, column: lines.at(-1)?.length ?? 0 }
}

function assertLowererContract(graph: ProjectGraph): void {
  const id = resolvedModuleId('/src/Lower.tsx')
  const source = graph.sourceOf(id)
  const materialized = materializeModule(graph, id)
  const plan = lowerModule({
    module: materialized,
    source,
    target: 'web',
    options: { projectGeneration: 'fixture-v1' },
    host: {
      resolveComponent(element) {
        return element.component.provenance?.specifier === '@fixture/ui'
          ? {
              key: `${element.component.provenance.resolvedId}#${element.component.provenance.importedName}`,
              acceptsClassName: true,
              staticConfig: {},
            }
          : null
      },
      isStyleProp(name) {
        return name === 'padding'
      },
      lowerCandidate(input: LoweringCandidateInput) {
        const padding = input.element.entries.find(
          (entry) => entry.kind === 'prop' && entry.name === 'padding'
        )
        assert.ok(padding && padding.kind === 'prop')
        assert.equal(padding.value.kind, 'static')
        return {
          ok: true,
          edits: [
            {
              start: padding.span.start,
              end: padding.span.end,
              content: 'className="_padding-12"',
              origin: padding.span,
            },
          ],
          css: ['._padding-12{padding:12px}'],
          imports: [
            {
              content: `\nimport './Lower.tamagui.css'`,
              origin: input.element.component.span,
            },
          ],
          flattened: true,
        }
      },
    },
  })
  assert.deepEqual(plan.stats, {
    found: 2,
    lowered: 1,
    flattened: 1,
    styled: 0,
    bailed: 1,
  })
  assert.equal(plan.structuralPassHash, 'web-noop-v1')
  assert.equal(plan.css, '._padding-12{padding:12px}')
  assert.deepEqual(
    plan.diagnostics.map(({ code }) => code),
    ['local/unsafe-style-spread']
  )
  const unsafeStart = source.indexOf('<Frame {...getProps()}')
  const unsafeEnd = source.indexOf('/>', unsafeStart) + 2
  const unsafeSource = source.slice(unsafeStart, unsafeEnd)
  const lowered = applyLoweredModule(source, id, plan)
  assert.equal(lowered.changed, true)
  assert.match(lowered.code, /className="_padding-12"/)
  assert.ok(lowered.code.includes(unsafeSource))
  assert.ok(lowered.code.endsWith("import './Lower.tamagui.css'"))
  assert.ok(lowered.map)
  const trace = new TraceMap(lowered.map)

  for (const [generatedNeedle, originalNeedle] of [
    ['className="_padding-12"', 'padding={12}'],
    ['data-sentinel="untouched"', 'data-sentinel="untouched"'],
    ["import './Lower.tamagui.css'", 'Frame padding'],
  ] as const) {
    const generatedOffset = lowered.code.indexOf(generatedNeedle)
    const originalOffset = source.indexOf(originalNeedle)
    assert.notEqual(generatedOffset, -1)
    assert.notEqual(originalOffset, -1)
    const traced = originalPositionFor(
      trace,
      lineAndColumn(lowered.code, generatedOffset)
    )
    assert.deepEqual(
      { source: traced.source, line: traced.line, column: traced.column },
      { source: id, ...lineAndColumn(source, originalOffset) }
    )
  }
}

export interface CorrectnessSummary {
  candidate: AnalyzerCandidate['name']
  fixtureCount: number
  definitionReferenceChecks: number
  sourceMapChecks: number
  elementParityChecks: number
  invalidationChecks: number
}

export function assertCandidateCorrectness(
  factory: CandidateFactory,
  project: ProjectInput,
  hostProject: HostResolvedProject
): CorrectnessSummary {
  const candidate = factory.create(project)
  candidate.link()
  assert.deepEqual(
    candidate.diagnostics().filter(({ kind }) => kind === 'parse'),
    [],
    `${candidate.name}: parse diagnostics`
  )

  const tokenDefinition = assertDefinition(
    candidate,
    '/src/config.ts',
    'baseSpace',
    '/src/tokens.ts',
    'importedToken'
  )
  const tokenReferences = candidate.referencesOf(tokenDefinition)
  assertReferenceSpans(candidate, tokenReferences)
  assert.deepEqual(compactReferences(tokenReferences), [
    '/src/config.ts:baseSpace',
    '/src/config.ts:baseSpace',
  ])

  const workspaceDefinition = assertDefinition(
    candidate,
    '/src/config.ts',
    'workspaceScale',
    '/packages/theme/src/index.ts',
    'workspaceScale'
  )
  const workspaceReferences = candidate.referencesOf(workspaceDefinition)
  assertReferenceSpans(candidate, workspaceReferences)
  assert.deepEqual(compactReferences(workspaceReferences), [
    '/src/config.ts:workspaceScale',
  ])

  const configDefinition = assertDefinition(
    candidate,
    '/src/App.tsx',
    'config',
    '/src/config.ts',
    'config'
  )
  const configReferences = candidate.referencesOf(configDefinition)
  assertReferenceSpans(candidate, configReferences)
  assert.ok(configReferences.length >= 6)

  const graph = new ProjectGraph(factory, hostProject)
  assertLowererContract(graph)
  const config = graph.evaluateBinding(resolvedModuleId('/src/config.ts'), 'config')
  assertEvaluation(config)
  assert.deepEqual(config.value, { padding: 12, gap: 24 })
  assert.deepEqual(config.dependencies, [
    '/packages/theme/src/index.ts',
    '/src/config.ts',
    '/src/tokens.ts',
  ])

  const sourceElements = graph.elementsOf(resolvedModuleId('/src/App.tsx')).elements
  assert.equal(sourceElements.length, 1)
  const sourceElement = sourceElements[0]
  assert.ok(sourceElement)
  assertCompleteElement(sourceElement)
  assert.deepEqual(
    sourceElement.entries
      .filter((entry) => entry.kind === 'prop')
      .map((entry) => entry.name),
    ['padding', 'gap']
  )

  const compiledElements = graph.elementsOf(
    resolvedModuleId('/src/App.compiled.ts')
  ).elements
  assert.equal(compiledElements.length, 3)
  assert.deepEqual(
    compiledElements.map((element) => {
      assertCompleteElement(element)
      return element.entries
        .filter((entry) => entry.kind === 'prop')
        .map((entry) => entry.name)
    }),
    [[], ['padding'], ['gap']]
  )

  const createElements = graph.elementsOf(
    resolvedModuleId('/src/App.create-element.ts')
  ).elements
  assert.equal(createElements.length, 1)
  const createElement = createElements[0]
  assert.ok(createElement)
  assertCompleteElement(createElement)
  assert.deepEqual(
    createElement.entries
      .filter((entry) => entry.kind === 'prop')
      .map((entry) => entry.name),
    ['padding']
  )

  for (const element of [...sourceElements, ...compiledElements, ...createElements]) {
    assert.deepEqual(
      element.component.definition && {
        id: element.component.definition.id,
        name: element.component.definition.name,
      },
      { id: '/packages/ui/src/index.ts', name: 'View' }
    )
  }

  const externalElement = graph.elementsOf(resolvedModuleId('/src/External.tsx'))
    .elements[0]
  assert.ok(externalElement)
  assertCompleteElement(externalElement)
  assert.deepEqual(externalElement.component.provenance, {
    specifier: '@external/ui',
    importedName: 'View',
    resolvedId: '/external/ui.mjs',
    external: true,
  })
  assert.equal(externalElement.component.definition, null)

  const styledResult = graph.elementsOf(resolvedModuleId('/src/Styled.tsx'))
  assert.equal(styledResult.styledDefinitions.length, 1)
  const styledDefinition = styledResult.styledDefinitions[0]
  assert.ok(styledDefinition)
  assert.equal(styledDefinition.complete, true)
  assert.equal(styledDefinition.name, 'StyledFrame')
  assert.equal(styledDefinition.baseClassName?.kind, 'static')
  assert.equal(
    styledDefinition.baseClassName?.kind === 'static'
      ? styledDefinition.baseClassName.value
      : null,
    'fixture-base'
  )
  assert.deepEqual(styledDefinition.factory, {
    specifier: '@fixture/ui',
    importedName: 'styled',
    resolvedId: '/packages/ui/src/index.ts',
    external: false,
  })
  assert.deepEqual(styledDefinition.base.provenance, {
    specifier: '@fixture/ui',
    importedName: 'View',
    resolvedId: '/packages/ui/src/index.ts',
    external: false,
  })
  const styledOptions = graph.evaluate(styledDefinition.options)
  assertEvaluation(styledOptions)
  assert.deepEqual(styledOptions.value, {
    padding: 8,
    variants: { size: { large: { padding: 16 } } },
    defaultVariants: { size: 'large' },
    compoundVariants: [{ size: 'large', gap: 4 }],
  })

  const parityIds = [
    resolvedModuleId('/src/Parity.tsx'),
    resolvedModuleId('/src/Parity.compiled.ts'),
    resolvedModuleId('/src/Parity.create-element.ts'),
  ]
  const parityElements = parityIds.map((id) => {
    const result = graph.elementsOf(id)
    assert.deepEqual(result.bailouts, [])
    const root = result.elements[0]
    assert.ok(root)
    assertCompleteElement(root)
    assertOrderedEntries(root)
    const source = graph.sourceOf(id)
    const marker =
      root.form === 'jsx' ? '<Frame' : root.form === 'jsx-runtime' ? '_jsxs' : 'h('
    const stringIndex = source.indexOf(marker, source.indexOf('export const'))
    assert.notEqual(stringIndex, -1)
    assert.equal(root.span.start, stringIndex)
    return root
  })
  const intrinsicElements = parityIds.map((id) => graph.elementsOf(id).elements[1])
  for (const intrinsic of intrinsicElements) {
    assert.ok(intrinsic)
    assert.deepEqual(canonicalElement(graph, intrinsic), {
      complete: true,
      component: { kind: 'intrinsic', name: 'span', definition: null },
      entries: [{ kind: 'child', value: 24 }],
    })
  }
  const canonicalParity = parityElements.map((element) =>
    canonicalElement(graph, element)
  )
  assert.deepEqual(canonicalParity[1], canonicalParity[0])
  assert.deepEqual(canonicalParity[2], canonicalParity[0])
  assert.deepEqual(canonicalParity[0], {
    complete: true,
    component: {
      kind: 'binding',
      name: 'Frame',
      definition: { id: '/packages/ui/src/index.ts', name: 'View' },
    },
    entries: [
      { kind: 'prop', name: 'padding', value: 12 },
      { kind: 'spread', value: { gap: 24 } },
      { kind: 'spread', value: { padding: 24 } },
      { kind: 'child', value: 'element' },
      { kind: 'child', value: 12 },
    ],
  })

  for (const id of parityIds) assertSpanEditSourceMap(candidate, id)

  const bailoutId = resolvedModuleId('/src/bailouts.ts')
  const dynamic = graph.evaluateBinding(bailoutId, 'dynamicValue')
  assert.equal(dynamic.ok, false)
  if (!dynamic.ok) {
    assert.deepEqual(
      { code: dynamic.bailout.code, kind: dynamic.bailout.kind },
      { code: 'local/unsupported-expression', kind: 'local' }
    )
  }
  const linked = graph.evaluateBinding(bailoutId, 'linkedValue')
  assert.equal(linked.ok, false)
  if (!linked.ok) {
    assert.deepEqual(
      { code: linked.bailout.code, kind: linked.bailout.kind },
      { code: 'linked/unresolved-binding', kind: 'linked' }
    )
  }
  const bailoutElements = graph.elementsOf(bailoutId)
  assert.deepEqual(
    bailoutElements.bailouts.map(({ code, kind }) => ({ code, kind })),
    [{ code: 'local/unsupported-prop-key', kind: 'local' }]
  )
  const incompleteElement = bailoutElements.elements[0]
  assert.ok(incompleteElement)
  assert.equal(incompleteElement.complete, false)
  if (!incompleteElement.complete) {
    assert.ok(!('entries' in incompleteElement))
    assert.deepEqual(
      incompleteElement.bailouts.map(({ code, kind }) => ({ code, kind })),
      [{ code: 'local/unsupported-prop-key', kind: 'local' }]
    )
  }
  assert.deepEqual(
    graph
      .diagnostics()
      .filter(({ code }) => code === 'linked/unresolved-import')
      .map(({ code, kind, dependencyId }) => ({ code, kind, dependencyId })),
    [
      {
        code: 'linked/unresolved-import',
        kind: 'linked',
        dependencyId: '/external/missing.ts',
      },
    ]
  )

  const tokenId = resolvedModuleId('/src/tokens.ts')
  const uiId = resolvedModuleId('/packages/ui/src/index.ts')
  const themeId = resolvedModuleId('/packages/theme/src/index.ts')
  const expectedAffected = [
    '/src/App.compiled.ts',
    '/src/App.create-element.ts',
    '/src/App.tsx',
    '/src/Parity.compiled.ts',
    '/src/Parity.create-element.ts',
    '/src/Parity.tsx',
    '/src/config.ts',
    '/src/token-barrel.ts',
    '/src/tokens.ts',
  ]
  assert.deepEqual(graph.affectedBy(tokenId), expectedAffected)
  const parseCounts = new Map(
    graph.moduleIds().map((id) => [id, graph.parseCount(id)] as const)
  )
  const uiElementsBefore = graph.elementsOf(uiId)
  const parityBefore = graph.elementsOf(parityIds[0])
  const tokenModule = moduleById(hostProject, tokenId)
  const changedTokens: HostModuleInput = {
    ...tokenModule,
    source: tokenModule.source.replace('md: 12', 'md: 14'),
  }
  const tokenInvalidation = graph.updateModule(changedTokens)
  assert.equal(tokenInvalidation.changed, true)
  assert.deepEqual(tokenInvalidation.invalidatedIds, expectedAffected)
  assert.notEqual(tokenInvalidation.previousHash, tokenInvalidation.contentHash)
  for (const id of graph.moduleIds()) {
    assert.equal(
      graph.parseCount(id),
      (parseCounts.get(id) ?? 0) + (id === tokenId ? 1 : 0),
      `${id} was unexpectedly reparsed`
    )
  }
  assert.equal(graph.elementsOf(uiId), uiElementsBefore)
  assert.notEqual(graph.elementsOf(parityIds[0]), parityBefore)
  const updatedConfig = graph.evaluateBinding(
    resolvedModuleId('/src/config.ts'),
    'config'
  )
  assertEvaluation(updatedConfig)
  assert.deepEqual(updatedConfig.value, { padding: 14, gap: 28 })
  assert.deepEqual(graph.updateModule(changedTokens).invalidatedIds, [])

  const configId = resolvedModuleId('/src/config.ts')
  const configModule = moduleById(hostProject, configId)
  const configWithoutWorkspace: HostModuleInput = {
    ...configModule,
    source: configModule.source
      .replace("import { workspaceScale } from '@fixture/theme'\n", '')
      .replace('baseSpace * workspaceScale.multiplier', 'baseSpace * 2'),
    imports: configModule.imports.filter(({ resolvedId }) => resolvedId !== themeId),
  }
  graph.updateModule(configWithoutWorkspace)
  assert.deepEqual(graph.dependenciesOf(configId), ['/src/token-barrel.ts'])
  assert.ok(!graph.dependentsOf(themeId).includes(configId))

  const barrelId = resolvedModuleId('/src/token-barrel.ts')
  assert.ok(graph.dependentsOf(tokenId).includes(barrelId))
  const barrelRemoval = graph.removeModule(barrelId)
  assert.deepEqual(barrelRemoval.invalidatedIds, [
    '/src/App.compiled.ts',
    '/src/App.create-element.ts',
    '/src/App.tsx',
    '/src/Parity.compiled.ts',
    '/src/Parity.create-element.ts',
    '/src/Parity.tsx',
    '/src/config.ts',
    '/src/token-barrel.ts',
  ])
  assert.deepEqual(graph.dependenciesOf(barrelId), [])
  assert.ok(!graph.dependentsOf(tokenId).includes(barrelId))

  return {
    candidate: candidate.name,
    fixtureCount: project.files.size,
    definitionReferenceChecks: 4,
    sourceMapChecks: 3,
    elementParityChecks: 3,
    invalidationChecks: 5,
  }
}
