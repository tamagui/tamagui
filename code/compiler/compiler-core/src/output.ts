import { createHash } from 'node:crypto'

import {
  GenMapping,
  addSegment,
  setSourceContent,
  toEncodedMap,
} from '@jridgewell/gen-mapping'
import MagicString from 'magic-string'

import type { ResolvedModuleId, SourceSpan } from './contracts'

export interface SourceEdit {
  /** UTF-16 source-string index, inclusive. */
  start: number
  /** UTF-16 source-string index, exclusive. Equal to start for an insertion. */
  end: number
  content: string
  origin: SourceSpan
}

export interface CompilerSourceMap {
  version: 3
  file?: string
  names: readonly string[]
  sources: readonly (string | null)[]
  sourcesContent: readonly (string | null)[]
  mappings: string
}

export interface AppliedLoweredModule {
  changed: boolean
  code: string
  map: CompilerSourceMap | null
}

export interface ApplicableLoweredModulePlan {
  id: ResolvedModuleId
  sourceHash: string
  edits: readonly SourceEdit[]
}

function compareEdits(
  left: SourceEdit & { index: number },
  right: SourceEdit & { index: number }
): number {
  return left.start - right.start || left.end - right.end || left.index - right.index
}

export function sourceContentHash(source: string): string {
  return createHash('sha256').update(source).digest('hex')
}

export function validateSourceEdits(source: string, edits: readonly SourceEdit[]): void {
  const sorted = edits.map((edit, index) => ({ ...edit, index })).sort(compareEdits)
  let previousEnd = 0
  for (const edit of sorted) {
    if (
      !Number.isInteger(edit.start) ||
      !Number.isInteger(edit.end) ||
      edit.start < 0 ||
      edit.end < edit.start ||
      edit.end > source.length
    ) {
      throw new Error(`Invalid UTF-16 source edit [${edit.start}, ${edit.end})`)
    }
    if (edit.start < previousEnd) {
      throw new Error(`Overlapping UTF-16 source edit at ${edit.start}`)
    }
    previousEnd = Math.max(previousEnd, edit.end)
  }
}

interface Position {
  line: number
  column: number
}

function sourcePositions(source: string): Position[] {
  const positions: Position[] = new Array(source.length + 1)
  let line = 0
  let column = 0
  for (let index = 0; index <= source.length; index++) {
    positions[index] = { line, column }
    if (index === source.length) break
    if (source.charCodeAt(index) === 10) {
      line++
      column = 0
    } else {
      column++
    }
  }
  return positions
}

function mappedSourceMap(
  source: string,
  id: ResolvedModuleId,
  edits: readonly (SourceEdit & { index: number })[]
): CompilerSourceMap {
  const map = new GenMapping()
  setSourceContent(map, id, source)
  const positions = sourcePositions(source)
  let generatedLine = 0
  let generatedColumn = 0
  let sourceCursor = 0

  const emit = (content: string, sourceStart: number, sourceEnd: number) => {
    const available = Math.max(1, sourceEnd - sourceStart)
    for (let offset = 0; offset < content.length; offset++) {
      const originalIndex = Math.min(sourceStart + offset, sourceStart + available - 1)
      const original = positions[originalIndex]!
      addSegment(map, generatedLine, generatedColumn, id, original.line, original.column)
      if (content.charCodeAt(offset) === 10) {
        generatedLine++
        generatedColumn = 0
      } else {
        generatedColumn++
      }
    }
  }

  for (const edit of edits) {
    emit(source.slice(sourceCursor, edit.start), sourceCursor, edit.start)
    if (edit.origin.id !== id) {
      throw new Error(`Source edit for ${id} must use a local mapping origin`)
    }
    emit(
      edit.content,
      edit.origin.start,
      edit.start === edit.end ? edit.origin.start + 1 : edit.origin.end
    )
    sourceCursor = edit.end
  }
  emit(source.slice(sourceCursor), sourceCursor, source.length)
  const encoded = toEncodedMap(map)
  return {
    version: 3,
    file: encoded.file ?? undefined,
    names: encoded.names,
    sources: encoded.sources,
    sourcesContent: encoded.sourcesContent ?? [source],
    mappings: encoded.mappings,
  }
}

/** The only compiler-core path that applies source edits and owns their source map. */
export function applyLoweredModule(
  source: string,
  id: ResolvedModuleId,
  plan: ApplicableLoweredModulePlan
): AppliedLoweredModule {
  if (plan.id !== id) {
    throw new Error(`Lowered module plan ${plan.id} cannot be applied to ${id}`)
  }
  if (plan.sourceHash !== sourceContentHash(source)) {
    throw new Error(`Lowered module plan for ${id} does not match the supplied source`)
  }
  if (plan.edits.length === 0) return { changed: false, code: source, map: null }
  validateSourceEdits(source, plan.edits)

  const output = new MagicString(source)
  const sorted = plan.edits.map((edit, index) => ({ ...edit, index })).sort(compareEdits)
  for (const edit of sorted) {
    if (edit.start === edit.end) {
      output.appendLeft(edit.start, edit.content)
    } else {
      output.overwrite(edit.start, edit.end, edit.content)
    }
  }
  return {
    changed: true,
    code: output.toString(),
    map: mappedSourceMap(source, id, sorted),
  }
}
