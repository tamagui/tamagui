import {
  ProjectGraph,
  resolvedModuleId,
  textOfSpan,
  yukuFactory,
  type HostModuleInput,
} from '@tamagui/compiler-core'
import { expect, test } from 'vitest'

const sourceId = resolvedModuleId('/virtual/dom-normalization.tsx')
const coreId = resolvedModuleId('/virtual/@tamagui/core.mjs')
const reactId = resolvedModuleId('/virtual/react.mjs')
const jsxRuntimeId = resolvedModuleId('/virtual/react-jsx-runtime.mjs')

function normalize(source: string, imports: HostModuleInput['imports']) {
  const graph = new ProjectGraph(yukuFactory, {
    modules: [{ id: sourceId, source, imports }],
  })
  return graph.elementsOf(sourceId)
}

test('imported html members normalize through JSX and runtime element forms', () => {
  const source = `
import { html as h } from '@tamagui/core'
import React, { createElement } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

export const jsxElement = <h.main><h.span>JSX</h.span></h.main>
export const jsxCall = jsx(h.div, { children: 'jsx' })
export const jsxsCall = jsxs(h.section, { children: ['jsxs', jsx(h.strong, { children: 'nested' })] })
export const createElementCall = createElement(h.article, null, 'named')
export const memberCreateElementCall = React.createElement(h.footer, null, 'member')
`
  const result = normalize(source, [
    { specifier: '@tamagui/core', resolvedId: coreId, external: true },
    { specifier: 'react', resolvedId: reactId, external: true },
    {
      specifier: 'react/jsx-runtime',
      resolvedId: jsxRuntimeId,
      external: true,
    },
  ])

  expect(result.bailouts).toEqual([])
  expect(
    result.elements.map((element) => ({
      form: element.form,
      tag: element.component.name,
      target: textOfSpan(source, element.component.span),
      provenance: element.component.provenance,
    }))
  ).toEqual([
    {
      form: 'jsx',
      tag: 'main',
      target: 'h.main',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'jsx',
      tag: 'span',
      target: 'h.span',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'jsx-runtime',
      tag: 'div',
      target: 'h.div',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'jsx-runtime',
      tag: 'section',
      target: 'h.section',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'jsx-runtime',
      tag: 'strong',
      target: 'h.strong',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'create-element',
      tag: 'article',
      target: 'h.article',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
    {
      form: 'create-element',
      tag: 'footer',
      target: 'h.footer',
      provenance: {
        specifier: '@tamagui/core',
        importedName: 'html',
        resolvedId: coreId,
        external: true,
      },
    },
  ])
})

test('non-html and unimported member targets keep the existing rejection', () => {
  const source = `
import { Card } from '@tamagui/core'
const html = { div: Card }
export const namespaced = <Card.Header />
export const unrelated = <html.div />
`
  const result = normalize(source, [
    { specifier: '@tamagui/core', resolvedId: coreId, external: true },
  ])

  expect(result.elements).toEqual([])
  expect(result.bailouts.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-element-name',
      message:
        'Element target JSXMemberExpression is not a stable identifier or intrinsic tag',
    },
    {
      code: 'local/unsupported-element-name',
      message:
        'Element target JSXMemberExpression is not a stable identifier or intrinsic tag',
    },
  ])
})
