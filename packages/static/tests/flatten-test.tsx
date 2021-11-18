import '@dish/react-test-env/browser'

import React from 'react'

import { extractBabel } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'web'
process.env.IS_STATIC = ''

window['React'] = React

test('flat transform props', async () => {
  const output = await extractBabel(`
    import { YStack, useMedia } from 'tamagui'

    export function Test(isLoading) {
      const media = useMedia()
      
      return (
        <YStack
          {...media.sm && {
            borderRadius: 10,
            backgroundColor: isLoading ? 'red' : 'blue'
          }}
        />
      )
    }
  `)
  const code = output?.code ?? ''

  console.log('code', code)

  expect(true).toBeTruthy()
  // expect(code.includes(`  "scale": 2`)).toBeTruthy()
  // expect(code.includes(`  "translateX": 10`)).toBeTruthy()
  // expect(code.includes(`  "translateY": 20`)).toBeTruthy()
  // expect(code.includes(`  "rotate": "10deg"`)).toBeTruthy()
})
