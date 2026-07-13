import assert from 'node:assert/strict'

import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping'
import MagicString from 'magic-string'

import { childNode, findAstNode, identifierName } from './ast'
import type { AnalyzerCandidate } from './contracts'

function lineAndColumn(source: string, offset: number): { line: number; column: number } {
  const prefix = source.slice(0, offset)
  const lines = prefix.split('\n')
  return { line: lines.length, column: lines.at(-1)?.length ?? 0 }
}

export function assertSpanEditSourceMap(candidate: AnalyzerCandidate, id: string): void {
  const source = candidate.sourceOf(id)
  const attribute = findAstNode(candidate.programOf(id), (node) => {
    if (node.type !== 'JSXAttribute') return false
    return identifierName(childNode(node, 'name')) === 'padding'
  })
  const attributeName = attribute && childNode(attribute, 'name')
  const unchangedStart = source.indexOf('config.padding')
  assert.ok(
    attributeName,
    `${candidate.name}: source-map fixture must contain a padding attribute`
  )
  assert.equal(source.slice(attributeName.start, attributeName.end), 'padding')
  assert.notEqual(
    unchangedStart,
    -1,
    'source-map fixture must contain an unchanged sentinel'
  )

  const edited = new MagicString(source)
  edited.overwrite(attributeName.start, attributeName.end, 'paddingBlock')
  const code = edited.toString()
  const map = edited.generateMap({ source: id, includeContent: true, hires: true })
  const traced = new TraceMap(map.toString())

  assert.match(code, /paddingBlock=\{config\.padding\}/)
  const generatedEdit = lineAndColumn(code, code.indexOf('paddingBlock'))
  const originalEdit = originalPositionFor(traced, generatedEdit)
  const expectedEdit = lineAndColumn(source, attributeName.start)
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
