import type { ResolvedModuleId, SourceSpan } from './contracts'
import { localBailout, type BailoutReason } from './diagnostics'
import type {
  MaterializedElement,
  MaterializedElementEntry,
  MaterializedModule,
  MaterializedStyledDefinition,
} from './materialize'
import {
  sourceContentHash,
  validateSourceEdits,
  type ApplicableLoweredModulePlan,
  type SourceEdit,
} from './output'

export const LOWERED_MODULE_PLAN_VERSION = 1

export type CompilerTarget = 'web' | 'native'

export interface LoweredModuleStats {
  found: number
  lowered: number
  flattened: number
  styled: number
  bailed: number
}

export interface LoweringComponent {
  /** Canonical resolved module id plus export name, supplied by the host registry. */
  key: string
  acceptsClassName: boolean
  staticConfig: unknown
}

export interface LoweringCandidateInput {
  id: ResolvedModuleId
  source: string
  target: CompilerTarget
  module: MaterializedModule
  element: MaterializedElement
  styledDefinition: MaterializedStyledDefinition | null
  component: LoweringComponent
}

export interface CandidateImport {
  content: string
  origin: SourceSpan
}

export type LoweringCandidateResult =
  | {
      ok: true
      edits: SourceEdit[]
      css: string[]
      imports: CandidateImport[]
      dependencies?: ResolvedModuleId[]
      flattened?: boolean
    }
  | { ok: false; bailout: BailoutReason }

/**
 * Tamagui's static adapter supplies stable style primitives and registry data. It does
 * not traverse modules, apply edits, commit partial candidates, or choose a fallback.
 */
export interface CompilerLoweringHost {
  resolveComponent(
    element: MaterializedElement,
    styledDefinition: MaterializedStyledDefinition | null
  ): LoweringComponent | null
  isStyleProp(name: string, component: LoweringComponent): boolean
  /** The host can retain this dynamic prop while committing other safe candidate edits. */
  canLowerDynamicStyleProp?(name: string, component: LoweringComponent): boolean
  lowerCandidate(input: LoweringCandidateInput): LoweringCandidateResult
}

export interface LowerModuleOptions {
  projectGeneration: string
}

export interface StructuralModulePassResult {
  module: MaterializedModule
  edits: SourceEdit[]
  imports: CandidateImport[]
  diagnostics: BailoutReason[]
  dependencies: ResolvedModuleId[]
}

export interface StructuralModulePass {
  /** Stable implementation/data hash included in every lowerer cache identity. */
  versionHash: string
  transform(input: {
    module: MaterializedModule
    source: string
    target: CompilerTarget
  }): StructuralModulePassResult
}

export interface LoweredModulePlan extends ApplicableLoweredModulePlan {
  version: typeof LOWERED_MODULE_PLAN_VERSION
  target: CompilerTarget
  inputHash: string
  projectGeneration: string
  structuralPassHash: string
  edits: SourceEdit[]
  css: string
  diagnostics: BailoutReason[]
  dependencies: ResolvedModuleId[]
  stats: LoweredModuleStats
}

