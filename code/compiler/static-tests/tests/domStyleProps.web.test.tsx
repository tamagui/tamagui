// finding: generated html.* on web are ordinary Tamagui components that
// accept regular style props (html.tsx says so), but the structural pass
// rewrote every html.* to a literal tag unconditionally — so
// <html.a color="red"> compiled to <a color="red">, the style prop landing on
// the DOM as a junk attribute and the element resets vanishing. an element
// carrying anything outside the strict DOM prop tables must stay on the
// runtime component path until the DOM candidate lowering exists.

import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('an html element carrying a style prop is not rewritten to a literal tag', async () => {
  const output = await extractForWeb(`
    import { html } from '@tamagui/core'
    export function Test() {
      return <html.a color="red" id="x">hi</html.a>
    }
  `)
  const code = output?.js ?? ''
  // the style prop must never land on a literal DOM tag as an attribute
  expect(code).not.toMatch(/<a[\s>]/)
  // the runtime component keeps handling it
  expect(code).toContain('html.a')
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
  expect(code).not.toContain('html.main')
})
