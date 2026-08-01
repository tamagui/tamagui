// decision 24: when every contribution is static, the compiler emits a plain
// element with program classes and skips the runtime component entirely. The
// extractor rides the same getSplitStyles pipeline as the runtime, so program
// lowering and class identity come from one implementation.
import * as React from 'react'
import { createRequire } from 'node:module'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React
const hostCore = createRequire(import.meta.url)(
  '@tamagui/core'
) as typeof import('@tamagui/core')

const extract = (jsx: string) =>
  extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return (
        ${jsx}
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

test('a clause-bearing string flattens to a plain element with a program class', async () => {
  const output = await extract(`<View width={10} backgroundColor="red hover:blue" />`)
  expect(output?.js).toContain('<div')
  const compilerClass = output?.js.match(/_bc-\d+/)?.[0]
  expect(compilerClass).toBeTruthy()
  expect(output?.js).not.toContain('<View')
  expect(output?.styles).toContain('background-color:red')
  expect(output?.styles).toMatch(/_bc-\d+:where\(:hover\)\{background-color:blue\}/)

  const config = hostCore.getConfig()
  const themeName = Object.keys(config.themes)[0] ?? ''
  const runtime = hostCore.getSplitStyles(
    { width: 10, backgroundColor: 'red hover:blue' },
    hostCore.View.staticConfig,
    config.themes[themeName] ?? {},
    themeName,
    {
      focus: false,
      focusVisible: false,
      focusWithin: false,
      hover: false,
      unmounted: true,
      press: false,
      pressIn: false,
      disabled: false,
    },
    {
      resolveValues: 'variable',
      noClass: false,
      isAnimated: false,
    }
  )
  const runtimeClass = runtime.classNames.backgroundColor
  expect(compilerClass).toBe(runtimeClass)
  const runtimeRules = runtime.rulesToInsert[runtimeClass]?.[4] ?? []
  expect(runtimeRules).toHaveLength(2)
  for (const rule of runtimeRules) {
    expect(output?.styles).toContain(rule)
  }
})

test('token payloads and media clauses lower statically', async () => {
  const output = await extract(`<View padding="4 sm:6" />`)
  expect(output?.js).toContain('<div')
  // padding expands to four longhand programs
  for (const prefix of ['_pt-', '_pr-', '_pb-', '_pl-']) {
    expect(output?.js).toContain(prefix)
  }
  expect(output?.styles).toContain('var(--')
  expect(output?.styles).toContain('@media')
})

test('theme clauses lower to the is-or-within selector statically', async () => {
  const output = await extract(`<View backgroundColor="red dark:blue" />`)
  expect(output?.js).toContain('<div')
  expect(output?.styles).toContain(':where(.t_dark, .t_dark *)')
})

test('transform axis programs carry their composition class', async () => {
  const output = await extract(`<View x="0px hover:10px" />`)
  expect(output?.js).toContain('<div')
  expect(output?.styles).toContain('--t-x')
  // the shared rule consuming the axis variables must ride along
  expect(output?.styles).toContain('translate:')
})

test('legacy condition objects convert and extract to the same program CSS', async () => {
  const object = await extract(
    `<View backgroundColor="red" hoverStyle={{ backgroundColor: 'blue' }} />`
  )
  const flat = await extract(`<View backgroundColor="red hover:blue" />`)
  require('node:fs').writeFileSync(
    '/tmp/fv-legacy-out.txt',
    `JS:\n${object?.js}\n\nCSS:\n${object?.styles}`
  )
  expect(object?.js).toContain('<div')
  const classOf = (js?: string) => js?.match(/_bc-\d+/)?.[0]
  // one merged program, identical class identity both spellings
  expect(classOf(object?.js)).toBeTruthy()
  expect(classOf(object?.js)).toBe(classOf(flat?.js))
})

test('a dynamic clause string bails to the runtime component', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View backgroundColor={props.value} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )
  expect(output?.js).toContain('backgroundColor={props.value}')
})
