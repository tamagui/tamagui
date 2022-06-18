import * as React from 'react'

import { extractBabel } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'web'
process.env.IS_STATIC = ''

window['React'] = React

describe('flatten-tests', () => {
  test('flat transform props', async () => {
    const output = await extractBabel(`
      import { YStack, useMedia } from 'tamagui'
  
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
    expect(
      code.includes(
        `[_sheet["0"], media.sm ? _sheet["1"] : _sheet["2"], media.sm && isLoading ? _sheet["3"] : _sheet["4"], media.sm && !isLoading ? _sheet["5"] : _sheet["6"]]`
      )
    ).toBeTruthy()

    const startStr = `ReactNativeStyleSheet.create(`
    const start = code.indexOf(startStr)
    const end = code.indexOf(`});`)
    const defs = code.slice(start + startStr.length, end + 1)
    const sheetStyles = JSON.parse(defs)

    expect(sheetStyles['0']).toEqual({
      transform: [
        {
          translateY: '10px',
        },
        {
          translateX: '20px',
        },
        {
          rotate: '10deg',
        },
      ],
      flexDirection: 'column',
      boxSizing: 'border-box',
      flexBasis: 'auto',
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
