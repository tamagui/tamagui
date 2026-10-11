import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

// TODO need to test familys across media queries
test('font family across media queries', async () => {
  const output = await extractForWeb(
    `
    import { H2 } from 'tamagui'
    export function Test(props) {
      return (
        <H2
          fontFamily="silkscreen sm:mono"
          fontSize="12 lg:9 sm:8"
        >
          Test
        </H2>
      )
    }
  `,
    {
      options: {
        components: ['tamagui'],
      },
    }
  )

  // font classes are no longer generated - fonts inherit from root
  expect(output?.js).toBeTruthy()
})

const sizedText = (family: string) => `
  import * as React from 'react'
  import { SizableText } from 'tamagui'
  export function Test() {
    return <SizableText fontFamily="${family}" size="7">Go</SizableText>
  }
`

// the v2 extractor baked a family-specific font size into each branch, so a
// family and a size chosen by the same condition had to be resolved together
// (fix(static): preserve conditional font variants). v3 emits the size as
// var(--f-size-*) under a font_<family> class instead, so the two are
// independent by construction — this pins that independence.
test('font size lowers to a family-independent variable', async () => {
  const heading = await extractForWeb(sizedText('heading'))
  const body = await extractForWeb(sizedText('body'))

  const classesOf = (js: string) => js.match(/className="([^"]+)"/)![1].split(' ')
  const headingClasses = classesOf(heading.js)
  const bodyClasses = classesOf(body.js)

  expect(headingClasses).toContain('font_heading')
  expect(bodyClasses).toContain('font_body')

  // everything except the family marker is identical: the size never encodes
  // which family it belongs to
  expect(headingClasses.filter((c) => !c.startsWith('font_'))).toEqual(
    bodyClasses.filter((c) => !c.startsWith('font_'))
  )
  expect(heading.styles).toContain('font-size:var(--f-size-7)')
  expect(heading.styles).toEqual(body.styles)
})

// a conditional family with static branches lowers per-branch: every class
// shared by both branches stays static, and because sizes are
// family-independent variables the only thing that flips is the font marker
test('a conditional font family lowers to a conditional font class', async () => {
  const output = await extractForWeb(`
    import * as React from 'react'
    import { SizableText } from 'tamagui'
    export function Test({ compact }) {
      return (
        <SizableText fontFamily={compact ? 'body' : 'heading'} size="7">
          Go
        </SizableText>
      )
    }
  `)

  expect(output.stats.lowered).toBe(1)
  expect(output.stats.flattened).toBe(1)
  expect(output.diagnostics).toEqual([])
  expect(output.js).toContain(`(compact) ? "font_body" : "font_heading"`)
  // the size classes stay family-independent: they live in the static part,
  // never inside the conditional segments
  const conditional = output.js.match(/\(compact\)[^\]]*/)![0]
  expect(conditional).not.toContain('_fs-')
})
