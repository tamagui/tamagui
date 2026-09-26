import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

const options = { options: { components: ['@tamagui/core'] } }

// identifiers resolve by position: a constant declared inside the component
// folds, and a parameter that shadows a module constant is not read as the
// module's value
test('function-scope constants fold and shadowing parameters do not', async () => {
  const output = await extractForWeb(
    [
      "import { View } from '@tamagui/core'",
      'const w = 10',
      'export function Test({ seed, w: shadow }: { seed: number; w: number }) {',
      '  const h = 20',
      "  const color = seed % 2 ? 'red' : 'blue'",
      '  return (',
      '    <>',
      '      <View width={w} height={h} backgroundColor={color} />',
      '      <Shadow w={shadow} />',
      '    </>',
      '  )',
      '}',
      'function Shadow({ w }: { w: number }) {',
      '  return <View width={w} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  const js = output?.js ?? ''
  expect(js).toMatch(
    /<div className=\{\["is_View _w-\d+ _h-\d+", \(seed % 2\) \? "_b-\d+" : "_b-\d+"\]\.filter\(Boolean\)\.join\(" "\)\}\s+\/>/
  )
  expect(output?.styles).toContain('width:10px')
  expect(output?.styles).toContain('height:20px')
  expect(js).toContain('return <View width={w} />')
  expect(output?.diagnostics?.map((diagnostic: any) => diagnostic.message)).toEqual([
    'Style prop width could not be safely extracted',
  ])
})
