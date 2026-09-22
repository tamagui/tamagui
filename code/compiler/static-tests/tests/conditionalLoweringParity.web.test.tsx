import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('lowers logical AND expression on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return <View backgroundColor={active && 'red'} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<div')
  expect(output?.js).toMatch(/\(active\) \? "_b-\d+" : ""/)
  expect(output?.styles).toContain('background-color:red')
})

test('does not retain a default class removed by a logical AND branch on web', async () => {
  const output = await extractForWeb(
    `
    import { styled, View } from '@tamagui/core'
    const Box = styled(View, { backgroundColor: 'green' })
    export function Test({ active }) {
      return <Box backgroundColor={active && 'red'} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toMatch(/\(active\) \? "_b-\d+" : ""/)
  const defaultClass = output?.styles.match(/\.(_b-\d+)\{background-color:green\}/)?.[1]
  expect(defaultClass).toBeTruthy()
  expect(output?.js).not.toContain(defaultClass)
})

test('lowers nested ternaries to nested ternary class expressions on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test({ status }) {
      return <View backgroundColor={status === 'err' ? 'red' : status === 'warn' ? 'yellow' : 'green'} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<div')
  expect(output?.js).toMatch(
    /\(status === 'err'\) \? "_b-\d+" : \(status === 'warn'\) \? "_b-\d+" : "_b-\d+"/
  )
  expect(output?.styles).toContain('background-color:red')
  expect(output?.styles).toContain('background-color:yellow')
  expect(output?.styles).toContain('background-color:green')
})

test('lowers multiple disjoint conditionals on web', async () => {
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test({ active, bold, size }) {
      return (
        <Text
          color={active ? 'red' : 'blue'}
          fontWeight={bold ? '700' : '400'}
          fontSize={size ? 20 : 14}
        />
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

  expect(output?.js).toContain('<span')
  expect(output?.js).toMatch(/\(active\) \? "_c-\d+" : "_c-\d+"/)
  expect(output?.js).toMatch(/\(bold\) \? "_fw-\d+" : "_fw-\d+"/)
  expect(output?.js).toMatch(/\(size\) \? "_fs-\d+" : "_fs-\d+"/)
})

// the v2 shape of #4194: a base value one conditional overrides leaked back in
// through the other conditional's branches, because each branch carried the
// whole base. every combination has to pick exactly its own arms
test('a base value overridden by one conditional does not return through another', async () => {
  const output = await extractForWeb(
    `
    import { styled, Text } from '@tamagui/core'
    const T = styled(Text, {
      fontWeight: '400',
      display: 'inline',
      variants: { size: { sm: { fontSize: 12, fontWeight: '300' } } } as const,
    })
    export function Test({ bold, shown }) {
      return <T size="sm" fontWeight={bold ? '600' : '500'} display={shown ? 'flex' : 'none'} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  const js = output?.js ?? ''
  const styles = output?.styles ?? ''
  const classFor = (css: string) => {
    const name = styles.match(new RegExp(`\\.(_[a-z]+-\\d+)\\{${css}\\}`))?.[1]
    // an absent rule would make every not.toContain below pass vacuously
    expect(name, css).toBeTruthy()
    return name
  }
  const expression = js.match(/className=\{([\s\S]*?)\}\s*\/>/)?.[1]
  expect(expression).toBeTruthy()
  const classNames = new Function('bold', 'shown', `return ${expression}`) as (
    bold: boolean,
    shown: boolean
  ) => string

  for (const bold of [true, false]) {
    for (const shown of [true, false]) {
      const classes = classNames(bold, shown).split(' ')
      const where = `bold=${bold} shown=${shown}`
      expect(classes, where).toContain(
        classFor(bold ? 'font-weight:600' : 'font-weight:500')
      )
      expect(classes, where).not.toContain(
        classFor(bold ? 'font-weight:500' : 'font-weight:600')
      )
      expect(classes, where).toContain(classFor(shown ? 'display:flex' : 'display:none'))
      expect(classes, where).not.toContain(
        classFor(shown ? 'display:none' : 'display:flex')
      )
      // the variant's weight and the base display are overridden in every branch
      expect(classes, where).not.toContain(classFor('font-weight:300'))
      expect(classes, where).not.toContain(classFor('display:inline'))
      expect(classes, where).toContain(classFor('font-size:12px'))
    }
  }
  // each conditional is one segment; the combinations are not cross-multiplied
  expect(js.match(/\(bold\)/g)).toHaveLength(1)
  expect(js.match(/\(shown\)/g)).toHaveLength(1)
})

test('lowers evaluable static spread with mixed style and non-style props on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View {...{ backgroundColor: 'red', id: 'my-view', testID: 'spread-test', 'data-test': 'ok' }} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<div')
  expect(output?.js).toMatch(/className="is_View _b-\d+"/)
  expect(output?.js).toContain(
    '{...{ "id": "my-view", "data-testid": "spread-test", "data-test": "ok" }}'
  )
  expect(output?.js).not.toContain('backgroundColor')
})

test('preserves static spread precedence over an earlier conditional on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return (
        <View
          backgroundColor={active ? 'red' : 'blue'}
          {...{ backgroundColor: 'green', id: 'last-wins' }}
        />
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

  expect(output?.js).toContain('className="is_View _b-1653391844"')
  expect(output?.js).not.toContain('active)')
  expect(output?.js).toContain('{...{ "id": "last-wins" }}')
  expect(output?.styles).toContain('background-color:green')
  expect(output?.styles).not.toContain('background-color:red')
  expect(output?.styles).not.toContain('background-color:blue')
})

test('keeps imported branch tests on the runtime component', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    import { importedColor } from './fixtures/conditional-lowering-import'
    export function Test() {
      return <View backgroundColor={importedColor} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<View backgroundColor={importedColor}')
  expect(output?.diagnostics.map(({ code }) => code)).toContain(
    'local/dynamic-style-value'
  )
})

test('keeps arbitrary non-style spread keys valid JSX', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View {...{ backgroundColor: 'red', 'data.owner': 'compiler' }} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('{...{ "data.owner": "compiler" }}')
  expect(output?.js).not.toContain('data.owner={')
})

test('lowers an imported evaluable spread on web', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    import { importedSpread } from './fixtures/conditional-lowering-import'
    export function Test() {
      return <View {...importedSpread} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<div')
  expect(output?.js).toContain('{...{ "id": "imported-spread" }}')
  expect(output?.styles).toContain('background-color:purple')
})

test('lowers mixed spreads in compiled prop objects on web', async () => {
  const output = await extractForWeb(
    `
    import React from 'react'
    import { View } from '@tamagui/core'
    export function Test() {
      return React.createElement(View, { ...{ backgroundColor: 'red', id: 'compiled' } })
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('React.createElement("div"')
  expect(output?.js).toContain('...{ "id": "compiled" }')
  expect(output?.styles).toContain('background-color:red')
})

test('bails when multiple web conditionals resolve the same style key', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test({ inset, edge }) {
      return <View padding={inset ? 10 : 20} paddingLeft={edge ? 1 : 2} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<View padding=')
  expect(output?.diagnostics.map(({ code }) => code)).toContain(
    'local/dynamic-style-value'
  )
})

test('keeps decision trees deeper than three branches on the runtime component', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test({ a, b, c, d }) {
      return <View backgroundColor={a ? 'red' : b ? 'blue' : c ? 'green' : d ? 'yellow' : 'pink'} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('<View backgroundColor=')
  expect(output?.diagnostics.map(({ code }) => code)).toContain(
    'local/dynamic-style-value'
  )
})
