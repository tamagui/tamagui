import assert from 'node:assert/strict'

import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping'
import MagicString from 'magic-string'

import {
  childNode,
  findAstNode,
  identifierName,
  textOfSpan,
  type AnalyzerCandidate,
} from '@tamagui/compiler-core'

function lineAndColumn(source: string, offset: number): { line: number; column: number } {
  const prefix = source.slice(0, offset)
  const lines = prefix.split('\n')
  return { line: lines.length, column: lines.at(-1)?.length ?? 0 }
}

export function assertSpanEditSourceMap(candidate: AnalyzerCandidate, id: string): void {
  const source = candidate.sourceOf(id)
  const declarationIndex = source.indexOf('export const')
  const declarationStart = declarationIndex === -1 ? 0 : declarationIndex
  const editable = findAstNode(candidate.programOf(id), (node) => {
    if (node.start < declarationStart) return false
    if (node.type === 'JSXAttribute') {
      return identifierName(childNode(node, 'name')) === 'padding'
    }
    if (node.type === 'Property' || node.type === 'ObjectProperty') {
      return identifierName(childNode(node, 'key')) === 'padding'
    }
    return false
  })
  const editableName =
    editable && childNode(editable, editable.type === 'JSXAttribute' ? 'name' : 'key')
  const unchangedStart = source.indexOf('config.padding')
  assert.ok(
    editableName,
    `${candidate.name}: source-map fixture must contain a padding attribute`
  )
  assert.equal(textOfSpan(source, editableName), 'padding')
  assert.notEqual(
    unchangedStart,
    -1,
    'source-map fixture must contain an unchanged sentinel'
  )

  const edited = new MagicString(source)
  const editStart = editableName.start
  const editEnd = editableName.end
  edited.overwrite(editStart, editEnd, 'paddingBlock')
  const code = edited.toString()
  const map = edited.generateMap({ source: id, includeContent: true, hires: true })
  const traced = new TraceMap(map.toString())

  assert.match(code, /paddingBlock/)
  const generatedEdit = lineAndColumn(code, code.indexOf('paddingBlock'))
  const originalEdit = originalPositionFor(traced, generatedEdit)
  const expectedEdit = lineAndColumn(source, editStart)
  assert.deepEqual(
    {
      source: originalEdit.source,
      line: originalEdit.line,
      column: originalEdit.column,
    },
    { source: id, ...expectedEdit }
  )

  const generatedSentinel = code.indexOf('config.padding')
  const generatedPosition = lineAndColumn(code, generatedSentinel)
  const originalPosition = originalPositionFor(traced, generatedPosition)
  const expectedOriginal = lineAndColumn(source, unchangedStart)
  assert.deepEqual(
    {
      source: originalPosition.source,
      line: originalPosition.line,
      column: originalPosition.column,
    },
    { source: id, ...expectedOriginal }
  )
}
