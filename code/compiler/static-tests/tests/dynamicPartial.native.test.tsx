import { parse } from '@babel/parser'
import { transform } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

function walk(value: unknown, visit: (node: any) => void, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return
  seen.add(value)
  visit(value)
  for (const child of Array.isArray(value) ? value : Object.values(value)) {
    walk(child, visit, seen)
  }
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flattenStyle))
  return (style as Record<string, unknown>) || {}
}

test('native opacity partial extraction preserves static and dynamic host styles', async () => {
  const sourcePath = resolve(
    import.meta.dirname,
    '../fixtures/native-compiled-dynamic-corpus.tsx'
  )
  const source = await readFile(sourcePath, 'utf8')
  const baseline = await extractForNative(source, { disablePartialExtraction: true })
  expect(baseline.stats).toEqual({
    found: 3,
    lowered: 0,
    flattened: 0,
    styled: 0,
    bailed: 3,
  })
  expect(
    baseline.diagnostics.map(({ code, component, prop, span }) => ({
      code,
      component,
      prop,
      start: span.start,
      end: span.end,
    }))
  ).toEqual([
    {
      code: 'local/dynamic-style-value',
      component: 'View',
      prop: 'opacity',
      start: 338,
      end: 476,
    },
    {
      code: 'local/dynamic-style-value',
      component: 'View',
      prop: 'opacity',
      start: 483,
      end: 663,
    },
    {
      code: 'local/dynamic-style-value',
      component: 'DynamicFixtureCard',
      prop: 'opacity',
      start: 670,
      end: 736,
    },
  ])
  const output = await extractForNative(source)

  expect(output.diagnostics).toEqual([])
  expect(output.stats).toEqual({
    found: 3,
    lowered: 3,
    flattened: 3,
    styled: 1,
    bailed: 0,
  })
  const ast = parse(output.code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const stableStyleCalls: any[] = []
  const expressionAttributes: any[] = []
  walk(ast, (node) => {
    if (
      node.type === 'CallExpression' &&
      node.callee?.type === 'MemberExpression' &&
      node.callee.property?.type === 'Identifier' &&
      node.callee.property.name === '_withStableStyle'
    ) {
      stableStyleCalls.push(node)
    }
    if (
      node.type === 'JSXAttribute' &&
      node.name?.type === 'JSXIdentifier' &&
      node.name.name === '_expressions'
    ) {
      expressionAttributes.push(node)
    }
  })

  expect(stableStyleCalls).toHaveLength(3)
  expect(expressionAttributes).toHaveLength(3)
  const staticStyles: Record<string, unknown>[] = []
  for (const call of stableStyleCalls) {
    const createStyle = call.arguments[1]
    expect(createStyle.type).toBe('ArrowFunctionExpression')
    expect(createStyle.body.type).toBe('ArrayExpression')
    expect(createStyle.body.elements).toHaveLength(2)
    const staticStyle = createStyle.body.elements[0]
    expect(staticStyle.type).toBe('ObjectExpression')
    staticStyles.push(
      Object.fromEntries(
        staticStyle.properties.map((property: any) => [
          property.key.name ?? property.key.value,
          property.value.value,
        ])
      )
    )
    const dynamicStyle = createStyle.body.elements[1]
    expect(dynamicStyle.type).toBe('ObjectExpression')
    expect(dynamicStyle.properties).toHaveLength(1)
    expect(
      dynamicStyle.properties[0].key.name ?? dynamicStyle.properties[0].key.value
    ).toBe('opacity')
    expect(dynamicStyle.properties[0].value.type).toBe('MemberExpression')
  }
  expect(staticStyles).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        width: 20,
        height: 20,
        backgroundColor: 'rgb(99,102,241)',
      }),
      expect.objectContaining({
        flexDirection: 'row',
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        backgroundColor: 'rgb(229,231,235)',
      }),
      expect.objectContaining({
        width: 120,
        height: 48,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        backgroundColor: 'rgb(249,250,251)',
      }),
    ])
  )
  for (const attribute of expressionAttributes) {
    const expression = attribute.value.expression
    expect(expression.type).toBe('ArrayExpression')
    expect(expression.elements).toHaveLength(1)
    const value =
      expression.elements[0].type === 'TSAsExpression'
        ? expression.elements[0].expression
        : expression.elements[0]
    expect(value.type).toBe('ConditionalExpression')
  }

  const executable = await transform(output.code, {
    format: 'cjs',
    jsx: 'automatic',
    loader: 'tsx',
    platform: 'node',
    target: 'node20',
  })
  const compiledModule = { exports: {} as Record<string, unknown> }
  const require = createRequire(import.meta.url)
  new Function('require', 'module', 'exports', executable.code)(
    require,
    compiledModule,
    compiledModule.exports
  )
  const Corpus = compiledModule.exports
    .NativeDynamicCompilerCorpus as React.ComponentType<{
    revision: number
  }>
  let rendered: TestRenderer.ReactTestRenderer
  await act(async () => {
    rendered = TestRenderer.create(<Corpus revision={0} />)
  })
  const before = rendered!.root
    .findAll((node) => node.type === 'View')
    .filter((node) => flattenStyle(node.props.style).opacity === 1)
  expect(before).toHaveLength(3)
  expect(before.map((node) => flattenStyle(node.props.style))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        width: 20,
        height: 20,
        backgroundColor: 'rgb(99,102,241)',
        opacity: 1,
      }),
      expect.objectContaining({
        flexDirection: 'row',
        paddingTop: 8,
        backgroundColor: 'rgb(229,231,235)',
        opacity: 1,
      }),
      expect.objectContaining({
        width: 120,
        height: 48,
        backgroundColor: 'rgb(249,250,251)',
        opacity: 1,
      }),
    ])
  )
  await act(async () => {
    rendered!.update(<Corpus revision={1} />)
  })
  const after = rendered!.root
    .findAll((node) => node.type === 'View')
    .filter((node) => flattenStyle(node.props.style).opacity === 0.8)
  expect(after).toHaveLength(3)
  after.forEach((node, index) => expect(node).toBe(before[index]))

  await act(async () => {
    rendered!.unmount()
  })
})
