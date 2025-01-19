import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

Error.stackTraceLimit = Number.Infinity
process.env.TAMAGUI_TARGET = 'native'

window['React'] = React

describe('flatten-tests', () => {
  test(`flattened without extra attributes`, async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'
      import { useMedia } from 'tamagui'
  
      export function Test(isLoading) {
        const media = useMedia()
        
        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
          />
        )
      }
    `)

    expect(output?.code).toContain(`<__ReactNativeView style={_sheet["0"]} />`)
  })

  test('flattened media queries', async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'
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

    expect(code).toMatchSnapshot()

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

  test(`work with experimentalFlattenThemesOnNative`, async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'
  
      export function Test(isLoading) {
        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
            backgroundColor="$background"
          />
        )
      }
    `)

    expect(output?.code).toMatchSnapshot()
  })

  test(`work with experimentalFlattenThemesOnNative + ternary`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
  
      export function Test() {
        return (
          <View backgroundColor={showBackground ? '$color1' : '$color2'} />
        )
      }
    `)

    expect(output?.code).toMatchSnapshot()
  })

  // TODO make this work:
  // test.skip(`keeps style object a single object case 2`, async () => {
  //   const output = await extractForNative(`
  //     import { View } from 'tamagui'

  //     export function Test() {
  //       return (
  //         <View position="absolute" key={0} right="$2" top="$2" />
  //       )
  //     }
  //   `)

  //   // just one sheet
  //   expect(output?.code).toContain(`style={_sheet["0"]}`)
  // })
})
