import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractBabel } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'native'
process.env.IS_STATIC = ''

window['React'] = React

describe('flatten-tests', () => {
  test('flattened media queries', async () => {
    const output = await extractBabel(`
      import { YStack } from 'tamagui/src/YStack'
      import { useMedia } from 'tamagui'
  
      export function Test(isLoading) {
        const media = useMedia()
        
        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
            {...media.sm && {
              scale: 2,
              borderRadius: 10,
              backgroundColor: isLoading ? 'red' : 'blue'
            }}
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toMatchInlineSnapshot(`
      "const _sheet = ReactNativeStyleSheet.create({
        \\"0\\": {
          \\"transform\\": [{
            \\"translateY\\": 10
          }, {
            \\"translateX\\": 20
          }, {
            \\"rotate\\": \\"10deg\\"
          }],
          \\"flexDirection\\": \\"column\\",
          \\"flexShrink\\": 0,
          \\"alignItems\\": \\"stretch\\"
        },
        \\"1\\": {
          \\"borderTopLeftRadius\\": 10,
          \\"borderTopRightRadius\\": 10,
          \\"borderBottomRightRadius\\": 10,
          \\"borderBottomLeftRadius\\": 10,
          \\"transform\\": [{
            \\"scale\\": 2
          }]
        },
        \\"2\\": {},
        \\"3\\": {
          \\"backgroundColor\\": \\"red\\"
        },
        \\"4\\": {},
        \\"5\\": {
          \\"backgroundColor\\": \\"blue\\"
        },
        \\"6\\": {}
      });
      import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
      import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
      import { YStack } from 'tamagui/src/YStack';
      import { useMedia } from 'tamagui';
      export function Test(isLoading) {
        const media = useMedia();
        return <__ReactNativeView style={[_sheet[\\"0\\"], media.sm ? _sheet[\\"1\\"] : _sheet[\\"2\\"], media.sm && isLoading ? _sheet[\\"3\\"] : _sheet[\\"4\\"], media.sm && !isLoading ? _sheet[\\"5\\"] : _sheet[\\"6\\"]]} />;
      }"
    `)

    const startStr = `ReactNativeStyleSheet.create(`
    const start = code.indexOf(startStr)
    const end = code.indexOf(`});`)
    const defs = code.slice(start + startStr.length, end + 1)
    const sheetStyles = JSON.parse(defs)

    expect(sheetStyles['0']).toEqual({
      transform: [
        {
          translateY: 10,
        },
        {
          translateX: 20,
        },
        {
          rotate: '10deg',
        },
      ],
      flexDirection: 'column',
      flexShrink: 0,
      alignItems: 'stretch',
    })

    expect(sheetStyles['1']).toEqual({
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      transform: [
        {
          scale: 2,
        },
      ],
    })

    expect(sheetStyles['3']).toEqual({
      backgroundColor: 'red',
    })

    expect(sheetStyles['5']).toEqual({
      backgroundColor: 'blue',
    })
  })
})
