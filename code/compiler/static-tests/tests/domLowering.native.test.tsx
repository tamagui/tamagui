import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

window['React'] = React

test('native DOM elements lower to backing primitives and wrap literal text', async () => {
  const output = await extractForNative(`
    import { jsx, jsxs } from 'react/jsx-runtime'
    import { html as h } from '@tamagui/core'

    export const JSXElement = (
      <h.main id="main">
        Hello {7}
        <h.span>world</h.span>
      </h.main>
    )
    export const JSXCall = jsx(h.section, { children: 'jsx' })
    export const JSXSCall = jsxs(h.nav, { children: ['one', jsx(h.strong, { children: 'two' })] })
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toMatchSnapshot()
})

test('native diagnostics reject unsupported table semantics without inventing output', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    const dynamicText = 'dynamic'
    export const Invalid = () => (
      <>
        <html.div onMouseMove={() => {}} />
        <html.div>{\`template literal\`}</html.div>
        <html.div>{1 + 2}</html.div>
        <html.div>{'a' + 'b'}</html.div>
        <html.div>{dynamicText}</html.div>
        <html.select />
      </>
    )
  `)

  expect(output.diagnostics.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-prop-key',
      message: 'onMouseMove has no native DOM event equivalent',
    },
    {
      code: 'local/unsupported-target',
      message:
        'html.select is not supported on native: native has no menu-based select control, so this tag is a native build error',
    },
    {
      code: 'local/unsupported-child',
      message:
        'html.div has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span',
    },
    {
      code: 'local/unsupported-child',
      message:
        'html.div has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span',
    },
    {
      code: 'local/unsupported-child',
      message:
        'html.div has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span',
    },
    {
      code: 'local/unsupported-child',
      message:
        'html.div has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span',
    },
  ])
})
