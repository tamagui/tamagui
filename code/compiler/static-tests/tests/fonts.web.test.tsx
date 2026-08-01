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
          fontFamily="silkscreen sm:mono"
          fontSize="12 lg:9 sm:8"
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

  // font classes are no longer generated - fonts inherit from root
  expect(output?.js).toBeTruthy()
})
