import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('theme props get extracted properly', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View theme="green" width={10} bg={props.green ? 'red' : 'blue'} />
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

  expect(output?.js).toContain(`<_TamaguiTheme name="green"><div className={`)
})

test('theme + media queries + conditionals extract', async () => {
  const output = await extractForWeb(
    `
    import { Stack } from '@tamagui/core'
    export function Test(props) {
      return (
        <Stack
          theme="surface1"
          $sm={{ flexDirection: 'column' }}
          {...(onlyDemo && {
            flexDirection: 'column',
          })}
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

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

// floating && floating2 && p2 pb18 mr2 btrr10 br5 btlr7
// floating && !floating2 && p2 pb18 mr1 btrr10 br5
// !floating && floating2 && p2 pb15 mr2 btrr10 br2 btlr7
// !floating && !floating2 && p2 pb15 mr1 btrr10 br2

test('conditional specific after generic style overrides', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Stack } from '@tamagui/core'
    export function Test(props) {
      return (
        <Stack
          p="$2"                              // base padding
          pb={floating ? 18 : 15}             // should override bottom
          mr={floating2 ? 2 : 1}              // unrelated ternary
          borderTopRightRadius={10}           // base tr radius
          borderRadius={floating ? 5 : 2}     // should override the tr radius always
          {...floating2 && {
            borderTopLeftRadius: 7
          }}
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

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('conditional styles get full base styles merged onto + shorthand', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
import { Stack } from '@tamagui/core'
    export function Test(props) {
      return (
        <Stack width={10} bg={props.green ? 'red' : 'blue'} />
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

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('className + conditional styles get full base styles merged onto + shorthand', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Stack } from '@tamagui/core'
    export function Test(props) {
      return (
        <Stack width={10} bg={props.green ? 'red' : 'blue'} className={props.className} />
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
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

test('font classNames are extracted properly', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text fontFamily="$body" />
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

  expect(
    output?.js.includes(
      `_cn = "font_body _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _ff-f-family"`
    )
  )
})

test('ternaries + font families works', async () => {
  // one sanity check debug output test
  const output = await extractForWeb(
    `
    import { Text } from '@tamagui/core'
    export function Test(props) {
      return (
        <Text fontFamily={window ? "$body" : "$heading"} />
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

  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})
