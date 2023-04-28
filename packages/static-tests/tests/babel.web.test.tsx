import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative, extractForWeb } from './lib/extract'

process.env.IS_STATIC = ''

window['React'] = React

test('conditional styles get full base styles merged onto + shorthand', async () => {
  console.log('RUN')

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
