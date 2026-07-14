import type { ResolvedModuleId, SourceSpan } from './contracts'
import type { BailoutReason } from './diagnostics'
import type { StaticEvaluationValue } from './evaluate'
import type { ProjectGraph } from './graph'
import type {
  ComponentImportProvenance,
  ElementComponentIR,
  ElementEntryIR,
  ElementIR,
  StyledDefinitionIR,
} from './ir'

export type MaterializedValue =
  | {
      kind: 'static'
      value: StaticEvaluationValue
      dependencies: ResolvedModuleId[]
      span: SourceSpan
    }
  | {
      kind: 'bailout'
      bailout: BailoutReason
      span: SourceSpan
    }

export type MaterializedElementEntry =
  | {
      kind: 'prop'
      name: string
      span: SourceSpan
      value: MaterializedValue
    }
  | {
      kind: 'spread'
      span: SourceSpan
      value: MaterializedValue
    }
  | {
      kind: 'child'
      span: SourceSpan
      value:
        | MaterializedValue
        | { kind: 'element'; span: SourceSpan }
        | { kind: 'empty'; span: SourceSpan }
    }

export interface MaterializedElement {
  kind: 'element'
  form: ElementIR['form']
  id: ResolvedModuleId
  span: SourceSpan
  propsSpan: SourceSpan | null
  component: ElementComponentIR
  complete: boolean
  entries: MaterializedElementEntry[]
  bailouts: BailoutReason[]
}

export interface MaterializedStyledDefinition {
  kind: 'styled-definition'
  id: ResolvedModuleId
  name: string
  span: SourceSpan
  definitionSpan: SourceSpan
  factory: ComponentImportProvenance
  base: ElementComponentIR
  baseClassName: MaterializedValue | null
  options: MaterializedValue
  complete: boolean
  bailouts: BailoutReason[]
}

export interface MaterializedModule {
  version: 1
  id: ResolvedModuleId
  inputHash: string
  elements: MaterializedElement[]
  styledDefinitions: MaterializedStyledDefinition[]
  diagnostics: BailoutReason[]
  dependencies: ResolvedModuleId[]
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function materializeValue(
  graph: ProjectGraph,
  value: Extract<ElementEntryIR, { kind: 'prop' }>['value']
): MaterializedValue {
  if (value.kind === 'static') {
    return { kind: 'static', value: value.value, dependencies: [], span: value.span }
  }
  const result = graph.evaluate(value)
  return result.ok
    ? {
        kind: 'static',
        value: result.value,
        dependencies: result.dependencies,
        span: value,
      }
    : { kind: 'bailout', bailout: result.bailout, span: value }
}

function materializeEntry(
  graph: ProjectGraph,
  entry: ElementEntryIR
): MaterializedElementEntry {
  if (entry.kind === 'prop') {
    return {
      kind: entry.kind,
      name: entry.name,
      span: entry.span,
      value: materializeValue(graph, entry.value),
    }
  }
  if (entry.kind === 'spread') {
    return {
      kind: entry.kind,
      span: entry.span,
      value: materializeValue(graph, entry.value),
    }
  }
  if (entry.value.kind === 'element' || entry.value.kind === 'empty') {
    return { kind: entry.kind, span: entry.span, value: entry.value }
  }
  return {
    kind: entry.kind,
    span: entry.span,
    value: materializeValue(graph, entry.value),
  }
}

function materializeElement(
  graph: ProjectGraph,
  element: ElementIR
): MaterializedElement {
  const entries = element.complete ? element.entries : element.bailedEntries
  return {
    kind: element.kind,
    form: element.form,
    id: element.id,
    span: element.span,
    propsSpan: element.propsSpan,
    component: element.component,
    complete: element.complete,
    entries: entries.map((entry) => materializeEntry(graph, entry)),
    bailouts: [...element.bailouts],
  }
}

function materializeStyledDefinition(
  graph: ProjectGraph,
  definition: StyledDefinitionIR
): MaterializedStyledDefinition {
  return {
    kind: definition.kind,
    id: definition.id,
    name: definition.name,
    span: definition.span,
    definitionSpan: definition.definitionSpan,
    factory: definition.factory,
    base: definition.base,
    baseClassName: definition.baseClassName
      ? materializeValue(graph, definition.baseClassName)
      : null,
    options: materializeValue(graph, definition.options),
    complete: definition.complete,
    bailouts: [...definition.bailouts],
  }
}

function collectDependencies(module: Omit<MaterializedModule, 'dependencies'>) {
  const dependencies = new Set<ResolvedModuleId>()
  const collect = (value: MaterializedValue) => {
    if (value.kind === 'static') {
      for (const dependency of value.dependencies) dependencies.add(dependency)
    } else if (value.bailout.dependencyId) {
      dependencies.add(value.bailout.dependencyId)
    }
  }
  for (const element of module.elements) {
    if (element.component.provenance) {
      dependencies.add(element.component.provenance.resolvedId)
    }
    if (element.component.definition) dependencies.add(element.component.definition.id)
    for (const entry of element.entries) {
      if (
        'value' in entry &&
        entry.value.kind !== 'element' &&
        entry.value.kind !== 'empty'
      ) {
        collect(entry.value)
      }
    }
  }
  for (const definition of module.styledDefinitions) {
    dependencies.add(definition.factory.resolvedId)
    if (definition.base.provenance)
      dependencies.add(definition.base.provenance.resolvedId)
    if (definition.base.definition) dependencies.add(definition.base.definition.id)
    if (definition.baseClassName) collect(definition.baseClassName)
    collect(definition.options)
  }
  return [...dependencies].sort(compareCodeUnits)
}

export function materializeModule(
  graph: ProjectGraph,
  id: ResolvedModuleId
): MaterializedModule {
  const inputHash = graph.contentHash(id)
  if (!inputHash) throw new Error(`Cannot materialize unknown host module ${id}`)
  const result = graph.elementsOf(id)
  const definitions = [...result.styledDefinitions]
  const definitionKeys = new Set(
    definitions.map((definition) => `${definition.id}\0${definition.name}`)
  )
  for (const element of result.elements) {
    const linked = element.component.definition
    if (!linked || linked.id === id) continue
    const definition = graph
      .elementsOf(linked.id)
      .styledDefinitions.find(
        (candidate) => candidate.id === linked.id && candidate.name === linked.name
      )
    const key = definition && `${definition.id}\0${definition.name}`
    if (definition && key && !definitionKeys.has(key)) {
      definitionKeys.add(key)
      definitions.push(definition)
    }
  }
  const base = {
    version: 1 as const,
    id,
    inputHash,
    elements: result.elements.map((element) => materializeElement(graph, element)),
    styledDefinitions: definitions.map((definition) =>
      materializeStyledDefinition(graph, definition)
    ),
    diagnostics: graph.diagnostics().filter(({ span }) => span.id === id),
  }
  return { ...base, dependencies: collectDependencies(base) }
}
