import * as React from 'react'

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
  expect(
    code.includes(`"0": {
    "flexDirection": "column",
    "boxSizing": "border-box",
    "flexBasis": "auto",
    "flexShrink": 0,
    "alignItems": "stretch",
    "transform": [{
      "translateY": 10
    }, {
      "translateX": 20
    }, {
      "rotate": "10deg"
    }]
  },
  "1": {
    "transform": [{
      "scale": 2
    }],
    "borderRadius": 10
  },
  "2": {},
  "3": {
    "backgroundColor": "red"
  },
  "4": {},
  "5": {
    "backgroundColor": "blue"
  }`)
  ).toBeTruthy()
})
