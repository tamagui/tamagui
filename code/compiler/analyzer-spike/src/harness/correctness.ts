import assert from 'node:assert/strict'

import type {
  AnalyzerCandidate,
  CandidateFactory,
  ProjectInput,
  ReferenceSite,
} from '../contracts'
import { evaluateBinding } from '../evaluate'
import { inspectElementForms } from '../normalize'
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
      candidate.sourceOf(reference.id).slice(reference.start, reference.end),
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
    candidate.sourceOf(definition.id).slice(definition.start, definition.end),
    definition.name,
    `${candidate.name}: invalid definition span for ${definition.id}:${definition.name}`
  )
  return definition
}

export interface CorrectnessSummary {
  candidate: AnalyzerCandidate['name']
  fixtureCount: number
  definitionReferenceChecks: number
  sourceMapChecks: number
}

export function assertCandidateCorrectness(
  factory: CandidateFactory,
  project: ProjectInput
): CorrectnessSummary {
  const candidate = factory.create(project)
  candidate.link()
  assert.deepEqual(candidate.diagnostics(), [], `${candidate.name}: analyzer diagnostics`)

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
  assert.deepEqual(compactReferences(configReferences), [
    '/src/App.compiled.ts:config',
    '/src/App.compiled.ts:config',
    '/src/App.create-element.ts:config',
    '/src/App.tsx:config',
    '/src/App.tsx:config',
    '/src/config.ts:config',
  ])

  assert.deepEqual(evaluateBinding(candidate, '/src/config.ts', 'config'), {
    padding: 12,
    gap: 24,
  })

  const sourceElements = inspectElementForms(candidate, '/src/App.tsx')
  assert.equal(sourceElements.length, 1)
  assert.deepEqual(sourceElements[0]?.propNames, ['padding', 'gap'])

  const compiledElements = inspectElementForms(candidate, '/src/App.compiled.ts')
  assert.equal(compiledElements.length, 3)
  assert.deepEqual(
    compiledElements.map((element) => element.propNames),
    [['children'], ['padding'], ['gap']]
  )

  const createElement = inspectElementForms(candidate, '/src/App.create-element.ts')
  assert.equal(createElement.length, 1)
  assert.deepEqual(createElement[0]?.propNames, ['padding'])

  for (const element of [...sourceElements, ...compiledElements, ...createElement]) {
    assert.deepEqual(
      element.componentDefinition && {
        id: element.componentDefinition.id,
        name: element.componentDefinition.name,
      },
      { id: '/packages/ui/src/index.ts', name: 'View' }
    )
  }

  assert.deepEqual(candidate.dependenciesOf('/src/config.ts'), [
    '/packages/theme/src/index.ts',
    '/src/token-barrel.ts',
  ])
  assert.deepEqual(candidate.affectedBy('/src/tokens.ts'), [
    '/src/App.compiled.ts',
    '/src/App.create-element.ts',
    '/src/App.tsx',
    '/src/config.ts',
    '/src/token-barrel.ts',
    '/src/tokens.ts',
  ])

  assertSpanEditSourceMap(candidate, '/src/App.tsx')

  return {
    candidate: candidate.name,
    fixtureCount: project.files.size,
    definitionReferenceChecks: 4,
    sourceMapChecks: 1,
  }
}
