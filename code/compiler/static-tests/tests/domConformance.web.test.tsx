import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('standalone style handles lower without a runtime style call', async () => {
  const output = await extractForWeb(`
    import { html, style } from '@tamagui/core/dom'
    const root = style({ color: 'red', padding: 4 })
    export const App = () => <html.main style={root}>hello</html.main>
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.js).toContain('const root = undefined')
  expect(output.js).toContain('<main className=')
  expect(output.js).not.toContain('<html.main')
  expect(output.js).not.toContain('style({')
  expect(output.styles).toContain('color:red')
  expect(output.styles).toContain('padding:4px')
})

test('standalone inline, array and conditional handles compose in compiled calls', async () => {
  const output = await extractForWeb(`
    import { jsx } from 'react/jsx-runtime'
    import { html, style } from 'tamagui/dom'
    const base = style({ color: 'red' })
    declare const active: boolean
    export const App = jsx(html.div, {
      style: [base, active && style({ backgroundColor: 'blue' })],
      children: 'hello',
    })
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.js).toContain('const base = undefined')
  expect(output.js).toContain('className: [')
  expect(output.js).toContain('(active) &&')
  expect(output.js).not.toContain('style({')
  expect(output.styles).toContain('color:red')
  expect(output.styles).toContain('background-color:blue')
})

test('standalone handles share Tamagui pseudo, media and theme lowering', async () => {
  const output = await extractForWeb(`
    import { html, style } from '@tamagui/core/dom'
    const responsive = style({
      opacity: '1 hover:0.5',
      padding: '4 sm:6',
      backgroundColor: 'red dark:blue',
    })
    export const App = () => <html.div style={responsive} />
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.styles).toContain('@media (hover: hover)')
  expect(output.styles).toContain(':where(:hover){opacity:0.5}')
  expect(output.styles).toContain('@media (min-width: 640px)')
  expect(output.styles).toContain(':where(.t_dark, .t_dark *)')
})

test('web lowering preserves strict host behavior defaults and aliases', async () => {
  const output = await extractForWeb(`
    import { html } from '@tamagui/core'
    export const App = () => (
      <>
        <html.button role="none">save</html.button>
        <html.label for="field">name</html.label>
        <html.input id="field" />
        <html.textarea />
      </>
    )
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.js).toMatch(/<button[^>]*type=\{"button"\}/)
  expect(output.js).toMatch(/<button[^>]*role="presentation"/)
  expect(output.js).toMatch(/<label[^>]*htmlFor="field"/)
  expect(output.js).toMatch(/<input[^>]*dir=\{"auto"\}/)
  expect(output.js).toMatch(/<textarea[^>]*dir=\{"auto"\}/)
})
