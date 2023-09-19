import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

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
