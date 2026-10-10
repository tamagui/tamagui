import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative, extractForWeb } from './lib/extract'

window['React'] = React

const fixture = `
  import { html, style } from '@tamagui/core/dom'
  const root = style({ backgroundColor: 'white', padding: 8 })
  const emphasized = style({ color: 'red', fontWeight: 'bold' })
  declare const active: boolean
  declare const ref: { current: unknown }
  declare const onClick: () => void
  export const PlatformDOMFixture = () => (
    <html.main aria-label="strict DOM fixture" ref={ref} style={root}>
      <html.h1>Heading</html.h1>
      <html.button onClick={onClick} style={[emphasized, active && style({ opacity: 0.5 })]}>
        Press
      </html.button>
      <html.input aria-label="Name" type="text" />
      <html.img alt="Square" height={20} src="square.png" width={20} />
    </html.main>
  )
`

test('one platform fixture compiles to semantic web and native host outcomes', async () => {
  const [web, native] = await Promise.all([
    extractForWeb(fixture),
    extractForNative(fixture),
  ])

  expect(web.diagnostics).toEqual([])
  expect(web.js).toContain('<main')
  expect(web.js).toContain('<h1')
  expect(web.js).toContain('<button')
  expect(web.js).toContain('<input')
  expect(web.js).toContain('<img')
  expect(web.js).not.toContain('<html.')
  expect(web.styles).toContain('background-color:')

  expect(native.diagnostics).toEqual([])
  expect(native.code).toContain('<__TamaguiDOMView')
  expect(native.code).toContain('<__TamaguiDOMText')
  expect(native.code).toContain('<__TamaguiDOMTextInput')
  expect(native.code).toContain('<__TamaguiDOMImage')
  expect(native.code).toContain('__tag={"main"}')
  expect(native.code).toContain('onClick={onClick}')
  expect(native.code).toContain('(active) &&')
  expect(native.code).not.toContain('<html.')
  expect(native.code).not.toContain('style({')
})
