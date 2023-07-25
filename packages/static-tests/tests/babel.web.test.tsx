import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative, extractForWeb } from './lib/extract'

process.env.IS_STATIC = ''

window['React'] = React

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
        components: ['@tamagui/core'],
      },
    }
  )
  expect(output?.js).toMatchSnapshot()
  expect(output?.styles).toMatchSnapshot()
})

// TODO need to test familys across media queries
test('font family across media queries', async () => {
  const output = await extractForWeb(
    `
    import { H2 } from 'tamagui'
    export function Test(props) {
      return (
        <H2
          ff="$silkscreen"
          size="$12"
          $lg={{
            size: '$9',
          }}
          $sm={{
            size: '$8',
            ff: '$mono',
          }}
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

  expect(output?.js.includes(`font_silkscreen`)).toBeTruthy()
})
