import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

const source = `
  import { Separator } from 'tamagui/separator'
  export function Test() {
    return <Separator width={100} />
  }
`

const options = {
  options: {
    components: ['tamagui/separator'],
  },
}

test('a styled component subpath lowers on native', async () => {
  const output = await extractForNative(source, options)

  expect(output.diagnostics).toEqual([])
  expect(output.stats).toMatchObject({
    found: 1,
    lowered: 1,
    flattened: 1,
    bailed: 0,
  })
})
