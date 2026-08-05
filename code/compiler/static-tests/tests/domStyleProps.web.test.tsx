// DOM elements use the ordinary lowering candidate, so author styles and
// element resets are extracted before the semantic target becomes a host tag.

import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('an html element carrying a style prop lowers to CSS on its semantic tag', async () => {
  const output = await extractForWeb(`
    import { html } from '@tamagui/core'
    export function Test() {
      return <html.a color="red" id="x">hi</html.a>
    }
  `)
  const code = output?.js ?? ''
  expect(code).toMatch(/<a[\s>]/)
  expect(code).not.toContain('<html.a')
  expect(code).not.toContain('color="red"')
  expect(output.styles).toContain('color:red')
})

test('an html element with a spread is not rewritten either', async () => {
  const output = await extractForWeb(`
    import { html } from '@tamagui/core'
    export function Test(props: any) {
      return <html.section {...props} id="s" />
    }
  `)
  const code = output?.js ?? ''
  expect(code).not.toMatch(/<section[\s>]/)
})

test('an html element with only strict DOM props still rewrites', async () => {
  const output = await extractForWeb(`
    import { html } from '@tamagui/core'
    export function Test() {
      return <html.main id="m" className="x">hi</html.main>
    }
  `)
  const code = output?.js ?? ''
  expect(code).toContain('<main')
  expect(code).not.toContain('<html.main')
})