export interface LowerModuleInput {
  module: MaterializedModule
  source: string
  target: CompilerTarget
  host: CompilerLoweringHost
  options: LowerModuleOptions
  structuralPass?: StructuralModulePass
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function diagnostic(
  code: Extract<BailoutReason['code'], `local/${string}`>,
  element: MaterializedElement,
  message: string,
  prop?: string
): BailoutReason {
  return {
    ...localBailout(code, element.span, message),
    component: element.component.name,
    specifier: element.component.provenance?.specifier,
    prop,
  }
}

function styledDefinitionFor(
  module: MaterializedModule,
  element: MaterializedElement
): MaterializedStyledDefinition | null {
  const definition = element.component.definition
  if (!definition) return null
  return (
    module.styledDefinitions.find(
      (candidate) => candidate.id === definition.id && candidate.name === definition.name
    ) ?? null
  )
}

function unsafeEntry(
  element: MaterializedElement,
  entry: MaterializedElementEntry,
  component: LoweringComponent,
  host: CompilerLoweringHost
): BailoutReason | null {
  if (entry.kind === 'spread' && entry.value.kind === 'bailout') {
    return diagnostic(
      'local/unsafe-style-spread',
      element,
      'Unevaluated spread may change style and duplicate-prop precedence'
    )
  }
  if (
    entry.kind === 'prop' &&
    host.isStyleProp(entry.name, component) &&
    entry.value.kind === 'bailout' &&
    !host.canLowerDynamicStyleProp?.(entry.name, component)
  ) {
    return diagnostic(
      'local/dynamic-style-value',
      element,
      `Style prop ${entry.name} could not be evaluated`,
      entry.name
    )
  }
  return null
}

function editsAreCandidateLocal(
  element: MaterializedElement,
  edits: readonly SourceEdit[]
): boolean {
  return edits.every(
    (edit) =>
      edit.origin.id === element.id &&
      edit.start >= element.span.start &&
      edit.end <= element.span.end
  )
}

function overlapsCommitted(
  edits: readonly SourceEdit[],
  committed: readonly SourceEdit[]
) {
  return edits.some((edit) =>
    committed.some((existing) => {
      if (edit.start === edit.end) {
        return edit.start > existing.start && edit.start < existing.end
      }
      if (existing.start === existing.end) {
        return existing.start > edit.start && existing.start < edit.end
      }
      return edit.start < existing.end && existing.start < edit.end
    })
  )
}

/** Builds one JSON-safe plan. Each recognized candidate commits all edits/CSS/imports or none. */
export function lowerModule({
  module,
  source,
  target,
  host,
  options,
  structuralPass,
}: LowerModuleInput): LoweredModulePlan {
  const stats: LoweredModuleStats = {
    found: 0,
    lowered: 0,
    flattened: 0,
    styled: 0,
    bailed: 0,
  }
  const structural = structuralPass
    ? structuralPass.transform({ module, source, target })
    : {
        module,
        edits: [],
        imports: [],
        diagnostics: [],
        dependencies: [],
      }
  if (structural.module.id !== module.id) {
    throw new Error(
      `Structural pass changed module identity from ${module.id} to ${structural.module.id}`
    )
  }
  if (structuralPass && !structuralPass.versionHash) {
    throw new Error('Structural pass must provide a non-empty version hash')
  }
  module = structural.module
  validateSourceEdits(source, structural.edits)
  const edits: SourceEdit[] = [...structural.edits]
  const css: string[] = []
  const diagnostics = [...module.diagnostics, ...structural.diagnostics]
  const dependencies = new Set([...module.dependencies, ...structural.dependencies])
  const imports = new Map<string, CandidateImport>(
    structural.imports.map((candidateImport) => [
      candidateImport.content,
      candidateImport,
    ])
  )

  for (const element of module.elements) {
    const styledDefinition = styledDefinitionFor(module, element)
    const component = host.resolveComponent(element, styledDefinition)
    if (!component) continue
    stats.found++

    if (!element.complete || (styledDefinition && !styledDefinition.complete)) {
      diagnostics.push(...element.bailouts, ...(styledDefinition?.bailouts ?? []))
      stats.bailed++
      continue
    }
    const unsafe = element.entries
      .map((entry) => unsafeEntry(element, entry, component, host))
      .find((result): result is BailoutReason => result !== null)
    if (unsafe) {
      diagnostics.push(unsafe)
      stats.bailed++
      continue
    }

    let result: LoweringCandidateResult
    try {
      result = host.lowerCandidate({
        id: module.id,
        source,
        target,
        module,
        element,
        styledDefinition,
        component,
      })
    } catch (error) {
      result = {
        ok: false,
        bailout: diagnostic(
          'local/style-resolution-failed',
          element,
          `Style resolution failed: ${error instanceof Error ? error.message : String(error)}`
        ),
      }
    }
    if (!result.ok) {
      diagnostics.push(result.bailout)
      stats.bailed++
      continue
    }
    try {
      validateSourceEdits(source, result.edits)
    } catch (error) {
      diagnostics.push(
        diagnostic(
          'local/overlapping-edit',
          element,
          error instanceof Error ? error.message : String(error)
        )
      )
      stats.bailed++
      continue
    }
    if (
      !editsAreCandidateLocal(element, result.edits) ||
      overlapsCommitted(result.edits, edits)
    ) {
      diagnostics.push(
        diagnostic(
          'local/overlapping-edit',
          element,
          'Candidate edits overlap another candidate or escape the element span'
        )
      )
      stats.bailed++
      continue
    }

    edits.push(...result.edits)
    css.push(...result.css)
    for (const candidateImport of result.imports) {
      if (!imports.has(candidateImport.content)) {
        imports.set(candidateImport.content, candidateImport)
      }
    }
    for (const dependency of result.dependencies ?? []) dependencies.add(dependency)
    stats.lowered++
    if (result.flattened) stats.flattened++
    if (styledDefinition) stats.styled++
  }

  for (const candidateImport of imports.values()) {
    edits.push({
      start: source.length,
      end: source.length,
      content: candidateImport.content,
      origin: candidateImport.origin,
    })
  }

  return {
    version: LOWERED_MODULE_PLAN_VERSION,
    id: module.id,
    target,
    inputHash: module.inputHash,
    sourceHash: sourceContentHash(source),
    projectGeneration: options.projectGeneration,
    structuralPassHash: structuralPass?.versionHash ?? `${target}-noop-v1`,
    edits,
    css: css.join(''),
    diagnostics,
    dependencies: [...dependencies].sort(compareCodeUnits),
    stats,
  }
}
